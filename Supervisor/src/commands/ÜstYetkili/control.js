const Discord = require('discord.js');
const settings = require("../../configs/settings.json")
const moment = require("moment")
moment.locale("tr")
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["kontrol"],
name: "control",
help: "kontrol",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed, prefix) => { 
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;  
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator))
{
message.reply({ content:"Bu işlemi yapamazsın dostum!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return;
}
let tagges = message.guild.members.cache.filter(member => !member.user.bot && ayars.serverTag.some(tag => member.user.globalName && member.user.globalName.includes(tag)) && !member.roles.cache.has(ayars.tagRoles))
let etk = message.guild.members.cache.filter(member => !member.roles.cache.has(ayars.etkinlikRoles) && !member.user.bot).size;
let cek = message.guild.members.cache.filter(member => !member.roles.cache.has(ayars.cekilisRoles) && !member.user.bot).size;
const row = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId('etkinlikdagit').setLabel("Etkinlik K. Dağıt").setStyle(Discord.ButtonStyle.Secondary), new Discord.ButtonBuilder().setCustomId('cekilisdagit').setLabel("Çekiliş K. Dağıt").setStyle(Discord.ButtonStyle.Secondary), new Discord.ButtonBuilder().setCustomId('tagrol').setLabel("Tag Rolü Dağıt").setStyle(Discord.ButtonStyle.Secondary));
let ysay = await message.channel.send({ embeds: [embed.setDescription(`Merhaba! ${message.guild.name} sunucu içerisi kontrol ekranına hoş geldin!\n\nTagı olup rolü olmayan kulanıcı sayısı: ${tagges.size}\nEtkinlik katılımcısı rolü olmayan kullanıcı sayısı: ${etk}\nÇekiliş katılımıcısı rolü olmayan kullanıcı sayısı: ${cek}\n\nRolleri dağıtmak için uygun butona tıklamanız yeterli!`)], components: [row] })
var filter = (button) => button.user.id === message.author.id;
const collector = ysay.createMessageComponentCollector({ filter, time: 30000 })
collector.on('collect', async (button, user) => {
if (button.customId === "etkinlikdagit") {
await button.reply({ content: `Etkinlik Katılımcısı rolü olmayan **${etk}** kişiye rol dağıtılıyor.`, ephemeral: true }).catch(e => {});
button.guild.members.cache.filter(member => !member.roles.cache.has(ayars.etkinlikRoles) && !member.user.bot).forEach(x => x.roles.add(ayars.etkinlikRoles).catch(e => {}))
}
if (button.customId === "cekilisdagit") {
await button.reply({ content: `Çekiliş Katılımcısı rolü olmayan **${cek}** kişiye rol dağıtılıyor.`, ephemeral: true }).catch(e => {});
button.guild.members.cache.filter(member => !member.roles.cache.has(ayars.cekilisRoles) && !member.user.bot).forEach(x => x.roles.add(ayars.cekilisRoles).catch(e => {}))
}
if (button.customId === "tagrol") {
button.guild.members.cache.filter(member => !member.user.bot && ayars.serverTag.some(tag => member.user.globalName && member.user.globalName.includes(tag)) && !member.roles.cache.has(ayars.tagRoles)).forEach(x => x.roles.add(ayars.tagRoles).catch(e =>{}))
await button.reply({ content: `Tagı olup rolü olmayan **${tagges.size}** kişiye rol dağıtılıyor.`, ephemeral: true}).catch(e => {});
} 
})  
}
}