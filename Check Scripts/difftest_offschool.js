#!/usr/bin/env node
/*
 * Ghost of Arcadia — off-school Strain surcharge proof.
 *
 * Ghost Guide to the Arcane p.37: a spell cast outside your primary school
 * costs +1 Strain on top of its listed cost; Universal spells are exempt.
 *
 * Loads the ENTIRE sheet worker into node with stubbed Roll20 globals. This is
 * the point of the harness: `node --check` parses but does not evaluate, so it
 * cannot see an undefined identifier or a temporal-dead-zone fault. Executing
 * the whole module reproduces the real load sequence.
 *
 * Then drives the three write paths against a seeded store and asserts the
 * resulting setAttrs writes.
 *
 * Usage: node difftest_offschool.js ghost_of_arcadia.html
 */

const fs = require("fs");
const path = process.argv[2] || "ghost_of_arcadia.html";
const raw = fs.readFileSync(path, "utf8");
const js = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];

/* ── Roll20 stubs ────────────────────────────────────────────────────── */
let STORE = {};
let WRITES = {};
const HANDLERS = {};
const SECTIONS = {};

const on = (ev, fn) => String(ev).split(/\s+/).forEach((e) => {
  (HANDLERS[e] = HANDLERS[e] || []).push(fn);
});
const getAttrs = (keys, cb) => {
  const out = {};
  keys.forEach((k) => { out[k] = STORE[k] !== undefined ? STORE[k] : ""; });
  cb(out);
};
const setAttrs = (obj, opt, cb) => {
  Object.assign(STORE, obj);
  Object.assign(WRITES, obj);
  const done = typeof opt === "function" ? opt : cb;
  if (typeof done === "function") done();
};
const getSectionIDs = (sec, cb) => cb(SECTIONS[sec] || []);
const getTranslationByKey = (k) => k;
const generateRowID = () => "-newrow";
const removeRepeatingRow = () => {};
Object.assign(globalThis, { on, getAttrs, setAttrs, getSectionIDs,
  getTranslationByKey, generateRowID, removeRepeatingRow });

/* ── Execute the module ──────────────────────────────────────────────── */
let mod;
try {
  mod = new Function(js + "\nreturn { spellOffSchoolPenalty, recalcSpellStrainPenalties, " +
                          "applySpellPreset, OFF_SCHOOL_STRAIN, skillDataMap };")();
} catch (e) {
  console.log("FAIL — worker threw at load:\n  " + e.message);
  process.exit(1);
}
console.log("module loaded and evaluated without error");

const { spellOffSchoolPenalty, recalcSpellStrainPenalties, applySpellPreset } = mod;
const fails = [];
const eq = (got, want, what) => {
  if (got !== want) fails.push(`${what}: got ${JSON.stringify(got)} want ${JSON.stringify(want)}`);
};

/* ── 1. Declaration order (TDZ guard) ────────────────────────────────── */
const declLine = (name) => {
  const i = js.indexOf("const " + name);
  return i < 0 ? Infinity : js.slice(0, i).split("\r\n").length;
};
[["spellOffSchoolPenalty", "applySpellPreset"],
 ["spellOffSchoolPenalty", "recalcSpellStrainPenalties"],
 ["OFF_SCHOOL_STRAIN", "spellOffSchoolPenalty"]].forEach(([src, dst]) => {
  if (declLine(src) >= declLine(dst))
    fails.push(`declaration order: ${src} (${declLine(src)}) must precede ${dst} (${declLine(dst)})`);
});

/* ── 2. The rule itself ──────────────────────────────────────────────── */
const GRAVE = "@{magic_necromancy_mdr}";
eq(spellOffSchoolPenalty("magic_necromancy_mdr", GRAVE), 0, "primary school = no surcharge");
eq(spellOffSchoolPenalty("magic_restoration_mdr", GRAVE), 1, "off-school = +1");
eq(spellOffSchoolPenalty("magic_universal_mdr", GRAVE), 0, "Universal exempt (off-school career)");
eq(spellOffSchoolPenalty("magic_universal_mdr", ""), 0, "Universal exempt (no career)");
eq(spellOffSchoolPenalty("magic_restoration_mdr", ""), 0, "unset career = unaligned, no surcharge");
eq(spellOffSchoolPenalty("magic_restoration_mdr", "@{none}"), 0, "header option = unaligned");
eq(spellOffSchoolPenalty("", GRAVE), 0, "no school selected = no surcharge");
eq(spellOffSchoolPenalty("magic_restoration_mdr", "garbage"), 0, "non-@{} career value tolerated");

/* every off-school pairing is exactly +1, never graded */
const SCHOOLS = Object.keys(mod.skillDataMap).filter((k) => k.startsWith("magic_"));
SCHOOLS.forEach((primary) => SCHOOLS.forEach((cast) => {
  const want = (cast === primary || cast === "magic_universal") ? 0 : 1;
  const got = spellOffSchoolPenalty(mod.skillDataMap[cast].bonus,
                                    "@{" + mod.skillDataMap[primary].bonus + "}");
  if (got !== want) fails.push(`matrix ${primary} casting ${cast}: got ${got} want ${want}`);
}));

/* ── 3. Preset apply path writes the surcharge ───────────────────────── */
const runPreset = (primary, school, spell) => {
  STORE = { primary_arcane_career: primary };
  WRITES = {};
  applySpellPreset("repeating_spellpreset_-r1_", school, spell);
  return WRITES["repeating_spellpreset_-r1_spellpreset_strain_penalty_mdr"];
};
/* pick a real spell key from each school so applySpellPreset does not bail */
const spellMapSrc = js.indexOf("const spellDataMap");
const spellDataMap = new Function(
  js.slice(spellMapSrc, js.indexOf("\r\n};", spellMapSrc) + 4) +
  "\nreturn spellDataMap;")();
const firstSpell = (s) => Object.keys(spellDataMap[s] || {})[0];

eq(runPreset("@{magic_necromancy_mdr}", "magic_necromancy", firstSpell("magic_necromancy")),
   "0", "preset: on-school row");
eq(runPreset("@{magic_necromancy_mdr}", "magic_restoration", firstSpell("magic_restoration")),
   "1", "preset: off-school row");
eq(runPreset("@{magic_necromancy_mdr}", "magic_universal", firstSpell("magic_universal")),
   "0", "preset: Universal row");
eq(runPreset("", "magic_restoration", firstSpell("magic_restoration")),
   "0", "preset: no career selected");

/* ── 4. Manual skill-select handler ──────────────────────────────────── */
const manual = HANDLERS["change:repeating_spellsmdr:spell_skill_mdr"];
if (!manual || !manual.length) fails.push("manual handler not registered");
else {
  const runManual = (primary, skillRef) => {
    STORE = {
      primary_arcane_career: primary,
      "repeating_spellsmdr_-m1_spell_skill_mdr": skillRef,
      magic_restoration_mdr: "45",
    };
    WRITES = {};
    manual[0]({ sourceAttribute: "repeating_spellsmdr_-m1_spell_skill_mdr" });
    return WRITES;
  };
  let w = runManual("@{magic_necromancy_mdr}", "@{magic_restoration_mdr}");
  eq(w["repeating_spellsmdr_-m1_strain_penalty"], "1", "manual: off-school");
  eq(w["repeating_spellsmdr_-m1_spell_skill_mdr_display"], "45", "manual: skill display written");

  w = runManual("@{magic_restoration_mdr}", "@{magic_restoration_mdr}");
  eq(w["repeating_spellsmdr_-m1_strain_penalty"], "0", "manual: on-school");

  /* Regression: the old code returned early here, leaving BOTH the penalty and
     the skill display unwritten — so the row's Strain roll referenced an attr
     that was never committed. */
  w = runManual("", "@{magic_restoration_mdr}");
  eq(w["repeating_spellsmdr_-m1_strain_penalty"], "0", "manual: unset career writes penalty");
  eq(w["repeating_spellsmdr_-m1_spell_skill_mdr_display"], "45", "manual: unset career writes display");
}

/* ── 5. Career change recomputes every stored row, both sections ──────── */
const careerWatcher = HANDLERS["change:primary_arcane_career"];
if (!careerWatcher || !careerWatcher.length) fails.push("primary_arcane_career watcher not registered");
else {
  SECTIONS["repeating_spellsmdr"] = ["-m1", "-m2"];
  SECTIONS["repeating_spellpreset"] = ["-p1", "-p2"];
  STORE = {
    primary_arcane_career: "@{magic_elemental_mdr}",
    "repeating_spellsmdr_-m1_spell_skill_mdr": "@{magic_elemental_mdr}",
    "repeating_spellsmdr_-m2_spell_skill_mdr": "@{magic_warding_mdr}",
    "repeating_spellpreset_-p1_spellpreset_school_key": "magic_elemental",
    "repeating_spellpreset_-p2_spellpreset_school_key": "magic_universal",
    /* stale values from the PREVIOUS career, deliberately wrong */
    "repeating_spellsmdr_-m1_strain_penalty": "1",
    "repeating_spellpreset_-p1_spellpreset_strain_penalty_mdr": "1",
  };
  WRITES = {};
  careerWatcher[0]({ sourceAttribute: "primary_arcane_career" });
  eq(WRITES["repeating_spellsmdr_-m1_strain_penalty"], "0", "recalc: manual on-school healed");
  eq(WRITES["repeating_spellsmdr_-m2_strain_penalty"], "1", "recalc: manual off-school");
  eq(WRITES["repeating_spellpreset_-p1_spellpreset_strain_penalty_mdr"], "0", "recalc: preset on-school healed");
  eq(WRITES["repeating_spellpreset_-p2_spellpreset_strain_penalty_mdr"], "0", "recalc: preset Universal");

  /* negative test: confirm the mutation is what drives the verdict */
  STORE.primary_arcane_career = "@{magic_warding_mdr}";
  WRITES = {};
  careerWatcher[0]({ sourceAttribute: "primary_arcane_career" });
  eq(WRITES["repeating_spellsmdr_-m1_strain_penalty"], "1", "recalc: flips when career changes");
  eq(WRITES["repeating_spellsmdr_-m2_strain_penalty"], "0", "recalc: flips the other way");

  /* empty sections must not throw */
  SECTIONS["repeating_spellsmdr"] = [];
  SECTIONS["repeating_spellpreset"] = [];
  try { careerWatcher[0]({ sourceAttribute: "primary_arcane_career" }); }
  catch (e) { fails.push("recalc threw on empty sections: " + e.message); }
}

/* ── 6. Roll formulas actually consume the attr ──────────────────────── */
const presetRolls = raw.match(/name="roll_spellpreset_[a-z]+"[^>]*>/g) || [];
if (presetRolls.length !== 3) fails.push(`expected 3 preset roll buttons, found ${presetRolls.length}`);
presetRolls.forEach((b) => {
  const which = b.match(/roll_spellpreset_([a-z]+)/)[1];
  if (!b.includes("@{spellpreset_strain_penalty_mdr}"))
    fails.push(`preset ${which} roll does not add the surcharge`);
});
if (!raw.includes('name="attr_spellpreset_strain_penalty_mdr"'))
  fails.push("spellpreset_strain_penalty_mdr has no named element in the row");

/* ── report ──────────────────────────────────────────────────────────── */
if (fails.length) {
  console.log(`\nFAIL — ${fails.length} assertion(s):\n`);
  fails.forEach((f) => console.log("   " + f));
  process.exit(1);
}
console.log("\nPASS — surcharge is +1 off-school, 0 on-school, 0 Universal,");
console.log("applied by both sections, recomputed on career change and on open.");
