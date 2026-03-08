on('chat:message', function(msg) {
  if (msg.type !== 'api' || !/^!movenpc($|\s)/.test(msg.content)) return;

  // Expected: !movenpc <name...> <moveStat> [modifier]
  const args = msg.content.trim().split(/\s+/).slice(1);

  if (args.length < 2) {
    sendChat("System", "/w gm Usage: !movenpc Name MoveStat [modifier]");
    return;
  }

  // If last two args are both integers, treat them as MoveStat and modifier
  let nameArgs, moveStr, modStr;

  if (args.length >= 3 && /^-?\d+$/.test(args[args.length - 1]) && /^-?\d+$/.test(args[args.length - 2])) {
    modStr   = args[args.length - 1];
    moveStr  = args[args.length - 2];
    nameArgs = args.slice(0, -2);
  } else {
    modStr   = "0";
    moveStr  = args[args.length - 1];
    nameArgs = args.slice(0, -1);
  }

  const moveStat = parseInt(moveStr, 10);
  const modifier = parseInt(modStr, 10) || 0;

  if (isNaN(moveStat)) {
    sendChat("System", "/w gm Error: Move stat must be a number. Usage: !movenpc Name MoveStat [modifier]");
    return;
  }

  const name     = nameArgs.join(' ');
  const roll     = randomInteger(10); // 1d10
  const diceroll = Math.max(1, roll + moveStat + modifier);

  const output = `&{template:coc-dice-roll} `
    + `{{name=Initiative (Chase) - ${name}}} `
    + `{{modifier=[[${modifier}]]}} `
    + `{{diceroll=[[${diceroll}]]}}`;

  sendChat(name, output);

  let turnorder = JSON.parse(Campaign().get("turnorder") || "[]");
  const existing = turnorder.find(entry => entry.custom === name);

  if (existing) {
    existing.pr = diceroll;
  } else {
    turnorder.push({ id: "-1", pr: diceroll, custom: name });
  }

  Campaign().set("initiativepage", true);
  Campaign().set("turnorder", JSON.stringify(turnorder));
});

