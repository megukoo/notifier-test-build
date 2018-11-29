if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

// Discord
const Discord = require("discord.js");

// Client
const client = new Discord.Client()

// Datastoring
const redis = require('redis')
const asyncredis = require('async-redis')

const config = require('./config.js')

var rediscli = redis.createClient({url: process.env.REDIS_URL})
asyncredis.decorate(rediscli)

client.redisClient = rediscli
client.logger = require("./util/Logger");

var prefix = config.prefix


require("./modules/functions.js")(client)

const init = async () => {
  client.on("ready", () => {
    console.log("The client is ready and has loaded.")
    let sourceChannel = client.channels.get(config.sourceChannel)
    let log = client.channels.get(config.approvedChat)
    if (!sourceChannel) {
      log.send("There was an error receiving the channel to begin the notifier.\nContact <@240639333567168512> ASAP.")
    } else {
      log.send("The notifier is initializing.")
      sourceChannel.fetchMessage(sourceMessage).then(message => {
        let output = eval(message.content)
        if (output._repeat) {
          log.send("Notifier is up and running.")
        } else {
          log.send("An error has occurred within the source code.\nContact <@240639333567168512> ASAP.")
        }
      })
    }
  })

  client.on("message", message => {
    if (message.author.bot) return;
    let prefixFound = message.content.toLowerCase().indexOf(prefix) == 0

    var prefixTrim;
    if (prefixFound) {
      prefixTrim = message.content.slice(prefix.length).trim().split(/ +/g);
    }
    const args = prefixTrim
    const command = args.shift().toLowerCase();

    // Get the user or member's permission level from the elevation
    const level = client.permlevel(message, data);


    const cmd = client.commands.get(command.toLowerCase()) || client.commands.get(client.aliases.get(command.toLowerCase()));


    if (!cmd) return message.channel.send("`" + command + "` doesn't seem like a valid command. Try again.")
    if (level < client.levelCache[cmd.conf.permLevel]) {
      return message.channel.send(`You are unable to run this command. ${cmd.conf.permLevel}+ only.`)
    }

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
     message.flags.push(args.shift().slice(1));
    }
    // If the command exists, **AND** the user has permission, run it.
    // client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
    try {
      cmd.run(client, message, args, level);
    } catch (e) {
      message.channel.send("Internal error when executing command. Contact <@240639333567168512>.")
      console.log(cmd.help.name + " command had an error. " + e)
    }
  })
  client.login(process.env.token)
};

init();
