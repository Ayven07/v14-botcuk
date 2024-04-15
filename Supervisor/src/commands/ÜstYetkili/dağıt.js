const settings = require("../../configs/settings.json")
const setups = require("../../schemas/setup")
const Discord = require("discord.js");
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["dağıt","dagit"],
name: "dağıt",
help: "dağıt",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: `${message.author}, Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`}).sil(15)
let voiceChannel = message.member.voice.channelId;
if (!voiceChannel) return message.reply(`Ses kanalında olmadığın için işlem iptal edildi.`).sil(15)            
let publicRooms = message.guild.channels.cache.filter(c => ayar.publicParents.some(a => a == c.parentId) && c.type === Discord.ChannelType.GuildVoice);
message.member.voice.channel.members.array().forEach((m, index) => {
setTimeout(() => {
if (m.voice.channelId !== voiceChannel) return;
m.voice.setChannel(publicRooms.random()).catch(e => {});
}, index*1000);
});
message.reply(`${message.guild.emojiGöster(emojis.yes)} **${message.member.voice.channel.name}** adlı ses kanalındaki üyeleri rastgele public odalara dağıtılmaya başladım!`).catch(e => {});
message.react(message.guild.emojiGöster(emojis.yes))
}
}