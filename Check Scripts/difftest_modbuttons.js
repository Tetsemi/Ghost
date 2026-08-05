#!/usr/bin/env node
/*
 * Ghost of Arcadia — weaponModDataMap wiring proof.
 *
 * `weaponModDataMap` is the authoritative source for weapon mod compatibility,
 * but no code reads it: `computeModButtons` reimplements slot +
 * compatible_categories as 13 hardcoded rows, and computeWeaponDice hardcodes
 * the Mag Scope die ranges.
 *
 * Before wiring the map up, this proves whether the two agree TODAY, for every
 * weapon in weaponDataMap. Any divergence is either a map error or a code error
 * and must be adjudicated by the rules author before the wiring proceeds —
 * silently adopting the map's answer would change live behaviour.
 *
 * Usage: node difftest_modbuttons.js ghost_of_arcadia.html
 * Exit 0 = code and map agree everywhere.
 */

const fs = require("fs");
const path = process.argv[2] || "ghost_of_arcadia.html";
const raw = fs.readFileSync(path, "utf8");
const js = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];

function extract(name) {
  const start = js.indexOf("const " + name);
  if (start < 0) throw new Error("not found: " + name);
  let depth = 0, seen = false, quote = null;
  for (let i = start; i < js.length; i++) {
    const c = js[i], prev = js[i - 1];
    if (quote) { if (c === quote && prev !== "\\") quote = null; continue; }
    if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
    if (c === "{" || c === "[") { depth++; seen = true; }
    else if (c === "}" || c === "]") {
      depth--;
      if (seen && depth === 0) return js.slice(start, i + 1) + ";";
    }
  }
  throw new Error("unterminated: " + name);
}

function extractFn(name) {
  const start = js.indexOf("function " + name);
  if (start < 0) throw new Error("not found: " + name);
  let depth = 0, seen = false;
  for (let i = start; i < js.length; i++) {
    if (js[i] === "{") { depth++; seen = true; }
    else if (js[i] === "}") { depth--; if (seen && depth === 0) return js.slice(start, i + 1); }
  }
  throw new Error("unterminated: " + name);
}

/* computeModButtons no longer hardcodes the 13 rows — since weaponModDataMap
   was wired it iterates weaponModBtnAttr and delegates to weaponModFits (a const arrow,
   so extract not extractFn), and both must be in the sandbox or the call
   both must be in the sandbox or the call throws ReferenceError. */
const sandbox = new Function(
  extract("weaponDataMap") + "\n" +
  extract("weaponModDataMap") + "\n" +
  extract("weaponModBtnAttr") + "\n" +
  extract("weaponModFits") + "\n" +
  extractFn("computeModButtons") + "\n" +
  "return { weaponDataMap, weaponModDataMap, weaponModBtnAttr, computeModButtons };"
)();
const { weaponDataMap, weaponModDataMap, computeModButtons } = sandbox;

/* Which button attr each map entry backs. */
const BTN_OF = {
  magnification_scope:         "btn_optics_mag_mdr",
  reflex_sight:                "btn_optics_reflex_mdr",
  thermal_scope:               "btn_optics_thermal_mdr",
  silencer:                    "btn_barrel_silencer_mdr",
  compensator:                 "btn_barrel_compensator_mdr",
  suppressor:                  "btn_barrel_suppressor_mdr",
  precision_choke:             "btn_barrel_prec_choke_mdr",
  slug_barrel:                 "btn_barrel_slug_mdr",
  smartlink:                   "btn_internal_smartlink_mdr",
  bio_coded:                   "btn_internal_biocoded_mdr",
  internal_recoil_system:      "btn_internal_irs_mdr",
  quick_load_system:           "btn_internal_qls_mdr",
  quick_select_trigger_module: "btn_internal_qst_mdr",
};

/* weaponDataMap.mod_slots uses "barrel_muzzle"/"optics"/"internal", matching
   weaponModDataMap.slot exactly — no translation needed. */
function fromMap(entry, modKey) {
  const mod = weaponModDataMap[modKey];
  const slots = entry.mod_slots || [];
  const traits = entry.traits || [];
  if (!slots.includes(mod.slot)) return "0";
  if (!(mod.compatible_categories || []).includes(entry.category || "")) return "0";
  if ((mod.incompatible_traits || []).some((t) => traits.includes(t))) return "0";
  const subs = mod.compatible_subcategories || [];
  if (subs.length && entry.subcategory && !subs.includes(entry.subcategory)) return "0";
  /* requires_mode is a FITTABILITY test, distinct from mode_restriction: the
     weapon must actually offer one of these modes for the mod to be fitted at
     all. A Compensator's only benefit is the SA follow-up reduction, so an
     SS-only shotgun or sniper cannot take one. Omitting this reported 10 false
     divergences against weaponModFits. */
  const reqMode = (mod.requires_mode || []).map((m) => String(m).toLowerCase());
  if (reqMode.length) {
    const modes = (entry.mode || []).map((m) => String(m).toLowerCase());
    if (!modes.some((m) => reqMode.includes(m))) return "0";
  }
  return "1";
}

const rows = [];
let compared = 0;
for (const wKey of Object.keys(weaponDataMap)) {
  const entry = weaponDataMap[wKey];
  const code = computeModButtons(entry, "");
  for (const modKey of Object.keys(BTN_OF)) {
    const attr = BTN_OF[modKey];
    const got = code[attr];
    const want = fromMap(entry, modKey);
    compared++;
    if (got !== want) {
      rows.push({
        weapon: wKey,
        category: entry.category || "",
        subcategory: entry.subcategory || "(none)",
        mod: modKey,
        code: got,
        map: want,
      });
    }
  }
}

console.log(`weapons: ${Object.keys(weaponDataMap).length}   mods: ${Object.keys(BTN_OF).length}   comparisons: ${compared}`);
if (!rows.length) {
  console.log("\nAGREE — computeModButtons matches weaponModDataMap for every weapon.");
  console.log("Wiring the map up is behaviour-preserving.");
  process.exit(0);
}

/* Group divergences by (mod, reason) so the report is adjudicable. */
const byMod = {};
rows.forEach((r) => { (byMod[r.mod] = byMod[r.mod] || []).push(r); });

console.log(`\nDIVERGENCE — ${rows.length} of ${compared} comparisons differ.\n`);
for (const mod of Object.keys(byMod).sort()) {
  const list = byMod[mod];
  const m = weaponModDataMap[mod];
  console.log(`${mod}  (slot=${m.slot}, cats=${JSON.stringify(m.compatible_categories)},`);
  console.log(`    subcats=${JSON.stringify(m.compatible_subcategories)}, incompat=${JSON.stringify(m.incompatible_traits)})`);
  list.forEach((r) => {
    console.log(`    ${r.weapon.padEnd(30)} cat=${r.category.padEnd(9)} sub=${String(r.subcategory).padEnd(12)} code=${r.code} map=${r.map}`);
  });
  console.log("");
}
console.log("Each line needs a ruling: is the map right (code is wrong) or the");
console.log("code right (map is stale)? Do not wire up until resolved.");
process.exit(1);
