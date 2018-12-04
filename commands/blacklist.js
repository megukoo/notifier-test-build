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
      message.channel.send("Blacklist success!\nUnique ID: `" + auths[ip].id + '`\nUser ID: `' + auths[ip].userid + "`")
      delete auths[ip]
      client.setData("Authenticated", JSON.stringify(auths))
      client.getData("Blacklist").then(d2 => {
        let blacklisted = JSON.parse(d2)
        blacklisted[ip] = true
        console.log("Blacklisted " + ip)
      })
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
  name: "blacklist",
  category: "System",
  description: "Blacklists users.",
  usage: "blacklist [ip]"
};
