exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  await message.channel.send("Auto restarting.");
  client.commands.forEach( async cmd => {
    await client.unloadCommand(cmd);
  });

  process.exit(143);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["restart", "shutdown"],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reboot",
  category: "System",
  description: "Restarts the bot.",
  usage: "reboot"
};
