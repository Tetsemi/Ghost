#!/usr/bin/env node
/* Keeps Documentation/Sheet Workers.md in step with the sheet worker.

   Usage:  node test_sheet_workers_doc.js <html> [<doc>] [--rows]

   Fails (exit 1) when
     - a named top-level function in the worker has no row in section 5 of the doc,
     - a section 5 row names a function the worker no longer declares,
     - the summary's "N named functions" or "N `on()` call sites" disagrees with the worker,
     - section 6 does not hold one W### row per `on()` call site, numbered 1..N.
   Reports, without failing, how many section 5 rows carry line ranges that no longer
   match the worker. Line numbers go stale with every edit; names and counts do not.

   --rows prints draft section 5 rows (purpose left as TODO) for every function the
   doc is missing, so a regeneration is mechanical rather than from memory.

   Requires `acorn` (npm install acorn), the same dependency as find_orphans.js.
   Do not "fix" a failure by editing this script; regenerate the doc. The doc is the
   thing that goes stale, which is the point of the check. */
const fs = require("fs");
const acorn = require("acorn");

const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
const wantRows = process.argv.includes("--rows");
const htmlPath = args[0] || "ghost_of_arcadia.html";
const docCandidates = args[1] ? [args[1]] : ["Documentation/Sheet Workers.md", "Documentation/Sheet_Workers.md"];
const docPath = docCandidates.find(p => fs.existsSync(p));
if (!docPath) { console.log("FAIL - no Sheet Workers doc found; tried: " + docCandidates.join(", ")); process.exit(1); }

const raw = fs.readFileSync(htmlPath, "utf8").replace(/\r/g, "");
const open = raw.indexOf('<script type="text/worker">');
if (open < 0) { console.log("FAIL - no worker block in " + htmlPath); process.exit(1); }
const bodyStart = open + '<script type="text/worker">'.length;
const js = raw.slice(bodyStart, raw.indexOf("</script>", bodyStart));
/* The worker's line 1 is the remainder of the <script> line, so HTML line = worker line + offset. */
const lineOffset = raw.slice(0, bodyStart).split("\n").length - 1;
const ast = acorn.parse(js, { ecmaVersion: 2022, locations: true });
const L = n => n.loc.start.line + lineOffset, E = n => n.loc.end.line + lineOffset;

/* --- what the worker declares ---------------------------------------- */
const fns = new Map();              /* name -> { start, end } */
const add = (name, node) => fns.set(name, { start: L(node), end: E(node) });
for (const st of ast.body) {
	if (st.type === "FunctionDeclaration" && st.id) add(st.id.name, st);
	else if (st.type === "VariableDeclaration")
		for (const d of st.declarations)
			if (d.id.type === "Identifier" && d.init && /^(Arrow)?FunctionExpression$/.test(d.init.type)) add(d.id.name, st);
}
let onSites = 0;
(function visit(n) {
	if (!n || typeof n.type !== "string") return;
	if (n.type === "CallExpression" && n.callee.type === "Identifier" && n.callee.name === "on") onSites++;
	for (const k of Object.keys(n)) {
		const c = n[k];
		if (Array.isArray(c)) c.forEach(visit); else if (c && typeof c.type === "string") visit(c);
	}
})(ast);

/* --- what the doc claims --------------------------------------------- */
const doc = fs.readFileSync(docPath, "utf8").replace(/\r/g, "");
const s5 = doc.indexOf("## 5."), s6 = doc.indexOf("## 6."), s7 = doc.indexOf("## 7.");
if (s5 < 0 || s6 < 0 || s7 < 0) { console.log("FAIL - doc is missing section 5, 6 or 7 headings"); process.exit(1); }
const docFns = new Map();
for (const m of doc.slice(s5, s6).matchAll(/^\| `([A-Za-z0-9_$]+)`(?: \*\*[^*|]+\*\*)? \| (\d+)[–-](\d+) \|/gm))
	docFns.set(m[1], { start: +m[2], end: +m[3] });
const watcherIds = [...doc.slice(s6, s7).matchAll(/^\| W(\d+) \|/gm)].map(m => +m[1]);
const claimFns = +(doc.match(/\*\*(\d+) named functions\*\*/) || [])[1];
const claimOn = +(doc.match(/\*\*(\d+) `on\(\)` call sites\*\*/) || [])[1];

/* --- compare ----------------------------------------------------------- */
const fails = [], bad = m => fails.push(m);
const missing = [...fns.keys()].filter(k => !docFns.has(k));
const extra = [...docFns.keys()].filter(k => !fns.has(k));
if (missing.length) bad(`${missing.length} function(s) in the worker with no row in section 5: ${missing.join(", ")}`);
if (extra.length) bad(`${extra.length} section 5 row(s) naming a function the worker no longer declares: ${extra.join(", ")}`);
if (claimFns !== fns.size) bad(`summary says ${claimFns} named functions; the worker declares ${fns.size}`);
if (claimOn !== onSites) bad(`summary says ${claimOn} on() call sites; the worker has ${onSites}`);
if (watcherIds.length !== onSites) bad(`section 6 holds ${watcherIds.length} W### rows; the worker has ${onSites} on() call sites`);
else if (watcherIds.some((v, i) => v !== i + 1)) bad("section 6 W### numbering is not 1..N in order");

let drift = 0;
for (const [k, v] of fns) { const d = docFns.get(k); if (d && (d.start !== v.start || d.end !== v.end)) drift++; }

console.log(`worker: ${fns.size} named functions, ${onSites} on() call sites   doc: ${docFns.size} rows, ${watcherIds.length} watcher rows   (${docPath})`);
console.log(`line ranges out of date in ${drift} of ${[...fns.keys()].filter(k => docFns.has(k)).length} matching rows (informational)`);
if (wantRows)
	for (const k of missing) { const v = fns.get(k); console.log(`| \`${k}\` | ${v.start}–${v.end} | TODO | TODO | TODO |`); }
if (fails.length) { console.log(`\nFAIL - ${fails.length}:`); fails.forEach(f => console.log("   " + f)); process.exit(1); }
console.log("\nPASS - function names and watcher counts in the doc match the worker.");
