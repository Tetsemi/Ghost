#!/usr/bin/env node
/* Core Rules Step 9: two Perks/Flaws combined; Flaws grant max +10 XP; a Flaw
   taken after character creation grants no XP and removing one never refunds. */
const fs=require("fs");
const p=process.argv[2]||"ghost_of_arcadia.html";
const raw=fs.readFileSync(p,"utf8");
const css=fs.readFileSync(process.argv[3]||p.replace(/\.html$/,".css"),"utf8");
const js=raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
const fails=[],bad=m=>fails.push(m);
let STORE={},WRITES={};const H={};
Object.assign(globalThis,{on:(e,f)=>String(e).split(/\s+/).forEach(k=>(H[k]=H[k]||[]).push(f)),
 getAttrs:(ks,cb)=>{const o={};ks.forEach(k=>o[k]=STORE[k]!==undefined?STORE[k]:"");cb(o);},
 setAttrs:(o,a,b)=>{Object.assign(STORE,o);Object.assign(WRITES,o);const d=typeof a==="function"?a:b;if(d)d();},
 getSectionIDs:(s,cb)=>cb([]),getTranslationByKey:k=>k,generateRowID:()=>"-n",removeRepeatingRow:()=>{}});
let mod; try{ mod=new Function(js+"\nregisterPerkSummaryWatcher();registerFlawSummaryWatcher();\nreturn {flawDataMap,perkDataMap};")(); }
catch(e){ console.log("FAIL — worker threw:\n  "+e.message); process.exit(1); }
const F=mod.flawDataMap,P=mod.perkDataMap;
const five=Object.keys(F).filter(k=>F[k].cost===5), ten=Object.keys(F).filter(k=>F[k].cost===10);
const flawEv=Object.keys(H).find(k=>/^change:flaw_/.test(k));
if(!flawEv) bad("no flaw watcher registered");
const fire=(ev,store)=>{STORE={...store};WRITES={};(H[ev]||[]).forEach(f=>f({}));return WRITES;};

/* 1. flaw XP caps at 10 */
{
  let w=fire(flawEv,{[`flaw_${ten[0]}`]:"1"});
  if(w.xpledger_flaws_gain!=="10") bad(`one 10-XP flaw should give 10, got ${w.xpledger_flaws_gain}`);
  if(w[`flaw_${five[0]}_lockflag`]!=="1") bad("with 10 XP taken, a 5-XP flaw must lock out (would exceed +10)");
  w=fire(flawEv,{[`flaw_${five[0]}`]:"1"});
  if(w.xpledger_flaws_gain!=="5") bad(`one 5-XP flaw should give 5, got ${w.xpledger_flaws_gain}`);
  if(five.length>1 && w[`flaw_${five[1]}_lockflag`]!=="0") bad("a second 5-XP flaw should still be available (5+5=10)");
  if(w[`flaw_${ten[0]}_lockflag`]!=="1") bad("with 5 XP taken, a 10-XP flaw must lock out (would be 15)");
}
/* 2. a chosen flaw is never locked, or it could not be un-chosen */
{
  const w=fire(flawEv,{[`flaw_${ten[0]}`]:"1"});
  if(w[`flaw_${ten[0]}_lockflag`]!=="0") bad("a selected flaw must never be locked");
}
/* 3. two selections combined, counting perks */
{
  const w=fire(flawEv,{[`flaw_${five[0]}`]:"1",perk_selected_count:"1"});
  if(w.flaw_slots_full!=="1") bad("1 perk + 1 flaw should fill the two-selection limit");
  if(five.length>1 && w[`flaw_${five[1]}_lockflag`]!=="1") bad("with 2 selections taken, further flaws must lock");
}
/* 4. XP freezes at the character creation lock */
{
  let w=fire(flawEv,{[`flaw_${ten[0]}`]:"1",char_creation_lock:"1",xpledger_flaws_gain:"10"});
  if(w.xpledger_flaws_gain!==undefined) bad("flaw XP must not be rewritten once creation is locked");
  w=fire(flawEv,{char_creation_lock:"1",xpledger_flaws_gain:"10"});
  if(w.xpledger_flaws_gain!==undefined) bad("removing a flaw after the lock must not refund XP");
  w=fire(flawEv,{[`flaw_${ten[0]}`]:"1",char_creation_lock:"0"});
  if(w.xpledger_flaws_gain!=="10") bad("before the lock the total must track selections live");
}
/* 4b. after the creation lock, NEITHER cap gates a new flaw */
{
  /* one 5-XP flaw already taken in play, creation locked: everything stays open */
  let w=fire(flawEv,{[`flaw_${five[0]}`]:"1",char_creation_lock:"1",xpledger_flaws_gain:"10"});
  for(const k of Object.keys(F))
    if(w[`flaw_${k}_lockflag`]!=="0")
      { bad(`after the creation lock, flaw ${k} must not be locked (caps are creation-only)`); break; }
  /* two selections already made and locked: still open */
  w=fire(flawEv,{[`flaw_${five[0]}`]:"1",perk_selected_count:"1",char_creation_lock:"1"});
  if(w.flaw_slots_full!=="0") bad("the two-selection limit must not apply after the creation lock");
  if(w[`flaw_${ten[0]}_lockflag`]!=="0") bad("a 10-XP flaw must be selectable in play regardless of prior XP");
  /* and the caps DO still apply before the lock */
  w=fire(flawEv,{[`flaw_${five[0]}`]:"1",char_creation_lock:"0"});
  if(w[`flaw_${ten[0]}_lockflag`]!=="1") bad("before the lock, a 10-XP flaw must still lock out at 5 XP taken");
}
/* 4c. the lock itself must retrigger the watcher */
if(!/change:char_creation_lock/.test(js)) bad("watchers do not fire on char_creation_lock — flags would stay stale");

/* 5. the perk watcher publishes its count and honours the combined limit */
{
  const perkEv=Object.keys(H).find(k=>/^change:perk_/.test(k));
  if(!perkEv) bad("no perk watcher registered");
  else{
    const pk=Object.keys(P);
    let w=fire(perkEv,{[`perk_${pk[0]}`]:"1"});
    if(w.perk_selected_count!=="1") bad(`perk_selected_count should be 1, got ${w.perk_selected_count}`);
    w=fire(perkEv,{[`perk_${pk[0]}`]:"1",flaw_selected_count:"1"});
    if(w.perk_slots_full!=="1") bad("1 perk + 1 flaw should fill the two-selection limit on the perk side");
    if(w[`perk_${pk[1]}_lockflag`]!=="1") bad("with 2 selections taken, further perks must lock");
  }
}
/* 6. markup + CSS the locks depend on */
{
  const fl=(raw.match(/name="attr_flaw_\w+_lockflag"/g)||[]).length;
  const pl=(raw.match(/name="attr_perk_\w+_lockflag"/g)||[]).length;
  if(fl!==Object.keys(F).length) bad(`flaw lockflag elements ${fl} != ${Object.keys(F).length} flaws`);
  if(pl!==Object.keys(P).length) bad(`perk lockflag elements ${pl} != ${Object.keys(P).length} perks`);
  if(!/\[name\$="_lockflag"\]\[value="1"\][^{]*sheet-talent-checkbox/.test(css))
    bad("the generic lockflag CSS rule is missing — locks would not render");
  /* Flaws tab must survive the creation lock; Perks must not. */
  const lockRule=css.slice(css.indexOf("attr_char_creation_lock"));
  const upTo=lockRule.slice(0,lockRule.indexOf("}"));
  if(!/act_perks/.test(upTo)) bad("the creation lock no longer hides the Perks tab");
  if(/act_flaws/.test(upTo)) bad("the creation lock still hides the Flaws tab — Flaws are acquirable in play");
}
if(fails.length){console.log(`FAIL — ${fails.length}:`);fails.forEach(f=>console.log("   "+f));process.exit(1);}
console.log(`flaws: ${Object.keys(F).length}   perks: ${Object.keys(P).length}   5XP: ${five.length}   10XP: ${ten.length}`);
console.log("\nPASS — selection limit, flaw XP cap and creation-lock freeze all hold.");
