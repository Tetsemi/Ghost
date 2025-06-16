on('chat:message', function(msg) {
  if (msg.type !== 'api' || !/^!movenpc($|\s)/.test(msg.content)) return;


  const args = msg.content.trim().split(/\s+/).slice(1); // remove "!movenpc"

  if (args.length < 2) {
    sendChat("System", "/w gm Usage: !movenpc Name MoveStat");
    return;
  }

  const moveStat = parseInt(args[args.length - 1], 10);
  if (isNaN(moveStat)) {
    sendChat("System", "/w gm Error: Move stat must be a number. Usage: !movenpc Name MoveStat");
    return;
  }

  const name = args.slice(0, -1).join(' ');
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
