const fs=require("fs");
const P_HTML=process.argv[2]||"ghost_of_arcadia.html";
const raw=fs.readFileSync(P_HTML,"utf8");
const js=raw.match(/<script type="text\/worker">([\s\S]*?)<\/script>/)[1];
const TR=JSON.parse(fs.readFileSync(P_HTML.replace(/[^/]*$/,"translation.json"),"utf8"));
let STORE={};const H={},SEC={};
Object.assign(globalThis,{on:(e,f)=>String(e).split(/\s+/).forEach(k=>(H[k]=H[k]||[]).push(f)),
 getAttrs:(ks,cb)=>{const o={};ks.forEach(k=>o[k]=STORE[k]!==undefined?STORE[k]:"");cb(o);},
 setAttrs:(o,a,b)=>{
   const changed=Object.keys(o).filter(k=>STORE[k]!==o[k]);
   Object.assign(STORE,o);
   const d=typeof a==="function"?a:b;if(d)d();
   const silent=(a&&typeof a==="object"&&a.silent);
   if(!silent) changed.forEach(k=>{
     const m=k.match(/^(repeating_[a-z]+)_(-[^_]+)_(.+)$/);
     if(!m) return;
     const ev=`change:${m[1]}:${m[3]}`;
     (H[ev]||[]).forEach(fn=>fn({sourceAttribute:k}));
   });
 },
 getSectionIDs:(s,cb)=>cb(SEC[s]||[]),getTranslationByKey:k=>TR[k]!==undefined?TR[k]:k,
 generateRowID:()=>"-n",removeRepeatingRow:()=>{}});
new Function(js+"\nregisterWeaponToggleWatchers('repeating','repeating_weaponsmdr');registerWeaponBarrelWatchers('repeating','repeating_weaponsmdr');")();
const P="repeating_weaponsmdr_-nix_";
const st=()=>`avail=${(STORE[P+"weapon_modes_available_mdr"]||"").padEnd(7)} mode=${(STORE[P+"weapon_mode_mdr"]||"").padEnd(3)} barrel=${JSON.stringify(STORE[P+"weapon_barrel_mdr"]||"")} ammo=${STORE[P+"weapon_ammo_type_mdr"]||"standard"}`;
const seed=()=>{STORE={[P+"weapon_modes_base_mdr"]:"sa bf",[P+"weapon_modes_available_mdr"]:"sa bf",
 [P+"weapon_mode_mdr"]:"bf",[P+"weapon_barrel_mdr"]:"",[P+"weapon_ammo_type_mdr"]:"standard",
 [P+"weapon_ammo_active_mdr"]:"0",[P+"weapon_cap_rating_mdr"]:"cap_4"};};
const click=(b)=>H[`clicked:repeating_weaponsmdr:weapon-${b}`][0]({sourceAttribute:P+`weapon-${b}`});

const fails=[];
const eq=(g,w,what)=>{if(g!==w)fails.push(`${what}: got "${g}" want "${w}"`);};
const av=()=>STORE[P+"weapon_modes_available_mdr"]||"";
console.log("A) suppressor FIRST, then subsonic  (your sequence)");
seed(); console.log("   start           "+st());
click("barrel-su"); console.log("   +suppressor     "+st());
click("ammo-su");   console.log("   +subsonic       "+st());
console.log("\nB) subsonic FIRST, then suppressor");
seed(); click("ammo-su");   console.log("   +subsonic       "+st());
click("barrel-su"); console.log("   +suppressor     "+st());
console.log("\nC) remove subsonic while suppressed  (BF must drop away again)");
click("ammo-su");   console.log("   -subsonic       "+st());
console.log("\nD) compensator + subsonic must NOT lift");
seed(); click("ammo-su"); click("barrel-co"); console.log("   comp+subsonic   "+st());

/* assertions */
seed(); click("barrel-su"); eq(av(),"sa","suppressor alone caps to SA");
click("ammo-su");           eq(av(),"sa bf","subsonic lifts the suppressor BF cap");
click("ammo-su");           eq(av(),"sa","removing subsonic restores the cap");
seed(); click("ammo-su"); click("barrel-su"); eq(av(),"sa bf","order independent");
seed(); click("ammo-su"); click("barrel-co"); eq(av(),"sa","compensator must NOT lift");
seed(); click("ammo-su"); click("barrel-sl"); eq(av(),"ss","silencer must NOT lift");
seed(); click("barrel-su"); click("ammo-ap"); eq(av(),"sa","non-subsonic ammo must NOT lift");
if(fails.length){console.log(`\nFAIL — ${fails.length}:`);fails.forEach(f=>console.log("   "+f));process.exit(1);}
console.log("\nPASS — subsonic lifts the suppressor BF cap, and only that.");
