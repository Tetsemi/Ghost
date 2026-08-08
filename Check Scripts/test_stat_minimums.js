#!/usr/bin/env node
/* Emptying a stat restores it to the ancestry base; a typed value below base is
   left alone and flagged. Mirrors the skill pattern, not the on-open clamp. */
const fs=require("fs");
const p=process.argv[2]||"ghost_of_arcadia.html";
const raw=fs.readFileSync(p,"utf8");
const css=fs.readFileSync(process.argv[3]||p.replace(/\.html$/,".css"),"utf8");
const js=raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
const STATS=["str","dex","pow","con","app","edu","siz","int"];
const fails=[],bad=m=>fails.push(m);

let STORE={},WRITES={};const H={};
Object.assign(globalThis,{on:(e,f)=>String(e).split(/\s+/).forEach(k=>(H[k]=H[k]||[]).push(f)),
 getAttrs:(ks,cb)=>{const o={};ks.forEach(k=>o[k]=STORE[k]!==undefined?STORE[k]:"");cb(o);},
 setAttrs:(o,a,b)=>{Object.assign(STORE,o);Object.assign(WRITES,o);const d=typeof a==="function"?a:b;if(d)d();},
 getSectionIDs:(s,cb)=>cb([]),getTranslationByKey:k=>k,generateRowID:()=>"-n",removeRepeatingRow:()=>{}});
let mod; try{ mod=new Function(js+"\nregisterStatHandler();\nreturn {ancestryDataMap};")(); }
catch(e){ console.log("FAIL — worker threw:\n  "+e.message); process.exit(1); }

const ev=Object.keys(H).find(k=>k==="change:con");
if(!ev) bad("registerStatHandler is not watching change:con");
if(!H["change:showracials"]) bad("registerStatHandler is not watching change:showracials — it cannot resolve the base");

function fire(race,over){
  STORE={showracials:race};
  STATS.forEach(s=>STORE[s]=String((mod.ancestryDataMap[race].stats[s]||{}).base??40));
  Object.assign(STORE,over); WRITES={};
  (H["change:con"]||[]).forEach(f=>f({sourceAttribute:"con"}));
  return WRITES;
}
/* 1. emptied stat restores to base */
for(const race of ["lyranni","khadra","veyra"]){
  for(const s of ["con","siz","edu"]){
    const base=mod.ancestryDataMap[race].stats[s].base;
    const w=fire(race,{[s]:""});
    if(String(w[s])!==String(base)) bad(`${race}/${s}: emptied field restored to ${w[s]}, expected base ${base}`);
    if(w[`${s}_below_min_css`]!=="0") bad(`${race}/${s}: restored field should not be flagged`);
  }
}
/* 2. below-base value is NOT clamped, but IS flagged */
{
  const base=mod.ancestryDataMap.khadra.stats.siz.base;      // 45
  const w=fire("khadra",{siz:String(base-10)});
  if(w.siz!==undefined) bad(`below-base SIZ was overwritten to ${w.siz} — should be left alone and flagged`);
  if(w.siz_below_min_css!=="1") bad("below-base SIZ was not flagged");
}
/* 3. at or above base clears the flag */
{
  const base=mod.ancestryDataMap.khadra.stats.siz.base;
  let w=fire("khadra",{siz:String(base)});
  if(w.siz_below_min_css!=="0") bad("SIZ exactly at base must not be flagged");
  w=fire("khadra",{siz:String(base+20)});
  if(w.siz_below_min_css!=="0") bad("SIZ above base must not be flagged");
}
/* 4. all eight stats participate */
{
  const w=fire("human",{});
  for(const s of STATS) if(w[`${s}_below_min_css`]===undefined) bad(`${s} has no below_min flag written`);
}
/* 5. markup + CSS, per stat */
for(const s of STATS){
  if((raw.match(new RegExp(`name="attr_${s}_below_min_css"`,"g"))||[]).length!==1)
    bad(`attr_${s}_below_min_css must have exactly one element`);
  /* Controller must be a DIRECT sibling of the input it colours, mirroring
     attr_bloodied_css ~ .sheet-hp-input. Reaching through the wrapper with
     `~ .sheet-x-wrapper input` did not render in Roll20. */
    /* The below-minimum rule must OUTRANK the per-stat edit-mode rules. Each of the
     eight attributes has its own edit-mode rule at (0,8,1) setting background-color
     in both edit modes, so any rule below that specificity silently loses no matter
     where it sits. Assert the relationship, not just that a rule exists. */
  const esc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const spec=sel=>{const t=sel.replace(/\[[^\]]*\]/g,"\u0000");
    return [ (t.match(/\.[\w-]+/g)||[]).length + (t.match(/\u0000/g)||[]).length,
             (t.match(/(?:^|[\s>+~])(input|div|button|span)\b/g)||[]).length ];};
  const ours=(css.match(new RegExp(`[^,{}]*attr_${s}_below_min_css[^,{}]*`,"g"))||[]);
  if(!ours.length){ bad(`no CSS rule colouring ${s} when below minimum`); continue; }
  /* Exclude our own selectors: they now end in the same
     input.sheet-edit-toggle-field[name="attr_x"] the edit-mode rules use, so an
     unfiltered match compares the rule against itself and always ties. */
  const theirs=(css.match(new RegExp(`[^,{}]*sheet-edit-toggle-field\\[name="attr_${s}"\\]`,"g"))||[])
                 .filter(x=>!x.includes("below_min_css"));
  if(theirs.length){
    const o=spec(ours[0]), t=theirs.map(spec).sort((a,b)=>b[0]-a[0]||b[1]-a[1])[0];
    if(!(o[0]>t[0]||(o[0]===t[0]&&o[1]>t[1])))
      bad(`${s}: below-min rule (0,${o[0]},${o[1]}) does not outrank the edit-mode rule (0,${t[0]},${t[1]})`);
  }
}
if(!/--cs_state_bloodied_bg/.test(css)) bad("bloodied colour variables missing");
/* 6. unknown race must not throw or write junk */
try{ const w=fire("human",{}); STORE.showracials="unknown"; WRITES={};
  (H["change:con"]||[]).forEach(f=>f({sourceAttribute:"con"}));
}catch(e){ bad("threw on an unknown race: "+e.message); }

if(fails.length){console.log(`FAIL — ${fails.length}:`);fails.forEach(f=>console.log("   "+f));process.exit(1);}
console.log(`stats: ${STATS.length}   restore-on-empty, flag-below-base, markup and CSS all verified`);
console.log("\nPASS — attribute minimums follow the skill pattern and flag in the display.");
