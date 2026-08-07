#!/usr/bin/env node
/*
 * Every handler that calls deriveWeaponTags must FETCH every attr
 * weaponTagInputs declares. A missing key is silent: deriveWeaponTags reads ""
 * from a store that was never asked for it, and the tag simply disappears.
 *
 * Source-text scanning cannot verify this — once a list is generated the
 * literals are gone, and line offsets shift under edits. This records the keys
 * actually passed to getAttrs at runtime.
 */
const fs = require("fs");
const p = process.argv[2] || "ghost_of_arcadia.html";
const js = fs.readFileSync(p, "utf8").match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];

let STORE = {}, ASKED = [];
const HANDLERS = {}, SECTIONS = {};
Object.assign(globalThis, {
  on: (e, f) => String(e).split(/\s+/).forEach(k => (HANDLERS[k] = HANDLERS[k] || []).push(f)),
  getAttrs: (keys, cb) => { ASKED.push(...keys); const o = {}; keys.forEach(k => o[k] = STORE[k] ?? ""); cb(o); },
  setAttrs: (o, a, b) => { Object.assign(STORE, o); const d = typeof a === "function" ? a : b; if (d) d(); },
  getSectionIDs: (s, cb) => cb(SECTIONS[s] || []),
  getTranslationByKey: k => k, generateRowID: () => "-n", removeRepeatingRow: () => {},
});
const fails = [];
let mod;
try { mod = new Function(js + "\nreturn { weaponTagAttrKeys, initWeaponComputedAttrs, refreshWeapon1Summary };")(); }
catch (e) { console.log("FAIL — worker threw at load:\n  " + e.message); process.exit(1); }

/* Each entry's `attrs` list drives the fetch; its `derive` closure reads
   whatever it names. Nothing tied the two together, so emptying an attrs list
   left derive reading a key that was never fetched — silent, and invisible to
   difftest_tags.js, whose harness seeds the store directly rather than going
   through a fetch list. Verified: emptying silent.attrs passed both tests. */
{
  const tbl = js.match(/const weaponTagInputs\s*=\s*\{([\s\S]*?)\n\};/);
  if (!tbl) fails.push("weaponTagInputs not found");
  else {
    let checked = 0;
    for (const m of tbl[1].matchAll(/(\w+):\s*\{\s*attrs:\s*\[([^\]]*)\],([\s\S]*?)\}\s*,/g)) {
      const [, name, attrsRaw, rest] = m;
      const declared = new Set((attrsRaw.match(/"([a-z0-9_]+)"/g) || []).map(s => s.slice(1, -1)));
      const read = new Set([...rest.matchAll(/\bg\("([a-z0-9_]+)"\)/g)].map(x => x[1]));
      checked++;
      for (const r of read) if (!declared.has(r))
        fails.push(`weaponTagInputs.${name}: derive reads "${r}" but attrs omits it`);
      for (const dcl of declared) if (!read.has(dcl))
        fails.push(`weaponTagInputs.${name}: attrs declares "${dcl}" but derive never reads it`);
    }
    console.log(`  ..   weaponTagInputs entries cross-checked: ${checked}`);
  }
}

const ROW = "-r1";
const REP_PREFIX = `repeating_weaponsmdr_${ROW}_`;

function run(label, fire, needed) {
  ASKED = []; STORE = {};
  SECTIONS["repeating_weaponsmdr"] = [ROW];
  SECTIONS["repeating_weaponmanual"] = [ROW];
  try { fire(); } catch (e) { fails.push(`${label}: threw — ${e.message}`); return; }
  const asked = new Set(ASKED);
  const missing = needed.filter(k => !asked.has(k));
  console.log(`  ${missing.length ? "MISS" : "OK  "} ${label.padEnd(30)} asked ${asked.size} keys, missing ${missing.length}`);
  missing.forEach(k => fails.push(`${label}: never fetches ${k}`));
}

run("initWeaponComputedAttrs", () => mod.initWeaponComputedAttrs(),
    mod.weaponTagAttrKeys("repeating", REP_PREFIX));
run("refreshWeapon1Summary", () => mod.refreshWeapon1Summary(),
    mod.weaponTagAttrKeys("weapon1", ""));

/* Every registered handler that could rebuild a summary. */
for (const ev of Object.keys(HANDLERS)) {
  if (!/weaponsmdr|weaponmanual/.test(ev)) continue;
  if (!/weapon_mode_mdr|weapon_summary|smartlink/.test(ev)) continue;
  run(ev.slice(0, 30), () => HANDLERS[ev][0]({ sourceAttribute: REP_PREFIX + "weapon_mode_mdr" }),
      mod.weaponTagAttrKeys("repeating", REP_PREFIX));
}

if (fails.length) {
  console.log(`\nFAIL — ${fails.length}:\n`); fails.forEach(f => console.log("   " + f)); process.exit(1);
}
console.log("\nPASS — every deriveWeaponTags consumer fetches every attr the table declares.");
