const ayar = require("../../configs/settings.json")
const moment = require("moment");
moment.locale("tr");
const emojis = require('../../configs/emojiName.json')
const Discord = require("discord.js");
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: ["ysay","yetkilises","sesteolmayan"],
name: "ysay",
help: "ysay",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed, durum) => {
const ayars = await setups.findOne({guildID: ayar.guildID})
if(!ayars) return;  
if (!message.guild) return;
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.react(message.guild.emojiGöster(emojis.no))
const row = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId('sesolmayan').setLabel("Seste Olmayanlar").setStyle(Discord.ButtonStyle.Danger), new Discord.ButtonBuilder().setCustomId('sesteolmayandm').setLabel("Duyuru").setStyle(Discord.ButtonStyle.Danger));
var ToplamYetkili = message.guild.members.cache.filter(yetkili => !yetkili.user.bot && ayars.staffRoles.some(t => yetkili.roles.cache.has(t))).size
var SesteOlanYetkili = message.guild.members.cache.filter(yetkili => !yetkili.user.bot && ayars.staffRoles.some(t => yetkili.roles.cache.has(t))).filter(yetkilises => yetkilises.voice.channel).size
var AktifYetkili = message.guild.members.cache.filter(yetkili => !yetkili.user.bot && ayars.staffRoles.some(t => yetkili.roles.cache.has(t)) && yetkili.presence && yetkili.presence.status !== "offline").size
var SesteOlmayanYetkili = message.guild.members.cache.filter(yetkili => !yetkili.user.bot && ayars.staffRoles.some(t => yetkili.roles.cache.has(t)) && yetkili.presence && yetkili.presence.status !== "offline").filter(yetkilises => !yetkilises.voice.channel).size
var Rainha = message.guild.members.cache.filter(yetkili => !yetkili.user.bot && ayars.staffRoles.some(t => yetkili.roles.cache.has(t)) && yetkili.presence && yetkili.presence.status !== "offline").filter(yetkilises => !yetkilises.voice.channel)
var ysay = await message.channel.send({embeds: [embed.setDescription(`Sunucumuzdaki toplam yetkili sayısı: **${ToplamYetkili}**\nSunucumuzdaki toplam aktif yetkili sayısı: **${AktifYetkili}**\nSesdeki toplam yetkili sayısı: **${SesteOlanYetkili}**\nSeste olmayan yetkili sayısı: **${SesteOlmayanYetkili}**`)], components: [row]})
var filter = (button) => button.user.id === message.author.id;
const collector = ysay.createMessageComponentCollector({ filter, time: 30000 })
collector.on('collect', async (button, user) => {
if (button.customId === "sesolmayan") {   
await button.deferUpdate();
await message.channel.send({content: `Seste olmayan yetkililer aşağıda sıralanmıştır.\n${Rainha.map(yetkili => `${yetkili}`).join("\n")}`}).catch(e => {})         
}
if (button.customId === "sesteolmayandm") {
await button.deferUpdate(); 
message.guild.members.cache.filter(yetkili => ayars.staffRoles.some(t => yetkili.roles.cache.has(t))).filter(yetkilises => !yetkilises.user.bot && !yetkilises.voice.channel).forEach(user => { user.send(`Merhabalar. **${message.guild.name}** sunucusunda ses aktifliğinizi artırmak ve yetkinizi yükseltmek için seslere giriniz. Müsait değilsen **Sleep Room** kanalına afk bırakabilirsin.`).catch(err => { message.channel.send(`${user} isimli yetkiliye özel mesajları kapalı olduğu için mesaj atamıyorum. Lütfen seslere geçebilir misin ? Müsait değilsen **Sleep Room** kanalına geçebilirsin.`) }) })
}              
})    
}
}