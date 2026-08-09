#!/usr/bin/env node
/* Executes the whole worker (node --check cannot see TDZ or undefined refs),
   then drives reconcileAmmoTypes against seeded stores. */
const fs = require("fs");
const raw = fs.readFileSync(process.argv[2] || "ghost_of_arcadia.html", "utf8");
const js  = raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];

let STORE = {}, WRITES = {};
const SECTIONS = {}, HANDLERS = {};
Object.assign(globalThis, {
  on: (e, f) => String(e).split(/\s+/).forEach(k => (HANDLERS[k] = HANDLERS[k] || []).push(f)),
  getAttrs: (ks, cb) => { const o = {}; ks.forEach(k => o[k] = STORE[k] !== undefined ? STORE[k] : ""); cb(o); },
  setAttrs: (o, a, b) => { Object.assign(STORE, o); Object.assign(WRITES, o);
                           const d = typeof a === "function" ? a : b; if (d) d(); },
  getSectionIDs: (s, cb) => cb(SECTIONS[s] || []),
  getTranslationByKey: k => k, generateRowID: () => "-new", removeRepeatingRow: () => {},
});

let mod;
try {
  mod = new Function(js + "\nreturn { reconcileAmmoTypes, retiredAmmoKeyMap, ammoTypeSections, weaponToggleFamilies, ammoDataMap };")();
} catch (e) { console.log("FAIL — worker threw at load:\n  " + e.message); process.exit(1); }
console.log("module loaded and evaluated without error");

const fails = [];
const eq = (g, w, what) => { if (g !== w) fails.push(`${what}: got ${JSON.stringify(g)} want ${JSON.stringify(w)}`); };

/* 1. Button values are now exactly the map's keys. */
const btnVals = Object.values(mod.weaponToggleFamilies.ammo.btns).sort();
const mapKeys = Object.keys(mod.ammoDataMap).sort();
eq(JSON.stringify(btnVals), JSON.stringify(mapKeys), "btn values == ammoDataMap keys");

/* 2. Every retired key resolves to a real map entry. */
Object.entries(mod.retiredAmmoKeyMap).forEach(([o, n]) => {
  if (!mod.ammoDataMap[n]) fails.push(`retiredAmmoKeyMap ${o} -> ${n} is not an ammoDataMap key`);
  if (mod.ammoDataMap[o]) fails.push(`retiredAmmoKeyMap key ${o} still exists in ammoDataMap`);
});

/* 2b. It must actually be CALLED on open. Removing the afterAllSets call
   previously left this whole test green, because the test invokes the function
   directly — a test that only proves the function works, not that it runs. */
if (!/afterAllSets[\s\S]{0,4000}?reconcileAmmoTypes\s*\(\s*\)\s*;/.test(js))
  fails.push("reconcileAmmoTypes is not called from afterAllSets — stored rows never migrate");

/* 3. Reconcile across all three scopes. */
SECTIONS["repeating_weaponsmdr"]   = ["-r1", "-r2"];
SECTIONS["repeating_weaponmanual"] = ["-m1"];
STORE = {
  weapon1_mdr_ammo_type: "subsonic",                              // stale
  "repeating_weaponsmdr_-r1_weapon_ammo_type_mdr": "veil_charged", // stale
  "repeating_weaponsmdr_-r2_weapon_ammo_type_mdr": "ap_rounds",    // already correct
  "repeating_weaponmanual_-m1_weapon_ammo_type_mdr": "shock",      // stale
};
WRITES = {};
mod.reconcileAmmoTypes();
eq(STORE.weapon1_mdr_ammo_type, "subsonic_rounds", "weapon1 migrated");
eq(STORE["repeating_weaponsmdr_-r1_weapon_ammo_type_mdr"], "veil_charged_rounds", "weaponsmdr migrated");
eq(STORE["repeating_weaponmanual_-m1_weapon_ammo_type_mdr"], "shock_rounds", "weaponmanual migrated");
eq(WRITES["repeating_weaponsmdr_-r2_weapon_ammo_type_mdr"], undefined, "already-correct row not rewritten");

/* 4. Idempotent — a second pass must write nothing. */
WRITES = {};
mod.reconcileAmmoTypes();
eq(Object.keys(WRITES).length, 0, "second pass is a no-op");

/* 5. Unknown / empty values are left alone, never cleared. */
STORE = { weapon1_mdr_ammo_type: "standard",
          "repeating_weaponsmdr_-r1_weapon_ammo_type_mdr": "" ,
          "repeating_weaponsmdr_-r2_weapon_ammo_type_mdr": "mystery_ammo" };
SECTIONS["repeating_weaponmanual"] = [];
WRITES = {};
mod.reconcileAmmoTypes();
eq(Object.keys(WRITES).length, 0, "unknown/empty values untouched");
eq(STORE["repeating_weaponsmdr_-r2_weapon_ammo_type_mdr"], "mystery_ammo", "unresolvable value not cleared");

/* 6. Empty sections must not throw. */
SECTIONS["repeating_weaponsmdr"] = []; SECTIONS["repeating_weaponmanual"] = [];
STORE = {};
try { mod.reconcileAmmoTypes(); } catch (e) { fails.push("threw on empty sections: " + e.message); }

if (fails.length) { console.log(`\nFAIL — ${fails.length}:\n`); fails.forEach(f => console.log("   " + f)); process.exit(1); }
console.log("\nPASS — key space migrated, reconciler idempotent, non-destructive, all three scopes.");
