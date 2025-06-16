on('chat:message', function(msg) {
  if (msg.type !== 'api' || !/^!initdex($|\s)/.test(msg.content)) return;

  debug_on = true;

  const playerName = msg.who.replace(" (GM)", "").trim();

  // Try to find the character associated with this button roll
  const character = findObjs({
    _type: "character",
    name: playerName
  })[0];

  if (!character) {
    sendChat("System", `No character found for: ${playerName}`);
    return;
  }

  const dexAttr = findObjs({
    type: 'attribute',
    characterid: character.id,
    name: 'dex'
  })[0];

  if (!dexAttr) {
    sendChat("System", `DEX not found for: ${playerName}`);
    return;
  }

  const dex = parseInt(dexAttr.get("current"), 10) || 0;
  const roll = randomInteger(100);
  let tier = 'Fail';
  let init = dex;

  if (roll === 1) {
    tier = 'Critical';
    init = 4000 + dex;
  } else if (roll <= Math.floor(dex / 5)) {
    tier = 'Extreme';
    init = 3000 + dex;
  } else if (roll <= Math.floor(dex / 2)) {
    tier = 'Hard';
    init = 2000 + dex;
  } else if (roll <= dex) {
    tier = 'Normal';
    init = 1000 + dex;
  } else if (roll >= 96) {
    tier = 'Fumble';
    init = 0;
  }

  const name = character.get("name");

  const output = `&{template:default} `
    + `{{name=Initiative (Combat) - ${name}}} `
    + `{{Roll=${roll}}} `
    + `{{Tier=${tier}}} `
    + `{{Result=${init}}}`;
  sendChat(name, output);

  let turnorderRaw = Campaign().get('turnorder') || '[]';
  let turnorder = [];

  try {
    turnorder = JSON.parse(turnorderRaw);
  } catch (err) {
    sendChat("System", `Error parsing turnorder: ${err}`);
  }

  const index = turnorder.findIndex(entry => entry.custom === name);

  if (index !== -1) {
    turnorder[index].pr = init;
  } else {
    turnorder.push({
      id: "-1",
      pr: init,
      custom: name
    });
  }

  Campaign().set('initiativepage', true);
  Campaign().set('turnorder', JSON.stringify(turnorder));
});
