#!/usr/bin/env node
/* test_usage_tracking.js — tracker usage counters (usage_tracker: "counter") and shared-use groups (usage_group).
 *
 * Executes the whole worker under stub Roll20 globals and fires the real tracker handler. A setAttrs that only
 * mutated the store would leave every change: handler dead, so the stub compares against the previous value and
 * dispatches the registered handlers for each changed tracker attr, honouring { silent: true }.
 *
 *   D  data       usage_tracker and usage_group appear only on entries with a tracked cadence and a valid value;
 *                 every group has two or more members that share a cadence; no talent is both counter and group
 *   L  lockstep   every career tracker attr has an HTML element, an attr_show_ input and a CSS reveal rule; every
 *                 counter or grouped talent has all three, whatever its owner; counters render as a number input
 *                 and every other tracked row as a checkbox; the tracked attr set is complete in HTML
 *   C  counter    a step up charges once per step (fixed and dice Strain); a jump charges every step; a step down,
 *                 an equal value, an empty field and a clear cost nothing; no previous value counts as 0; a blocked
 *                 use at 0 Strain restores the previous count; Clear Scene resets a counter without charging
 *   B  checkbox   the original path is unchanged: a tick charges, an untick does nothing
 *   G  group      ticking one member marks the others used silently and only the ticked one pays; unticking any
 *                 clears all; a blocked tick leaves every member unticked; Clear Scene clears all with no charge;
 *                 a group of one behaves as a plain checkbox
 *   W  wiring     exactly one handler is registered on the tracker event; declaration order holds
 *
 * Synthetic talents are injected into a copy of the worker source because usageGroupSiblings and the tracker event
 * list are computed at load. Comment-stripped source is used for every call-site assertion.
 *
 * Usage: node test_usage_tracking.js ghost_of_arcadia.html [ghost_of_arcadia.css]
 */
const fs = require("fs");
const nodePath = require("path");
const say = console.log.bind(console);
console.log = () => {}; // the worker traces on every call

const args = process.argv.slice(2);
const htmlPath = args[0] || "ghost_of_arcadia.html";
const cssPath = args[1] || nodePath.join(nodePath.dirname(htmlPath), "ghost_of_arcadia.css");
const transPath = nodePath.join(nodePath.dirname(htmlPath), "translation.json");
const html = fs.readFileSync(htmlPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const TRANS = JSON.parse(fs.readFileSync(transPath, "utf8"));
const worker = html.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
/* Declared before first use: the stripper is consumed by the wiring checks below. */
const strip = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const code = strip(worker);

const fails = [];
const check = (name, ok, detail) => { if (!ok) fails.push(`${name}${detail ? ` — ${detail}` : ""}`); };
const eq = (name, got, want) => check(name, got === want, `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`);

/* Tracked attrs that predate this feature and have no HTML element. Self-clearing: an entry that gains an element
   fails the check and must be removed. */
const L_EXCEPTIONS = { used_scene_alteri_social_resonance: "pre-existing: ancestry talent with a Scene limit and no tracker element" };

/* ── Roll20 stubs ────────────────────────────────────────────────────── */
let STORE = {};
let HANDLERS = [];
let MESSAGES = [];
let FIRED = [];
const makeGlobals = () => {
  const on = (ev, fn) => { HANDLERS.push({ events: String(ev).split(/\s+/), fn }); };
  const getAttrs = (keys, cb) => {
    const out = {};
    keys.forEach((k) => { out[k] = STORE[k] !== undefined ? STORE[k] : ""; });
    cb(out);
  };
  const dispatch = (attr, prev, next) => {
    HANDLERS.filter((h) => h.events.includes(`change:${attr}`)).forEach((h) => {
      FIRED.push(attr);
      h.fn({ sourceAttribute: attr, previousValue: prev, newValue: next, sourceType: "player" });
    });
  };
  const setAttrs = (obj, opt, cb) => {
    const options = typeof opt === "object" && opt ? opt : {};
    const done = typeof opt === "function" ? opt : cb;
    const changes = [];
    Object.keys(obj).forEach((k) => {
      const prev = STORE[k];
      STORE[k] = obj[k];
      if (String(prev) !== String(obj[k]) && /^used_/.test(k)) changes.push([k, prev, obj[k]]);
    });
    if (!options.silent) changes.forEach(([k, p, n]) => dispatch(k, p, n));
    if (typeof done === "function") done();
  };
  const getSectionIDs = (sec, cb) => cb([]);
  const startRoll = (msg, cb) => { MESSAGES.push(msg); if (typeof cb === "function") cb({ rollId: "r" }); };
  const finishRoll = () => {};
  const getTranslationByKey = (k) => TRANS[k];
  Object.assign(globalThis, { on, getAttrs, setAttrs, getSectionIDs, startRoll, finishRoll, getTranslationByKey,
    generateRowID: () => "-x", removeRepeatingRow: () => {} });
  return { dispatch };
};

const EXPORTS = `return { careerDataMap, ancestryDataMap, perkDataMap, flawDataMap, backgroundDataMap, usageGroupSiblings,
  trackerChangeEvent, getUsageLimitedTalentNames, lookupTalentData };`;
const load = (src) => {
  HANDLERS = []; STORE = {}; MESSAGES = []; FIRED = [];
  const g = makeGlobals();
  let W;
  try { W = new Function(src + "\n" + EXPORTS)(); } catch (e) { say(`FAIL — worker threw at load: ${e.message}`); process.exit(1); }
  return { W, g };
};

/* Synthetic talents, injected under stormweaver so lookupTalentData and the tracker event list pick them up. */
const SYN = `
\t\t\tsyn_air: { tier: 1, cost: 5, capstone: false, name_key: "syn_air-u", rule_text_key: "", type: { economy: "free_action", tag: "x" }, strain: "", usage_limit: "scene", usage_group: "chan", affected_skill: [], prerequisite: "" },
\t\t\tsyn_earth: { tier: 1, cost: 5, capstone: false, name_key: "syn_earth-u", rule_text_key: "", type: { economy: "free_action", tag: "x" }, strain: "", usage_limit: "scene", usage_group: "chan", affected_skill: [], prerequisite: "" },
\t\t\tsyn_fire: { tier: 1, cost: 5, capstone: false, name_key: "syn_fire-u", rule_text_key: "", type: { economy: "free_action", tag: "x" }, strain: "", usage_limit: "scene", usage_group: "chan", affected_skill: [], prerequisite: "" },
\t\t\tsyn_paid_a: { tier: 1, cost: 5, capstone: false, name_key: "syn_paid_a-u", rule_text_key: "", type: { economy: "free_action", tag: "x" }, strain: "2", usage_limit: "scene", usage_group: "paid", affected_skill: [], prerequisite: "" },
\t\t\tsyn_paid_b: { tier: 1, cost: 5, capstone: false, name_key: "syn_paid_b-u", rule_text_key: "", type: { economy: "free_action", tag: "x" }, strain: "2", usage_limit: "scene", usage_group: "paid", affected_skill: [], prerequisite: "" },
\t\t\tsyn_alone: { tier: 1, cost: 5, capstone: false, name_key: "syn_alone-u", rule_text_key: "", type: { economy: "free_action", tag: "x" }, strain: "1", usage_limit: "scene", usage_group: "solo", affected_skill: [], prerequisite: "" },
\t\t\tsyn_fixed: { tier: 1, cost: 5, capstone: false, name_key: "syn_fixed-u", rule_text_key: "", type: { economy: "action", tag: "x" }, strain: "2", usage_limit: "scene", usage_tracker: "counter", affected_skill: [], prerequisite: "" },
`;
const injectSyn = (src) => {
  const m = /\n\tstormweaver: \{[\s\S]*?\n\t\ttalents: \{\r?\n/.exec(src);
  if (!m) { say("FAIL — cannot find stormweaver.talents to inject into"); process.exit(1); }
  const at = m.index + m[0].length;
  return src.slice(0, at) + SYN.replace(/\n/g, "\r\n").replace(/^\r\n/, "") + src.slice(at);
};

/* ── Real worker ─────────────────────────────────────────────────────── */
const real = load(worker);
const RW = real.W;
say("module loaded and evaluated without error");

/* D. Data validity, run as a function so the negative tests can run it against synthetic data. */
const validateUsageData = (W) => {
  const problems = [];
  const owners = [];
  Object.entries(W.careerDataMap).forEach(([c, d]) => owners.push([c, d.talents]));
  Object.entries(W.ancestryDataMap).forEach(([r, d]) => { owners.push([r, d.talents]); owners.push([r, d.traits]); });
  const tracked = (t) => ["long_rest", "scene", "session"].some((c) => (Array.isArray(t.usage_limit) ? t.usage_limit : [t.usage_limit]).includes(c));
  owners.forEach(([owner, talents]) => {
    const groups = {};
    Object.entries(talents || {}).forEach(([k, t]) => {
      if (t.usage_tracker !== undefined && t.usage_tracker !== "counter") problems.push(`${owner}.${k}: usage_tracker "${t.usage_tracker}" is not "counter"`);
      if ((t.usage_tracker || t.usage_group) && !tracked(t)) problems.push(`${owner}.${k}: usage_tracker/usage_group without a tracked usage_limit`);
      if (t.usage_tracker && t.usage_group) problems.push(`${owner}.${k}: both usage_tracker and usage_group`);
      if (t.usage_group !== undefined && (typeof t.usage_group !== "string" || !t.usage_group)) problems.push(`${owner}.${k}: usage_group must be a non-empty string`);
      if (t.usage_group) (groups[t.usage_group] = groups[t.usage_group] || []).push(k);
    });
    Object.entries(groups).forEach(([g, keys]) => {
      if (keys.length < 2) problems.push(`${owner}: usage_group "${g}" has one member (${keys[0]})`);
      const lim = new Set(keys.map((k) => JSON.stringify(talents[k].usage_limit)));
      if (lim.size > 1) problems.push(`${owner}: usage_group "${g}" members have different usage_limit values`);
    });
  });
  return problems;
};
const realProblems = validateUsageData(RW);
check("D1 real data: usage_tracker / usage_group valid", realProblems.length === 0, realProblems.join("; "));

/* Data that carries the feature, whoever owns it */
const featureAttrs = [];
const walkTalents = (owner, talents) => Object.entries(talents || {}).forEach(([k, t]) => {
  if (t.usage_tracker || t.usage_group) {
    ["long_rest", "scene", "session"].forEach((c) => { if ((Array.isArray(t.usage_limit) ? t.usage_limit : [t.usage_limit]).includes(c)) featureAttrs.push({ attr: `used_${c}_${owner}_${k}`, rest: `${owner}_${k}`, counter: t.usage_tracker === "counter" }); });
  }
});
Object.entries(RW.careerDataMap).forEach(([c, d]) => walkTalents(c, d.talents));
Object.entries(RW.ancestryDataMap).forEach(([r, d]) => { walkTalents(r, d.talents); walkTalents(r, d.traits); });

/* L. Lockstep */
const careerKeys = Object.keys(RW.careerDataMap);
const allTracked = ["long_rest", "scene", "session"].flatMap((c) => RW.getUsageLimitedTalentNames(c));
const hasEl = (a) => html.includes(`name="attr_${a}"`);
const hasShow = (rest) => html.includes(`name="attr_show_${rest}"`);
const hasReveal = (rest) => css.includes(`name="attr_show_${rest}"][value="1"]`);
const restOf = (a) => a.replace(/^used_(scene|session|long_rest)_/, "");
const stillMissing = [];
allTracked.forEach((a) => {
  if (!hasEl(a)) { if (L_EXCEPTIONS[a]) stillMissing.push(a); else check(`L1 tracked attr has an HTML element: ${a}`, false); }
});
Object.keys(L_EXCEPTIONS).forEach((a) => check(`L1x exception is still needed: ${a}`, stillMissing.includes(a), "it now has an element; remove it from L_EXCEPTIONS"));
allTracked.filter((a) => careerKeys.some((c) => restOf(a).startsWith(c + "_"))).forEach((a) => {
  check(`L2 career tracker has an attr_show_ input: ${a}`, hasShow(restOf(a)));
  check(`L3 career tracker has a CSS reveal rule: ${a}`, hasReveal(restOf(a)));
});
featureAttrs.forEach((f) => {
  check(`L4 counted/grouped talent has an element: ${f.attr}`, hasEl(f.attr));
  check(`L5 counted/grouped talent has an attr_show_ input: ${f.attr}`, hasShow(f.rest));
  check(`L6 counted/grouped talent has a CSS reveal rule: ${f.attr}`, hasReveal(f.rest));
  const num = new RegExp(`<input[^>]*type="number"[^>]*name="attr_${f.attr}"|<input[^>]*name="attr_${f.attr}"[^>]*type="number"`).test(html);
  const chk = new RegExp(`<input[^>]*type="checkbox"[^>]*name="attr_${f.attr}"|<input[^>]*name="attr_${f.attr}"[^>]*type="checkbox"`).test(html);
  if (f.counter) { check(`L7 counter renders as a number input: ${f.attr}`, num && !chk); check(`L7c counter row uses sheet-tracker-counter: ${f.attr}`, new RegExp(`name="attr_${f.attr}"[^>]*class="sheet-tracker-counter"`).test(html)); }
  else check(`L8 non-counter renders as a checkbox: ${f.attr}`, chk && !num);
});
check("L9 the feature is exercised by at least one real talent", featureAttrs.some((f) => f.counter), "no real talent uses a counter");
check("L10 counter CSS rule exists", /input\.sheet-tracker-counter\s*\{/.test(css));

/* C. Counter, on the real pilot talent (Strain 1d4) */
const pilot = featureAttrs.find((f) => f.counter);
const P = pilot ? pilot.attr : "used_scene_arcane_gunslinger_disruptive_round";
const fire = (attr, prev, next) => HANDLERS.filter((h) => h.events.includes(`change:${attr}`)).forEach((h) => h.fn({ sourceAttribute: attr, previousValue: prev, newValue: next }));
const seed = (o) => { STORE = Object.assign({ name: "T", strain: "20", strain_max: "20" }, o || {}); MESSAGES = []; FIRED = []; };
const realRandom = Math.random;
check("C0 the pilot counter is registered on the tracker event", HANDLERS.some((h) => h.events.includes(`change:${P}`)));

Math.random = () => 0; // every die rolls 1
seed({ [P]: "1" }); fire(P, "0", "1");
eq("C1 0→1 charges one use", String(STORE.strain), "19");
eq("C1m one chat line", MESSAGES.length, 1);
check("C1l a single use carries no ×N label", !/×\d/.test(MESSAGES[0] || ""));
seed({ [P]: "3" }); fire(P, "1", "3");
eq("C2 1→3 (a jump of two) charges two uses", String(STORE.strain), "18");
eq("C2m still one chat line", MESSAGES.length, 1);
check("C2l the line shows ×2", /×2/.test(MESSAGES[0] || ""), MESSAGES[0]);
Math.random = () => 0.999; // every die rolls 4
seed({ [P]: "3" }); fire(P, "0", "3");
eq("C2d three uses of 1d4 at the maximum", String(STORE.strain), "8");
Math.random = () => 0;
seed({ [P]: "2" }); fire(P, "3", "2");
eq("C3 a step down charges nothing", String(STORE.strain), "20"); eq("C3m and posts nothing", MESSAGES.length, 0);
seed({ [P]: "2" }); fire(P, "2", "2");
eq("C4 an equal value charges nothing", String(STORE.strain), "20");
seed({ [P]: "" }); fire(P, "2", "");
eq("C5 an emptied field charges nothing", String(STORE.strain), "20");
seed({ [P]: "abc" }); fire(P, "0", "abc");
eq("C5b a non-numeric value charges nothing", String(STORE.strain), "20");
seed({ [P]: "1" }); fire(P, undefined, "1");
eq("C6 no previous value counts as 0", String(STORE.strain), "19");
seed({ strain: "0", [P]: "3" }); fire(P, "2", "3");
eq("C7 a blocked use restores the previous count", STORE[P], "2");
eq("C7s and leaves Strain at 0", String(STORE.strain), "0");
check("C7m and posts the blocked line", MESSAGES.length === 1 && /perk_roll_cannot_activate|cannot/i.test(MESSAGES[0] + TRANS["perk_roll_cannot_activate-u"]), MESSAGES[0]);
seed({ [P]: "4" });
HANDLERS.filter((h) => h.events.includes("clicked:clear_scene_uses")).forEach((h) => h.fn({}));
eq("C8 Clear Scene resets the counter", STORE[P], "0");
eq("C8s without charging Strain", String(STORE.strain), "20");
eq("C8m or posting a line", MESSAGES.length, 0);
eq("C8f and clearing_tracker is released", STORE.clearing_tracker, "0");

/* B. Checkbox path: an existing Scene checkbox talent with fixed Strain */
const cbCareer = "stormweaver";
const cb = Object.entries(RW.careerDataMap[cbCareer].talents).find(([, t]) => t.usage_limit === "scene" && /^\d+$/.test(t.strain || "") && !t.usage_tracker && !t.usage_group);
const CB = cb ? `used_scene_${cbCareer}_${cb[0]}` : null;
check("B0 a fixed-Strain Scene checkbox talent exists to test", !!CB);
if (CB) {
  const cost = parseInt(cb[1].strain, 10);
  seed({ [CB]: "1" }); fire(CB, "0", "1");
  eq("B1 a tick charges the talent's Strain", String(STORE.strain), String(20 - cost)); eq("B1m once", MESSAGES.length, 1);
  seed({ [CB]: "0" }); fire(CB, "1", "0");
  eq("B2 an untick charges nothing", String(STORE.strain), "20"); eq("B2m and posts nothing", MESSAGES.length, 0);
}

/* G. Groups and fixed counters, on synthetic talents */
const syn = load(injectSyn(worker));
const SW = syn.W;
const synProblems = validateUsageData(SW);
check("D2 the synthetic data is the only source of validation problems", synProblems.length === 1 && /usage_group "solo" has one member/.test(synProblems[0]), synProblems.join("; "));
const A = (k) => `used_scene_stormweaver_${k}`;
const air = A("syn_air"), earth = A("syn_earth"), fire_ = A("syn_fire");
eq("G0 siblings exclude self", JSON.stringify(SW.usageGroupSiblings[air]), JSON.stringify([earth, fire_]));
eq("G0b a group of one has no entry for its sibling", (SW.usageGroupSiblings[A("syn_alone")] || []).length, 0);
check("G0c every group member is on the tracker event", [air, earth, fire_].every((a) => SW.trackerChangeEvent.includes(`change:${a}`)));
seed({}); STORE[air] = "1"; fire(air, "0", "1");
eq("G1 ticking one marks the others", STORE[earth] + STORE[fire_], "11");
eq("G1m only one chat line", MESSAGES.length, 1);
eq("G1f the propagated members fired no handler", FIRED.filter((a) => a === earth || a === fire_).length, 0);
eq("G1s a free group charges nothing", String(STORE.strain), "20");
seed({ [air]: "1", [earth]: "1", [fire_]: "1" }); STORE[earth] = "0"; fire(earth, "1", "0");
eq("G2 unticking one clears all", STORE[air] + STORE[earth] + STORE[fire_], "000"); eq("G2m and posts nothing", MESSAGES.length, 0);
seed({ [air]: "1", [earth]: "1", [fire_]: "1" });
HANDLERS.filter((h) => h.events.includes("clicked:clear_scene_uses")).forEach((h) => h.fn({}));
eq("G3 Clear Scene clears every member", STORE[air] + STORE[earth] + STORE[fire_], "000");
eq("G3m with no chat line", MESSAGES.length, 0); eq("G3s and no Strain", String(STORE.strain), "20");
const pa = A("syn_paid_a"), pb = A("syn_paid_b");
seed({}); STORE[pa] = "1"; fire(pa, "0", "1");
eq("G4 a paid group charges the ticked talent once", String(STORE.strain), "18"); eq("G4m with one line", MESSAGES.length, 1);
eq("G4p and marks the other member used", STORE[pb], "1");
seed({ strain: "0" }); STORE[pa] = "1"; fire(pa, "0", "1");
eq("G5 a blocked tick leaves the ticked member unticked", STORE[pa], "0");
eq("G5p and its sibling unticked too", STORE[pb], "0");
eq("G5s Strain stays 0", String(STORE.strain), "0");
const alone = A("syn_alone");
seed({}); STORE[alone] = "1"; fire(alone, "0", "1");
eq("G6 a group of one charges as a plain checkbox", String(STORE.strain), "19"); eq("G6m once", MESSAGES.length, 1);
const fx = A("syn_fixed");
seed({}); STORE[fx] = "3"; fire(fx, "0", "3");
eq("G7 a fixed-Strain counter charges cost × uses", String(STORE.strain), "14");
check("G7m the line shows ×3", /×3/.test(MESSAGES[0] || ""), MESSAGES[0]);
seed({}); STORE[fx] = "1"; fire(fx, "3", "1");
eq("G8 no refund on a step down", String(STORE.strain), "20");
Math.random = realRandom;

/* W. Wiring */
eq("W1 one handler is registered on the tracker event", (code.match(/on\(\s*trackerChangeEvent\s*,/g) || []).length, 1);
const at = (re) => { const m = re.exec(code); return m ? code.slice(0, m.index).split("\n").length : -1; };
const dGroup = at(/const usageGroupSiblings\s*=/), dNames = at(/const getUsageLimitedTalentNames\s*=/), dHas = at(/const hasLimit\s*=/);
const dCareer = at(/const careerDataMap\s*=/), dAnc = at(/const ancestryDataMap\s*=/), hTrack = at(/on\(\s*trackerChangeEvent\s*,/);
check("W2 usageGroupSiblings is declared after hasLimit, getUsageLimitedTalentNames and both DataMaps",
  dGroup > Math.max(dHas, dNames, dCareer, dAnc) && dHas > 0 && dNames > 0 && dCareer > 0 && dAnc > 0,
  `group ${dGroup}, hasLimit ${dHas}, names ${dNames}, career ${dCareer}, ancestry ${dAnc}`);
check("W3 the tracker handler follows usageGroupSiblings", hTrack > dGroup && dGroup > 0, `handler ${hTrack}, group ${dGroup}`);
check("W4 the handler passes the use count and restore value", /handleTrackerStrainDeduction\(\s*source\s*,\s*\{\s*uses:\s*next\s*-\s*prev\s*,\s*restore:\s*String\(prev\)\s*\}\s*\)/.test(code));
check("W5 propagated group writes are silent", /setAttrs\(\s*updates\s*,\s*\{\s*silent:\s*true\s*\}/.test(code));

if (fails.length) { say(`FAIL — ${fails.length} check(s):`); fails.forEach((f) => say("  " + f)); process.exit(1); }
say("PASS — usage counters and shared-use groups");
