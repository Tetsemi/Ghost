on('chat:message', function(msg) {
  if (msg.type !== 'api' || !/^!initdex($|\s)/.test(msg.content)) return;

  debug_on = false;

  const playerName = msg.who.replace(" (GM)", "").trim();

  const character = findObjs({
    _type: "character",
    name: playerName
  })[0];

  if (!character) {
    sendChat("System", `No character found for: ${playerName}`);
    return;
  }

  const dexAttr = findObjs({
    _type: 'attribute',
    characterid: character.id,
    name: 'dex'
  })[0];

  if (!dexAttr) {
    sendChat("System", `DEX not found for: ${playerName}`);
    return;
  }

  const modAttr = findObjs({
    _type: 'attribute',
    characterid: character.id,
    name: 'dice_modifier_checkbox'
  })[0];

  const dex      = parseInt(dexAttr.get("current"), 10) || 0;
  const modifier = modAttr ? (parseInt(modAttr.get("current"), 10) || 0) : 0;

  // Effective DEX after modifier, minimum 1
  const effectiveDex = Math.max(1, dex + modifier);

  const roll = randomInteger(100);
  let tier = 'Fail';
  let init = 0;

  if (roll === 1) {
    tier = 'Critical';
    init = 4000 + effectiveDex;
  } else if (roll <= Math.floor(effectiveDex / 5)) {
    tier = 'Extreme';
    init = 3000 + effectiveDex;
  } else if (roll <= Math.floor(effectiveDex / 2)) {
    tier = 'Hard';
    init = 2000 + effectiveDex;
  } else if (roll <= effectiveDex) {
    tier = 'Normal';
    init = 1000 + effectiveDex;
  } else if (roll >= (effectiveDex > 50 ? 96 : 96)) {
    tier = 'Fumble';
    init = 0;
  }

  const name       = character.get("name");
  const success    = effectiveDex;
  const hard       = Math.max(1, Math.floor(effectiveDex / 2));
  const extreme    = Math.max(1, Math.floor(effectiveDex / 5));

  // coc-1 template drives tier display from inline roll comparisons,
  // so we pass roll, success, hard, extreme as inline rolls with fixed values.
  const output = `&{template:coc-1} `
    + `{{name=Initiative (Combat) - ${name}}} `
    + `{{modifier=[[${modifier}]]}} `
    + `{{success=[[${success}]]}} `
    + `{{hard=[[${hard}]]}} `
    + `{{extreme=[[${extreme}]]}} `
    + `{{roll1=[[${roll}]]}}`;

  sendChat(name, output);

  // Turn order uses init value calculated server-side
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