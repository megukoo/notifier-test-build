const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hours], m [minutes], s [seconds]");
  var discord = require("discord.js")

  const embed = new discord.RichEmbed()
  .setAuthor("Notifier", client.user.avatarURL)
  .setTitle("Statistics")
  .setDescription("Collected stats.")
  .addField("Memory Usage", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "MB")
  .addField("Heap Total", ((process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + "MB"))
  .addField("Uptime", duration)
  .addField("Discord.js Version", "v" + version)
  .addField("Node Version", process.version)
  .setColor('ORANGE')
  .setTimestamp()

  message.channel.send({embed})
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "stats",
  category: "Info",
  description: "Gives some useful bot statistics.",
  usage: "stats"
};
