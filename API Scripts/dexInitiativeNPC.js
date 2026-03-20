on('chat:message', function(msg) {
  if (msg.type !== 'api' || !/^!initdexnpc($|\s)/.test(msg.content)) return;

  // Expected: !initdexnpc <name...> <dex> <modifier>
  const args = msg.content.trim().split(/\s+/).slice(1);

  if (args.length < 2) {
    sendChat("System", "/w gm Usage: !initdexnpc Name DEX [modifier]");
    return;
  }

  // Last arg is optional modifier (may be signed: -10, 0, 10, 20)
  // Second-to-last is DEX. Everything before is the name.
  let nameArgs, dexStr, modStr;

  // If last two args are both integers, treat them as DEX and modifier
  if (args.length >= 3 && /^-?\d+$/.test(args[args.length - 1]) && /^-?\d+$/.test(args[args.length - 2])) {
    modStr   = args[args.length - 1];
    dexStr   = args[args.length - 2];
    nameArgs = args.slice(0, -2);
  } else {
    modStr   = "0";
    dexStr   = args[args.length - 1];
    nameArgs = args.slice(0, -1);
  }

  const dex      = parseInt(dexStr, 10);
  const modifier = parseInt(modStr, 10) || 0;

  if (isNaN(dex)) {
    sendChat("System", "/w gm Error: DEX must be a number. Usage: !initdexnpc Name DEX [modifier]");
    return;
  }

  const name         = nameArgs.join(' ');
  const effectiveDex = Math.max(1, dex + modifier);
  const roll         = randomInteger(100);
  let tier           = 'Fail';
  let init           = 0;

  const extreme = Math.max(1, Math.floor(effectiveDex / 5));
  const hard    = Math.max(1, Math.floor(effectiveDex / 2));
  const success = effectiveDex;

  if (roll === 1)           { tier = 'Critical'; init = 4000 + effectiveDex; }
  else if (roll <= extreme) { tier = 'Extreme';  init = 3000 + effectiveDex; }
  else if (roll <= hard)    { tier = 'Hard';     init = 2000 + effectiveDex; }
  else if (roll <= success) { tier = 'Normal';   init = 1000 + effectiveDex; }
  else if ((effectiveDex < 50 && roll >= 96) || (effectiveDex >= 50 && roll === 100)) { tier = 'Fumble';   init = 0; }
  else						{ tier = 'Fail'; 	 init = effectiveDex; }
  
  if (init <= 0) init = 0;

  const output = `&{template:coc-1} `
    + `{{name=Initiative (Combat) - ${name}}} `
    + `{{modifier=[[${modifier}]]}} `
    + `{{success=[[${success}]]}} `
    + `{{hard=[[${hard}]]}} `
    + `{{extreme=[[${extreme}]]}} `
    + `{{roll1=[[${roll}]]}}`;

  sendChat(name, output);

  let turnorder = JSON.parse(Campaign().get("turnorder") || "[]");
  const existing = turnorder.find(entry => entry.custom === name);

  if (existing) {
    existing.pr = init;
  } else {
    turnorder.push({ id: "-1", pr: init, custom: name });
  }

  Campaign().set("initiativepage", true);
  Campaign().set("turnorder", JSON.stringify(turnorder));
});
