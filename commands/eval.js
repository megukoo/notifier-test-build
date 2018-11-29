// The EVAL command will execute **ANY** arbitrary javascript code given to it.
// THIS IS PERMISSION LEVEL 10 FOR A REASON! It's perm level 10 because eval
// can be used to do **anything** on your machine, from stealing information to
// purging the hard drive. DO NOT LET ANYONE ELSE USE THIS

// However it's, like, super ultra useful for troubleshooting and doing stuff
// you don't want to put in a command.

const { inspect } = require("util");
const { post } = require("snekfetch");
const discord = require('discord.js')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const code = args.join(" ");
  const token = client.token.split("").join("[^]{0,2}");
  const rev = client.token.split("").reverse().join("[^]{0,2}");
  const filter = new RegExp(`${token}|${rev}`, "g");
  try {
    let output = eval(code);
    if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
    output = inspect(output, { depth: 0, maxArrayLength: null });
    output = output.replace(filter, "[TOKEN]");
    output = clean(output);


    if (output.length < 1950) {
      var embed = new discord.RichEmbed()
      embed.setTitle("Code evaluated")
      embed.setDescription(`\`\`\`js\n${output}\n\`\`\``);
      embed.setColor(process.env.green)
      embed.setFooter("Nerd evaluated some code", message.author.avatarURL)
      embed.setTimestamp()
      message.channel.send({embed})
    } else {
      try {
        const { body } = await post("https://www.hastebin.com/documents").send(output);
        var embed = new discord.RichEmbed()
        embed.setTitle("That's a large result")
        embed.setDescription(`Output was to long so it was uploaded to hastebin https://www.hastebin.com/${body.key}.js`);
        embed.setColor(process.env.orange)
        embed.setFooter("Nerd evaluated some code", message.author.avatarURL)
        embed.setTimestamp()
        message.channel.send({embed})
      } catch (error) {
        message.channel.send(`I tried to upload the output to hastebin but encountered this error ${error.name}: ${error.message}`);
      }
    }
  } catch (error) {
    var embed = new discord.RichEmbed()
    embed.setTitle("Get oofed")
    embed.setDescription(`The following error occured \`\`\`js\n${error.stack}\`\`\``);
    embed.setColor(process.env.red)
    embed.setFooter("Nerd evaluated some bad code", message.author.avatarURL)
    embed.setTimestamp()
    message.channel.send({embed})
  }

  function clean(text)  {
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["run"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript code.",
  usage: "eval [...code]"
};
