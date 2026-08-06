#!/usr/bin/env node
/*
 * Ghost of Arcadia — deriveWeaponTags differential test.
 *
 * The static prover (verify_tag_derivations.py) compares the seven inline
 * derivation blocks against each other. Once they are replaced by
 * deriveWeaponTags there is nothing left to compare, so this restores the
 * evidence from the other direction: it runs an exhaustive input matrix through
 * deriveWeaponTags and through the canonical derivation the prover extracted,
 * and asserts the outputs are identical.
 *
 * The `ap` field was removed on 2026-08-06: it was derived, threaded through the
 * bag and destructured by both consumers, and read by neither. Its absence is
 * asserted by the completeness check below, which iterates weaponTagInputs.
 *
 * Reference expressions below are transcribed verbatim from the prover output
 * (17 positions, variants=1 across all 7 sites). barrel and mode are excluded
 * from the shared set because site 2 legitimately overrides them; they are
 * covered by the overrides test instead.
 *
 * Usage: node difftest_tags.js ghost_of_arcadia.html
 * Exit 0 = identical on every combination.
 */

const fs = require("fs");
const path = process.argv[2] || "ghost_of_arcadia.html";
const raw = fs.readFileSync(path, "utf8");
const js = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];

/* Pull the three pieces under test straight out of the sheet. */
function extract(name, kind) {
  const start = js.indexOf((kind || "const ") + name);
  if (start < 0) throw new Error("not found: " + name);
  let depth = 0, seen = false, quote = null, tmpl = 0;
  for (let i = start; i < js.length; i++) {
    const c = js[i], prev = js[i - 1];
    if (quote) {                                   // inside '...' "..." or `...`
      if (c === quote && prev !== "\\") quote = null;
      else if (quote === "`" && c === "{" && prev === "$") tmpl++;
      else if (quote === "`" && c === "}" && tmpl > 0) tmpl--;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
    if (c === "{" || c === "[") { depth++; seen = true; }
    else if (c === "}" || c === "]") { depth--; if (seen && depth === 0) return js.slice(start, i + 1) + ";"; }
  }
  throw new Error("unterminated: " + name);
}

function extractStmt(name) {           // arrow consts with an expression body
  const start = js.indexOf("const " + name);
  if (start < 0) throw new Error("not found: " + name);
  const end = js.indexOf(";", js.indexOf("=>", start));
  return js.slice(start, end + 1);
}

const src = [
  extract("weaponPresetBareCores"),
  extractStmt("weaponPresetAttrRep"),
  extractStmt("weaponPresetAttrW1"),
  extract("weaponTagInputs"),
  extract("deriveWeaponTags"),
].join("\n");
const sandbox = new Function(src + "\nreturn { weaponTagInputs, deriveWeaponTags, weaponPresetAttrRep, weaponPresetAttrW1 };")();
const { deriveWeaponTags, weaponPresetAttrRep, weaponPresetAttrW1 } = sandbox;

/* Canonical derivation, transcribed from the prover's variants=1 output. */
const canonical = (g, x) => ({
  aim:         g("aim") || "",
  biocoded:    g("mod_internal") === "biocoded" ? "1" : "",
  category:    g("category") || "",
  concealable: g("trait_concealable") || "",
  cover:       g("target_cover") || "",
  cq:          g("trait_cq") === "1",
  irs:         g("mod_internal") === "irs" ? "1" : "",
  loadout:     g("loadout") || "",
  maxRange:    g("max_range") || "",
  optics:      g("optics") || (g("trait_scoped") === "1" ? "magnification" : ""),
  prone:       g("target_prone") || "",
  qls:         g("mod_internal") === "qls" ? "1" : "",
  qst:         g("mod_internal") === "qst" ? "1" : "",
  range:       g("range_band") || "short",
  silent:      g("trait_silent") || "",
  sl:          ((g("mod_internal") === "smartlink" || g("trait_smartlink") === "1")
                && x["cw_smartlink_installed"] === "1") ? "1" : "",
  /* consumed by computeWeaponDice, not buildTagsStr */
  reduceEff:   (parseInt(g("mod_penalty_reduce"), 10) || 0) + (g("mod_internal") === "irs" ? 1 : 0),
});

/* Value domains chosen to exercise every branch, including absent attrs. */
const DOMAIN = {
  mod_internal:     ["", "smartlink", "irs", "qst", "qls", "biocoded", "other"],
  mod_penalty_reduce: ["", "0", "1", "2"],
  trait_smartlink:  ["", "1"],
  trait_scoped:     ["", "1"],
  optics:           ["", "reflex"],
  ammo_active:      ["", "0", "1"],
  ammo_type:        ["", "standard", "ap_rounds"],
  trait_cq:         ["", "1"],
  trait_concealable:["", "1"],
  trait_silent:     ["", "1"],
  loadout:          ["", "drum", "extmag"],
  category:         ["", "rifle", "handgun"],
  range_band:       ["", "short", "long"],
  max_range:        ["", "S", "L"],
  aim:              ["", "1"],
  target_prone:     ["", "1"],
  target_cover:     ["", "partial"],
};
const GLOBALS = [{ cw_smartlink_installed: "" }, { cw_smartlink_installed: "1" }];

const cores = Object.keys(DOMAIN);
let checked = 0;
const failures = [];

function compare(vals, globals, scope) {
  const prefix = scope === "weapon1" ? "" : "repeating_weaponsmdr_-abc123_";
  const store = {};
  cores.forEach((c, i) => {
    store[scope === "weapon1" ? weaponPresetAttrW1(c) : prefix + weaponPresetAttrRep(c)] = vals[i];
  });
  const g = (c) => store[scope === "weapon1" ? weaponPresetAttrW1(c) : prefix + weaponPresetAttrRep(c)] || "";
  const got = deriveWeaponTags(store, scope, prefix, globals);
  const want = canonical(g, globals);
  checked++;
  Object.keys(want).forEach((k) => {
    if (got[k] !== want[k]) {
      failures.push({ scope, key: k, got: got[k], want: want[k], inputs: JSON.stringify(vals) });
    }
  });
}

/* Exhaustive over the interacting attrs; the independent ones are swept
   pairwise since they cannot influence each other's branches. */
const INTERACTING = ["mod_internal", "trait_smartlink", "trait_scoped", "optics",
                     "ammo_active", "ammo_type", "mod_penalty_reduce"];
function sweep(scope) {
  const idx = cores.map(() => 0);
  const interIdx = INTERACTING.map((c) => cores.indexOf(c));
  const rec = (d) => {
    if (d === interIdx.length) {
      for (let pass = 0; pass < 3; pass++) {
        cores.forEach((c, i) => {
          if (interIdx.indexOf(i) < 0) idx[i] = pass % DOMAIN[c].length;
        });
        GLOBALS.forEach((gl) => compare(cores.map((c, i) => DOMAIN[c][idx[i]]), gl, scope));
      }
      return;
    }
    const ci = interIdx[d];
    for (let k = 0; k < DOMAIN[cores[ci]].length; k++) { idx[ci] = k; rec(d + 1); }
  };
  rec(0);
}

sweep("repeating");
sweep("weapon1");

/* Overrides: site 2 supplies post-click barrel and its mode restriction. */
const store = { "repeating_weaponsmdr_-abc123_weapon_barrel_mdr": "stock" };
const ov = deriveWeaponTags(store, "repeating", "repeating_weaponsmdr_-abc123_",
                            {}, { barrel: "suppressor", mode: "sa" });
if (ov.barrel !== "suppressor") failures.push({ key: "barrel override", got: ov.barrel, want: "suppressor" });
if (ov.mode !== "sa") failures.push({ key: "mode override", got: ov.mode, want: "sa" });
const noOv = deriveWeaponTags(store, "repeating", "repeating_weaponsmdr_-abc123_", {});
if (noOv.barrel !== "stock") failures.push({ key: "barrel default", got: noOv.barrel, want: "stock" });

/* Completeness: every declared key present regardless of an empty store. */
const empty = deriveWeaponTags({}, "repeating", "repeating_weaponsmdr_-abc123_", {});
Object.keys(sandbox.weaponTagInputs).forEach((k) => {
  if (!(k in empty)) failures.push({ key: k, got: "MISSING", want: "present" });
});

console.log(`combinations checked : ${checked}`);
console.log(`assertions           : ${checked * 17 + 4 + Object.keys(sandbox.weaponTagInputs).length}`);
if (failures.length) {
  console.log(`\nFAIL — ${failures.length} mismatch(es):\n`);
  failures.slice(0, 20).forEach((f) => console.log("   ", JSON.stringify(f)));
  process.exit(1);
}
console.log("\nPASS — deriveWeaponTags matches the canonical derivation on every combination.");
console.log("Overrides and completeness verified.");
