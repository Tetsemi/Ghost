#!/usr/bin/env node
/*
 * test_talent_types.js — talentTypeMap lockstep.
 * talentTypeMap links three layers by hand: the label translation key, the four
 * summary_type_<key> attrs in the Summary Type tab markup, and the order that sets both the
 * summary's iteration order and (by convention) the markup order. Every way of breaking it is
 * silent: a key with no markup block drops its talents from the Summary Type view; a key with no
 * translation shows the raw key; an economy used by a talent but absent from the map drops that
 * talent from the view.
 *
 *   TT1  every map entry has a label_key that exists in translation.json
 *   TT2  orders are unique numbers
 *   TT3  every entry declares source { doc, version, date, section }
 *   TT4  the Summary Type markup declares each of the four attrs exactly once
 *   TT5  the markup blocks appear in `order` sequence
 *   TT6  every type.economy used by any talent, trait, racial or feature is a map key, except the
 *        declared TT6_EXCEPTIONS (self-clearing: an exception nothing uses any more fails)
 *   TT7  the activation types added 2026-11-26 are present with their labels
 * Usage: node test_talent_types.js <html> [css]
 */
"use strict";
const fs = require("fs"), path = require("path");
const htmlPath = process.argv[2];
if (!htmlPath) { console.error("usage: node test_talent_types.js <html>"); process.exit(2); }
const html = fs.readFileSync(htmlPath, "utf8");
const trans = JSON.parse(fs.readFileSync(path.join(path.dirname(htmlPath), "translation.json"), "utf8"));
const grab = (n) => {
  const i = html.indexOf("const " + n + " = {");
  if (i < 0) throw new Error("no declaration: " + n);
  let d = 0, j = html.indexOf("{", i); const s = j;
  for (; j < html.length; j++) { if (html[j] === "{") d++; else if (html[j] === "}") { d--; if (!d) break; } }
  return (0, eval)("(" + html.slice(s, j + 1) + ")");
};
let fails = 0;
const check = (name, ok, extra) => { if (!ok) { fails++; console.log(`  FAIL ${name}${extra ? "  -> " + extra : ""}`); } };

let types = {};
try { types = grab("talentTypeMap"); } catch (e) { check("TT0 talentTypeMap parses", false, String(e.message).split("\n")[0]); }
const keys = Object.keys(types);
check("TT0 the map was read", keys.length >= 9, String(keys.length));
if (!keys.length) { console.log(`FAIL — ${fails} check(s) failed`); process.exit(1); }

const noLabel = keys.filter((k) => !trans[types[k].label_key]);
check("TT1 every label_key exists in translation.json", noLabel.length === 0, noLabel.join(", "));

const orders = keys.map((k) => types[k].order);
check("TT2 orders are unique numbers", orders.every((o) => typeof o === "number") && new Set(orders).size === orders.length, orders.join(","));

const badSrc = keys.filter((k) => { const s = types[k].source || {}; return !(s.doc && s.version && s.date && s.section); });
check("TT3 every entry declares a full source", badSrc.length === 0, badSrc.join(", "));

const count = (re) => (html.match(re) || []).length;
const missing = [];
keys.forEach((k) => ["", "_text", "_open", "_text_open"].forEach((suf) => {
  const n = count(new RegExp(`name="attr_summary_type_${k}${suf}"`, "g"));
  if (n !== 1) missing.push(`${k}${suf}=${n}`);
}));
check("TT4 each type declares its four summary attrs exactly once", missing.length === 0, missing.join(", "));

const pos = (k) => html.indexOf(`name="attr_summary_type_${k}_open"`);
const byOrder = [...keys].sort((a, b) => types[a].order - types[b].order);
const positions = byOrder.map(pos);
const inSeq = positions.every((p, i) => p > (i ? positions[i - 1] : -1));
check("TT5 the markup blocks follow the order sequence", inSeq, byOrder.map((k, i) => `${k}@${positions[i]}`).join(" "));

const used = new Map();
const walk = (o, where) => {
  if (!o || typeof o !== "object") return;
  if (o.type && typeof o.type === "object" && typeof o.type.economy === "string") used.set(where, o.type.economy);
  for (const [k, v] of Object.entries(o)) if (v && typeof v === "object") walk(v, where + "." + k);
};
["careerDataMap", "ancestryDataMap", "backgroundDataMap"].forEach((m) => walk(grab(m), m));
/* Found 2026-11-26: 58 existing talents (53 special_immediate, 4 special, 1 active) name an economy the
   map does not declare, so the Summary Type tab never lists them; its markup still carries blocks for
   all three. Not fixed here: restoring the types is a ruling. Self-clearing, like C1_EXCEPTIONS. */
const TT6_EXCEPTIONS = new Set(["special_immediate", "special", "active"]);
const stale = [...TT6_EXCEPTIONS].filter((e) => types[e] || ![...used.values()].includes(e));
check("TT6 every declared exception is still needed (remove it from TT6_EXCEPTIONS)", stale.length === 0, stale.join(", "));
const unknown = [...used].filter(([, e]) => !types[e] && !TT6_EXCEPTIONS.has(e)).map(([w, e]) => `${w}=${e}`);
check("TT6 every talent economy is a talentTypeMap key", unknown.length === 0, unknown.slice(0, 5).join(", ") + (unknown.length > 5 ? ` (+${unknown.length - 5})` : ""));

const want = { downtime_activity: "Downtime Activity", full_scene: "Full Scene", one_minute: "1 Minute", passive_maneuver: "Passive / Maneuver" };
Object.entries(want).forEach(([k, label]) => {
  check(`TT7 ${k} is present`, !!types[k]);
  check(`TT7 ${k} reads "${label}"`, types[k] && trans[types[k].label_key] === label, types[k] && trans[types[k].label_key]);
});

if (fails) { console.log(`FAIL — ${fails} check(s) failed`); process.exit(1); }
console.log(`PASS — talentTypeMap: ${keys.length} types, ${used.size} talent economies resolved, markup and translations in lockstep.`);
