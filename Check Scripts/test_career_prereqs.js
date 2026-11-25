#!/usr/bin/env node
/*
 * Ghost of Arcadia — career talent prerequisite logic.
 *
 * A career talent's prerequisites are three independent fields and EVERY field
 * a talent carries must be satisfied:
 *
 *   prerequisite     one talent, or an OR list of talents
 *   prerequisiteAll  an AND list of talents
 *   prerequisiteAny  { tier, count } — that many OTHER ticked talents from the tier
 *
 * The tier count never includes the talents the same entry names in
 * prerequisite / prerequisiteAll (author ruling, 2026-11-25): the two are
 * separate requirements. A talent that combines a tier count with named
 * prerequisites is listed as REVIEW so the author can confirm it was intended.
 *
 * What this executes (updateCareerTalentEnables, against a synthetic career
 * added to the real careerDataMap object):
 *   E  enable flags: each field on its own, combined with AND
 *   L  lock flags: an AND prerequisite is locked by any ticked dependent, an OR
 *      prerequisite only while it is the dependent's sole ticked alternative
 *   T  the tier count: separate from named talents, sources recorded and locked
 *   R  regression: with --against <pristine.html>, every real career is driven
 *      through the same seeded states in both workers and the ordered writes
 *      must be identical (no career uses prerequisiteAll or a combined form yet)
 *
 * Executing the module is the point: `node --check` parses but does not resolve
 * identifiers. Failures name the check that fired, not just a non-zero exit.
 *
 * Usage: node test_career_prereqs.js ghost_of_arcadia.html [--against pristine.html]
 */

const fs = require("fs");
/* The worker traces to console.log on every call; silence it so the verdict is readable. */
const say = console.log.bind(console);
console.log = () => {};
const args = process.argv.slice(2);
const against = args.includes("--against") ? args[args.indexOf("--against") + 1] : null;
const path = args.find((a) => !a.startsWith("--") && a !== against) || "ghost_of_arcadia.html";

/* Review list: talents the author has confirmed that combine a tier count with
   named prerequisites. Self-clearing — an entry that no longer matches fails. */
const PREREQ_REVIEWED = [];

const workerOf = (p) => fs.readFileSync(p, "utf8").match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];

/* ── Roll20 stubs ────────────────────────────────────────────────────── */
let STORE = {};
let LOG = [];
const on = () => {};
const getAttrs = (keys, cb) => {
  const out = {};
  keys.forEach((k) => { out[k] = STORE[k] !== undefined ? STORE[k] : ""; });
  cb(out);
};
const setAttrs = (obj, opt, cb) => {
  /* Key order inside one setAttrs call is not behaviour; compare sorted. */
  LOG.push(JSON.stringify(Object.keys(obj).sort().reduce((o, k) => (o[k] = obj[k], o), {})));
  Object.assign(STORE, obj);
  const done = typeof opt === "function" ? opt : cb;
  if (typeof done === "function") done();
};
const getSectionIDs = (sec, cb) => cb([]);
const getTranslationByKey = (k) => k;
const generateRowID = () => "-newrow";
const removeRepeatingRow = () => {};
Object.assign(globalThis, { on, getAttrs, setAttrs, getSectionIDs,
  getTranslationByKey, generateRowID, removeRepeatingRow });

const load = (p) => {
  try {
    return new Function(workerOf(p) + "\nreturn { updateCareerTalentEnables, careerDataMap };")();
  } catch (e) {
    say(`FAIL — worker threw at load (${p}):\n  ${e.message}`);
    process.exit(1);
  }
};
const mod = load(path);
say("module loaded and evaluated without error");

const fails = [];
const check = (name, ok, detail) => { if (!ok) fails.push(`${name}${detail ? ": " + detail : ""}`); };

/* ── Synthetic career ────────────────────────────────────────────────── */
const C = "zz_test";
const T = (tier, extra) => Object.assign({ tier, cost: 5, capstone: false, prerequisite: "" }, extra || {});
mod.careerDataMap[C] = { name: "Test", talents: {
  t1_a: T(1), t1_b: T(1), t1_c: T(1),
  t2_str: T(2, { prerequisite: "t1_a" }),
  t2_or: T(2, { prerequisite: ["t1_a", "t1_b"] }),
  t2_all: T(2, { prerequisiteAll: ["t1_a", "t1_b"] }),
  t2_mix: T(2, { prerequisite: ["t1_a", "t1_b"], prerequisiteAll: ["t1_c"] }),
  t2_tier: T(2, { prerequisiteAny: { tier: 1, count: 2 } }),
  t2_tier_named: T(2, { prerequisite: "t1_a", prerequisiteAny: { tier: 1, count: 1 } }),
  t2_tier_all: T(2, { prerequisiteAll: ["t1_a", "t1_b"], prerequisiteAny: { tier: 1, count: 1 } }),
  t2_none: T(2),
  t3_chain: T(3, { prerequisite: "t2_all" }),
} };
const KEYS = Object.keys(mod.careerDataMap[C].talents);

const run = (ticked) => {
  STORE = {};
  KEYS.forEach((k) => { STORE[`${C}_${k}`] = ticked.includes(k) ? "1" : "0"; });
  LOG = [];
  try { mod.updateCareerTalentEnables(C); }
  catch (e) { fails.push(`threw for ticked [${ticked}]: ${e.message}`); }
  const get = (k, s) => STORE[`${C}_${k}${s}`];
  return {
    en: (k) => get(k, "_enabled"),
    lockPre: (k) => get(k, "_lockflag_prereq"),
    lock: (k) => get(k, "_lockflag"),
    src: (k) => get(k, "_sources"),
  };
};
const eq = (name, got, want) => check(name, got === want, `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`);

/* ── E. Enable flags ─────────────────────────────────────────────────── */
{
  const r = run([]);
  ["t1_a", "t1_b", "t1_c"].forEach((k) => eq(`E1 ${k} enabled with nothing ticked`, r.en(k), "1"));
  ["t2_str", "t2_or", "t2_all", "t2_mix", "t2_tier", "t2_tier_named", "t2_tier_all", "t2_none", "t3_chain"]
    .forEach((k) => eq(`E1 ${k} disabled with nothing ticked`, r.en(k), "0"));
}
{
  const r = run(["t1_a"]);
  eq("E2 single prerequisite met", r.en("t2_str"), "1");
  eq("E2 OR list met by one alternative", r.en("t2_or"), "1");
  eq("E2 AND list needs both", r.en("t2_all"), "0");
  eq("E2 OR met but AND unmet stays disabled", r.en("t2_mix"), "0");
  eq("E2 tier count 2 not met by one talent", r.en("t2_tier"), "0");
  eq("E3 named talent does not count toward its own tier count", r.en("t2_tier_named"), "0");
}
{
  const r = run(["t1_a", "t1_b"]);
  eq("E4 AND list met", r.en("t2_all"), "1");
  eq("E4 tier count met by two talents", r.en("t2_tier"), "1");
  eq("E4 named plus one other satisfies tier+named", r.en("t2_tier_named"), "1");
  eq("E5 AND-named talents do not count toward the tier count", r.en("t2_tier_all"), "0");
  eq("E4 OR met, AND (t1_c) unmet", r.en("t2_mix"), "0");
}
{
  const r = run(["t1_c"]);
  /* The pre-fix function let a later pass overwrite an earlier one: the AND
     pass re-enabled t2_mix on t1_c alone, and the tier pass re-enabled
     t2_tier_all on any one tier talent. */
  eq("E6 AND met alone must NOT enable a talent whose OR list is unmet", r.en("t2_mix"), "0");
  eq("E6 tier count met alone must NOT enable a talent whose AND list is unmet", r.en("t2_tier_all"), "0");
}
{
  const r = run(["t1_a", "t1_b", "t1_c"]);
  eq("E7 AND met plus a separate tier talent", r.en("t2_tier_all"), "1");
  eq("E7 OR and AND both met", r.en("t2_mix"), "1");
}

/* ── L. Lock flags ───────────────────────────────────────────────────── */
{
  const r = run(["t1_a", "t1_b", "t2_all"]);
  eq("L1 AND prerequisite a locked by ticked dependent", r.lockPre("t1_a"), "1");
  eq("L1 AND prerequisite b locked by ticked dependent", r.lockPre("t1_b"), "1");
  eq("L1 unrelated talent not locked", r.lockPre("t1_c"), "0");
}
{
  const r = run(["t1_a", "t1_b", "t2_or"]);
  eq("L2 OR alternative a free while b is also ticked", r.lockPre("t1_a"), "0");
  eq("L2 OR alternative b free while a is also ticked", r.lockPre("t1_b"), "0");
}
{
  const r = run(["t1_a", "t2_or"]);
  eq("L3 sole ticked OR alternative is locked", r.lockPre("t1_a"), "1");
  eq("L3 unticked alternative is not locked", r.lockPre("t1_b"), "0");
}
{
  const r = run(["t1_a", "t1_c", "t2_mix"]);
  eq("L4 combined: sole OR alternative locked", r.lockPre("t1_a"), "1");
  eq("L4 combined: AND prerequisite locked", r.lockPre("t1_c"), "1");
}
{
  const r = run(["t1_a", "t1_b", "t2_all", "t3_chain"]);
  eq("L5 chain: t2_all locked by ticked t3_chain", r.lockPre("t2_all"), "1");
  eq("L5 chain: AND prerequisite still locked while dependent is ticked", r.lockPre("t1_a"), "1");
}
{
  const r = run(["t1_a", "t1_b"]);
  eq("L6 nothing locked when no dependent is ticked (a)", r.lockPre("t1_a"), "0");
  eq("L6 nothing locked when no dependent is ticked (b)", r.lockPre("t1_b"), "0");
}

/* ── T. Tier count: sources and their locks ──────────────────────────── */
{
  const r = run(["t1_a", "t1_b", "t2_tier"]);
  eq("T1 sources recorded", r.src("t2_tier"), `${C}_t1_a,${C}_t1_b`);
  eq("T1 source a locked while the dependent is ticked", r.lock("t1_a"), "1");
  eq("T1 source b locked while the dependent is ticked", r.lock("t1_b"), "1");
  eq("T1 non-source not locked", r.lock("t1_c"), "0");
}
{
  const r = run(["t1_a", "t1_b", "t1_c", "t2_tier_all"]);
  eq("T2 named talents excluded from sources", r.src("t2_tier_all"), `${C}_t1_c`);
}
{
  const r = run(["t1_a", "t1_b"]);
  eq("T3 untouched dependent locks no sources", r.lock("t1_a"), "0");
}

/* ── R. Regression against the pristine worker ───────────────────────── */
if (against) {
  const old = load(against);
  let seed = 12345;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  let cases = 0, diffs = 0;
  const drive = (m, career, ticked) => {
    STORE = {};
    Object.keys(m.careerDataMap[career].talents).forEach((k) => {
      STORE[`${career}_${k}`] = ticked.has(k) ? "1" : "0";
    });
    LOG = [];
    m.updateCareerTalentEnables(career);
    return LOG.join("\n");
  };
  for (const career of Object.keys(mod.careerDataMap)) {
    if (career === C) continue;
    const keys = Object.keys(mod.careerDataMap[career].talents || {});
    if (!keys.length) continue;
    const states = [new Set(), new Set(keys)];
    keys.forEach((k) => states.push(new Set([k])));
    for (let i = 0; i < 40; i++) states.push(new Set(keys.filter(() => rnd() < 0.35)));
    for (const s of states) {
      cases++;
      let a, b;
      try { a = drive(old, career, s); b = drive(mod, career, s); }
      catch (e) { fails.push(`R threw in ${career}: ${e.message}`); continue; }
      if (a !== b) {
        diffs++;
        if (diffs <= 3) {
          const ja = JSON.parse(a.split("\n")[0]), jb = JSON.parse(b.split("\n")[0]);
          const bad = Object.keys(Object.assign({}, ja, jb)).filter((k) => ja[k] !== jb[k]);
          fails.push(`R writes differ for ${career} with ${s.size} ticked: ${bad.slice(0, 4).map((k) => `${k} old=${ja[k]} new=${jb[k]}`).join("; ")}`);
        }
      }
    }
  }
  check("R real careers behave identically to the pristine worker", diffs === 0, `${diffs} of ${cases} states differ`);
  say(`regression: ${cases} seeded states across the real careers, ${diffs} differ`);
} else {
  say("regression: skipped (pass --against <pristine.html> to run it)");
}

/* ── REVIEW: tier count combined with named prerequisites ────────────── */
{
  const review = [];
  for (const [ck, c] of Object.entries(mod.careerDataMap)) {
    if (ck === C) continue;
    for (const [k, t] of Object.entries(c.talents || {})) {
      const rule = t.prerequisiteAny;
      if (!rule || rule.tier == null || rule.count == null) continue;
      const named = [].concat(t.prerequisite || [], t.prerequisiteAll || []).filter(Boolean);
      if (!named.length) continue;
      const inTier = named.filter((n) => c.talents[n] && c.talents[n].tier === rule.tier);
      review.push({ id: `${ck}.${k}`, named, inTier, tier: rule.tier });
    }
  }
  const ids = review.map((r) => r.id);
  PREREQ_REVIEWED.forEach((id) => check("REVIEW list entry no longer applies — remove it", ids.includes(id), id));
  const open = review.filter((r) => !PREREQ_REVIEWED.includes(r.id));
  if (open.length) {
    say(`REVIEW — ${open.length} talent(s) combine a tier count with named prerequisites (named talents are not part of the count):`);
    open.forEach((r) => say(`  ${r.id}: tier ${r.tier} count, named [${r.named}]${r.inTier.length ? `, ${r.inTier.length} named talent(s) sit in the counted tier` : ""}`));
  } else {
    say("REVIEW — no talent combines a tier count with named prerequisites");
  }
}

/* ── Verdict ─────────────────────────────────────────────────────────── */
if (fails.length) {
  say(`\nFAIL — ${fails.length} check(s):`);
  fails.forEach((f) => say("  " + f));
  process.exit(1);
}
say("\nPASS — prerequisite fields combine with AND, the tier count is separate, and locks follow AND/OR.");
