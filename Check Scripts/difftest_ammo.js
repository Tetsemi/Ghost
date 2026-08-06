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

/* ── 1. ap_modifier vs the hardcoded AP literals ─────────────────────── */
const AP_SITE = /(\w*[Aa]mmoAP)\s*=\s*\(\s*(\w+)\s*===\s*"1"\s*&&\s*(\w+)\s*===\s*"([a-z_]+)"\s*\)\s*\?\s*(\d+)\s*:\s*0/g;
const apSites = [];
let m;
while ((m = AP_SITE.exec(js)) !== null) {
  apSites.push({ varName: m[1], stored: m[4], value: Number(m[5]) });
}
if (!apSites.length) bad("no hardcoded ammoAP sites located — has the shape changed?");

/* Every site must agree with every other site. */
const apByStored = {};
apSites.forEach((s) => {
  if (apByStored[s.stored] === undefined) apByStored[s.stored] = s.value;
  else if (apByStored[s.stored] !== s.value)
    bad(`AP literals disagree for "${s.stored}": ${apByStored[s.stored]} vs ${s.value}`);
});

/* Code's view -> map's view, for all six types. */
Object.keys(STORED_TO_MAP).forEach((stored) => {
  const key = toMap(stored);
  const declared = M[key].ap_modifier;
  const implemented = apByStored[stored] !== undefined ? apByStored[stored] : 0;
  if (declared !== implemented)
    bad(`ap_modifier ${key}: map=${declared} code=${implemented}`);
});
/* And no literal names a type the map does not know. */
Object.keys(apByStored).forEach((stored) => {
  if (!STORED_TO_MAP[stored]) bad(`AP literal names unknown ammo type "${stored}"`);
});

/* ── 2. damage_die_shift vs reducingAmmo ─────────────────────────────── */
const red = js.match(/const\s+reducingAmmo\s*=\s*\[([^\]]*)\]/);
if (!red) bad("reducingAmmo literal not located");
const reducing = red
  ? red[1].split(",").map((s) => s.trim().replace(/^"|"$/g, "")).filter(Boolean)
  : [];
const reducingMapped = reducing.map(toMap).sort();
const declaredShift = Object.keys(M).filter((k) => M[k].damage_die_shift !== 0).sort();
if (JSON.stringify(reducingMapped) !== JSON.stringify(declaredShift))
  bad(`die shift: code reduces ${JSON.stringify(reducingMapped)} but map declares ${JSON.stringify(declaredShift)}`);

/* stepDownDie applies exactly ONE step. A map entry declaring -2 would be
   silently under-applied, so pin the magnitude too. */
Object.keys(M).forEach((k) => {
  const s = M[k].damage_die_shift;
  if (s !== 0 && s !== -1)
    bad(`damage_die_shift ${k}=${s}: code applies one step only (stepDownDie), magnitude unrepresentable`);
});

/* ── 3. Duplication census ───────────────────────────────────────────── */
/* Pinned so the count cannot creep upward unnoticed, and so wiring the map up
   is visible as this number falling to zero. */
const EXPECTED_AP_SITES = 10;
if (apSites.length !== EXPECTED_AP_SITES)
  bad(`hardcoded AP sites: ${apSites.length}, expected ${EXPECTED_AP_SITES} — update the count deliberately`);
/* Count real property accesses, not mentions. Comments referencing
   ammoDataMap[stored] in prose would otherwise inflate this and make the map
   look wired when nothing reads it — strip comments before measuring. */
const codeOnly = js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const ammoDataMapReads = (codeOnly.match(/ammoDataMap\s*[\[.]/g) || []).length;
notes.push(`ammoDataMap reads: ${ammoDataMapReads} (target after wiring: > 0)`);
notes.push(`hardcoded AP sites: ${apSites.length} (target after wiring: 0)`);
notes.push(`stored values needing rename: ${JSON.stringify(mismatched)}`);

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
console.log(`ammo types: ${Object.keys(M).length}   AP sites: ${apSites.length}   ammoDataMap reads: ${ammoDataMapReads}\n`);

console.log("IMPLEMENTED — map vs code");
Object.keys(STORED_TO_MAP).forEach((stored) => {
  const key = toMap(stored);
  const ap = apByStored[stored] !== undefined ? apByStored[stored] : 0;
  const shift = reducing.includes(stored) ? -1 : 0;
  const okAp = ap === M[key].ap_modifier;
  const okSh = shift === M[key].damage_die_shift;
  console.log(`  ${okAp && okSh ? "OK  " : "DIFF"} ${key.padEnd(22)} ap map=${M[key].ap_modifier} code=${ap}   ` +
              `die_shift map=${M[key].damage_die_shift} code=${shift}`);
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
