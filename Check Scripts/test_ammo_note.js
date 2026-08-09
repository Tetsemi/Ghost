#!/usr/bin/env node
/* Ammo roll note: ammoDataMap.effect_summary_key -> {{ammonote}}.
   Executes the worker; node --check cannot see an undefined identifier. */
const fs = require("fs");
const p   = process.argv[2] || "ghost_of_arcadia.html";
const raw = fs.readFileSync(p, "utf8");
const js  = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
const TR  = JSON.parse(fs.readFileSync(p.replace(/[^/]*$/, "translation.json"), "utf8"));

const fails = [];
const bad = (m) => fails.push(m);

/* ── Static wiring: every layer present ──────────────────────────────── */
const W1 = "weapon1_mdr_ammo_note", REP = "weapon_ammo_note_mdr";
if ((raw.match(new RegExp(`name="attr_${W1}"`, "g")) || []).length !== 1)
  bad(`${W1} must have exactly one named element`);
if ((raw.match(new RegExp(`name="attr_${REP}"`, "g")) || []).length !== 2)
  bad(`${REP} must have exactly one named element in each of the two weapon fieldsets`);
const rolls = raw.match(/name="roll_[a-z0-9_]*"[^>]*value="[^"]*\{\{ammo=[^"]*"/g) || [];
if (rolls.length !== 6) bad(`expected 6 roll buttons passing ammo, found ${rolls.length}`);
rolls.forEach((b) => {
  if (!/\{\{ammonote=@\{(weapon1_mdr_ammo_note|weapon_ammo_note_mdr)\}\}\}/.test(b))
    bad(`roll button ${(b.match(/name="(roll_[a-z0-9_]*)"/) || [])[1]} does not pass ammonote`);
});
if ((raw.match(/\{\{#ammonote\}\}/g) || []).length !== 2) bad("expected {{#ammonote}} in both attack templates");
if ((raw.match(/\{\{\/ammonote\}\}/g) || []).length !== 2) bad("unclosed {{#ammonote}} section");
if (!TR["ammo_effect"]) bad("translation key ammo_effect missing");
/* Alphabetical order of translation.json must survive the insert. */
const keys = Object.keys(TR);
const i = keys.indexOf("ammo_effect");
if (i > 0 && keys[i - 1] > "ammo_effect") bad(`ammo_effect inserted out of order (after ${keys[i - 1]})`);
if (i >= 0 && i + 1 < keys.length && keys[i + 1] < "ammo_effect") bad(`ammo_effect inserted out of order (before ${keys[i + 1]})`);

/* ── Runtime: the note resolves to the authored effect text ───────────── */
Object.assign(globalThis, {
  on: () => {}, getAttrs: (k, cb) => cb({}), setAttrs: () => {},
  getSectionIDs: (s, cb) => cb([]), generateRowID: () => "-n", removeRepeatingRow: () => {},
  getTranslationByKey: (k) => (TR[k] !== undefined ? TR[k] : k),
});
let mod;
try { mod = new Function(js + "\nreturn { ammoEffects, ammoDataMap, weaponPresetAttrDefaults };")(); }
catch (e) { console.log("FAIL — worker threw at load:\n  " + e.message); process.exit(1); }

Object.keys(mod.ammoDataMap).forEach((t) => {
  const note = mod.ammoEffects(t, "1").note;
  const key  = mod.ammoDataMap[t].effect_summary_key;
  if (!note) bad(`${t}: note resolved empty`);
  if (note === key) bad(`${t}: effect_summary_key "${key}" missing from translation.json (fell back to the key)`);
  if (mod.ammoEffects(t, "0").note !== "") bad(`${t}: inactive ammo must produce no note`);
});
if (mod.ammoEffects("standard", "1").note !== "") bad("standard ammo must produce no note");
if (mod.ammoEffects("mystery_ammo", "1").note !== "") bad("unknown ammo must produce no note");

/* ── The note is an owned attr, so deselect must clear it ─────────────── */
if (!mod.weaponPresetAttrDefaults.ammo_note) bad("ammo_note missing from weaponPresetAttrDefaults");
else {
  const spec = mod.weaponPresetAttrDefaults.ammo_note;
  if (spec.def !== "") bad(`ammo_note default should be "" not ${JSON.stringify(spec.def)}`);
  if (spec.both !== true) bad("ammo_note must be declared for both scopes");
}
/* The preset apply path builds from Object.assign(clearOthers, ...), NOT from
   buildWeaponPresetBlank, so the defaults map does not reach it — assert the
   explicit reset is present. */
if (!/\[p \+ "weapon_ammo_note_mdr"\]:\s*"",/.test(js))
  bad("preset apply does not explicitly clear weapon_ammo_note_mdr");

/* ── Every label write site has a matching note write ─────────────────── */
const labelWrites = (js.match(/roll_ammo_label(_mdr)?[`"\]]*\s*[:=]/g) || []).length;
const noteWrites  = (js.match(/ammo_note(_mdr)?[`"\]]*\s*[:=]/g) || []).length;
if (noteWrites < labelWrites)
  bad(`${labelWrites} label writes but only ${noteWrites} note writes — a path updates the label without the note`);

if (fails.length) { console.log(`\nFAIL — ${fails.length}:\n`); fails.forEach(f => console.log("   " + f)); process.exit(1); }
console.log(`label writes: ${labelWrites}   note writes: ${noteWrites}   roll buttons: ${rolls.length}`);
console.log("\nPASS — note wired across all six roll buttons, both templates, all three scopes.");
