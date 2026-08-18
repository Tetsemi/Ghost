#!/usr/bin/env node
/*
 * Ghost of Arcadia — money ledger recalc proof.
 *
 * `recalcMoneyLedger` writes every row's `money_running_total` and the
 * sheet-level `money_balance`. Until 2026-08-18 it was registered ONLY on
 * change:money_credit / change:money_debit / the two reporder attrs /
 * remove:repeating_moneyledger, and was never called on open — so a character
 * whose rows had not been edited since the handler shipped displayed blank
 * Total cells and a stale balance. With the Cash field retired the ledger is
 * the sole record of credits, which makes that staleness user-visible.
 *
 * Executing the whole worker is the point of the harness: `node --check`
 * parses but does not evaluate, so it cannot see an undefined identifier or a
 * temporal-dead-zone fault, and a test that calls the function itself does not
 * prove the function RUNS. The call site is asserted textually for that reason
 * — deleting the afterAllSets line must fail this test.
 *
 * Usage: node test_money_ledger.js ghost_of_arcadia.html
 */

const fs = require("fs");
const path = process.argv[2] || "ghost_of_arcadia.html";
const raw = fs.readFileSync(path, "utf8");
const js = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];

/* ── Roll20 stubs ────────────────────────────────────────────────────── */
let STORE = {};
let WRITES = {};
const HANDLERS = {};
const SECTIONS = {};

/* Push, never assign: a harness storing one handler per event name silently
   drops duplicate on() registrations, and duplication is exactly the kind of
   defect this suite exists to surface. */
const on = (ev, fn) => String(ev).split(/\s+/).forEach((e) => {
  (HANDLERS[e] = HANDLERS[e] || []).push(fn);
});
const getAttrs = (keys, cb) => {
  const out = {};
  keys.forEach((k) => { out[k] = STORE[k] !== undefined ? STORE[k] : ""; });
  cb(out);
};
const setAttrs = (obj, opt, cb) => {
  Object.assign(STORE, obj);
  Object.assign(WRITES, obj);
  const done = typeof opt === "function" ? opt : cb;
  if (typeof done === "function") done();
};
const getSectionIDs = (sec, cb) => cb(SECTIONS[sec] || []);
const getTranslationByKey = (k) => k;
const generateRowID = () => "-newrow";
const removeRepeatingRow = () => {};
Object.assign(globalThis, { on, getAttrs, setAttrs, getSectionIDs,
  getTranslationByKey, generateRowID, removeRepeatingRow });

/* ── Execute the module ──────────────────────────────────────────────── */
let mod;
try {
  mod = new Function(js + "\nreturn { recalcMoneyLedger, getSectionIDsOrdered, toNum };")();
} catch (e) {
  console.log("FAIL — worker threw at load:\n  " + e.message);
  process.exit(1);
}
console.log("module loaded and evaluated without error");

const { recalcMoneyLedger } = mod;
const fails = [];
const eq = (got, want, what) => {
  if (got !== want) fails.push(`${what}: got ${JSON.stringify(got)} want ${JSON.stringify(want)}`);
};

const P = "repeating_moneyledger_";
const seed = (rows, order) => {
  SECTIONS.moneyledger = rows.map((r) => r.id);
  STORE = {};
  if (order) STORE["_reporder_repeating_moneyledger"] = order;
  rows.forEach((r) => {
    STORE[`${P}${r.id}_money_credit`] = r.c === undefined ? "" : String(r.c);
    STORE[`${P}${r.id}_money_debit`]  = r.d === undefined ? "" : String(r.d);
  });
  WRITES = {};
};

/* ── 1. The call site exists in afterAllSets ─────────────────────────── */
/* Asserted against comment-stripped source: a literal scan matching the
   comment that explains the call would pass on a deleted call. */
const stripped = js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
if (!/afterAllSets\s*=\s*\(\)\s*=>\s*\{[\s\S]{0,6000}?recalcMoneyLedger\s*\(\s*\)\s*;/.test(stripped))
  fails.push("recalcMoneyLedger() is not called from afterAllSets — stored rows will not self-heal on open");

/* ── 2. Declaration order (TDZ guard) ────────────────────────────────── */
const declLine = (name) => {
  const i = js.indexOf("const " + name);
  return i < 0 ? Infinity : js.slice(0, i).split("\r\n").length;
};
[["getSectionIDsOrdered", "recalcMoneyLedger"],
 ["toNum", "recalcMoneyLedger"],
 ["recalcMoneyLedger", "afterAllSets"]].forEach(([src, dst]) => {
  if (declLine(src) >= declLine(dst))
    fails.push(`declaration order: ${src} (${declLine(src)}) must precede ${dst} (${declLine(dst)})`);
});

/* ── 3. Running totals accumulate, balance is the last one ───────────── */
seed([{ id: "-a", c: 20000 }, { id: "-b", d: 4500 }, { id: "-c", c: 1200 }]);
recalcMoneyLedger();
eq(WRITES[`${P}-a_money_running_total`], "20000", "row 1 running total");
eq(WRITES[`${P}-b_money_running_total`], "15500", "row 2 running total");
eq(WRITES[`${P}-c_money_running_total`], "16700", "row 3 running total");
eq(WRITES.money_balance, "16700", "balance equals final running total");

/* ── 4. A deleted middle row renumbers the rows after it ─────────────── */
seed([{ id: "-a", c: 20000 }, { id: "-c", c: 1200 }]);
recalcMoneyLedger();
eq(WRITES[`${P}-c_money_running_total`], "21200", "renumber after deletion");
eq(WRITES.money_balance, "21200", "balance after deletion");

/* ── 5. Balance is order-INDEPENDENT, running totals are not ──────────
   This is the property that made a migration row placement cosmetic rather
   than a correctness question. If it ever stops holding, the reasoning
   recorded in the retirement commit stops holding with it. */
seed([{ id: "-a", c: 20000 }, { id: "-b", d: 4500 }], "-a,-b");
recalcMoneyLedger();
const fwd = WRITES.money_balance;
seed([{ id: "-a", c: 20000 }, { id: "-b", d: 4500 }], "-b,-a");
recalcMoneyLedger();
eq(WRITES.money_balance, fwd, "balance unchanged by row order");
eq(WRITES[`${P}-b_money_running_total`], "-4500", "reordered: debit row now first");

/* ── 6. Blank, empty and malformed input ─────────────────────────────── */
seed([{ id: "-a" }, { id: "-b", c: "", d: "" }]);
recalcMoneyLedger();
eq(WRITES.money_balance, "0", "blank rows sum to zero");

seed([{ id: "-a", c: "1,500 Cr" }, { id: "-b", d: "abc" }]);
recalcMoneyLedger();
eq(WRITES.money_balance, "1500", "non-numeric text stripped, garbage reads as 0");

seed([]);
try { recalcMoneyLedger(); }
catch (e) { fails.push("threw on an empty section: " + e.message); }
eq(WRITES.money_balance, "0", "empty section writes a zero balance");

/* ── 7. The change registration still exists and is not duplicated ───── */
const ev = "change:repeating_moneyledger:money_credit";
if (!HANDLERS[ev] || !HANDLERS[ev].length) fails.push("credit change handler not registered");
else if (HANDLERS[ev].length !== 1)
  fails.push(`${HANDLERS[ev].length} handlers registered on ${ev}, expected 1`);
if (!HANDLERS["remove:repeating_moneyledger"]) fails.push("row-removal handler not registered");

/* ── 8. money_running_total has a named element in the row ───────────── */
if (!raw.includes('name="attr_money_running_total"'))
  fails.push("money_running_total has no named element — the computed total is not displayed");

/* ── report ──────────────────────────────────────────────────────────── */
if (fails.length) {
  console.log(`\nFAIL — ${fails.length} assertion(s):\n`);
  fails.forEach((f) => console.log("   " + f));
  process.exit(1);
}
console.log("\nPASS — running totals accumulate in row order, the balance is");
console.log("order-independent, blank and malformed input read as zero, and the");
console.log("recalc is called from afterAllSets so stored rows self-heal on open.");
