#!/usr/bin/env node
/* test_dead_code_removal.js — proves Todo 10 dead-code removal changed no behaviour.

   Usage
     node test_dead_code_removal.js <sheet.html> --phase pre  [--coverage] [--save baseline.json.gz]
     node test_dead_code_removal.js <sheet.html> --phase post --check baseline.json.gz
     node test_dead_code_removal.js <sheet.html> --phase post          (static checks only)

   --phase pre   asserts every removal target still exists exactly as inventoried
                 (so the plan matches the file), then optionally saves the baseline.
   --phase post  asserts every removal target is gone and every protected
                 binding is still present, then diffs behaviour against the baseline.
   --coverage    (pre only) injects a probe before each removal target and fails
                 if any target's line is never executed by the scenarios — a
                 differential test that never reaches the deleted code proves nothing.

   Behaviour is captured by EXECUTING the whole worker under stub Roll20 globals.
   setAttrs compares against the previous value and fires the registered
   change: handlers (honouring { silent: true }), per Claude.md. Every scenario
   gets a fresh module instance so registration state cannot leak between them.

   Strips comments before every textual scan (Claude.md: Run regex census checks
   against comment-stripped source). */
"use strict";
const fs = require("fs"), zlib = require("zlib"), crypto = require("crypto");

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const HTML = args.find((a) => !a.startsWith("--") && /\.html$/.test(a)) || "ghost_of_arcadia.html";
const PHASE = opt("--phase");
if (PHASE !== "pre" && PHASE !== "post") { console.error("--phase pre|post is required"); process.exit(2); }

const raw = fs.readFileSync(HTML, "utf8");
const jsRaw = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const js = strip(jsRaw);

const fails = [];
const bad = (m) => fails.push(m);
const ok = (m) => console.log("  ok   " + m);

/* ───────────────────────── 1. static inventory ─────────────────────────
   Each target: [name, regex that matches its DECLARATION in comment-stripped
   source, expected declaration count before removal]. Protected: bindings that
   look adjacent to a target and must survive. */
const wordCount = (name) => (js.match(new RegExp("(?<![\\w$])" + name + "(?![\\w$])", "g")) || []).length;
const TARGETS = [
  /* [id, name, declaration regex, expected declarations pre-removal] */
  ["flaw5Keys",            "flaw5Keys",            /const\s+flaw5Keys\b/g, 1],
  ["flaw10Keys",           "flaw10Keys",           /const\s+flaw10Keys\b/g, 1],
  ["picked5",              "picked5",              /let\s+picked5\b/g, 1],
  ["picked10 (flaw+perk)", "picked10",             /let\s+picked10\b/g, 2],
  ["picked15 (perk)",      "picked15",             /let\s+picked15\b/g, 1],
  ["bgLimiterRegistered",  "bgLimiterRegistered",  /const\s+bgLimiterRegistered\b/g, 1],
  ["talentSkills(calc)",   "talentSkills",         /const\s+talentSkills\s*=\s*Object\.entries/g, 1],
  ["iage",                 "iage",                 /const\s+iage\b/g, 1],
  ["iedu",                 "iedu",                 /const\s+iedu\b/g, 1],
  ["iwound",               "iwound",               /const\s+iwound\b/g, 1],
  ["slots(initWeapon)",    "slots",                /const\s+slots\s*=\s*entry\.mod_slots/g, 1],
  ["reflexRanges",         "reflexRanges",         /const\s+reflexRanges\b/g, 1],
  /* phase 2 (orphan functions) */
  ["applyAllSkillBonuses", "applyAllSkillBonuses", /function\s+applyAllSkillBonuses\b/g, 1],
  ["getAllTalentSkills",   "getAllTalentSkills",   /function\s+getAllTalentSkills\b/g, 1],
  ["handleRaceChange",     "handleRaceChange",     /function\s+handleRaceChange\b/g, 1],
  ["lastRaceHandled",      "lastRaceHandled",      /let\s+lastRaceHandled\b/g, 1],
  ["removeExhaustedStatus","removeExhaustedStatus",/function\s+removeExhaustedStatus\b/g, 1],
  ["applyTiredStatus",     "applyTiredStatus",     /function\s+applyTiredStatus\b/g, 1],
  ["removeTiredStatus",    "removeTiredStatus",    /function\s+removeTiredStatus\b/g, 1],
  ["computeWeaponAPTotal", "computeWeaponAPTotal", /function\s+computeWeaponAPTotal\b/g, 1],
];
/* names whose removal is phase-gated, so the harness can be run after phase 1 only */
const PHASE2 = new Set(["applyAllSkillBonuses","getAllTalentSkills","handleRaceChange","lastRaceHandled",
  "removeExhaustedStatus","applyTiredStatus","removeTiredStatus","computeWeaponAPTotal"]);
const PHASE_ARG = opt("--scope") || "all"; // phase1 | all

/* Things that must NEVER be removed by this work. [description, regex, min count] */
const PROTECTED = [
  ["flawKeys still declared and used",              /const\s+flawKeys\b/g, 1],
  ["flawKeys still used >= 4 times",                /(?<![\w$])flawKeys(?![\w$])/g, 4],
  ["BG_LIMITER_V2_REGISTERED guard intact",         /BG_LIMITER_V2_REGISTERED/g, 3],
  ["stat watched array keeps \"age\"",              /"age",\s*"str"/g, 1],
  ["stat watched array keeps \"edu\"",              /"app",\s*"edu",\s*"siz"/g, 1],
  ["stat watched array keeps \"major_wounds\"",     /"char_creation_lock",\s*"major_wounds"/g, 1],
  ["stat handler still writes major_wounds",        /update\["major_wounds"\]/g, 1],
  ["calc still applies talentBonus",                /const\s+talentBonus\b/g, 1],
  ["setDefaultTalentBonuses retained (live)",       /function\s+setDefaultTalentBonuses\b/g, 1],
  ["ensureRaceWatchers retained (live)",            /function\s+ensureRaceWatchers\b/g, 1],
  ["initializeRaceState retained (live)",           /function\s+initializeRaceState\b/g, 1],
  ["detonatorDataMap retained (Todo 8)",            /const\s+detonatorDataMap\b/g, 1],
  ["computeModButtons retained",                    /function\s+computeModButtons\b/g, 1],
  ["longRanges/closeRanges retained",               /const\s+closeRanges\b/g, 1],
  ["computeWeaponHit reflex literal retained",      /reflexBonus\s*=\s*\(optics === "reflex"/g, 1],
  ["buildTagsStr reflexActive retained",            /const\s+reflexActive\b/g, 1],
  ["ammoEffects retained (replaces AP helper)",     /const\s+ammoEffects\b/g, 1],
  ["Exhausted/Tired inline logic in change:strain", /getConditionLabel\("exhausted"\)/g, 1],
];

console.log(`\n== static checks (${PHASE}) on ${HTML} ==`);
try { new Function(jsRaw); ok("worker parses"); } catch (e) { bad("worker does not parse: " + e.message); }

for (const [id, name, declRe, expect] of TARGETS) {
  if (PHASE_ARG === "phase1" && PHASE2.has(name)) continue;
  const decl = (js.match(declRe) || []).length;
  if (PHASE === "pre") {
    if (decl !== expect) bad(`${id}: expected ${expect} declaration(s) before removal, found ${decl}`);
    else ok(`${id}: declaration present (${wordCount(name)} word occurrence(s))`);
  } else {
    const left = wordCount(name);
    /* `slots`, `talentSkills`, `picked5` and `getConditionLabel`-style names are shared by other
       scopes, so the declaration regex is authoritative; the word count is advisory. */
    if (decl !== 0) bad(`${id}: declaration still present after removal`);
    else ok(`${id}: declaration gone`);
    if (!["slots", "talentSkills"].includes(name) && left !== 0)
      bad(`${id}: ${left} residual occurrence(s) of the identifier remain (non-comment)`);
  }
}
/* talentSkills must be gone from BOTH sites at the end of phase 2 */
if (PHASE === "post" && PHASE_ARG !== "phase1") {
  const n = (js.match(/(?<![\w$])talentSkills(?![\w$])/g) || []).length;
  if (n !== 0) bad(`talentSkills: ${n} residual occurrence(s) after phase 2 (expected 0)`);
}
for (const [d, re, min] of PROTECTED) {
  const n = (js.match(re) || []).length;
  if (n < min) bad(`PROTECTED binding damaged: ${d} (found ${n}, need >= ${min})`);
  else ok("protected: " + d);
}
/* The only legitimate remaining references to the retired names are NONE;
   catch accidental retention of a call site to a removed function. */
if (PHASE === "post" && PHASE_ARG !== "phase1") {
  for (const n of ["applyAllSkillBonuses","getAllTalentSkills","handleRaceChange","removeExhaustedStatus",
                   "applyTiredStatus","removeTiredStatus","computeWeaponAPTotal"]) {
    if (wordCount(n) !== 0) bad(`${n} still referenced after removal`);
  }
}

if (PHASE === "post" && !opt("--check")) finish();

/* ───────────────────────── 2. execution harness ───────────────────────── */
let C; // current context
const clone = (o) => JSON.parse(JSON.stringify(o));
const realLog = console.log;
const quiet = () => { console.log = () => {}; console.warn = () => {}; console.info = () => {}; };
const loud = () => { console.log = realLog; };
Date.now = () => 1700000000000;
let seed = 12345; Math.random = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

const HITS = new Set();
globalThis.__probe = (n) => HITS.add(n);

const PROBES = [
  ["flaw5Keys", /^\s*const\s+flaw5Keys\b/m], ["picked5", /^\s*let\s+picked5\b/m],
  ["picked10(flaw)", /^\s*let\s+picked10 = 0;/m], ["picked10(perk)", /^\s*let\s+picked10   = 0;/m],
  ["picked15(perk)", /^\s*let\s+picked15\b/m],
  ["bgLimiterRegistered", /^const\s+bgLimiterRegistered\b/m],
  ["talentSkills(calc)", /^\s*const\s+talentSkills\s*=\s*Object\.entries/m],
  ["iage", /^\s*const\s+iage\b/m], ["iedu", /^\s*const\s+iedu\b/m], ["iwound", /^\s*const\s+iwound\b/m],
  ["slots(initWeapon)", /^\s*const\s+slots\s*=\s*entry\.mod_slots/m],
  ["reflexRanges", /^\s*const\s+reflexRanges\b/m],
];
let source = jsRaw;
if (flag("--coverage")) {
  if (PHASE !== "pre") { console.error("--coverage only valid with --phase pre"); process.exit(2); }
  for (const [name, re] of PROBES) {
    const m = re.exec(source);
    if (!m) { bad(`coverage: could not place probe for ${name}`); continue; }
    source = source.slice(0, m.index) + `__probe(${JSON.stringify(name)});` + source.slice(m.index);
  }
}

const EXPOSE = ["flawDataMap","ancestryDataMap","weaponDataMap","skillDataMap","careerDataMap",
  "registerFlawSummaryWatcher","recalcFlawSummary","registerStatHandler","calculateAndUpdateSkillValues",
  "buildTagsStr","computeWeaponHit","computeWeaponDice","bootstrapGlobalWatchersOnce","registerBackgroundSkillLimiterV2",
  "initWeaponComputedAttrs","initializeSheetOnOpen","ensureRaceWatchers","initializeRaceState","updateTalentEnables",
  "registerPerkSummaryWatcher","perkDataMap"];
const wrapper = source + "\nreturn {" + EXPOSE.map((n) => `${n}: (typeof ${n} !== "undefined" ? ${n} : undefined)`).join(",") + "};";

const ROW = /^(repeating_[^_]+)_(-[^_]+)_(.+)$/;
function setup(store, sections) {
  C = { STORE: clone(store || {}), LOG: [], H: {}, SECTIONS: sections || {}, fires: 0, overflow: false, errors: [] };
  const fire = (ev, info) => {
    const hs = C.H[ev]; if (!hs) return;
    for (const h of hs.slice()) {
      if (++C.fires > 20000) { C.overflow = true; return; }
      try { h(info || {}); } catch (e) { C.errors.push(`${ev}: ${e.message}`); }
    }
  };
  C.fire = fire;
  Object.assign(globalThis, {
    on: (e, f) => String(e).trim().split(/\s+/).forEach((k) => (C.H[k] = C.H[k] || []).push(f)),
    getAttrs: (ks, cb) => { const o = {}; ks.forEach((k) => (o[k] = C.STORE[k] !== undefined ? C.STORE[k] : "")); cb(o); },
    setAttrs: (o, a, b) => {
      const opts = typeof a === "object" && a ? a : {};
      const done = typeof a === "function" ? a : b;
      const changed = [];
      for (const k of Object.keys(o).sort()) {
        const v = String(o[k]);
        C.LOG.push(k + "=" + v);
        if (C.STORE[k] !== v) { C.STORE[k] = v; changed.push(k); }
      }
      if (!opts.silent) for (const k of changed) {
        const m = k.match(ROW);
        if (m) fire(`change:${m[1]}:${m[3]}`, { sourceAttribute: k, newValue: C.STORE[k] });
        else fire(`change:${k}`, { sourceAttribute: k, newValue: C.STORE[k] });
      }
      if (typeof done === "function") done();
    },
    getSectionIDs: (s, cb) => cb((C.SECTIONS[s] || []).slice()),
    getTranslationByKey: (k) => k,
    getTranslationLanguage: () => "en",
    generateRowID: () => "-gen",
    removeRepeatingRow: () => {},
    setTranslation: () => {},
  });
  let mod;
  try { mod = new Function(wrapper)(); } catch (e) { throw new Error("worker threw at load: " + e.message); }
  C.mod = mod;
  return C;
}

const SNAP = {};
const record = (id, ctx) => {
  const reg = Object.keys(ctx.H).sort().map((k) => k + "#" + ctx.H[k].length);
  SNAP[id] = {
    writes: ctx.LOG.slice(), errors: ctx.errors.slice(), overflow: ctx.overflow,
    reg: crypto.createHash("sha256").update(reg.join("\n")).digest("hex"), regCount: reg.length,
  };
};
const run = (id, fn) => { quiet(); try { fn(); } catch (e) { SNAP[id] = { threw: e.message }; } finally { loud(); } };

/* Loaded once, outside the quiet window, so the ancestry list is known. */
quiet(); let base; try { base = setup({}, {}); } finally { loud(); }
const MOD0 = base.mod;
const RACES = Object.keys(MOD0.ancestryDataMap || {}).sort();
if (!RACES.length) bad("ancestryDataMap not exposed — harness cannot run");

/* S1 — sheet open, one per ancestry plus unselected. Exercises initializeSheetOnOpen
   end to end: bootstrapGlobalWatchersOnce, every init, afterAllSets, race state. */
const weaponKeys = Object.keys(MOD0.weaponDataMap || {});
const hg = weaponKeys.find((k) => MOD0.weaponDataMap[k].category === "handgun");
const rifle = weaponKeys.find((k) => MOD0.weaponDataMap[k].category === "rifle");
for (const race of ["", ...RACES]) {
  run("open/" + (race || "unselected"), () => {
    const store = { showracials: race, str: "50", dex: "50", pow: "50", con: "50", app: "50", edu: "50", siz: "50", int: "50" };
    const sections = {
      repeating_weaponsmdr: ["-w1", "-w2", "-w3"],
      repeating_weaponmanual: ["-m1"],
    };
    store["repeating_weaponsmdr_-w1_weapon_preset_handgun_mdr"] = hg || "";
    store["repeating_weaponsmdr_-w2_weapon_preset_rifle_mdr"] = rifle || "";
    store["repeating_weaponsmdr_-w3_weapon_ammo_type_mdr"] = "ap_rounds";
    store["repeating_weaponsmdr_-w3_weapon_ammo_active_mdr"] = "1";
    const ctx = setup(store, sections);
    ctx.fire("sheet:opened", {});
    record("open/" + (race || "unselected"), ctx);
  });
}

/* S2 — flaw summary watcher over the selection space that touches flaw5/10 logic. */
run("flaw/grid", () => {
  const F = MOD0.flawDataMap, keys = Object.keys(F);
  const five = keys.filter((k) => F[k].cost === 5), ten = keys.filter((k) => F[k].cost === 10);
  const combos = [[], [five[0]], [ten[0]], [five[0], five[1]], [five[0], ten[0]], [ten[0], ten[1]], [five[0], five[1], five[2]]];
  const out = [];
  for (const lock of ["0", "1"]) for (const perks of ["0", "1", "2"]) for (const c of combos) {
    const store = { char_creation_lock: lock, perk_selected_count: perks };
    c.filter(Boolean).forEach((k) => (store["flaw_" + k] = "1"));
    const ctx = setup(store, {});
    ctx.mod.registerFlawSummaryWatcher();
    ctx.LOG.length = 0;
    ctx.fire(Object.keys(ctx.H).find((k) => /^change:flaw_/.test(k)), {});
    out.push(`## lock=${lock} perks=${perks} sel=${c.join("+")}`, ...ctx.LOG, ...ctx.errors);
  }
  SNAP["flaw/grid"] = { writes: out, errors: [], overflow: false, reg: "", regCount: 0 };
});

/* S2b — perk summary watcher: the 10/15-cost perks are what the dead picked10/picked15 counted. */
run("perk/grid", () => {
  const P = MOD0.perkDataMap, keys = Object.keys(P);
  const c10 = keys.filter((k) => P[k].cost === 10), c15 = keys.filter((k) => P[k].cost === 15), other = keys.filter((k) => ![10, 15].includes(P[k].cost));
  const combos = [[], [c10[0]], [c15[0]], [c10[0], c15[0]], [c10[0], c10[1]], [other[0]], [other[0], c15[0]], [c15[0], c15[1]]];
  const out = [];
  for (const lock of ["0", "1"]) for (const flaws of ["0", "1", "2"]) for (const c of combos) {
    const store = { char_creation_lock: lock, flaw_selected_count: flaws };
    c.filter(Boolean).forEach((k) => (store["perk_" + k] = "1"));
    const ctx = setup(store, {});
    ctx.mod.registerPerkSummaryWatcher();
    ctx.LOG.length = 0;
    ctx.fire(Object.keys(ctx.H).find((k) => /^change:perk_/.test(k)), {});
    out.push(`## lock=${lock} flaws=${flaws} sel=${c.join("+")}`, ...ctx.LOG, ...ctx.errors);
  }
  SNAP["perk/grid"] = { writes: out, errors: [], overflow: false, reg: "", regCount: 0 };
});

/* S2c — status slots driven by strain and HP. The orphan Exhausted/Tired helpers
   (removeExhaustedStatus, applyTiredStatus, removeTiredStatus) duplicate logic that is
   INLINED in the change:strain watcher; this pins the inlined logic so deleting the
   dead copies is shown to leave the live one alone. */
run("status/strain-hp", () => {
  const out = [];
  const stat = (extra) => Object.assign({ name: "Test", strain_max: "10", pulphp_max: "20", hp: "20",
    status1: "", status2: "", status3: "", status4: "", char_creation_lock: "0" }, extra);
  for (const [strain, st] of [["0", {}], ["5", {}], ["9", {}], ["10", {}], ["12", {}],
      ["10", { status1: "Exhausted" }], ["3", { status1: "Exhausted", status2: "Tired" }],
      ["10", { status1: "a", status2: "b", status3: "c", status4: "d" }], ["7", { status1: "Tired" }]]) {
    const ctx = setup(stat(Object.assign({ strain }, st)), {});
    ctx.fire("change:strain", { sourceAttribute: "strain", newValue: strain });
    out.push(`## strain=${strain} ${JSON.stringify(st)}`, ...ctx.LOG, ...ctx.errors);
  }
  for (const hp of ["20", "11", "10", "9", "1", "0"]) {
    const ctx = setup(stat({ hp }), {});
    ctx.fire("change:hp", { sourceAttribute: "hp", newValue: hp });
    out.push(`## hp=${hp}`, ...ctx.LOG, ...ctx.errors);
  }
  SNAP["status/strain-hp"] = { writes: out, errors: [], overflow: false, reg: "", regCount: 0 };
});

/* S3 — registerStatHandler over age × major_wounds × edu × awakened × ancestry.
   These are exactly the inputs the dead locals iage/iedu/iwound parse; the output must not move. */
run("stat/grid", () => {
  const out = [];
  for (const race of RACES.slice(0, 3).concat(RACES.slice(-1))) {
    const st = MOD0.ancestryDataMap[race].stats || {};
    for (const age of ["", "16", "45", "99"]) for (const wound of ["", "4", "99"]) for (const edu of ["", "15", "40", "85"]) for (const aw of ["0", "1"]) {
      const store = { showracials: race, age, major_wounds: wound, edu, awakened: aw, char_creation_lock: "0",
        str: "55", dex: "60", pow: "65", con: "70", app: "50", siz: String((st.siz && st.siz.base) || 50), int: "55",
        vitality: "30", athletics_skill_mdr: "40" };
      const ctx = setup(store, {});
      ctx.mod.registerStatHandler();
      ctx.LOG.length = 0;
      ctx.fire("change:str", {});
      out.push(`## ${race} age=${age} wound=${wound} edu=${edu} aw=${aw}`, ...ctx.LOG, ...ctx.errors);
    }
  }
  SNAP["stat/grid"] = { writes: out, errors: [], overflow: false, reg: "", regCount: 0 };
});

/* S4 — calculateAndUpdateSkillValues with a talent-granted skill selected for each
   ancestry. The live path is `talentBonus`; the dead local `talentSkills` must not matter. */
run("skillcalc/talents", () => {
  const out = [];
  for (const race of RACES) {
    const talents = MOD0.ancestryDataMap[race].talents || {};
    const withSkills = Object.entries(talents).filter(([, t]) => t && t.skills && (Array.isArray(t.skills) ? t.skills.length : Object.keys(t.skills).length));
    const skills = Object.keys(MOD0.skillDataMap || {}).slice(0, 6);
    for (const [tk, t] of withSkills.slice(0, 4)) for (const sk of skills.slice(0, 3)) {
      const values = { dex: "60", edu: "55", [`${race}_${tk}_mdr_checkbox`]: `talent_${sk}`,
        [`${race}_talent_${sk}_bonus_mdr`]: "10", [`${race}_mdr_checkbox`]: sk, [`${race}_${sk}_bonus_mdr`]: "5" };
      const ctx = setup({}, {});
      ctx.mod.calculateAndUpdateSkillValues(race, values, {});
      out.push(`## ${race}.${tk} -> ${sk}`, ...ctx.LOG, ...ctx.errors);
    }
    const ctx = setup({}, {});            /* and with nothing selected */
    ctx.mod.calculateAndUpdateSkillValues(race, { dex: "60", edu: "55" }, {});
    out.push(`## ${race} none`, ...ctx.LOG, ...ctx.errors);
  }
  SNAP["skillcalc/talents"] = { writes: out, errors: [], overflow: false, reg: "", regCount: 0 };
});

/* S5 — buildTagsStr and computeWeaponHit sweep (reflexRanges neighbourhood). */
run("tags/sweep", () => {
  const out = [];
  const ctx = setup({}, {});
  for (const optics of ["", "reflex", "thermal", "magnification"]) for (const aim of ["", "quick", "focused", "both"])
    for (const range of ["engaged", "short", "medium", "long", "extreme", ""]) for (const sl of ["", "1"])
      for (const cat of ["handgun", "rifle", "smg", "shotgun", "heavy"]) {
        out.push([optics, aim, range, sl, cat].join("|") + " => " +
          ctx.mod.buildTagsStr(optics, sl, "", "", "", "", "", "sa", range, cat, "L", "", aim, "", "", "", "", ""));
        if (ctx.mod.computeWeaponHit) out.push("   hit " + JSON.stringify(ctx.mod.computeWeaponHit(optics, sl, range, aim)));
      }
  SNAP["tags/sweep"] = { writes: out, errors: [], overflow: false, reg: "", regCount: 0 };
});

/* S6 — registration census: bootstrapGlobalWatchersOnce twice must register once
   (the live BG_LIMITER_V2_REGISTERED guard replaced bgLimiterRegistered), and the
   event/handler-count census must not move. */
run("census/bootstrap", () => {
  const ctx = setup({ showracials: RACES[0] }, {});
  ctx.mod.bootstrapGlobalWatchersOnce();
  const n1 = Object.keys(ctx.H).length, h1 = Object.values(ctx.H).reduce((a, b) => a + b.length, 0);
  ctx.mod.registerBackgroundSkillLimiterV2();
  const h2 = Object.values(ctx.H).reduce((a, b) => a + b.length, 0);
  if (h1 !== h2) bad(`registerBackgroundSkillLimiterV2 registered again on a second call (${h1} -> ${h2}): re-entry guard is broken`);
  record("census/bootstrap", ctx);
  SNAP["census/bootstrap"].writes.push(`events=${n1} handlers=${h1}`);
});

/* ───────────────────────── 3. compare / save ───────────────────────── */
const sha = (a) => crypto.createHash("sha256").update(JSON.stringify(a)).digest("hex");
console.log("\n== behavioural scenarios ==");
for (const id of Object.keys(SNAP).sort()) {
  const s = SNAP[id];
  if (s.threw) { bad(`scenario ${id} THREW: ${s.threw}`); continue; }
  if (s.errors && s.errors.length) bad(`scenario ${id}: handler error(s): ${s.errors.slice(0, 3).join(" | ")}`);
  if (s.overflow) bad(`scenario ${id}: cascade exceeded 20000 handler fires`);
  console.log(`  ${id.padEnd(22)} writes=${String(s.writes.length).padStart(6)}  hash=${sha(s.writes).slice(0, 12)}  reg=${s.regCount}`);
}
const scenarioCount = Object.keys(SNAP).length;
if (scenarioCount < 16) bad(`expected >= 16 scenarios, got ${scenarioCount} — harness degraded`);

if (flag("--coverage")) {
  console.log("\n== coverage: each removal target must be EXECUTED by at least one scenario ==");
  for (const [name] of PROBES) {
    if (HITS.has(name)) ok("reached " + name);
    else bad(`coverage: ${name} was never executed — no scenario exercises its line`);
  }
}

const saveTo = opt("--save");
if (saveTo) {
  fs.writeFileSync(saveTo, zlib.gzipSync(JSON.stringify(SNAP)));
  console.log(`\nbaseline saved: ${saveTo} (${scenarioCount} scenarios)`);
}
const checkAgainst = opt("--check");
if (checkAgainst) {
  const B = JSON.parse(zlib.gunzipSync(fs.readFileSync(checkAgainst)));
  console.log("\n== diff against baseline ==");
  for (const id of Object.keys(B).sort()) {
    const a = B[id], b = SNAP[id];
    if (!b) { bad(`scenario ${id} missing from the post-removal run`); continue; }
    if (b.threw) continue;                       /* already reported above; nothing to diff */
    const same = sha(a.writes) === sha(b.writes) && a.reg === b.reg && a.regCount === b.regCount;
    if (same) { ok(`${id}: identical (${a.writes.length} writes)`); continue; }
    let i = 0; const A = a.writes, Bw = b.writes;
    while (i < A.length && i < Bw.length && A[i] === Bw[i]) i++;
    bad(`${id}: DIVERGES at write #${i}: before=${JSON.stringify(A[i])} after=${JSON.stringify(Bw[i])}` +
        (a.reg !== b.reg ? " (watcher registration census also differs)" : ""));
  }
  for (const id of Object.keys(SNAP)) if (!B[id]) bad(`scenario ${id} is new — rebuild the baseline`);
}
finish();

function finish() {
  console.log("");
  if (fails.length) { console.log("FAIL (" + fails.length + ")"); fails.forEach((f) => console.log("  - " + f)); process.exit(1); }
  console.log("PASS");
  process.exit(0);
}
