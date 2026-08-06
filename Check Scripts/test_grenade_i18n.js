#!/usr/bin/env node
/* Grenade display strings must resolve through tr(), not be hardcoded. */
const fs=require("fs");
const p=process.argv[2]||"ghost_of_arcadia.html";
const raw=fs.readFileSync(p,"utf8");
const js=raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
const TR=JSON.parse(fs.readFileSync(p.replace(/[^/]*$/,"translation.json"),"utf8"));
const fails=[]; const bad=m=>fails.push(m);

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
  for(const m of b.matchAll(/tr\("([^"]+)"\)/g)){
    checked++;
    if(TR[m[1]]===undefined) bad(`${f}: tr("${m[1]}") has no translation key`);
  }
}
/* 2. no display-looking literals left. Punctuation, separators and dice
   fragments are not display strings. */
const ALLOW=new Set(["","—"," ","+ "," — ","  •  "," / ","m32","demolitions","throw",
  "firearms_rifle","placed_charge","mine","structural","none","engaged","short","medium",
  "@{throw_mdr}","@{firearms_rifle_mdr}","@{demolitions_mdr}","function","label"]);
for(const f of FNS){
  for(const m of body(f).matchAll(/"([^"]*)"/g)){
    const s=m[1];
    if(ALLOW.has(s)) continue;
    if(/-u$/.test(s)) continue;                 // a translation key
    if(/^[a-z_]+$/.test(s)) continue;           // a data key
    if(/[A-Z]|\s/.test(s)) bad(`${f}: hardcoded display string ${JSON.stringify(s)}`);
  }
}
/* 3. the specific regression that started this */
if(/tags\.push\("Needs detonator"\)/.test(js)) bad('"Needs detonator" is still hardcoded');

console.log(`functions: ${FNS.length}   tr() keys checked: ${checked}`);
if(fails.length){console.log(`\nFAIL — ${fails.length}:\n`);fails.forEach(f=>console.log("   "+f));process.exit(1);}
console.log("\nPASS — every grenade display string resolves through tr().");
