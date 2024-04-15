const setups = require("../../schemas/setup")
const Discord = require("discord.js")
const a = require("../../configs/settings.json")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["seslisay","sesli"],
name: "seslisay",
help: "seslisay",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: a.guildID})
if(!ayar) return;  
if(!ayar.staffRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
{
message.react(message.guild.emojiGöster(emojis.no))  
return
}
let members = message.guild.members.cache.filter(m => m.voice.channelId);
let topses = message.guild.members.cache.filter(s => s.voice.channel);
let tagses = topses.filter(s => ayar.serverTag.some(tag => s.user.globalName && s.user.globalName.includes(tag)));
let yayın = topses.filter(s => s.voice.streaming).size;
let mik = topses.filter(s => s.voice.selfMute).size;
let kulak = topses.filter(s => s.voice.selfDeaf).size;
const pub = message.guild.channels.cache.filter(t => ayar.publicParents.some(a => a == t.parentId) && t.type === Discord.ChannelType.GuildVoice)
let yetkili = message.guild.members.cache.filter(x => x.voice.channel && ayar.staffRoles.some(t => x.roles.cache.has(t))).size
embed.setDescription(`
${message.guild.emojiGöster(emojis.yldz)} Sesli kanallarda toplam **${topses.size}** kişi var 

${message.guild.emojiGöster(emojis.nokta)} Public odalarda **${members.filter(m => ayar.publicParents.some(x => m.voice.channel.parentId === x)).size}** kişi var 
${message.guild.emojiGöster(emojis.nokta)} Ses kanallarında **${yetkili}** yetkili var 
${message.guild.emojiGöster(emojis.nokta)} Ses kanallarında **${tagses.size}** taglı kullanıcı var

${message.guild.emojiGöster(emojis.nokta)} Ses kanallarında **${yayın}** kişi yayın yapıyor 
${message.guild.emojiGöster(emojis.nokta)} Mikrofonu kapalı: **${mik}**
${message.guild.emojiGöster(emojis.nokta)} Kulaklığı kapalı: **${kulak}**`)
message.reply({ embeds: [embed]})
}
}
