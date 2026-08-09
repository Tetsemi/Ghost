#!/usr/bin/env node
/* Scope-accurate orphan finder. Regex use-counting gives false negatives on
   names that also appear as string literals on their own declaration line
   (`internal === "qst"` counts as a second "use" of qst), so this walks the
   AST instead: for each `const` binding, count Identifier references that
   resolve to it, excluding the declarator id itself. */
const fs = require("fs"), acorn = require("acorn"), walk = require("acorn-walk");
const raw = fs.readFileSync(process.argv[2] || "ghost_of_arcadia.html", "utf8");
const js  = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
const ast = acorn.parse(js, { ecmaVersion: 2022, locations: true });

const scopes = [];
function enter(node) { scopes.push({ node, decls: new Map() }); }
function leave() { return scopes.pop(); }
const results = [];

function isFn(n) {
  return /Function/.test(n.type) || n.type === "Program";
}
(function visit(node, parentScope) {
  if (!node || typeof node.type !== "string") return;
  const own = isFn(node);
  if (own) enter(node);
  const scope = scopes[scopes.length - 1];

  // collect const declarations in this scope
  walk.simple(node, {}); // no-op to keep acorn-walk loaded
  for (const key of Object.keys(node)) {
    const child = node[key];
    const kids = Array.isArray(child) ? child : [child];
    for (const k of kids) {
      if (!k || typeof k.type !== "string") continue;
      if (k.type === "VariableDeclaration" && k.kind === "const") {
        for (const d of k.declarations) {
          if (d.id.type === "Identifier")
            scope.decls.set(d.id.name, { line: d.id.loc.start.line, node: d, uses: 0 });
        }
      }
    }
  }
  // count identifier uses within this scope's subtree
  walk.full(node, (n) => {
    if (n.type !== "Identifier") return;
    const d = scope.decls.get(n.name);
    if (!d) return;
    if (d.node.id === n) return;            // the declarator itself
    d.uses++;
  });
  for (const key of Object.keys(node)) {
    const child = node[key];
    const kids = Array.isArray(child) ? child : [child];
    for (const k of kids) if (k && typeof k.type === "string") visit(k, scope);
  }
  if (own) {
    const s = leave();
    for (const [name, d] of s.decls)
      if (d.uses === 0) results.push({ name, line: d.line });
  }
})(ast, null);

const seen = new Set();
const uniq = results.filter(r => { const k = r.name + ":" + r.line; if (seen.has(k)) return false; seen.add(k); return true; });
uniq.sort((a, b) => a.line - b.line);
console.log(`unused const bindings: ${uniq.length}\n`);
const lines = js.split("\r\n");
uniq.forEach(r => console.log(`  L${String(r.line).padStart(6)}  ${r.name.padEnd(14)} ${(lines[r.line-1]||"").trim().slice(0,96)}`));
