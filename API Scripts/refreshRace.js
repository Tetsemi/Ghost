// === RefreshRace API ===
// Usage: select token(s) representing characters, then type: !refreshRace
on('ready', () => log('RefreshRace API ready'));

const setAttrWithWorker = (attr, value) => {
    // Correct signature: setWithWorker(attributeObj, 'current', value)
    if (typeof setWithWorker === 'function') {
        setWithWorker(attr, 'current', value);
    } else {
        // Fallback won't trigger sheetworkers; only used if setWithWorker missing
        attr.set('current', value);
    }
};

on('chat:message', (msg) => {
    if (msg.type !== 'api' || !/^!refreshRace\b/i.test(msg.content)) return;

    if (!msg.selected || !msg.selected.length) {
        sendChat('RefreshRace', `/w "${msg.who.replace(' (GM)','')}" Please select a token representing a character.`);
        return;
    }

    const stamp = String(Date.now());

    msg.selected.forEach(sel => {
        if (sel._type !== 'graphic') return;
        const token = getObj('graphic', sel._id);
        if (!token) return;

        const charId = token.get('represents');
        if (!charId) return;

        let attr = findObjs({ type: 'attribute', characterid: charId, name: 'refresh_race_trigger' })[0];
        if (!attr) {
            attr = createObj('attribute', { characterid: charId, name: 'refresh_race_trigger', current: '' });
        }

        setAttrWithWorker(attr, stamp);
    });

    sendChat('RefreshRace', `/w "${msg.who.replace(' (GM)','')}" Race refresh triggered for selected token(s).`);
});
