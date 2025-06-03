on('chat:message', function(msg) {
  if (msg.type !== 'api' || !msg.content.startsWith('!movenpc')) return;

  const args = msg.content.split(' ');
  const name = args[1] || "Unnamed";
  const moveStat = parseInt(args[2], 10) || 0;

  const roll = randomInteger(10); // 1d10
  const total = roll + moveStat;

  const output = `&{template:default} `
    + `{{name=Initiative (Chase) - ${name}}} `
    + `{{Roll=${roll}}} `
    + `{{Modifier=${moveStat}}} `
    + `{{Total=${total}}}`;
  sendChat(name, output);

  let turnorder = JSON.parse(Campaign().get("turnorder") || "[]");
  const existing = turnorder.find(entry => entry.custom === name);

  if (existing) {
    existing.pr = total;
  } else {
    turnorder.push({ id: "-1", pr: total, custom: name });
  }

  Campaign().set("initiativepage", true);
  Campaign().set("turnorder", JSON.stringify(turnorder));
});
