exports.run = async (client, message, args, level) => {
    let text = args.join(" ")
    if (text == undefined) {
      return message.channel.send("Need a query!")
    }
    client.hastebin(text)
        .then(link => {
         message.channel.send("Posted at " + link)
        })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["hb"],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "hastebin",
    category: "System",
    description: "Posts the query to Hastebin.",
    usage: "hastebin [words]"
};
