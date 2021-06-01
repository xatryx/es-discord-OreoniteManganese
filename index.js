import config from 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import Eris from 'eris'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const guildUpsert = async (msg) => {
    const { data, error } = await supabase
        .from('guilds')
        .upsert([{ guild_id: `${msg.guildID}` }])
};

const channelUpsert = async (msg) => {
    const { data, error } = await supabase
        .from('channels')
        .upsert([{ channel_id: `${msg.channel.id}`, guild_id: `${msg.guildID}` }])
};

const messageUpsert = async (msg) => {
    const { data, error } = await supabase
    .from('messages')
    .upsert([{ message_id: `${msg.id}`, channel_id: `${msg.channel.id}`, message_neutral_score: 0, message_abusive_score: 0, message_hate_score: 0 }])
};

var bot = new Eris(`Bot ${process.env.DISCORD_BOT_TOKEN}`);

bot.on("ready", () => {
    console.log("Ready!");
});

bot.on("error", (err) => {
  console.error(err);
});

bot.on("messageCreate", async (msg) => {
    guildUpsert(msg);
    channelUpsert(msg);
    messageUpsert(msg);
    msg.addReaction("💠");
});

bot.registerCommand("#guild", (msg) => {
    bot.createMessage(msg.channel.id, `Guild ID: ${msg.guildID} | Guild Name: ${msg.channel.guild.name}`)
});

bot.connect();