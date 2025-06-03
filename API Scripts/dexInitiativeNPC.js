on('chat:message', function(msg) {
  if (msg.type !== 'api' || !msg.content.startsWith('!initdexnpc')) return;

  const args = msg.content.split(' ');
  const name = args[1] || "Unnamed";
  const dex = parseInt(args[2], 10) || 0;

  const roll = randomInteger(100);
  let tier = 'Fail';
  let init = dex;

  if (roll === 1)       { tier = 'Critical'; init = 4000 + dex; }
  else if (roll <= dex / 5)  { tier = 'Extreme'; init = 3000 + dex; }
  else if (roll <= dex / 2)  { tier = 'Hard';    init = 2000 + dex; }
  else if (roll <= dex)      { tier = 'Normal';  init = 1000 + dex; }
  else if (roll >= 96)       { tier = 'Fumble';  init = 0; }

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
