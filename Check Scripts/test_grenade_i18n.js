#!/usr/bin/env node
/* Grenade display strings must resolve through tr(), not be hardcoded. */
const fs=require("fs");
const p=process.argv[2]||"ghost_of_arcadia.html";
const raw=fs.readFileSync(p,"utf8");
const js=raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
const TR=JSON.parse(fs.readFileSync(p.replace(/[^/]*$/,"translation.json"),"utf8"));
const fails=[]; const bad=m=>fails.push(m);

/* Declared above both consumers: a const used before its declaration is a
   temporal-dead-zone ReferenceError, which parsing cannot see. */
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g,"").replace(/^\s*\/\/.*$/gm,"");
const FNS=["grenadeZoneDisplay","buildGrenadeTagsStr","buildGrenadeEffectStr",
           "buildGrenadeConditionStr","buildGrenadeSaveFailStr","buildGrenadeSavePassStr",
           "buildGrenadeDeliveryNote"];
function body(name){
  const i=js.indexOf("function "+name); if(i<0){bad(name+" not found");return "";}
  let d=0,seen=false;
  for(let j=i;j<js.length;j++){ if(js[j]==="{"){d++;seen=true;} else if(js[j]==="}"){d--;if(seen&&d===0)return js.slice(i,j+1);} }
  return "";
}
/* 1. every tr() key resolves */
let checked=0;
for(const f of FNS){
  const b=body(f);
  if(b && !/const tr = /.test(b)) bad(`${f}: uses no local tr — tr is function-scoped`);
  for(const m of strip(b).matchAll(/tr\("([^"]+)"\)/g)){
    checked++;
    if(TR[m[1]]===undefined) bad(`${f}: tr("${m[1]}") has no translation key`);
  }
}
/* 2. no display-looking literals left. Scanned against comment-stripped source:
   the comment explaining what this replaced quotes the old string, and matched
   itself. Third recurrence of that trap in one session. */
/* Punctuation, separators and dice
   fragments are not display strings. */
const ALLOW=new Set(["","—"," ","+ "," — ","  •  "," / "," + ","m32","demolitions","throw",
  "firearms_rifle","placed_charge","mine","structural","none","engaged","short","medium",
  "@{throw_mdr}","@{firearms_rifle_mdr}","@{demolitions_mdr}","function","label"]);
for(const f of FNS){
  for(const m of strip(body(f)).matchAll(/"([^"]*)"/g)){
    const s=m[1];
    if(ALLOW.has(s)) continue;
    if(/-u$/.test(s)) continue;                 // a translation key
    if(/^[a-z_]+$/.test(s)) continue;           // a data key
    if(/[A-Z]|\s/.test(s)) bad(`${f}: hardcoded display string ${JSON.stringify(s)}`);
  }
}
/* 3. The FAIL cell must report the FAILURE outcome. save_halves_damage
   describes what a PASS does, so checking it first made both cells read
   "half dmg" and swallowed incendiary's condition_on_fail entirely. */
{
  const TRs = JSON.parse(fs.readFileSync(p.replace(/[^/]*$/,"translation.json"),"utf8"));
  Object.assign(globalThis,{on:()=>{},getAttrs:(k,c)=>c({}),setAttrs:()=>{},
    getSectionIDs:(s,c)=>c([]),generateRowID:()=>"-n",removeRepeatingRow:()=>{},
    getTranslationByKey:k=>TRs[k]!==undefined?TRs[k]:k});
  let mod;
  try { mod=new Function(js+"\nreturn {explosivesDataMap,conditionsDataMap,buildGrenadeSaveFailStr,buildGrenadeSavePassStr};")(); }
  catch(e){ bad("worker threw at load: "+e.message); }
  if(mod) for(const k of Object.keys(mod.explosivesDataMap)){
    const e=mod.explosivesDataMap[k]; if(!e.save_stat) continue;
    const f=mod.buildGrenadeSaveFailStr(e), pa=mod.buildGrenadeSavePassStr(e);
    if(f===pa) bad(`${k}: FAIL and PASS cells are identical ("${f}")`);
    if(e.save_halves_damage && !/full/.test(f)) bad(`${k}: halves-damage FAIL must report full damage, got "${f}"`);
    if(e.save_halves_damage && !/half/.test(pa)) bad(`${k}: halves-damage PASS must report half damage, got "${pa}"`);
    /* The cell shows the RESOLVED condition name, not the stored key, so
       resolve the expectation the same way rather than matching raw snake_case. */
    if(e.condition_on_fail){
      const c=mod.conditionsDataMap[e.condition_on_fail];
      const want=c&&c.name_key?(TRs[c.name_key]||c.name_key):e.condition_on_fail;
      if(!f.includes(want))
        bad(`${k}: condition_on_fail "${e.condition_on_fail}" (resolves to "${want}") missing from the FAIL cell ("${f}")`);
      if(c&&c.name_key&&f.includes(e.condition_on_fail)&&want!==e.condition_on_fail)
        bad(`${k}: FAIL cell shows the raw key "${e.condition_on_fail}" instead of "${want}"`);
    }
  }
}

/* 4. the specific regression that started this */
if(/tags\.push\("Needs detonator"\)/.test(js)) bad('"Needs detonator" is still hardcoded');

console.log(`functions: ${FNS.length}   tr() keys checked: ${checked}`);
if(fails.length){console.log(`\nFAIL — ${fails.length}:\n`);fails.forEach(f=>console.log("   "+f));process.exit(1);}
console.log("\nPASS — every grenade display string resolves through tr().");
