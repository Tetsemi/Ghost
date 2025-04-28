// ExtremeDamageParser.js
on('chat:message', function(msg) {
    if (msg.type !== 'api') return;

    const args = msg.content.split(' ');
    if (args[0] !== '!extremedamage') return;

    const damageString = args.slice(1).join(' ').trim(); // e.g., "2d6+4"

    if (!damageString) {
        sendChat('System', '/w gm No damage string provided.');
        return;
    }

    const diceMatch = damageString.match(/(\d+)d(\d+)([+\-]\d+)?/i);
    if (!diceMatch) {
        sendChat('System', `/w gm Unable to parse damage string: ${damageString}`);
        return;
    }

    const numDice = parseInt(diceMatch[1], 10) || 0;
    const dieSize = parseInt(diceMatch[2], 10) || 0;
    const bonus = parseInt(diceMatch[3] || 0, 10) || 0;

    const maxRoll = (numDice * dieSize) + bonus;

    // Send back a formatted message with both damage values
    sendChat('ExtremeDamage', `&{template:coc-attack-1} 
    {{name=Extreme Damage}}
    {{damage=[[${damageString}]]}}
    {{extremedamage=[[${maxRoll}]]}}
    `);
});
