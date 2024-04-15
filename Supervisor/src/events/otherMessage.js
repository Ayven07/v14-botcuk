const Discord = require("discord.js");
const client = global.client;
const emojis = require('../configs/emojiName.json')
const bannedCmd = require("../schemas/bannedcmd")
const settings = require("../configs/settings.json")
const setups = require("../schemas/setup")
module.exports = async (message) => {
if(!message) return;
if(!message.guild) return;
if(message.channel.type == Discord.ChannelType.DM) return;
if(message.member.id == client.user.id) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;
let kanallar = ["tweet", "tweet-chat"]
if (kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) {
if(message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && ayar.ownerRoles.some(x => message.member.roles.cache.has(x)) && ayar.roleAddRoles.some(r => message.member.roles.cache.has(r))) return;    
if(!message.content.toLowerCase().includes(`${settings.prefix}tweet`)) return message.delete().catch((e) => {})
} 
let kanallars = ["selfie", "günün-fotoğrafı", "günün-fotosu"]
if(kanallars.some((x) => message.channel.name.toLowerCase().includes(x))) {
if(!message.attachments.first()) {
if(message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && ayar.ownerRoles.some(x => message.member.roles.cache.has(x)) && ayar.roleAddRoles.some(r => message.member.roles.cache.has(r))) return;    
await message.delete().catch(e => {})  
} else {
const emojiss = message.guild.emojis.cache.array();
shuffleArray(emojiss);
const emojisToAdd = emojiss.slice(0, 10);
try {
for (const emoji of emojisToAdd) {
await message.react(emoji);
}
} catch (e) {
}
}
}
};
module.exports.conf = {
name: "messageCreate",
};

function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
}
}