const asyncredis = require("async-redis")
const moment = require("moment");
require("moment-duration-format");

const disc = require("discord.js")

module.exports = (client) => {

  // Dependency
  client.sendItemEmbed = function (name, id, stock, price, channel) {
      const embed = new disc.RichEmbed()
      embed.setColor(process.env.green)
      stock = stock || "No"
      price = price || "Unknown"
      let url = "https://www.roblox.com/catalog/" + id
      embed.setTitle(`${name}`)
      // embed.setURL(`https://www.roblox.com/catalog/${id}`)
      embed.setDescription(`Price: ${price} R$\nStock: ${stock} items to buy out\n\n${url}`)
      embed.setFooter("Gotta get it, quick")
      embed.setThumbnail(`https://www.roblox.com/asset-thumbnail/image?assetId=${id}&width=420&height=420&format=png`)
      channel.send({embed})
  }

    client.permlevel = (message, data) => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;

        if (currentLevel.check(message, client, data) ) {
        permlvl = currentLevel.level;
         break
        }


    }
    return permlvl;
  };


  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };
  // Remove all accented letters for queries
  client.removeAccents = function (strAccents) {
		var strAccents = strAccents.split('');
		var strAccentsOut = new Array();
		var strAccentsLen = strAccents.length;
		var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠš§§ŸÿýŽž';
		var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsSsYyyZz";
		for (var y = 0; y < strAccentsLen; y++) {
			if (accents.indexOf(strAccents[y]) != -1) {
				strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
			} else
				strAccentsOut[y] = strAccents[y];
		}
		strAccentsOut = strAccentsOut.join('');
		return strAccentsOut;
	}

  client.getData = async (key) => {
    let data = await client.redisClient.get(key)
    return data
  }

  client.setData = async (key, val) => {
    let data = await client.redisClient.set(key, val)
    return data
  }

  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      client.logger.log(`Command  "${props.help.name}" was loaded. 👌`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command due to error: ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };




  client.wait = require("util").promisify(setTimeout);

  // check permissions for discord
  client.checkPerm = function(guildMember, permissionName) {
    try {
      return guildMember.hasPermission(permissionName)
    } catch (e) {
      console.log('check perm fail: ' + e)
      // client.startChannel.send('check permission failure: ' + e)
    }
  }

  client.hastebin = async function(input) {
    const {post} = require('snekfetch')
    const { body } = await post('https://hastebin.com/documents').send(input)
    let key = body.key
    return "https://hastebin.com/" + key
  }
  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception:\n${errorMsg}`);

     if (client.startChannel) {
      client.startChannel.send("error, rebooting (check logs)")
     }
    process.exit(143);
  });

  process.on("unhandledRejection", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Unhandled rejection: ${errorMsg}`);
    client.clean(client, errorMsg).then(text => {
       if (client.startChannel) {
         client.startChannel.send("Unhandled Rejection\n" + text + "\nLast command used: " + client.lastCommand)
       }
    })
  });

};
