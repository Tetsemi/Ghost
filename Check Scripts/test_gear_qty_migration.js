#!/usr/bin/env node
/*
 * Ghost of Arcadia — static gear-row quantity attrs.
 *
 * Each of twelve gear tables has two static preset rows. Both once declared
 * attr_<x>_qty, so typing a quantity in one changed the other (found by D2,
 * 2026-10-15). They are now <x>1_qty and <x>2_qty, and migrateSharedGearQty
 * carries a stored shared value across. Asserted here:
 *
 *   1. HTML: per table, <x>1_qty and <x>2_qty are each declared once at the top
 *      level, and the old <x>_qty appears only inside the repeating rows;
 *   2. the migration copies a stored shared value into both new attrs, resets
 *      the old attr, and is idempotent (a second run writes nothing);
 *   3. it never overwrites a quantity already set on a new attr, never copies
 *      the default "1", and treats an empty store as nothing to do;
 *   4. it is called from afterAllSets (comment-stripped source).
 *
 * Executes the worker. Usage: node test_gear_qty_migration.js ghost_of_arcadia.html
 */
const fs = require("fs");
const raw = fs.readFileSync(process.argv[2] || "ghost_of_arcadia.html", "utf8");
const js = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
const strip = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const fails = [], bad = (m) => fails.push(m);
const TABLES = ["arcanesupply", "bots", "bypass", "clothing", "comms", "disguise",
  "drones", "entertainment", "omnidevice", "survival", "surveillance", "utility"];

/* 1. HTML */
const html = raw.slice(0, raw.indexOf('<script type="text/worker">'));
let depth = 0, top = "", inside = "";
html.split(/(<fieldset\b|<\/fieldset>)/).forEach((t) => {
  if (t.startsWith("<fieldset")) depth++;
  else if (t === "</fieldset>") depth = Math.max(0, depth - 1);
  else if (depth === 0) top += t; else inside += t;
});
const count = (s, a) => (s.match(new RegExp(`name="attr_${a}"`, "g")) || []).length;
for (const t of TABLES) {
  for (const n of [1, 2]) if (count(top, `${t}${n}_qty`) !== 1) bad(`${t}${n}_qty declared ${count(top, `${t}${n}_qty`)} times at top level (expected 1)`);
  if (count(top, `${t}_qty`) !== 0) bad(`${t}_qty is still declared at top level; the static rows would share it again`);
  if (count(inside, `${t}_qty`) !== 2) bad(`${t}_qty expected twice inside the repeating rows, found ${count(inside, `${t}_qty`)}`);
}

/* 4. call site */
if (!/afterAllSets\s*=\s*\(\)\s*=>\s*\{[\s\S]{0,4000}?migrateSharedGearQty\s*\(\s*\)\s*;/.test(strip(js)))
  bad("migrateSharedGearQty() is not called from afterAllSets");

/* 2-3. Execution */
let STORE = {}, WRITES = [];
const getAttrs = (k, cb) => { const o = {}; k.forEach((x) => (o[x] = STORE[x] !== undefined ? STORE[x] : "")); cb(o); };
const setAttrs = (o, opt, cb) => { WRITES.push(Object.assign({}, o)); Object.assign(STORE, o); const d = typeof opt === "function" ? opt : cb; if (typeof d === "function") d(); };
Object.assign(globalThis, { on: () => {}, getAttrs, setAttrs, getSectionIDs: (s, cb) => cb([]), getTranslationByKey: (k) => k, generateRowID: () => "-r", removeRepeatingRow: () => {} });
const realLog = console.log; console.log = () => {};
let mig;
try { mig = new Function(js + "\nreturn migrateSharedGearQty;")(); }
catch (e) { console.log = realLog; console.log("FAIL - the worker threw while loading: " + e.message); process.exit(1); }
const run = (seed) => { STORE = Object.assign({}, seed); WRITES = []; mig(); return WRITES; };

let w = run({});
if (w.length) bad("empty store: expected no writes, got " + JSON.stringify(w));
w = run({ clothing_qty: "1", bots_qty: "" });
if (w.length) bad('default "1" / empty: expected no writes, got ' + JSON.stringify(w));

w = run({ clothing_qty: "3", drones_qty: "0" });
for (const [t, v] of [["clothing", "3"], ["drones", "0"]]) {
  if (STORE[`${t}1_qty`] !== v || STORE[`${t}2_qty`] !== v) bad(`${t}: both rows should hold ${v}, got ${STORE[`${t}1_qty`]} / ${STORE[`${t}2_qty`]}`);
  if (STORE[`${t}_qty`] !== "1") bad(`${t}: old attr should be reset to "1", got ${STORE[`${t}_qty`]}`);
}
if (STORE.bots1_qty !== undefined) bad("an untouched table was written");
const snap = JSON.stringify(STORE);
WRITES = []; mig();
if (WRITES.length || JSON.stringify(STORE) !== snap) bad("second run is not idempotent: " + JSON.stringify(WRITES));

run({ comms_qty: "5", comms1_qty: "9" });
if (STORE.comms1_qty !== "9") bad("a quantity already set on comms1_qty was overwritten");
if (STORE.comms2_qty !== "5") bad("comms2_qty should receive the shared value, got " + STORE.comms2_qty);

console.log = realLog;
if (fails.length) { console.log(`FAIL - ${fails.length}:`); fails.forEach((f) => console.log("   " + f)); process.exit(1); }
console.log("PASS - twelve tables have per-row qty attrs, the migration copies once, never overwrites, and runs on open.");
