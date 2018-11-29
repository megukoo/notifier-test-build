const Discord = require("discord.js");

exports.run = (client, message, args, level) => {
  let role = message.guild.roles.get("516587508532903937")
  if (role) {
    let member = message.mentions.members.first()
    if (!member) return message.channel.send("No member provided.")
    member.addRole(role).then(mem => {
      let embed = new Discord.RichEmbed()
      embed.setTitle("Success")
      embed.setDescription(`✅ ${member.user.tag} was successfully approved.`)
      embed.setColor('GREEN')
      message.channel.send({embed})
    }).catch(e => {
      let embed = new Discord.RichEmbed()
      embed.setTitle("Failure, like you are.")
      embed.setDescription(`An error occurred. Inspect my roles.\n\n${e}`)
      embed.setColor('RED')
      message.channel.send({embed})
    })

  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "approve",
  category: "System",
  description: "Approves users.",
  usage: "approve"
};
