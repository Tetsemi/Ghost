#!/usr/bin/env node
/* test_changelog.js — the Change Log tab.
 *
 * Executes the whole worker under stub Roll20 globals, registers the real change-log watchers into a
 * registry that can dispatch events, and asserts behaviour rather than text:
 *
 *   G  gating        no row before the creation lock; a row after it; a row when the player opts in;
 *                    opts.always bypasses both
 *   T  toggles       acquired / removed rows for career and ancestry talents, perks and flaws, with the
 *                    right area, display name, detail and "By"; no row for no-op or initialisation events;
 *                    every talent attr has a registered event, exactly once
 *   S  selections    ancestry, background, primary and secondary career, background talent; secondary
 *                    career removal reads removedInfo
 *   C  cleanup       Clear Inactive Careers writes one summary row per career that had ticked talents,
 *                    leaves active careers alone, and logs nothing the second time
 *   P  pruning       oldest rows by stored timestamp (not by row order) are removed past the cap
 *   W  wiring        the registrar is called from bootstrapGlobalWatchersOnce, the tab is in tabList and in
 *                    the HTML and CSS, every attr the writer produces has an element and the reverse, every
 *                    translation key resolves, column widths sum to 813, declaration order holds
 *
 * Comment-stripped source is used for every call-site assertion. A test that calls a function directly
 * does not prove the function is called, so the call sites are asserted separately.
 *
 * Usage: node test_changelog.js ghost_of_arcadia.html [ghost_of_arcadia.css]
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

/* ── Roll20 stubs ────────────────────────────────────────────────────── */
let STORE = {};
let CAPTURE = null;
let ROWSEQ = 0;
const HANDLERS = [];
const on = (ev, fn) => { if (CAPTURE) CAPTURE.push({ events: String(ev).split(/\s+/), fn }); };
const getAttrs = (keys, cb) => {
  const out = {};
  keys.forEach((k) => { out[k] = STORE[k] !== undefined ? STORE[k] : ""; });
  cb(out);
};
const setAttrs = (obj, opt, cb) => {
  Object.assign(STORE, obj);
  const done = typeof opt === "function" ? opt : cb;
  if (typeof done === "function") done();
};
const getSectionIDs = (sec, cb) => {
  const ids = new Set();
  const re = new RegExp(`^${sec}_(-[^_]+)_`);
  Object.keys(STORE).forEach((k) => { const m = k.match(re); if (m) ids.add(m[1]); });
  cb([...ids]);
};
const removeRepeatingRow = (prefix) => { Object.keys(STORE).forEach((k) => { if (k.startsWith(prefix + "_")) delete STORE[k]; }); };
const generateRowID = () => `-r${++ROWSEQ}`;
const getTranslationByKey = (k) => TRANS[k];
Object.assign(globalThis, { on, getAttrs, setAttrs, getSectionIDs, removeRepeatingRow, generateRowID, getTranslationByKey });

let W;
try {
  W = new Function(worker + `
return { logChange, pruneChangeLog, registerChangeLogWatchers, changeLogDescribeToggle, cleanupInactiveCareers,
  careerDataMap, ancestryDataMap, perkDataMap, flawDataMap, backgroundDataMap, tabList, CHANGELOG_MAX_ROWS, careerTalentEvents };`)();
} catch (e) {
  say(`FAIL — worker threw at load: ${e.message}`);
  process.exit(1);
}
say("module loaded and evaluated without error");

CAPTURE = HANDLERS;
W.registerChangeLogWatchers();
CAPTURE = null;
const fire = (token, eventInfo) => HANDLERS.filter((h) => h.events.includes(token)).forEach((h) => h.fn(eventInfo));

const reset = (seed) => { STORE = Object.assign({}, seed || {}); };
const rowsOf = () => {
  const out = [];
  getSectionIDs("repeating_changelog", (ids) => ids.forEach((id) => {
    const p = `repeating_changelog_${id}_`;
    const r = {};
    Object.keys(STORE).filter((k) => k.startsWith(p)).forEach((k) => { r[k.slice(p.length)] = STORE[k]; });
    out.push(r);
  }));
  return out.sort((a, b) => (+a.log_time) - (+b.log_time));
};
const tr = (k) => TRANS[k] || k;
const LOCKED = { char_creation_lock: "1" };

/* Real data to drive the handlers */
const careerKey = Object.keys(W.careerDataMap).find((c) => Object.keys(W.careerDataMap[c].talents || {}).length > 3);
const careerTalent = Object.keys(W.careerDataMap[careerKey].talents)[0];
const ct = W.careerDataMap[careerKey].talents[careerTalent];
const raceKey = Object.keys(W.ancestryDataMap).find((r) => Object.keys(W.ancestryDataMap[r].talents || {}).length);
const raceTalent = Object.keys(W.ancestryDataMap[raceKey].talents)[0];
const rt = W.ancestryDataMap[raceKey].talents[raceTalent];
const perkKey = Object.keys(W.perkDataMap)[0];
const flawKey = Object.keys(W.flawDataMap)[0];
const careerAttr = `${careerKey}_${careerTalent}`;
const tick = (attr, prev, next, sourceType) => fire(`change:${attr}`, { sourceAttribute: attr, previousValue: prev, newValue: next, sourceType: sourceType || "player" });

/* ── G. Gating ───────────────────────────────────────────────────────── */
reset();
tick(careerAttr, "0", "1");
eq("G1 no row before the creation lock", rowsOf().length, 0);
reset(LOCKED);
tick(careerAttr, "0", "1");
eq("G2 a row after the creation lock", rowsOf().length, 1);
reset({ changelog_log_creation: "1" });
tick(careerAttr, "0", "1");
eq("G3 a row when the player opts in during creation", rowsOf().length, 1);
reset();
W.logChange([{ by: "sheet", area: "career", change: "cleared", subject: "x", detail: "y" }], { always: true });
eq("G4 opts.always bypasses the gate", rowsOf().length, 1);
reset();
W.logChange([{ by: "sheet", area: "career", change: "cleared", subject: "x", detail: "y" }]);
eq("G5 logChange alone does not bypass the gate", rowsOf().length, 0);

/* ── T. Toggles ──────────────────────────────────────────────────────── */
reset(LOCKED);
tick(careerAttr, "0", "1");
let r = rowsOf()[0] || {};
eq("T1 career area", r.log_area, tr("changelog_area_career-u"));
eq("T1 career change", r.log_change, tr("changelog_change_acquired-u"));
eq("T1 career subject is the resolved display name", r.log_subject, tr(ct.name_key));
check("T1 career detail names the career, tier and cost",
  (r.log_detail || "").includes(tr(`${careerKey}-u`) !== `${careerKey}-u` ? tr(`${careerKey}-u`) : W.careerDataMap[careerKey].name)
  && (r.log_detail || "").includes(`${tr("changelog_tier-u")} ${ct.tier}`)
  && (r.log_detail || "").includes(`${ct.cost} ${tr("changelog_xp-u")}`), r.log_detail);
eq("T1 By is Player for a player click", r.log_by, tr("changelog_by_player-u"));
eq("T1 preview equals detail (CSS truncates, JS does not)", r.log_detail_preview, r.log_detail);
check("T1 timestamp and When are written", /^\d{13,}$/.test(r.log_time || "") && /^\d{4}-\d\d-\d\d \d\d:\d\d$/.test(r.log_when || ""), `${r.log_time} / ${r.log_when}`);

reset(LOCKED);
tick(careerAttr, "1", "0");
eq("T2 untick logs Removed", (rowsOf()[0] || {}).log_change, tr("changelog_change_removed-u"));
reset(LOCKED);
tick(careerAttr, "0", "1", "sheetworker");
eq("T3 a sheet-driven tick logs By Sheet", (rowsOf()[0] || {}).log_by, tr("changelog_by_sheet-u"));

reset(LOCKED);
tick(careerAttr, "0", "0"); tick(careerAttr, "", "0"); tick(careerAttr, undefined, "0"); tick(careerAttr, "1", "1");
eq("T4 no-op and initialisation events log nothing", rowsOf().length, 0);

reset(LOCKED);
tick(`${raceKey}_${raceTalent}`, "0", "1");
r = rowsOf()[0] || {};
eq("T5 ancestry area", r.log_area, tr("changelog_area_ancestry-u"));
eq("T5 ancestry subject", r.log_subject, tr(rt.name_key));
reset(LOCKED);
tick(`perk_${perkKey}`, "0", "1");
r = rowsOf()[0] || {};
eq("T6 perk area", r.log_area, tr("changelog_area_perk-u"));
eq("T6 perk subject", r.log_subject, tr(W.perkDataMap[perkKey].name));
reset(LOCKED);
tick(`flaw_${flawKey}`, "0", "1");
r = rowsOf()[0] || {};
eq("T7 flaw area", r.log_area, tr("changelog_area_flaw-u"));
eq("T7 flaw subject", r.log_subject, tr(W.flawDataMap[flawKey].name));
reset(LOCKED);
W.changeLogDescribeToggle("perk_institutional_weight_institution") && fails.push("T8 the institution text attr must not be a logged toggle");
tick("perk_institutional_weight_institution", "0", "1");
tick("not_a_talent_at_all", "0", "1");
eq("T8 unknown attrs log nothing", rowsOf().length, 0);

/* every talent attr has a registered event, exactly once */
const tokens = {};
HANDLERS.forEach((h) => h.events.forEach((e) => { tokens[e] = (tokens[e] || 0) + 1; }));
const want = [];
Object.entries(W.careerDataMap).forEach(([c, d]) => Object.keys(d.talents || {}).forEach((t) => want.push(`change:${c}_${t}`)));
Object.entries(W.ancestryDataMap).forEach(([c, d]) => Object.keys(d.talents || {}).forEach((t) => want.push(`change:${c}_${t}`)));
Object.keys(W.perkDataMap).forEach((k) => want.push(`change:perk_${k}`));
Object.keys(W.flawDataMap).forEach((k) => want.push(`change:flaw_${k}`));
const missing = want.filter((t) => !tokens[t]);
const dup = Object.keys(tokens).filter((t) => tokens[t] > 1);
check("T9 every career, ancestry, perk and flaw talent has a registered event", missing.length === 0, `${missing.length} missing, e.g. ${missing.slice(0, 3)}`);
check("T9 no event token is registered twice", dup.length === 0, dup.slice(0, 3).join(", "));
eq("T9 the registrar makes exactly 3 on() registrations", HANDLERS.length, 3);

/* ── S. Selections ───────────────────────────────────────────────────── */
const sel = (attr, prev, next, sourceType) => fire(`change:${attr.startsWith("repeating_secondarycareer_") ? "repeating_secondarycareer:secondary_career" : attr}`,
  { sourceAttribute: attr, previousValue: prev, newValue: next, sourceType: sourceType || "player" });
const races = Object.keys(W.ancestryDataMap);
reset(LOCKED);
sel("showracials", races[0], races[1]);
r = rowsOf()[0] || {};
eq("S1 ancestry area", r.log_area, tr("changelog_area_ancestry-u"));
eq("S1 ancestry change", r.log_change, tr("changelog_change_changed-u"));
check("S1 detail reads old -> new", /\S+ -> \S+/.test(r.log_detail || ""), r.log_detail);
reset(LOCKED);
sel("showracials", "", races[0]);
eq("S2 first selection logs Added", (rowsOf()[0] || {}).log_change, tr("changelog_change_added-u"));
reset(LOCKED);
sel("showracials", races[0], races[0]);
eq("S3 an unchanged selection logs nothing", rowsOf().length, 0);
const bgs = Object.keys(W.backgroundDataMap);
reset(LOCKED);
sel("background_choice", bgs[0], bgs[1]);
r = rowsOf()[0] || {};
eq("S4 background area", r.log_area, tr("changelog_area_background-u"));
eq("S4 background subject is the new background's name", r.log_subject, tr(W.backgroundDataMap[bgs[1]].name));
const careers = Object.keys(W.careerDataMap);
reset(LOCKED);
sel("primary_career", "", careers[0]);
eq("S5 primary career area", (rowsOf()[0] || {}).log_area, tr("changelog_area_career-u"));
reset(LOCKED);
sel("repeating_secondarycareer_-abc_secondary_career", careers[0], careers[1]);
eq("S6 secondary career change logs", rowsOf().length, 1);
reset(LOCKED);
fire("remove:repeating_secondarycareer", { sourceAttribute: "repeating_secondarycareer_-abc", sourceType: "player",
  removedInfo: { "repeating_secondarycareer_-abc_secondary_career": careers[0] } });
r = rowsOf()[0] || {};
eq("S7 secondary removal logs Removed", r.log_change, tr("changelog_change_removed-u"));
reset(LOCKED);
fire("remove:repeating_secondarycareer", { sourceAttribute: "repeating_secondarycareer_-abc", sourceType: "player", removedInfo: {} });
eq("S8 a removal with no career value logs nothing", rowsOf().length, 0);
const bgRace = races.find((x) => Object.keys(W.ancestryDataMap[x].talents || {}).length);
const bgTalent = Object.keys(W.ancestryDataMap[bgRace].talents)[0];
reset(LOCKED);
sel(`bg_${bgRace}_talent`, "", bgTalent);
r = rowsOf()[0] || {};
eq("S9 background talent area", r.log_area, tr("changelog_area_background-u"));
eq("S9 background talent subject", r.log_subject, tr(W.ancestryDataMap[bgRace].talents[bgTalent].name_key));

/* ── C. Clear Inactive Careers ───────────────────────────────────────── */
const cs = Object.keys(W.careerDataMap).filter((c) => Object.keys(W.careerDataMap[c].talents || {}).length >= 3);
const [inactive, active] = [cs[0], cs[1]];
const tIn = Object.keys(W.careerDataMap[inactive].talents).slice(0, 3);
const tAct = Object.keys(W.careerDataMap[active].talents).slice(0, 2);
const seedClear = (extra) => {
  const s = Object.assign({}, extra);
  Object.keys(W.careerDataMap).forEach((c) => { s[`${c}_ready`] = "0"; });
  s[`${active}_ready`] = "1";
  tIn.forEach((t) => { s[`${inactive}_${t}`] = "1"; });
  tAct.forEach((t) => { s[`${active}_${t}`] = "1"; });
  reset(s);
};
const runClear = () => { try { W.cleanupInactiveCareers(); } catch (e) { fails.push(`C threw: ${e.message}`); } };
seedClear(LOCKED);
runClear();
let rows = rowsOf();
eq("C1 one summary row for the one inactive career that had ticked talents", rows.length, 1);
r = rows[0] || {};
eq("C1 area and change", `${r.log_area}|${r.log_change}`, `${tr("changelog_area_career-u")}|${tr("changelog_change_cleared-u")}`);
check("C1 detail has the count and names every cleared talent",
  (r.log_detail || "").startsWith(`3 ${tr("changelog_detail_talents-u")}`)
  && tIn.every((t) => (r.log_detail || "").includes(tr(W.careerDataMap[inactive].talents[t].name_key))), r.log_detail);
check("C2 the inactive career's talents are cleared", tIn.every((t) => STORE[`${inactive}_${t}`] === "0"));
check("C3 the active career's talents are untouched", tAct.every((t) => STORE[`${active}_${t}`] === "1"));
runClear();
eq("C4 a second clear logs nothing", rowsOf().length, 1);
seedClear({});
runClear();
eq("C5 before the lock the clear still clears but logs nothing", rowsOf().length, 0);
check("C5 and the talents are still cleared", tIn.every((t) => STORE[`${inactive}_${t}`] === "0"));

/* ── P. Pruning ──────────────────────────────────────────────────────── */
const cap = W.CHANGELOG_MAX_ROWS;
reset(LOCKED);
const order = Array.from({ length: cap + 5 }, (_, i) => i);
order.sort((a, b) => ((a * 7919) % 101) - ((b * 7919) % 101)); // shuffle row creation order away from time order
order.forEach((i) => { STORE[`repeating_changelog_-p${i}_log_time`] = String(1000 + i); STORE[`repeating_changelog_-p${i}_log_subject`] = `row${i}`; });
W.pruneChangeLog();
rows = rowsOf();
eq("P1 pruned to the cap", rows.length, cap);
check("P2 the oldest five by timestamp were removed, regardless of row order",
  [0, 1, 2, 3, 4].every((i) => !rows.some((x) => x.log_subject === `row${i}`)) && rows.some((x) => x.log_subject === "row5"));
reset(LOCKED);
Array.from({ length: cap }, (_, i) => i).forEach((i) => { STORE[`repeating_changelog_-q${i}_log_time`] = String(1000 + i); });
W.logChange([{ by: "player", area: "perk", change: "acquired", subject: "new", detail: "" }]);
eq("P3 a write past the cap prunes in the same flow", rowsOf().length, cap);

/* ── W. Wiring ───────────────────────────────────────────────────────── */
check("W1 bootstrapGlobalWatchersOnce calls registerChangeLogWatchers",
  /const bootstrapGlobalWatchersOnce\s*=\s*\(\)\s*=>\s*\{[\s\S]{0,2500}?registerChangeLogWatchers\s*\(\s*\)\s*;/.test(code));
check("W2 cleanupInactiveCareers calls logChange",
  /const cleanupInactiveCareers\s*=\s*\(\)\s*=>\s*\{[\s\S]{0,6000}?logChange\s*\(\s*clearedLog\s*\)/.test(code));
check("W3 tabList carries changelog", W.tabList.includes("changelog"));
check("W4 the tab button exists", /<button type="action" name="act_changelog"/.test(html));
check("W5 the tab content div exists", /<div class="sheet-tab-content sheet-changelog">/.test(html));
check("W6 CSS shows the tab", /\[value="changelog"\] ~ \.sheet-changelog\b/.test(css));
check("W7 CSS highlights the tab button", /\[value="changelog"\] ~ \.sheet-tab-buttons button\[name="act_changelog"\]/.test(css));

/* every attr the writer produces has an element in the fieldset, and the reverse */
reset(LOCKED);
W.logChange([{ by: "player", area: "perk", change: "acquired", subject: "s", detail: "d" }]);
const written = new Set(Object.keys(STORE).filter((k) => k.startsWith("repeating_changelog_")).map((k) => k.replace(/^repeating_changelog_-[^_]+_/, "")));
const fs1 = html.match(/<fieldset class="repeating_changelog">([\s\S]*?)<\/fieldset>/);
check("W8 the repeating_changelog fieldset exists", !!fs1);
const declared = new Set([...(fs1 ? fs1[1] : "").matchAll(/name="attr_([a-z_]+)"/g)].map((m) => m[1]));
check("W8 every written attr has an element", [...written].every((a) => declared.has(a)), `missing: ${[...written].filter((a) => !declared.has(a))}`);
check("W8 every element has a writer", [...declared].every((a) => written.has(a)), `unwritten: ${[...declared].filter((a) => !written.has(a))}`);

/* translation keys */
const tabBlock = (html.match(/<div class="sheet-tab-content sheet-changelog">([\s\S]*?)<!-- -{5,}|<div class="sheet-tab-content sheet-changelog">[\s\S]{0,6000}/) || [""])[0];
const used = new Set([...tabBlock.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]));
used.add("changelog-u"); // the tab button
["ancestry", "background", "career", "flaw", "perk"].forEach((a) => used.add(`changelog_area_${a}-u`));
["acquired", "added", "changed", "cleared", "removed"].forEach((c) => used.add(`changelog_change_${c}-u`));
["changelog_by_player-u", "changelog_by_sheet-u", "changelog_xp-u", "changelog_tier-u", "changelog_detail_talents-u"].forEach((k) => used.add(k));
const absent = [...used].filter((k) => !TRANS[k]);
check("W9 every translation key the tab and the writer use exists", absent.length === 0, absent.join(", "));

/* column widths */
const cols = ["when", "by", "area", "change", "subject", "detail"].map((c) => {
  const m = css.match(new RegExp(`\\.sheet-changelog \\.changelog-${c}\\s*\\{\\s*flex:\\s*0 0 (\\d+)px`));
  return m ? +m[1] : NaN;
});
eq("W10 column widths sum to 813", cols.reduce((a, b) => a + b, 0), 813);

/* declaration order: the registrar's inputs precede it */
const at = (re) => { const m = code.search(re); return m < 0 ? Infinity : m; };
check("W11 careerTalentEvents is declared before registerChangeLogWatchers",
  at(/const careerTalentEvents\s*=/) < at(/const registerChangeLogWatchers\s*=/));
check("W11 getCareerKeyFromSourceAttr is declared before changeLogDescribeToggle",
  at(/const getCareerKeyFromSourceAttr\s*=/) < at(/const changeLogDescribeToggle\s*=/));

/* no other handler listens to the log's own attrs */
check("W12 nothing registers a change handler on the log section",
  !/on\(\s*[`"'][^`"']*repeating_changelog/.test(code));

if (fails.length) {
  say(`FAIL — ${fails.length} check(s):`);
  fails.forEach((f) => say("  " + f));
  process.exit(1);
}
say("PASS — the Change Log gates, records, prunes, and is wired into the tab, the CSS and the translations.");
