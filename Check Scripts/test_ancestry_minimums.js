#!/usr/bin/env node
/* SIZ/INT/EDU ancestry minimums must match the Core Rules, and stats[x].base
   must remain the value applyRacialBaseStats clamps to. */
const fs=require("fs");
const p=process.argv[2]||"ghost_of_arcadia.html";
const js=fs.readFileSync(p,"utf8").match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
Object.assign(globalThis,{on:()=>{},getAttrs:(k,c)=>c({}),setAttrs:()=>{},getSectionIDs:(s,c)=>c([]),
 generateRowID:()=>"-n",removeRepeatingRow:()=>{},getTranslationByKey:k=>k});
let mod; try{ mod=new Function(js+"\nreturn {ancestryDataMap};")(); }
catch(e){ console.log("FAIL — worker threw:\n  "+e.message); process.exit(1); }
const fails=[];
/* Core Rules Step 2 / Step 6: SIZ 35 default, Veyra 25, Khadra 45. */
const SIZ={alteri:35,draevi:35,feran:35,human:35,khadra:45,kitsu:35,lyranni:35,veyra:25};
const A=mod.ancestryDataMap;
const names=Object.keys(A);
if(names.length!==8) fails.push(`expected 8 ancestries, found ${names.length}`);
for(const [n,want] of Object.entries(SIZ)){
  const got=A[n]&&A[n].stats&&A[n].stats.siz&&A[n].stats.siz.base;
  if(got!==want) fails.push(`${n}: siz.base is ${got}, Core Rules minimum is ${want}`);
}
/* base is the enforced floor — applyRacialBaseStats raises anything below it. */
if(!/current < racialBase/.test(js))
  fails.push("applyRacialBaseStats no longer clamps to stats[x].base — `base` may have stopped meaning `minimum`");
/* Core Rules Step 6 also states hard minimums of EDU 40 and INT 40. */
for(const n of names){
  const i=A[n].stats&&A[n].stats.int&&A[n].stats.int.base;
  if(i!==40) fails.push(`${n}: int.base is ${i}, Core Rules minimum is 40`);
  const e=A[n].stats&&A[n].stats.edu&&A[n].stats.edu.base;
  if(e!==40) fails.push(`${n}: edu.base is ${e}, Core Rules minimum is 40`);
}
/* Ancestry maxima are deliberate design (60-85 with per-ancestry variation), not
   a flat cap. Assert they exist and are sane so a stray edit is caught. */
for(const n of names){
  for(const st of ["str","dex","pow","con","app","edu","siz","int"]){
    const mx=A[n].stats&&A[n].stats[st]&&A[n].stats[st].max;
    const bs=A[n].stats&&A[n].stats[st]&&A[n].stats[st].base;
    if(typeof mx!=="number") fails.push(`${n}.${st}: no numeric max`);
    else if(mx<bs) fails.push(`${n}.${st}: max ${mx} is below base ${bs}`);
  }
}
if(fails.length){console.log(`FAIL — ${fails.length}:`);fails.forEach(f=>console.log("   "+f));process.exit(1);}
console.log(`ancestries: ${names.length}   SIZ/EDU/INT minimums verified against the Core Rules; maxima sane`);
console.log("\nPASS — ancestry attribute minimums match the document.");
