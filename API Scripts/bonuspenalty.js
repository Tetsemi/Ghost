// Bonus/Penalty Ability Seeder (Roll20 API; Pro required)
on('ready', () => {
  const ABILITY_NAME  = 'bonuspenalty';
  const ABILITY_ACTION =
    '&{template:coc-bp-dice-roll} {{name=Bonus/Penalty}} {{diceroll=[[1d10-1]]}}';
  const AS_TOKEN_ACTION = true; // show as Token Action (set to false if you don't want that)

  const ensureAbility = (ch) => {
    if (!ch) return;
    const cid = ch.id;
    let ability = findObjs({ type: 'ability', characterid: cid, name: ABILITY_NAME })[0];

    if (!ability) {
      createObj('ability', {
        characterid: cid,
        name: ABILITY_NAME,
        action: ABILITY_ACTION,
        istokenaction: AS_TOKEN_ACTION
      });
    } else {
      // keep it in sync if you change ABILITY_ACTION above
      if (ability.get('action') !== ABILITY_ACTION) ability.set('action', ABILITY_ACTION);
      if (ability.get('istokenaction') !== AS_TOKEN_ACTION)
        ability.set('istokenaction', AS_TOKEN_ACTION);
    }
  };

  // Seed all existing characters on sandbox start
  findObjs({ type: 'character' }).forEach(ensureAbility);

  // Auto-seed any newly created characters
  on('add:character', ensureAbility);

  // Manual command: seed selected characters (or all, if none selected)
  on('chat:message', (msg) => {
    if (msg.type !== 'api') return;
    const [cmd] = msg.content.trim().split(/\s+/);
    if (cmd !== '!seed-bonus') return;

    const seedSelected = () => {
      (msg.selected || []).forEach((sel) => {
        if (sel._type === 'graphic') {
          const tok = getObj('graphic', sel._id);
          if (!tok) return;
          const ch = getObj('character', tok.get('represents'));
          ensureAbility(ch);
        } else if (sel._type === 'character') {
          ensureAbility(getObj('character', sel._id));
        }
      });
    };

    if (msg.selected && msg.selected.length) {
      seedSelected();
      sendChat('Seeder', 'Seeded **bonuspenalty** on selected.');
    } else {
      findObjs({ type: 'character' }).forEach(ensureAbility);
      sendChat('Seeder', 'Seeded **bonuspenalty** on all characters.');
    }
  });
});
