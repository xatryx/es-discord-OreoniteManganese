require('dotenv').config()

const Eris = require("eris");

var bot = new Eris(`${process.env.DISCORD_BOT_TOKEN}`);

bot.on("ready", () => {
    console.log("Ready!");
});

bot.on("error", (err) => {
  console.error(err);
});

bot.on("messageCreate", (msg) => {
    if(msg.content === "!ping") {
        bot.createMessage(msg.channel.id, "Pong!");
    } else if(msg.content === "!pong") {
        bot.createMessage(msg.channel.id, "Ping!");
    }
});

bot.connect();