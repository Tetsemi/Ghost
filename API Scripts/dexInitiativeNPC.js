on('chat:message', function(msg) {
  if (msg.type !== 'api' || !/^!initdexnpc($|\s)/.test(msg.content)) return;

  const args = msg.content.trim().split(/\s+/).slice(1); // remove "!initdexnpc"

  if (args.length < 2) {
    sendChat("System", "/w gm Usage: !initdexnpc Name DEX");
    return;
  }

  const dex = parseInt(args[args.length - 1], 10);
  if (isNaN(dex)) {
    sendChat("System", "/w gm Error: DEX must be a number. Usage: !initdexnpc Name DEX");
    return;
  }

  const name = args.slice(0, -1).join(' ');
  const roll = randomInteger(100);
  let tier = 'Fail';
  let init = dex;

  if (roll === 1)       { tier = 'Critical'; init = 4000 + dex; }
  else if (roll <= dex / 5)  { tier = 'Extreme'; init = 3000 + dex; }
  else if (roll <= dex / 2)  { tier = 'Hard';    init = 2000 + dex; }
  else if (roll <= dex)      { tier = 'Normal';  init = 1000 + dex; }
  else if (roll >= 96)       { tier = 'Fumble';  init = 0; }
  
  if (init <= 0) init = 0.1;
  
  const output = `&{template:default} `
    + `{{name=Initiative (Combat) - ${name}}} `
    + `{{Roll=${roll}}} `
    + `{{Tier=${tier}}} `
    + `{{Result=${init}}}`;
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
