on('chat:message', function(msg) {
  if (msg.type !== 'api' || !msg.content.startsWith('!initdex')) return;
  debug_on = true;

  const selected = msg.selected;
  if (!selected || selected.length === 0) {
    sendChat('System', 'No token selected.');
    return;
  }

  selected.forEach((sel) => {
    const token = getObj('graphic', sel._id);
    if (!token) {
      if (debug_on) sendChat("Debug", `Token not found for ID: ${sel._id}`);
      return;
    }

    const charId = token.get('represents');
    const character = getObj('character', charId);
    if (!character) {
      if (debug_on) sendChat("Debug", `Character not found for token ID: ${token.id}`);
      return;
    }

    const dexAttr = findObjs({
      type: 'attribute',
      characterid: charId,
      name: 'dex'
    })[0];

    if (!dexAttr) {
      if (debug_on) sendChat("Debug", `DEX attribute not found for character ID: ${charId}`);
    }

    const dex = parseInt(dexAttr?.get('current'), 10) || 0;
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
    if (debug_on) sendChat("Debug", `Character: ${name}`);
    if (debug_on) sendChat("Debug", `DEX: ${dex}, Roll: ${roll}, Tier: ${tier}, Init: ${init}`);

    const output = `&{template:default} `
      + `{{name=Initiative (Combat) - ${name}}} `
      + `{{Roll=${roll}}} `
      + `{{Tier=${tier}}} `
      + `{{Result=${init}}}`;
    sendChat(name, output);

    const pageId = token.get("pageid");
    Campaign().set('initiativepage', true);

    let turnorderRaw = Campaign().get('turnorder') || '[]';
    let turnorder = [];

    try {
      turnorder = JSON.parse(turnorderRaw);
    } catch (err) {
      if (debug_on) sendChat("Debug", `Error parsing turnorder: ${err}`);
    }

    const index = turnorder.findIndex(entry => entry.id === token.id);

    if (index !== -1) {
      if (debug_on) sendChat("Debug", `Token already in turn tracker. Updating initiative.`);
      turnorder[index].pr = init;
    } else {
      if (debug_on) sendChat("Debug", `Token not in tracker. Forcing add.`);
      turnorder.push({
        id: token.id,
        pr: init,
        _pageid: pageId 
      });
    }

    Campaign().set('turnorder', JSON.stringify(turnorder));
    if (debug_on) sendChat("Debug", `Updated turnorder: ${JSON.stringify(turnorder)}`);
  });
});
