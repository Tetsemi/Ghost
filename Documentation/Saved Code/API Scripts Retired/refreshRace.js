// === RefreshRace (bounce to placeholder then back) ===
// Usage: select token(s) representing characters, then: !refreshRace
on('ready', () => log('RefreshRace API ready'));

const setAttrWithWorker = (attr, value) => {
  if (typeof setWithWorker === 'function') {
    setWithWorker(attr, 'current', value);   // correct signature
  } else {
    attr.set('current', value);              // fallback (won't fire workers)
  }
};

const getOrCreateAttr = (charId, name) =>
  findObjs({ type:'attribute', characterid: charId, name })[0]
  || createObj('attribute', { type:'attribute', characterid: charId, name, current: '' });

on('chat:message', (msg) => {
  if (msg.type !== 'api' || !/^!refreshRace\b/i.test(msg.content)) return;

  if (!msg.selected || !msg.selected.length) {
    sendChat('RefreshRace', `/w "${msg.who.replace(' (GM)','')}" Please select a token representing a character.`);
    return;
  }

  msg.selected.forEach(sel => {
    if (sel._type !== 'graphic') return;
    const token  = getObj('graphic', sel._id);
    if (!token) return;

    const charId   = token.get('represents');
    if (!charId) return;

    const raceAttr = getOrCreateAttr(charId, 'showracials');
    const current  = String(raceAttr.get('current') || '').trim();

    // Try several common placeholder values; pick the first that's different from current.
    const placeholders = ['', '0', 'none', 'choose']; // your sheet likely uses "" for “-- Choose Race --”
    const bounce = placeholders.find(v => v !== current) || '';

    // Flip to placeholder → then flip back after a short delay
    setAttrWithWorker(raceAttr, bounce);
    setTimeout(() => setAttrWithWorker(raceAttr, current), 400);
  });

  sendChat('RefreshRace', `/w "${msg.who.replace(' (GM)','')}" Race refresh triggered (placeholder bounce).`);
});
