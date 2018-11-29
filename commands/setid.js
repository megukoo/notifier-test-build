const Discord = require("discord.js");

exports.run = (client, message, args, level) => {
  let id = args[0]
  if (!parseInt(id)) {
    let embed = new Discord.RichEmbed()
    embed.setTitle("Invalid argument")
    embed.setDescription(`The ID must be a number.`)
    embed.setColor('RED')
    message.channel.send({embed})
    return
  }
  if (client.trackingID) {
    if (!id) {
      client.trackingID = 1
      let embed = new Discord.RichEmbed()
      embed.setTitle("Success")
      embed.setDescription(`✅ Tracking ID reset to the official ROBLOX account.`)
      embed.setColor('GREEN')
      message.channel.send({embed})
    } else {
      client.trackingID = id
      let embed = new Discord.RichEmbed()
      embed.setTitle("Success")
      embed.setDescription(`✅ Tracking ID set to ${id}.\n\nhttps://www.roblox.com/users/${id}/profile`)
      embed.setColor('GREEN')
      message.channel.send({embed})
    }
  } else {
    message.channel.send("The tracking ID is not initialized yet.")
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "setid",
  category: "System",
  description: "Sets the ID of the user to track.",
  usage: "setid"
};
