/*
redesigning this command

would now use embeds
*/




exports.run = (client, message, args, level) => {
  // if no specific command is called show all commands
  const discord = require("discord.js")

  let commands = client.commands.array()

  let text = commands.join(", ")
  const embed = new discord.RichEmbed()
  embed.setTitle("Command List")
  embed.setColor('ORANGE')
  embed.addField("Usable Commands: ", text)
  message.channel.send({embed})
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "Info",
  description: "Displays all the available commands.",
  usage: "help [command]"
};
