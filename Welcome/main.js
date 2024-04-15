const settings = require('./settings.json');
const Discord = require("discord.js")
const setting = require('../Supervisor/src/configs/settings.json')
const { Rainha } = require('../client')
for (let index = 0; index < settings.tokens.length; index++) {
let token = settings.tokens[index]
let channel = settings.channels < 1 ? settings.channels[0] : settings.channels[index]
if(channel) {
const client = new Rainha()
Rainha.BotLogin(client, token)
client.on(Discord.Events.ClientReady, async () => {
voiceJoin(client, setting.guildID, channel)
});   
client.on(Discord.VoiceStateUpdate, async (oldState, newState) => { 
if(oldState.member.id === client.user.id && oldState.channelId && !newState.channelId) {
voiceJoin(client, setting.guildID, channel)
}
}) 
 }
}

async function voiceJoin(clients, guildID, channel) {
setInterval(() => { sesKontrol(); }, 5000);
async function sesKontrol() { 
const { joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");
let guild = clients.guilds.cache.get(guildID);
if(!guild) return console.log("sunucu yok!");
let Channel = global.Voice = guild.channels.cache.get(channel);
if(!Channel) return console.log("channel yok");
const connection = getVoiceConnection(guild.id);
if (connection) return;
if (Channel) { joinVoiceChannel({
channelId: Channel.id,
guildId: Channel.guild.id,
adapterCreator: Channel.guild.voiceAdapterCreator,
selfDeaf: true,
selfMute: false,
group: clients.user.id
})}
 }
} 