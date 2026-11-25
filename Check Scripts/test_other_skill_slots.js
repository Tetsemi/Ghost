#!/usr/bin/env node
/*
 * Ghost of Arcadia — free "Other" skill slots.
 *
 * The sheet has thirteen free-text skill slots, otherskill1..otherskill13, each
 * a complete row (checkbox, name, _skill_mdr, _mdr, roll button). Three things
 * must agree for a slot to work, and none of them is visible to the others:
 *
 *   1. the HTML declares the slot exactly once. A slot declared on two visible
 *      rows makes both rows edit the same attr (found 2026-10-15: otherskill11
 *      sat in both Perform and Tradecraft, and a first fix renamed one to
 *      otherskill12, which already existed — the duplicate merely moved);
 *   2. every skill-value calculation loop covers the slot, or its _mdr is never
 *      computed and a rolled value is 0 (otherskill12 was outside both loops);
 *   3. the new-character initialiser seeds the slot.
 *
 * Executes the worker, because the loop bounds are literals inside two
 * different functions and only running them shows what they cover.
 *
 * Usage: node test_other_skill_slots.js ghost_of_arcadia.html
 */
const fs = require("fs");
const path = process.argv[2] || "ghost_of_arcadia.html";
const raw = fs.readFileSync(path, "utf8");
const m = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/);
const fails = [];
const bad = (msg) => fails.push(msg);

/* comment-stripped worker source, for the textual assertions */
const strip = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const js = m[1];
const code = strip(js);

/* ── 1. HTML: each slot's five attrs declared exactly once outside fieldsets ── */
const html = raw.slice(0, raw.indexOf('<script type="text/worker">')).replace(/<rolltemplate[\s\S]*?<\/rolltemplate>/g, "");
let depth = 0, top = "";
html.split(/(<fieldset\b|<\/fieldset>)/).forEach((tok) => {
  if (tok.startsWith("<fieldset")) depth++;
  else if (tok === "</fieldset>") depth = Math.max(0, depth - 1);
  else if (depth === 0) top += tok;
});
const SUFFIX = ["improved_label", "mdr", "mdr_checkbox", "mdr_name", "skill_mdr"];
const COUNT = 13;
for (let i = 1; i <= COUNT; i++)
  for (const s of SUFFIX) {
    const n = (top.match(new RegExp(`name="attr_otherskill${i}_${s}"`, "g")) || []).length;
    if (n !== 1) bad(`otherskill${i}_${s} is declared ${n} times outside repeating sections (expected 1)`);
  }
if (/name="attr_otherskill(\d+)_/.test(top)) {
  const hi = Math.max(...[...top.matchAll(/name="attr_otherskill(\d+)_/g)].map((x) => +x[1]));
  if (hi > COUNT) bad(`otherskill${hi} exists in the HTML but this test covers 1..${COUNT}; raise COUNT`);
}

/* ── 2. Textual: every literal bound agrees with the slot count ── */
const lengths = [...code.matchAll(/Array\.from\(\{\s*length:\s*(\d+)\s*\},\s*\(_,\s*i\)\s*=>\s*`otherskill\$\{i \+ 1\}`\)/g)].map((x) => +x[1]);
if (lengths.length !== 2) bad(`expected 2 otherSkills loops, found ${lengths.length}`);
lengths.forEach((n) => { if (n !== COUNT) bad(`an otherSkills loop covers 1..${n}, not 1..${COUNT}`); });
const osc = code.match(/const otherSlotCount\s*=\s*(\d+)/);
if (!osc || +osc[1] !== COUNT) bad(`otherSlotCount is ${osc ? osc[1] : "missing"}, not ${COUNT}`);

/* ── 3. Execution ── */
const STORE = {};
const on = () => {};
const getAttrs = (k, cb) => { const o = {}; k.forEach((x) => (o[x] = STORE[x] !== undefined ? STORE[x] : "")); cb(o); };
let LAST = null;
const setAttrs = (o, opt, cb) => { LAST = Object.assign({}, o); const d = typeof opt === "function" ? opt : cb; if (typeof d === "function") d(); };
Object.assign(globalThis, { on, getAttrs, setAttrs, getSectionIDs: (s, cb) => cb([]), getTranslationByKey: (k) => k,
  generateRowID: () => "-r", removeRepeatingRow: () => {} });
/* the worker logs freely when debug_on is set; keep the verdict readable */
const realLog = console.log;
console.log = () => {};
let mod;
try {
  mod = new Function(js + "\nreturn { calculateAndUpdateSkillValues, initNewCharacterSkills, skillDataMap };")();
} catch (e) { console.log = realLog; console.log("FAIL - the worker threw while loading: " + e.message); process.exit(1); }

const mapped = new Set(Object.keys(mod.skillDataMap).filter((k) => /^otherskill\d+$/.test(k)));
const values = {};
for (let i = 1; i <= COUNT; i++) values[`otherskill${i}_skill_mdr`] = String(10 + i);
try { mod.calculateAndUpdateSkillValues("", values, { silent: true }); }
catch (e) { bad("calculateAndUpdateSkillValues threw: " + e.message); }
if (LAST)
  for (let i = 1; i <= COUNT; i++) {
    if (mapped.has(`otherskill${i}`)) continue;
    const got = LAST[`otherskill${i}_mdr`];
    if (got !== 10 + i) bad(`calculateAndUpdateSkillValues: otherskill${i}_mdr is ${JSON.stringify(got)}, expected ${10 + i}`);
  }
else bad("calculateAndUpdateSkillValues wrote nothing");

let init = null;
try { init = mod.initNewCharacterSkills(); } catch (e) { bad("initNewCharacterSkills threw: " + e.message); }
if (init)
  for (let i = 1; i <= COUNT; i++) {
    if (mapped.has(`otherskill${i}`)) continue;
    if (init[`otherskill${i}_skill_mdr`] === undefined || init[`otherskill${i}_mdr`] === undefined)
      bad(`initNewCharacterSkills does not seed otherskill${i}`);
  }

console.log = realLog;
if (fails.length) { console.log(`FAIL - ${fails.length}:`); fails.forEach((f) => console.log("   " + f)); process.exit(1); }
console.log(`PASS - otherskill1..${COUNT} are each declared once, computed by both loops, and seeded on a new character.`);
