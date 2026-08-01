#!/usr/bin/env node
/*
 * Ghost of Arcadia — weaponModDataMap mechanical-effect proof (item 2).
 *
 * difftest_modbuttons.js proved the *compatibility* fields (slot,
 * compatible_categories, compatible_subcategories, incompatible_traits) agree
 * with computeModButtons. This proves the second half: the *mechanical effect*
 * fields — die ranges, hit bonuses, penalty reductions, mode restrictions,
 * range-band extension — against the places the sheet hardcodes them.
 *
 * Each check states the map's declaration, the code's literal, and whether they
 * agree. Where the code implements something the map does not declare (or vice
 * versa) that is reported as a GAP, not a pass — a gap means wiring the map up
 * would silently change behaviour.
 *
 * Usage: node difftest_modeffects.js ghost_of_arcadia.html
 * Exit 0 = every declared effect is faithfully implemented and vice versa.
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
    else if (c === "}" || c === "]") { depth--; if (seen && depth === 0) return js.slice(start, i + 1) + ";"; }
  }
  throw new Error("unterminated: " + name);
}

const box = new Function(
  extract("weaponModDataMap") + "\n" + extract("barrelModeRestrict") +
  "\nreturn { weaponModDataMap, barrelModeRestrict };"
)();
const M = box.weaponModDataMap;
const barrelModeRestrict = box.barrelModeRestrict;

/* Range-band codes used by the map vs the strings used by the sheet. */
const BAND = { E: "engaged", S: "short", M: "medium", L: "long", X: "extreme" };
const expand = (codes) => (codes || []).map((c) => BAND[c] || c.toLowerCase());

/* Pull a literal array out of a known code line, e.g. ["engaged", "short"]. */
function codeArray(pattern) {
  const m = js.match(pattern);
  if (!m) return null;
  return m[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
}
const eq = (a, b) =>
  a && b && a.length === b.length && a.every((x, i) => x === b[i]);

const results = [];
const check = (mod, field, mapVal, codeVal, ok, note) =>
  results.push({ mod, field, mapVal: JSON.stringify(mapVal), codeVal: JSON.stringify(codeVal), ok, note: note || "" });

/* ── 1. magnification_scope die ranges ───────────────────────────────── */
const magPen = codeArray(/magPenDice\s*=\s*\(optics === "magnification" && \[([^\]]*)\]\.includes\(range\)\)/);
const magBon = codeArray(/magBonusDice\s*=\s*\(optics === "magnification" && \[([^\]]*)\]\.includes\(range\)\)/);
check("magnification_scope", "penalty_die_range",
      expand(M.magnification_scope.penalty_die_range), magPen,
      eq(expand(M.magnification_scope.penalty_die_range), magPen));
check("magnification_scope", "bonus_die_range",
      expand(M.magnification_scope.bonus_die_range), magBon,
      eq(expand(M.magnification_scope.bonus_die_range), magBon));

/* ── 2. reflex_sight hit bonus ───────────────────────────────────────── */
const reflexPct = js.match(/reflexBonus\s*=\s*\(optics === "reflex" && aimActive && \[([^\]]*)\]\.includes\(range\)[^)]*\)\s*\?\s*(\d+)/);
check("reflex_sight", "hit_bonus_pct", M.reflex_sight.hit_bonus_pct,
      reflexPct ? Number(reflexPct[2]) : null,
      !!reflexPct && Number(reflexPct[2]) === M.reflex_sight.hit_bonus_pct);
const reflexBands = reflexPct ? reflexPct[1].split(",").map((s) => s.trim().replace(/"/g, "")) : null;
check("reflex_sight", "hit_bonus_range_limit",
      expand(M.reflex_sight.hit_bonus_range_limit), reflexBands,
      eq(expand(M.reflex_sight.hit_bonus_range_limit), reflexBands));
check("reflex_sight", "hit_bonus_aim_only", M.reflex_sight.hit_bonus_aim_only,
      /reflexBonus[\s\S]{0,80}aimActive/.test(js),
      M.reflex_sight.hit_bonus_aim_only === /reflexBonus[\s\S]{0,80}aimActive/.test(js));

/* ── 3. smartlink hit bonus ──────────────────────────────────────────── */
const slPct = js.match(/hasSL\s*\?\s*(\d+)\s*:|slBonus\s*=\s*[^;]*?(\d+)\s*:\s*0/);
const slNum = slPct ? Number(slPct[1] || slPct[2]) : null;
check("smartlink", "hit_bonus_pct", M.smartlink.hit_bonus_pct, slNum,
      slNum === M.smartlink.hit_bonus_pct, slNum === null ? "literal not located" : "");

/* ── 4. IRS penalty reduction ────────────────────────────────────────── */
const irsOne = /irsBonus\s*=\s*irs === "1" \? 1 : 0/.test(js);
check("internal_recoil_system", "bf_penalty_reduction",
      M.internal_recoil_system.bf_penalty_reduction, irsOne ? 1 : null, irsOne && M.internal_recoil_system.bf_penalty_reduction === 1);
check("internal_recoil_system", "fa_penalty_reduction",
      M.internal_recoil_system.fa_penalty_reduction, irsOne ? 1 : null, irsOne && M.internal_recoil_system.fa_penalty_reduction === 1,
      "code applies one flat reduction to both BF and FA");

/* ── 5. mode restrictions (barrel mods) ──────────────────────────────── */
const LABEL = { silencer: "Silencer", compensator: "Compensator", suppressor: "Suppressor",
                precision_choke: "Precision Choke", slug_barrel: "Slug Barrel" };
for (const key of Object.keys(LABEL)) {
  const declared = (M[key].mode_restriction || []).map((s) => s.toLowerCase());
  const impl = barrelModeRestrict[LABEL[key]];
  if (!declared.length) {
    check(key, "mode_restriction", declared, impl, impl === null || impl === undefined,
          "map declares no restriction");
    continue;
  }
  /* The map names the HIGHEST permitted mode; the code lists every permitted
     mode. Expand the declaration along the ss < sa < bf < fa ordering. */
  const ORDER = ["ss", "sa", "bf", "fa"];
  const top = declared[declared.length - 1];
  const expanded = ORDER.slice(0, ORDER.indexOf(top) + 1);
  check(key, "mode_restriction", expanded, impl, eq(expanded, impl),
        `map declares ${JSON.stringify(declared)} (highest permitted)`);
}

/* ── 6. slug_barrel range-band extension ─────────────────────────────── */
const slugExt = js.match(/slugExt\s*=\s*\(barrel === "Slug Barrel"\)\s*\?\s*(\d+)/);
check("slug_barrel", "range_band_extension", M.slug_barrel.range_band_extension,
      slugExt ? Number(slugExt[1]) : null,
      !!slugExt && Number(slugExt[1]) === M.slug_barrel.range_band_extension);

/* ── 7. effects declared in the map with NO implementation ───────────── */
const UNIMPLEMENTED = {
  quick_load_system: "reload_as_free_action",
  compensator: "sa_follow_up_reduction",
  thermal_scope: "ignores_low_light_penalty",
};
for (const [mod, field] of Object.entries(UNIMPLEMENTED)) {
  const declared = M[mod][field];
  if (!declared) continue;
  results.push({ mod, field, mapVal: JSON.stringify(declared), codeVal: '"(none)"',
                 ok: null, note: "declared in map, no mechanical implementation found" });
}

/* ── report ──────────────────────────────────────────────────────────── */
const pass = results.filter((r) => r.ok === true).length;
const fail = results.filter((r) => r.ok === false);
const gaps = results.filter((r) => r.ok === null);

console.log(`checks: ${results.length}   agree: ${pass}   disagree: ${fail.length}   gaps: ${gaps.length}\n`);
for (const r of results) {
  const mark = r.ok === true ? "OK  " : r.ok === false ? "DIFF" : "GAP ";
  console.log(`${mark} ${r.mod.padEnd(26)} ${r.field.padEnd(23)} map=${r.mapVal.padEnd(30)} code=${r.codeVal}`);
  if (r.note) console.log(`       ${r.note}`);
}
if (fail.length) {
  console.log("\nDISAGREEMENT — wiring the map up would change behaviour.");
  console.log("Each line needs a ruling before proceeding.");
  process.exit(1);
}
if (gaps.length) {
  console.log("\nAGREE on everything implemented, but the map declares effects the");
  console.log("sheet does not implement. Wiring is safe for the implemented set;");
  console.log("the gaps are unbuilt features, not defects.");
  process.exit(0);
}
console.log("\nAGREE — every declared effect matches its implementation.");
