if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

// Discord
const Discord = require("discord.js");

// Anti-ddos
const DDOS = require("anti-ddos")

// Client
const client = new Discord.Client()

// Datastoring
const redis = require('redis')
const asyncredis = require('async-redis')

// Other
const {promisify} = require("util");
const util = require("util")
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const bodyParser = require('body-parser')
const express = require("express");
const http = require('request')

const config = require('./config.js')


var app = express();
var rediscli = redis.createClient({url: process.env.REDIS_URL})
client.redisClient = rediscli

asyncredis.decorate(client.redisClient)


client.logger = require("./util/Logger");
client.config = config
client.notifs = {}

client.commands = new Enmap()
client.aliases = new Enmap()

var prefix = "$"


require("./modules/functions.js")(client)

// Ready event to load sources
client.on("ready", async () => {
  // await client.wait(2500)
  console.log("The client is ready and has loaded.")
  let sourceChannel = client.channels.get(config.sourceChannel)
  let log = client.channels.get(config.approvedChat)
  if (!sourceChannel) {
    log.send("There was an error receiving the data to begin the notifiers.\nContact <@240639333567168512> ASAP.")
  } else {
    log.send("The notifier is initializing.")
    sourceChannel.fetchMessage(config.sourceMessage).then(message => {
      try {
        let output = eval(message.content)
        if (output._repeat) {
          log.send("Limited notifier up.")
        } else {
          log.send("An error has occurred within the source code.\nContact <@240639333567168512> ASAP. (Limited notifier)")
        }
      } catch (e) {
        log.send("An error occurred in the Limited Notifier source.")
      }

    })

    sourceChannel.fetchMessage(config.sourceMessage2).then(message => {
      try {
        let output = eval(message.content)
        console.log(output)
        if (output) {
          log.send("Item notifier up.")
        } else {
          log.send("An error has occurred within the source code.\nContact <@240639333567168512> ASAP. (Item notifier)")
        }
      } catch (e) {
        log.send("An error occurred in the Item Notifier source.")
      }
    })
  }
})

// Set up the HTTP server
app.use(bodyParser.json())
app.set('env', 'production')

app.listen(process.env.PORT || 3000, function() {
  console.log("Running on port " + process.env.PORT)
})

app.get("/notifications/:userid", function (req, res) {
  let ipOrigin = req.headers['x-forwarded-for']
  let id = req.params.userid
  if (!id) {
    return res.status(400).send("Invalid UserId")
  }
  if (!parseInt(id)) {
    return res.status(400).send("Invalid UserId")
  }
  if (parseInt(id) < 1) {
    return res.status(400).send("Invalid UserId")
  }
  client.getData("Authenticated").then(d => {
    let auths = JSON.parse(d)
    if (auths[ipOrigin]) {
      let notifs = client.notifs
      let toSend = []
      let rn = Date.now()
      for (x in notifs) {
        if (rn - notifs[x].created < 15000) {
          toSend.push(notifs[x])
        }
      }
      res.status(200).send(toSend)
    } else {
      res.status(403).send("Unauthorized")
    }
  })
})

app.post("/requestauth", function (req, res) {
  // console.log(req.headers, res)
  let body = req.body
  let ipOrigin = body.ip
  let userId = body.userId

  // Check for invalid data
  if (!userId || !ipOrigin || !body) {
    return res.status(400).send("Malformed request")
  }
  if (!parseInt(userId)) {
    return res.status(400).send("Invalid UserId")
  }
  if (parseInt(userId) < 1) {
    return res.status(400).send("Invalid UserId")
  }

  // Check for modified requests
  if (ipOrigin !== req.headers['x-forwarded-for']) {
    console.log(`IP Address conflict: ${ipOrigin} (Origin) vs ${req.headers['x-forwarded-for']} (Headers)`)
    return res.status(403).send("Invalid IP Address")
  }
  client.getData("Authenticated").then(d => {
    let auths = JSON.parse(d)
    if (!auths[ipOrigin]) {
      let uniqueKey = genID()
      let saving = {
        userid: userId,
        approved: false,
      }
      auths[ipOrigin] = saving
      client.setData("Authenticated", JSON.stringify(auths))

      // Let's not technically log the IPs, hide them halfway
      let formatted = ipOrigin.split(".")
      let digitCount = formatted.pop().length
      let replacer = 'x'
      formatted.push(replacer.repeat(digitCount))
      formatted = formatted.join(".")
      console.log(`IP Address ${ipOrigin} has sent a request from the userId of ${userId}`)
      client.users.get('240639333567168512').send(`IP Address \`${ipOrigin}\` has sent an approval request from the userId of \`${userId}\`\nhttps://www.roblox.com/users/${userId}/profile`)
      res.status(201).send("Awaiting approval")
    } else {
      let userData = auths[ipOrigin]
      if (!userData.approved) {
        res.status(403).send("Not Approved")
      } else {
        return res.status(200).send("Approved")
      }
    }
  })
})

app.get("/", (request, response) => {
  // Keeps this explosion wizard alive.
  response.sendStatus(200);
});


// Initialize the client
const init = async () => {
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading ${cmdFiles.length} commands.`);

  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });

  client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Get the user or member's permission level from the elevation
    const level = client.permlevel(message);


    const cmd = client.commands.get(command.toLowerCase()) || client.commands.get(client.aliases.get(command.toLowerCase()));


    if (!cmd) return message.channel.send("`" + command + "` doesn't seem like a valid command. Try again.")
    if (level < client.levelCache[cmd.conf.permLevel]) {
      return message.channel.send(`You are unable to run this command. ${cmd.conf.permLevel}+ only.`)
    }

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
     message.flags.push(args.shift().slice(1));
    }

    try {
      cmd.run(client, message, args, level);
    } catch (e) {
      message.channel.send("Internal error when executing command. Contact <@240639333567168512>.")
      console.log(cmd.help.name + " command had an error. " + e)
    }
  })

  client.levelCache = {};

  for (let i = 0; i < config.permLevels.length; i++) {
    const thisLevel = config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(process.env.token)
};

init();

setInterval(() => {
  http.get(`http://limited-notifier.herokuapp.com/`);
}, 360000);
