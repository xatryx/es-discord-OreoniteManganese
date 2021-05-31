require('dotenv').config()

const Eris = require("eris");

var bot = new Eris(`Bot ${process.env.DISCORD_BOT_TOKEN}`);

bot.on("ready", () => {
    console.log("Ready!");
});

bot.on("error", (err) => {
  console.error(err);
});

bot.on("messageCreate", (msg) => {
    // do something
});

bot.connect();