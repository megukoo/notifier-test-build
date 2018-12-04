const Discord = require("discord.js");

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
    let auths = JSON.parse(d)
    if (auths[ip]) {
      auths[ip].approved = true
      message.channel.send("Authentication success!\nnique ID: `" + auths[ip].id + '`\nUser ID: `' + auths[ip].userid + "`")
      client.setData("Authenticated", JSON.stringify(auths))
    } else {
      return message.channel.send("Could not find the IP address in the database.")
    }
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
