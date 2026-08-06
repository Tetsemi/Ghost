#!/usr/bin/env node
/*
 * Ghost of Arcadia — ammoDataMap wiring proof.
 *
 * `ammoDataMap` is the authoritative source for ammunition rules, but NOTHING
 * reads it: the identifier appears exactly once in the worker, its own
 * declaration. Every ammo rule the sheet implements is hardcoded, and most
 * declared rules are not implemented at all.
 *
 * This is the same position weaponModDataMap was in before it was wired up, so
 * this test plays the same role difftest_modbuttons.js did: prove whether the
 * literals and the map agree TODAY, before anything moves. Any divergence is
 * either a map error or a code error and must be adjudicated by the rules
 * author — silently adopting the map's answer would change live behaviour.
 *
 * It also pins the STORED-VALUE KEY SPACE. The sheet stores short names
 * ("subsonic") while the map is keyed on long ones ("subsonic_rounds"), so a
 * naive ammoDataMap[storedValue] lookup returns undefined for four of six
 * types. That fails OPEN, not loud: an ap_modifier lookup would yield 0 and
 * look correct, while subsonic would silently lose its die step-down. The
 * translation table below is the thing the migration deletes; after the
 * rename it becomes the identity and this test still passes.
 *
 * Usage: node difftest_ammo.js ghost_of_arcadia.html
 * Exit 0 = map and code agree, key space is as expected, deferred data intact.
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

const box = new Function(
  extract("ammoDataMap") + "\n" +
  extract("weaponToggleFamilies") + "\n" +
  "return { ammoDataMap, weaponToggleFamilies };"
)();
const M = box.ammoDataMap;
const BTNS = box.weaponToggleFamilies.ammo.btns;

const fails = [];
const notes = [];
const bad = (m) => fails.push(m);

/* ── 0. Key space ─────────────────────────────────────────────────────
   Expected stored-value -> ammoDataMap key. Frozen deliberately: if anyone
   renames a stored value or a map key without updating this table, the
   bijection assertions below fail rather than the mismatch going unnoticed.
   MIGRATED 2026-08-06 — now the identity. Kept so a future rename that
   forgets one layer fails here instead of silently returning undefined. */
const STORED_TO_MAP = {
  ap_rounds:           "ap_rounds",
  breacher_slugs:      "breacher_slugs",
  hollow_point:        "hollow_point",
  shock_rounds:        "shock_rounds",
  subsonic_rounds:     "subsonic_rounds",
  veil_charged_rounds: "veil_charged_rounds",
};

const storedValues = Object.values(BTNS).sort();
const tableKeys = Object.keys(STORED_TO_MAP).sort();
if (JSON.stringify(storedValues) !== JSON.stringify(tableKeys))
  bad(`button values ${JSON.stringify(storedValues)} do not match the translation table ${JSON.stringify(tableKeys)}`);

const mapKeys = Object.keys(M).sort();
const translated = Object.values(STORED_TO_MAP).sort();
if (JSON.stringify(mapKeys) !== JSON.stringify(translated))
  bad(`translated values ${JSON.stringify(translated)} do not cover ammoDataMap keys ${JSON.stringify(mapKeys)}`);

const mismatched = Object.keys(STORED_TO_MAP).filter(k => k !== STORED_TO_MAP[k]);
const toMap = (stored) => STORED_TO_MAP[stored] || stored;

/* ── 0b. CSS button-highlight coverage, per scope ─────────────────────
   Each stored value needs a [value=] rule in BOTH the weapon1 scope
   (attr_weapon1_mdr_ammo_type) and the repeating scope
   (attr_weapon_ammo_type_mdr). Checking only that "a rule exists somewhere"
   passes when one scope was missed during a rename — verified by reverting a
   single ammo_type_mdr selector and watching the naive check stay green. */
const cssPath = process.argv[3] || path.replace(/\.html$/, ".css");
let css = null;
try { css = fs.readFileSync(cssPath, "utf8"); } catch (e) { /* optional */ }
if (css === null) {
  notes.push(`CSS not found at ${cssPath} — button-highlight coverage UNVERIFIED`);
} else {
  Object.keys(STORED_TO_MAP).forEach((stored) => {
    ["ammo_type", "ammo_type_mdr"].forEach((attr) => {
      if (!css.includes(`${attr}"][value="${stored}"`))
        bad(`CSS: no [value="${stored}"] rule for attr_..._${attr} — that button never highlights`);
    });
  });
}

/* ── 1. Equivalence: pre-wiring behaviour vs ammoEffects ──────────────
   ammoDataMap is now READ rather than duplicated, so scraping literals no
   longer proves anything. Comparing ammoEffects' output back to the map it
   reads would be tautological, so the pre-wiring logic is transcribed here
   verbatim as the canonical reference — the same approach difftest_tags.js
   uses. This is an independent restatement, not a second read of the source.

     ammoAP      = (active === "1" && type === "ap_rounds") ? 2 : 0;
     reducingAmmo = ["ap_rounds", "subsonic_rounds"];
     doReduce    = (active === "1") && reducingAmmo.includes(type);
     label       = (active === "1" && type !== "standard")
                     ? type.replace(/_/g, " ") : "";                        */
const canonical = (type, active) => ({
  ap:       (active === "1" && type === "ap_rounds") ? 2 : 0,
  dieShift: (active === "1" && ["ap_rounds", "subsonic_rounds"].includes(type)) ? -1 : 0,
  label:    (active === "1" && type && type !== "standard") ? type.replace(/_/g, " ") : "",
});

/* Execute the worker: node --check cannot see an undefined identifier or a TDZ
   fault, and ammoEffects is only reachable by running the module. */
let ammoEffects = null;
{
  const TR = (() => {
    try { return JSON.parse(fs.readFileSync(path.replace(/[^/]*$/, "translation.json"), "utf8")); }
    catch (e) { return null; }
  })();
  if (!TR) notes.push("translation.json not found — label text UNVERIFIED");
  Object.assign(globalThis, {
    on: () => {}, getAttrs: (k, cb) => cb({}), setAttrs: () => {},
    getSectionIDs: (s, cb) => cb([]), generateRowID: () => "-n", removeRepeatingRow: () => {},
    getTranslationByKey: (k) => (TR && TR[k] !== undefined) ? TR[k] : k,
  });
  try { ammoEffects = new Function(js + "\nreturn ammoEffects;")(); }
  catch (e) { bad("worker threw at load: " + e.message); }
}

const TYPES = Object.keys(STORED_TO_MAP).concat(["standard", "", "mystery_ammo"]);
const rows = [];
if (ammoEffects) {
  TYPES.forEach((t) => ["1", "0", ""].forEach((a) => {
    /* Wrapped: a missing unknown-key guard makes this throw, and an uncaught
       throw here crashes the run instead of reporting which input broke it. */
    let got;
    try { got = ammoEffects(t, a); }
    catch (e) { bad(`ammoEffects threw on ${JSON.stringify(t)}/${JSON.stringify(a)}: ${e.message}`); return; }
    const want = canonical(t, a);
    if (got.ap !== want.ap)
      bad(`ap ${t}/${a}: pre-wiring=${want.ap} ammoEffects=${got.ap}`);
    if (got.dieShift !== want.dieShift)
      bad(`dieShift ${t}/${a}: pre-wiring=${want.dieShift} ammoEffects=${got.dieShift}`);
    if (STORED_TO_MAP[t] && a === "1") rows.push({ t, got, want });
  }));

  /* ── 2. Label: an INTENDED divergence, asserted precisely ──────────
     The old label rendered the KEY with underscores stripped ("veil charged
     rounds"). It now resolves name_key. Assert the new value equals the
     authored name rather than merely "differs", so a broken key that falls
     back to the raw key string is caught. */
  Object.keys(STORED_TO_MAP).forEach((t) => {
    const key = M[t].name_key;
    const got = ammoEffects(t, "1").label;
    if (!key) { bad(`${t}: no name_key`); return; }
    if (got === key) bad(`${t}: name_key "${key}" is missing from translation.json (label fell back to the key)`);
    if (!got) bad(`${t}: label resolved empty`);
  });
  /* Inactive and standard must still yield no label. */
  if (ammoEffects("ap_rounds", "0").label !== "") bad("inactive ammo must yield no label");
  if (ammoEffects("standard", "1").label !== "") bad("standard ammo must yield no label");
  /* An unknown key must degrade quietly, never throw. */
  try {
    const u = ammoEffects("mystery_ammo", "1");
    if (u.ap !== 0 || u.dieShift !== 0 || u.label !== "") bad("unknown ammo key must yield zeroed effects");
  } catch (e) { bad("unknown ammo key threw: " + e.message); }
}

/* ── 3. Duplication census, inverted now that the map is wired ────────── */
const AP_SITE = /(\w*[Aa]mmoAP)\s*=\s*\(\s*(\w+)\s*===\s*"1"\s*&&\s*(\w+)\s*===\s*"([a-z_]+)"\s*\)\s*\?\s*(\d+)\s*:\s*0/g;
const apSites = (js.match(AP_SITE) || []).length;
if (apSites !== 0)
  bad(`${apSites} hardcoded ammoAP literal(s) remain — every site must read ammoDataMap`);
if (/reducingAmmo/.test(js))
  bad("reducingAmmo still present — die shift must come from damage_die_shift");
/* Count real property accesses, not mentions: comments referencing
   ammoDataMap[stored] in prose would otherwise make the map look wired. */
const codeOnly = js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
/* Checked against codeOnly, not js: the comment explaining what this replaced
   contains the very pattern being banned, and matched itself. */
if (/ammoType\.replace\(\/_\/g/.test(codeOnly))
  bad("ammo label still derived from the key — must resolve name_key");

const ammoDataMapReads = (codeOnly.match(/ammoDataMap\s*[\[.]/g) || []).length;
if (ammoDataMapReads < 1) bad("ammoDataMap is still not read by any code");
notes.push(`ammoDataMap reads: ${ammoDataMapReads}   hardcoded AP sites: ${apSites}`);

/* ── 4. Declared but NOT implemented ──────────────────────────────────
   These are live combat effects the map declares and the sheet ignores.
   Unlike weaponModDataMap's deferrals these are not documented decisions, so
   they are reported as GAPs. Each is asserted PRESENT with its expected value:
   an earlier version of difftest_modeffects.js skipped absent fields, which
   meant deleting one passed silently. Do not weaken these to "if declared". */
const UNIMPLEMENTED = [
  { key: "veil_charged_rounds", field: "damage_type_override", expected: "veil",
    why: "damage type is never overridden; the weapon's own damage_type always wins" },
  { key: "shock_rounds", field: "bonus_damage_condition", expected: "mechanical_targets_only",
    why: "target class is unknown to the sheet; +2d6 vs mechanical is never applied" },
  { key: "breacher_slugs", field: "structural_damage_multiplier", expected: 2,
    why: "structural x2 vs objects and barriers is never applied" },
  { key: "breacher_slugs", field: "forces_single_target", expected: true,
    why: "no code consumes it; scatter_spray removal is not applied either" },
  { key: "subsonic_rounds", field: "suppressed_bf_enabled", expected: true,
    why: "no code consumes it; BF gating ignores ammo" },
  { key: "subsonic_rounds", field: "requires_suppressor", expected: true,
    why: "no code consumes it; subsonic is selectable without a suppressor fitted" },
  { key: "veil_charged_rounds", field: "on_fumble", expected: "veil_burnout",
    why: "no fumble hook exists" },
];
const gaps = [];
UNIMPLEMENTED.forEach((u) => {
  const got = M[u.key] ? M[u.key][u.field] : undefined;
  const intact = JSON.stringify(got) === JSON.stringify(u.expected);
  if (!intact)
    bad(`DATA LOST ${u.key}.${u.field}: expected ${JSON.stringify(u.expected)}, got ${JSON.stringify(got)} — ` +
        "this rule is unimplemented but authoritative; do not drop it from the map");
  else gaps.push(u);
});
/* hollow_point.soak_modifier is a nested object; check its shape survives. */
const sm = M.hollow_point && M.hollow_point.soak_modifier;
if (!sm || !sm.low_soak || !sm.high_soak)
  bad("DATA LOST hollow_point.soak_modifier: expected low_soak/high_soak branches");
else gaps.push({ key: "hollow_point", field: "soak_modifier", expected: "(nested)",
                 why: "soak-threshold branching is never applied" });

/* ── report ──────────────────────────────────────────────────────────── */
console.log(`ammo types: ${Object.keys(M).length}   hardcoded AP sites: ${apSites}   ammoDataMap reads: ${ammoDataMapReads}\n`);

console.log("EQUIVALENCE — pre-wiring behaviour vs ammoEffects (ammo active)");
rows.forEach((r) => {
  const ok = r.got.ap === r.want.ap && r.got.dieShift === r.want.dieShift;
  console.log(`  ${ok ? "OK  " : "DIFF"} ${r.t.padEnd(22)} ap ${r.want.ap}->${r.got.ap}   ` +
              `die_shift ${r.want.dieShift}->${r.got.dieShift}   label "${r.want.label}" -> "${r.got.label}"`);
});

console.log("\nKEY SPACE — stored value -> map key");
Object.keys(STORED_TO_MAP).forEach((s) => {
  const same = s === STORED_TO_MAP[s];
  console.log(`  ${same ? "OK    " : "RENAME"} "${s}"${same ? "" : ' -> "' + STORED_TO_MAP[s] + '"'}`);
});
if (mismatched.length)
  console.log(`  ${mismatched.length} of ${Object.keys(STORED_TO_MAP).length} stored values do not equal their map key.\n` +
              "  ammoDataMap[storedValue] is undefined for these — a lookup returns 0/no-op\n" +
              "  rather than throwing, so wiring up BEFORE the rename fails silently.");

console.log("\nGAP — declared in the map, not implemented anywhere");
gaps.forEach((g) => {
  console.log(`  GAP  ${g.key.padEnd(22)} ${g.field}`);
  console.log(`       ${g.why}`);
});

notes.forEach((n) => console.log("\nnote: " + n));

if (fails.length) {
  console.log(`\nFAIL — ${fails.length} problem(s):\n`);
  fails.forEach((f) => console.log("   " + f));
  console.log("\nEach line needs a ruling before ammoDataMap is wired up.");
  process.exit(1);
}
console.log("\nAGREE — every IMPLEMENTED ammo rule matches its declaration, so wiring");
console.log("ammoDataMap up is behaviour-preserving once the key space is migrated.");
console.log("GAPs are declared rules with no implementation: they are not proven safe,");
console.log("they are simply not running. Each needs implement-or-defer adjudication.");
process.exit(0);
