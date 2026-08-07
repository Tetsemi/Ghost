#!/usr/bin/env node
/*
 * Skill->XP is a secondary-or-later career mechanic (Core/Arcane get a 20-point
 * bundle, Specialists get none). Asserts the four layers agree.
 */
const fs = require("fs");
const p = process.argv[2] || "ghost_of_arcadia.html";
const raw = fs.readFileSync(p, "utf8");
const css = fs.readFileSync(process.argv[3] || p.replace(/\.html$/, ".css"), "utf8");
const js  = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
const fails = [], bad = m => fails.push(m);

Object.assign(globalThis, { on: () => {}, getAttrs: (k, c) => c({}), setAttrs: () => {},
  getSectionIDs: (s, c) => c([]), generateRowID: () => "-n", removeRepeatingRow: () => {},
  getTranslationByKey: k => k });
let mod;
try { mod = new Function(js + "\nreturn { careerDataMap };")(); }
catch (e) { console.log("FAIL — worker threw at load:\n  " + e.message); process.exit(1); }

/* 1. DataMap matches the rule: Core and Arcane 20, Specialist 0. */
let core = 0, arc = 0, spec = 0;
for (const [k, c] of Object.entries(mod.careerDataMap)) {
  const t = c.career_type, b = c.skill_points_secondary;
  if (t === "core")       { core++; if (b !== 20) bad(`${k}: core career must have a 20-point bundle, got ${b}`); }
  else if (t === "arcane"){ arc++;  if (b !== 20) bad(`${k}: arcane career must have a 20-point bundle, got ${b}`); }
  else if (t === "specialist") { spec++; if (b !== 0) bad(`${k}: specialist careers have no bundle, got ${b}`); }
}
console.log(`  careers — core ${core}, arcane ${arc}, specialist ${spec}`);
if (!spec) bad("no specialist careers found — has career_type changed?");

/* 2. The primary-career conversion must be gone entirely: the rule is
      "secondary or later", and no primary control was ever built. */
["primary_career_skill_to_xp"].forEach(a => {
  const n = (raw.match(new RegExp(a, "g")) || []).length;
  if (n) bad(`${a} still appears ${n}x — the conversion is a secondary-career mechanic`);
});

/* 3. HTML: controller must PRECEDE both targets, or `~` cannot reach them. */
const row = raw.slice(raw.indexOf('<fieldset class="repeating_secondarycareer">'),
                      raw.indexOf("</fieldset>", raw.indexOf('<fieldset class="repeating_secondarycareer">')));
const iCtl = row.indexOf('name="attr_secondary_career_bundle"');
const iIn  = row.indexOf('name="attr_secondary_career_skill_to_xp"');
const iNa  = row.indexOf("sheet-career-na");
if (iCtl < 0) bad("no attr_secondary_career_bundle controller in the row");
if (iNa  < 0) bad("no sheet-career-na spacer in the row");
if (iCtl > iIn || iCtl > iNa) bad("controller must precede both targets for `~` to match");
if ((row.match(/name="attr_secondary_career_skill_to_xp"/g) || []).length !== 1)
  bad("skill_to_xp must have exactly one named element in the row");

/* 4. CSS: default hidden, shown only at [value="0"], and the input hidden then. */
if (!/\.sheet-career-na\s*\{[^}]*display:\s*none/.test(css)) bad("sheet-career-na is not hidden by default");
if (!/attr_secondary_career_bundle"\]\[value="0"\][^{]*attr_secondary_career_skill_to_xp"\]\s*\{[^}]*display:\s*none/.test(css))
  bad("no rule hiding the skill_to_xp input when the bundle is 0");
if (!/attr_secondary_career_bundle"\]\[value="0"\][^{]*sheet-career-na\s*\{[^}]*display:\s*block/.test(css))
  bad("no rule showing the N/A spacer when the bundle is 0");

/* 5. The worker must write the controller AND clear a stale conversion —
      the Ledger sums skill_to_xp across rows regardless of visibility. */
if (!/secondary_career_bundle`\]:\s*String\(bundle\)/.test(js)) bad("controller is never written");
if (!/bundle === 0 && skillToXP !== 0/.test(js)) bad("a stale conversion is never cleared for Specialists");

/* 6. The over-cap case is deliberately NOT clamped. */
if (/Math\.min\([^)]*bundle/.test(js)) bad("over-cap entries should not be clamped — the Ledger shows the deficit");

if (fails.length) { console.log(`\nFAIL — ${fails.length}:\n`); fails.forEach(f => console.log("   " + f)); process.exit(1); }
console.log("\nPASS — bundle data, N/A swap, controller write and stale-value clearing all agree.");
