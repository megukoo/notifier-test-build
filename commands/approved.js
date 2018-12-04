const Discord = require("discord.js");

exports.run = (client, message, args, level) => {
  if (message.channel.type !== 'dm') {
    message.channel.send("Now now, we don't want to leak IPs do we? Go to my DMs.")
    return
  }
  client.getData("Authenticated").then(d => {
    let auths = JSON.parse(d)
    let approved = []
    for (x in auths) {
      if (auths[x].approved) {
        approved.push(`\`${x}\` - to user ${auths[x].userid}`)
      }
    }
    let embed = new Discord.RichEmbed()
    embed.setTitle("Approved Users")
    embed.setDescription(`${approved.join("\n")}`)
    embed.setColor('GREEN')
    message.channel.send({embed})
  })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "approved",
  category: "System",
  description: "Lists approved users.",
  usage: "approved"
};
