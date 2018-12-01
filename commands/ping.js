const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send("Ping?");
  const embed = new Discord.RichEmbed()
  embed.setColor("ORANGE")
  embed.setDescription(`Response time: ${ ( (msg.createdTimestamp - message.createdTimestamp) / 1000).toFixed(2)} seconds\n\nAPI response: ${Math.round(client.ping)} milliseconds`)
  message.channel.send({embed})
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["pong"],
  permLevel: "User"
};

exports.help = {
  name: "ping",
  category: "Fun",
  description: "Latency check.",
  usage: "ping"
};
