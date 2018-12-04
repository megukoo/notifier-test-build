const Discord = require("discord.js");

// Function to generate IDs
function genID() {
  var d = new Date().getTime();
  var d2 = d
  if (typeof d2 !== 'undefined' && typeof d2.now === 'function'){
      d += performance.now();
  }
  return 'ID-xxxxx-xxxxx-4xxx4-yxxxx-xxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

exports.run = (client, message, args, level) => {
  let ip = args[0]
  if (!ip) {
    return message.channel.send("No IP provided.")
  }
  if (message.channel.type !== 'dm') {
    message.channel.send("Now now, we don't want to leak IPs do we? Go to my DMs.")
    if (ip) {
      message.delete()
    }
    return
  }
  client.getData("Authenticated").then(d => {
    client.getData("Blacklist").then(d2 => {
      let blacklisted = JSON.parse(d2)
      if (blacklisted) {
        return message.channel.send("This IP is on the blacklist. Remove it first.")
      }
      let auths = JSON.parse(d)
      if (auths[ip]) {
        auths[ip].approved = true
        let id = genID()
        auths[ip].id = id
        message.channel.send("Authentication success!\nUnique ID: `" + auths[ip].id + '`\nUser ID: `' + auths[ip].userid + "`")
        client.setData("Authenticated", JSON.stringify(auths))

      } else {
        return message.channel.send("Could not find the IP address in the database.")
      }
    })
  })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "whitelist",
  category: "System",
  description: "Whitelists users.",
  usage: "whitelist [ip]"
};
