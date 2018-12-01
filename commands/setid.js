const Discord = require("discord.js");

exports.run = (client, message, args, level) => {
  let id = args[0]

  if (client.trackingID) {
    if (!id) {
      client.trackingID = 1
      let embed = new Discord.RichEmbed()
      embed.setTitle("Success")
      embed.setDescription(`✅ Tracking ID reset to the official ROBLOX account.`)
      embed.setColor('GREEN')
      message.channel.send({embed})
    } else {
      if (!parseInt(id)) {
        let embed = new Discord.RichEmbed()
        embed.setTitle("Current ID")
        embed.setDescription(`The current tracking ID is ${client.trackingID || "not initalized."}`)
        embed.setColor('ORANGE')
        message.channel.send({embed})
        return
      }
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
