#!/usr/bin/env node
/*
 * Ghost of Arcadia — barrel button handler equivalence test.
 *
 * The barrel buttons existed as 15 handlers across three scopes: a generated
 * forEach in registerWeaponManualWatchers (5), and two blocks of hand-written
 * literals for repeating_weaponsmdr (5) and weapon1 (5). The literals encode
 * the mode-restriction branch STRUCTURALLY (sl/co/su got the restricting body,
 * pc/sb the plain toggle) where the generated version branches on
 * barrelModeRestrict[barrelVal] at runtime.
 *
 * This fires every button in every scope against a seeded store and records the
 * resulting setAttrs writes. Run it before and after the merge and diff the
 * JSON: identical output proves the consolidation is behaviour-preserving,
 * including that pc/sb correctly fall through the runtime branch.
 *
 * Usage: node difftest_barrel.js <html> [--save baseline.json | --check baseline.json]
 */

const fs = require("fs");
const path = process.argv[2] || "ghost_of_arcadia.html";
const mode = process.argv[3] || "--print";
const file = process.argv[4];

const raw = fs.readFileSync(path, "utf8");
const js = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];

const BTNS = ["sl", "co", "su", "pc", "sb"];
/* Internal-mod buttons share the same three-scope duplication as the barrel
   buttons, so the same save/check recipe covers them. */
const TOGGLE_FAMILIES = {
  internal: { btns: { bc: "biocoded", ir: "irs", ql: "qls", qt: "qst", sl: "smartlink" },
              rep: "weapon_mod_internal_mdr", w1: "weapon1_mdr_mod_internal" },
  optics:   { btns: { mag: "magnification", ref: "reflex", thm: "thermal" },
              rep: "weapon_optics_mdr", w1: "weapon1_mdr_optics" },
};
/* aim is a two-button cycle over "" / quick / focused / both, not a toggle. */
const AIM_STATES = ["", "quick", "focused", "both"];
/* Weapon states chosen to exercise both branches and the empty-avail fallback. */
const STATES = [
  { label: "SA only",        modes_base: "sa",       mode: "sa", barrel: "" },
  { label: "SS only",        modes_base: "ss",       mode: "ss", barrel: "" },
  { label: "SA/BF",          modes_base: "sa bf",    mode: "bf", barrel: "" },
  { label: "SS/SA/BF/FA",    modes_base: "ss sa bf fa", mode: "fa", barrel: "" },
  { label: "no modes_base",  modes_base: "",         mode: "",   barrel: "" },
  { label: "toggle off",     modes_base: "ss sa",    mode: "sa", barrel: "PRESET" },
];

const SCOPES = [
  { scope: "repeating", section: "repeating_weaponmanual",
    evPat: "clicked:repeating_weaponmanual:weapon-barrel-{b}",
    intPat: "clicked:repeating_weaponmanual:weapon-internal-{b}",
    intAttr: "weapon_mod_internal_mdr",
    prefix: "repeating_weaponmanual_r1_",
    nm: { barrel: "weapon_barrel_mdr", modes_base: "weapon_modes_base_mdr",
          mode: "weapon_mode_mdr", modes_available: "weapon_modes_available_mdr" } },
  { scope: "repeating", section: "repeating_weaponsmdr",
    evPat: "clicked:repeating_weaponsmdr:weapon-barrel-{b}",
    intPat: "clicked:repeating_weaponsmdr:weapon-internal-{b}",
    intAttr: "weapon_mod_internal_mdr",
    prefix: "repeating_weaponsmdr_r1_",
    nm: { barrel: "weapon_barrel_mdr", modes_base: "weapon_modes_base_mdr",
          mode: "weapon_mode_mdr", modes_available: "weapon_modes_available_mdr" } },
  { scope: "weapon1", section: "",
    evPat: "clicked:weapon1-barrel-{b}",
    intPat: "clicked:weapon1-internal-{b}",
    intAttr: "weapon1_mdr_mod_internal",
    prefix: "",
    nm: { barrel: "weapon1_mdr_barrel", modes_base: "weapon1_mdr_modes_base",
          mode: "weapon1_mdr_mode", modes_available: "weapon1_mdr_modes_available" } },
];

const harness = `
let _store = {}, _writes = {}, _handlers = {}, _err = null;
global.on = (ev, cb) => { ev.split(" ").forEach(e => { _handlers[e] = cb; }); };
global.getAttrs = (keys, cb) => {
  const o = {}; (keys || []).forEach(k => { if (k in _store) o[k] = _store[k]; });
  try { cb(o); } catch (e) { _err = e; }
};
global.setAttrs = (u, a, b) => {
  Object.assign(_writes, u); Object.assign(_store, u);
  const cb = typeof a === "function" ? a : b;
  if (typeof cb === "function") cb();
};
global.getSectionIDs = (s, cb) => cb(["r1"]);
global.getTranslationByKey = k => k;
global.generateRowID = () => "r1";
`;

const driver = `
const BTNS = ${JSON.stringify(BTNS)};
const STATES = ${JSON.stringify(STATES)};
const SCOPES = ${JSON.stringify(SCOPES)};
if (typeof registerWeaponManualWatchers === "function") registerWeaponManualWatchers();
if (typeof registerWeaponBarrelWatchers === "function") {
  /* Post-merge: the smdr and weapon1 registrations may live behind the shared
     function; calling it here is harmless if the top-level calls already ran. */
}
const results = [];
for (const sc of SCOPES) {
  for (const btn of BTNS) {
    for (const st of STATES) {
      const ev = sc.evPat.replace("{b}", btn);
      const h = _handlers[ev];
      const P = sc.prefix;
      const label = sc.section || "weapon1";
      if (!h) { results.push({ scope: label, btn, state: st.label, missing: true }); continue; }
      _err = null; _writes = {};
      const barrelPreset = st.barrel === "PRESET" ? "Silencer" : "";
      _store = {
        [P + sc.nm.barrel]: barrelPreset,
        [P + sc.nm.modes_base]: st.modes_base,
        [P + sc.nm.mode]: st.mode,
        [P + sc.nm.modes_available]: st.modes_base,
      };
      try {
        h({ sourceAttribute: P + "weapon-barrel-" + btn, triggerName: ev });
      } catch (e) { _err = e; }
      const out = {};
      Object.keys(_writes).sort().forEach(k => { out[k.replace(P, "")] = _writes[k]; });
      results.push({ scope: label, btn, state: st.label,
                     err: _err ? String(_err).slice(0, 60) : null, writes: out });
    }
  }
}
/* Single-attr toggle families (internal mods, optics): toggle on from empty,
   off from self, and switch from another value. */
const TOGGLE_FAMILIES = ${JSON.stringify(TOGGLE_FAMILIES)};
const TOG_STATES = [{ label: "empty", cur: "" }, { label: "same set", cur: "SELF" }, { label: "other set", cur: "OTHER" }];
for (const sc of SCOPES) {
  for (const [family, spec] of Object.entries(TOGGLE_FAMILIES)) {
    const attr = sc.scope === "weapon1" ? spec.w1 : spec.rep;
    const vals = Object.values(spec.btns);
    for (const btn of Object.keys(spec.btns)) {
      for (const st of TOG_STATES) {
        const ev = (sc.scope === "weapon1")
          ? "clicked:weapon1-" + family + "-" + btn
          : "clicked:" + sc.section + ":weapon-" + family + "-" + btn;
        const h = _handlers[ev];
        const P = sc.prefix;
        const label = (sc.section || "weapon1") + " [" + family + "]";
        if (!h) { results.push({ scope: label, btn, state: st.label, missing: true }); continue; }
        _err = null; _writes = {};
        const cur = st.cur === "SELF" ? spec.btns[btn]
                  : st.cur === "OTHER" ? vals.find(v => v !== spec.btns[btn])
                  : "";
        _store = { [P + attr]: cur };
        try { h({ sourceAttribute: P + "weapon-" + family + "-" + btn, triggerName: ev }); }
        catch (e) { _err = e; }
        const out = {};
        Object.keys(_writes).sort().forEach(k => { out[k.replace(P, "")] = _writes[k]; });
        results.push({ scope: label, btn, state: st.label,
                       err: _err ? String(_err).slice(0, 60) : null, writes: out });
      }
    }
  }
}
/* range: plain set. mode: gated set. ammo: two-attr toggle + tranq guard. */
const OTHER = {
  range: { btns: { en: "engaged", sh: "short", md: "medium", ln: "long", ex: "extreme" },
           seed: (P, sc) => ({}) },
  mode:  { btns: { ss: "ss", sa: "sa", bf: "bf", fa: "fa" },
           seed: (P, sc, avail) => ({ [P + (sc.scope === "weapon1" ? "weapon1_mdr_modes_available" : "weapon_modes_available_mdr")]: avail }) },
  ammo:  { btns: { ap: "ap_rounds", br: "breacher", hp: "hollow_point", sh: "shock", su: "subsonic", vc: "veil_charged" },
           seed: () => ({}) },
};
const AMMO_ATTR = (sc) => sc.scope === "weapon1"
  ? { type: "weapon1_mdr_ammo_type", act: "weapon1_mdr_ammo_active", sub: "weapon1_mdr_subcategory" }
  : { type: "weapon_ammo_type_mdr", act: "weapon_ammo_active_mdr", sub: "weapon_subcategory_mdr" };
const OTHER_STATES = [
  { label: "default" }, { label: "self active" }, { label: "tranq" },
  { label: "avail ss only" }, { label: "avail all" },
];
for (const sc of SCOPES) {
  for (const [family, spec] of Object.entries(OTHER)) {
    for (const btn of Object.keys(spec.btns)) {
      for (const st of OTHER_STATES) {
        const ev = (sc.scope === "weapon1")
          ? "clicked:weapon1-" + family + "-" + btn
          : "clicked:" + sc.section + ":weapon-" + family + "-" + btn;
        const h = _handlers[ev];
        const P = sc.prefix;
        const label = (sc.section || "weapon1") + " [" + family + "]";
        if (!h) { results.push({ scope: label, btn, state: st.label, missing: true }); continue; }
        _err = null; _writes = {}; _store = {};
        if (family === "mode") {
          const avail = st.label === "avail ss only" ? "ss" : st.label === "avail all" ? "ss sa bf fa" : "ss sa";
          Object.assign(_store, spec.seed(P, sc, avail));
        }
        if (family === "ammo") {
          const A = AMMO_ATTR(sc);
          if (st.label === "self active") { _store[P + A.type] = spec.btns[btn]; _store[P + A.act] = "1"; }
          if (st.label === "tranq") { _store[P + A.sub] = "tranq"; }
        }
        try { h({ sourceAttribute: P + "weapon-" + family + "-" + btn, triggerName: ev }); }
        catch (e) { _err = e; }
        const out = {};
        Object.keys(_writes).sort().forEach(k => { out[k.replace(P, "")] = _writes[k]; });
        results.push({ scope: label, btn, state: st.label,
                       err: _err ? String(_err).slice(0, 60) : null, writes: out });
      }
    }
  }
}
/* Cap-change cases: modes_available carries BOTH the barrel cap and the
   rounds-remaining gate. updateCapCounter used to rebuild it from modes_base
   alone, silently restoring modes the barrel forbids on any magazine change,
   shot or reload. */
if (typeof updateCapCounter === "function") {
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  const CAP = [
    { label: "silencer + full mag",   barrel: "Silencer",    base: "sa",       spent: 0,  want: "ss" },
    { label: "no barrel + full mag",  barrel: "",            base: "sa",       spent: 0,  want: "sa" },
    { label: "suppressor caps bf",    barrel: "Suppressor",  base: "sa bf",    spent: 0,  want: "sa" },
    { label: "rounds gate only",      barrel: "",            base: "sa bf fa", spent: 11, want: "sa" },
    { label: "both restrictions",     barrel: "Silencer",    base: "sa bf",    spent: 11, want: "ss" },
    { label: "unrestricting barrel",  barrel: "Slug Barrel", base: "ss sa",    spent: 0,  want: "ss sa" },
  ];
  /* The selected mode must be clamped to the available list, whether it was
     excluded by the barrel cap or by rounds remaining. */
  const CLAMP = [
    { label: "clamp: silencer vs SA", barrel: "Silencer",   base: "sa",       spent: 0,  mode: "sa", want: "ss" },
    { label: "clamp: suppressor vs BF", barrel: "Suppressor", base: "sa bf",  spent: 0,  mode: "bf", want: "sa" },
    { label: "clamp: rounds vs FA",   barrel: "",           base: "sa bf fa", spent: 11, mode: "fa", want: "sa" },
    { label: "clamp: valid mode kept", barrel: "",          base: "sa bf",    spent: 0,  mode: "sa", want: "sa" },
  ];
  for (const c of CAP) {
    _err = null; _writes = {};
    _store = { weapon1_mdr_cap_rating: "cap_12", weapon1_mdr_mode: "sa",
               weapon1_mdr_modes_available: c.base, weapon1_mdr_modes_base: c.base,
               weapon1_mdr_barrel: c.barrel };
    for (let n = 1; n <= c.spent; n++) _store["weapon1_mdr_cap_box_" + pad(n)] = "1";
    try {
      updateCapCounter("weapon1_mdr_cap_rating", (n) => "weapon1_mdr_cap_box_" + pad(n),
        "weapon1_mdr_cap_counter", 15, "weapon1_mdr_mode", "weapon1_mdr_modes_available");
    } catch (e) { _err = e; }
    results.push({ scope: "capCounter", btn: c.label, state: "want " + c.want,
                   err: _err ? String(_err).slice(0, 60) : null,
                   writes: { modes_available: _store.weapon1_mdr_modes_available } });
  }
  for (const c of CLAMP) {
    _err = null; _writes = {};
    _store = { weapon1_mdr_cap_rating: "cap_12", weapon1_mdr_mode: c.mode,
               weapon1_mdr_modes_available: c.base, weapon1_mdr_modes_base: c.base,
               weapon1_mdr_barrel: c.barrel };
    for (let n = 1; n <= c.spent; n++) _store["weapon1_mdr_cap_box_" + pad(n)] = "1";
    try {
      updateCapCounter("weapon1_mdr_cap_rating", (n) => "weapon1_mdr_cap_box_" + pad(n),
        "weapon1_mdr_cap_counter", 15, "weapon1_mdr_mode", "weapon1_mdr_modes_available");
    } catch (e) { _err = e; }
    results.push({ scope: "capCounter", btn: c.label, state: "mode want " + c.want,
                   err: _err ? String(_err).slice(0, 60) : null,
                   writes: { mode: _store.weapon1_mdr_mode,
                             modes_available: _store.weapon1_mdr_modes_available } });
  }
}
const AIM_STATES = ${JSON.stringify(AIM_STATES)};
for (const sc of SCOPES) {
  const attr = sc.scope === "weapon1" ? "weapon1_mdr_aim" : "weapon_aim_mdr";
  for (const btn of ["quick", "focused"]) {
    for (const cur of AIM_STATES) {
      const ev = (sc.scope === "weapon1")
        ? "clicked:weapon1-aim-" + btn
        : "clicked:" + sc.section + ":weapon-aim-" + btn;
      const h = _handlers[ev];
      const P = sc.prefix;
      const label = (sc.section || "weapon1") + " [aim]";
      if (!h) { results.push({ scope: label, btn, state: cur || "(empty)", missing: true }); continue; }
      _err = null; _writes = {}; _store = { [P + attr]: cur };
      try { h({ sourceAttribute: P + "weapon-aim-" + btn, triggerName: ev }); }
      catch (e) { _err = e; }
      const out = {};
      Object.keys(_writes).sort().forEach(k => { out[k.replace(P, "")] = _writes[k]; });
      results.push({ scope: label, btn, state: cur || "(empty)",
                     err: _err ? String(_err).slice(0, 60) : null, writes: out });
    }
  }
}
console.log("###JSON###" + JSON.stringify(results));
`;

fs.writeFileSync("/tmp/_barrel_run.js", harness + js + driver);
const { execFileSync } = require("child_process");
let out;
try {
  out = execFileSync("node", ["/tmp/_barrel_run.js"], { encoding: "utf8", timeout: 90000 });
} catch (e) {
  console.error("harness failed:\n" + (e.stdout || "") + (e.stderr || ""));
  process.exit(2);
}
const results = JSON.parse(out.slice(out.indexOf("###JSON###") + 10));

const missing = results.filter(r => r.missing);
const errored = results.filter(r => r.err);
console.log(`cases: ${results.length}   missing handlers: ${missing.length}   errors: ${errored.length}`);
missing.forEach(r => console.log(`   MISSING ${r.scope} ${r.btn} ${r.state}`));
errored.forEach(r => console.log(`   ERROR   ${r.scope} ${r.btn} ${r.state}: ${r.err}`));

if (mode === "--save") {
  fs.writeFileSync(file, JSON.stringify(results, null, 1));
  console.log(`\nbaseline written to ${file}`);
  process.exit(missing.length || errored.length ? 1 : 0);
}
if (mode === "--check") {
  const base = JSON.parse(fs.readFileSync(file, "utf8"));
  const key = r => `${r.scope}|${r.btn}|${r.state}`;
  const bm = new Map(base.map(r => [key(r), r]));
  let diffs = 0;
  for (const r of results) {
    const b = bm.get(key(r));
    if (!b) { console.log(`   NEW CASE ${key(r)}`); diffs++; continue; }
    if (JSON.stringify(b.writes) !== JSON.stringify(r.writes) || !!b.missing !== !!r.missing) {
      diffs++;
      console.log(`   DIFF ${key(r)}`);
      console.log(`        before: ${JSON.stringify(b.writes || "(missing)")}`);
      console.log(`        after : ${JSON.stringify(r.writes || "(missing)")}`);
    }
  }
  for (const b of base) if (!results.find(r => key(r) === key(b))) { console.log(`   LOST CASE ${key(b)}`); diffs++; }
  console.log(diffs ? `\nFAIL — ${diffs} behavioural difference(s).`
                    : "\nPASS — every button in every scope writes exactly what it did before.");
  process.exit(diffs ? 1 : 0);
}
console.log("\n" + JSON.stringify(results.slice(0, 4), null, 1));
