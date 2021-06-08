import config from 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { PostgrestClient } from '@supabase/postgrest-js'
import { CommandClient } from 'eris'
import { abusivePrediction } from "./prediction.js"

const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
const schema = process.env.SCHEMA_NAME;
const supabase = new PostgrestClient(supabaseUrl, {schema: schema});
const serverCommands = ["guild", "channel", "token", "refresh"];

// Update an existing `Guild` or Insert a new row of `Guild`
const guildUpsert = async (msg) => {
    const { data, error } = await supabase
        .from('guilds')
        .upsert([{ guild_id: `${msg.guildID}`, guild_name: `${msg.channel.guild.name}`, guild_icon_url: `${msg.channel.guild.dynamicIconURL("png", 1024)}` }])
};

// Update an existing `Channel` or Insert a new row of `Channel`
const channelUpsert = async (msg) => {
    const { data, error } = await supabase
        .from('channels')
        .upsert([{ channel_id: `${msg.channel.id}`, guild_id: `${msg.guildID}`, channel_name: `${msg.channel.name}` }])
};

// Update an existing `Message` or Insert a new row of `Message`
const messageUpsert = async (msg, neutral_score, abusive_score, hate_score) => {
    const { data, error } = await supabase
    .from('messages')
    .upsert([{ message_id: `${msg.id}`, channel_id: `${msg.channel.id}`, message_neutral_score: neutral_score, message_abusive_score: abusive_score, message_hate_score: hate_score }])
};

// Update an existing `guild_admin_token` for a matching `guild_id` and `oldtoken` input
const guildTokenUpsert = async (guildid, oldtoken, newtoken) => {
    const { data, error } = await supabase
        .from('guilds')
        .update([{guild_admin_token: `${newtoken}`}])
        .eq('guild_id', `${guildid}`)
        .eq('guild_admin_token', `${oldtoken}`)

    return data
};

// Initiate a new Eris Command Client
var bot = new CommandClient(`Bot ${process.env.DISCORD_BOT_TOKEN}`, {}, {description: "A Discord Bot Integration for Aegis Automation Services", owner: "Xatryx Team", prefix: "#"});

// onReady Event
bot.on("ready", () => {
    console.log("Ready!");
});

// onError Event
bot.on("error", (err) => {
  console.error(err);
});

// onMessageCreate Event
bot.on("messageCreate", async (msg) => {
    if (!msg.author.bot) {
        if (msg.prefix != "#") {

            const { normal, abusive, hate } = await abusivePrediction(msg.content);

            guildUpsert(msg);
            channelUpsert(msg);
            messageUpsert(msg, normal, abusive, hate);
            
            // bot.createMessage(msg.channel.id, `Normal: ${normal}, Abusive: ${abusive}, Hate-speech: ${hate}`);

            msg.addReaction("💠");
        } else {
            msg.addReaction("🪧");
        }
    }
});

// #guild
bot.registerCommand(serverCommands[0], (msg) => {
    bot.createMessage(msg.channel.id, `Guild ID: ${msg.guildID} | Guild Name: ${msg.channel.guild.name}`);
}, {
    description: "checks the details of the current guild",
    fullDescription: "this command would tells you everything about this guild, future work also includes overall guild data within our services.",
    guildOnly: true,
    usage: "run this command as-is to print a number of information related to the guild where the command get's executed"
});

// #channel
bot.registerCommand(serverCommands[1], (msg) => {
    bot.createMessage(msg.channel.id, `Channel ID: ${msg.channel.id} | Channel Name: ${msg.channel.name}`);
}, {
    description: "checks the details of the current channel",
    fullDescription: "this command would tells you everything about this channel, future work also includes channel health check.",
    guildOnly: true,
    usage: "run this command as-is to print a number of information related to the channel where the command get's executed"
});

// #token
bot.registerCommand(serverCommands[2], async (msg, arg) => {
    const data = await guildTokenUpsert(msg.guildID, arg[0], arg[1]);
    
    if (data != null) {
        bot.createMessage(msg.channel.id, `Guild Admin Token has just been updated`);
    } else {
        bot.createMessage(msg.channel.id, `Guild Admin Token cannot be updated`);
    }
}, {
    argsRequired: true,
    cooldown: 60000,
    cooldownMessage: "oh c'mon gimme a break",
    description: "updates the guild_admin_token for the current guild where the command gets executed",
    fullDescription: "this command accepts two arguments that will be used to update your preexisting guild_admin_token. The first argument is your current token, and the second one is the new one. You may change this as much as you want with 60 seconds of delay at the bare minimum between changes.",
    guildOnly: true,
    requirements: {
        permissions: {
            "administrator": true
        }
    },
    usage: "use any combination of alphabets, numbers, and symbols as your token argument. please be mindful when using single-quote, it won't work unless you wrap it around double quotes which would also be considered as part of the token :("
});

// #refresh
bot.registerCommand(serverCommands[3], (msg) => {
    guildUpsert(msg);
    channelUpsert(msg);
    bot.createMessage(msg.channel.id, "Fresh as the winds blow..");
}, {
    description: "refreshes the bot from spacing out too long",
    fullDescription: "this command could help you to solve issues where changes to Guild Name etc has not been recorded by the this poor Bot :(.",
    guildOnly: true,
});

// Start the Client
bot.connect();