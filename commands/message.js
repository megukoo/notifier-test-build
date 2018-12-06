const Discord = require("discord.js");

exports.run = (client, message, args, level) => {
  let text = args.join(" ")
  let id = Math.random()
  id = id.toString()
  if (!text) {
    return message.channel.send("Cannot sent an empty message.")
  }
  client.addNotif(null, id, null, null, null, null, null, message)
  message.channel.send("Message was pushed to notifiers.")
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "message",
  category: "System",
  description: "Sends a message to the notification process.",
  usage: "message [message]"
};
