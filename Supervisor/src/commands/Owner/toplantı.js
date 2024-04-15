
const Discord = require("discord.js");
const c = require("../../configs/settings.json")
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const client = global.client;
module.exports = {
conf: {
aliases: ["toplanti"],
name: "toplantı",
help: "toplantı",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({guildID: c.guildID})   
if(!ayar) return;
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) { message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return }
if(!message.member.voice.channel) return message.reply({embeds: [embed.setDescription(`${message.member} Bir ses kanalında bulunmalısın.`)]}).sil(15)
let enAltYetkiliRolü = message.guild.roles.cache.get(ayar.registerPerms);
let yetkililer = message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.highest.position >= enAltYetkiliRolü.position && !uye.voice.channel)
if (yetkililer.length == 0) return message.reply('Aktif olup, seste olmayan yetkili bulunmuyor!').sil(15)
let buttons = new Discord.ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder().setPlaceholder("Toplantı İşlemini Şeçiniz!").setCustomId("toplantimenu")
.setOptions([{ label: `Toplantı Başlat`, description: `Toplantıyı Bulunduğunuz Ses Kanalında Başlatır Ve Rol Dağıtır!`, value: `meetingstart`, emoji: `${message.guild.emojiGöster(emojis.member).id}` },{ label: `Toplantı Duyuru`, description: `Yetkilileri DM Üzerinden Toplantıya Çağırır!`, value: `meetingcall`, emoji: `${message.guild.emojiGöster(emojis.duyuru).id}` }]))
let mesaj = await message.reply({ components: [buttons], embeds: [embed.setDescription(`${message.member} *Menüden Bir \`Toplantı\` İşlemi Belirtiniz!*`)] })
const collector = mesaj.createMessageComponentCollector({ filter: i => i.user.id === message.member.id, time: 30000, max: 1 });
collector.on('end', async (Rainha) => {
if (Rainha.size == 0) mesaj.delete();
})
collector.on('collect', async (Rainhas) => {
if (!Rainhas.isStringSelectMenu()) return;
let value = Rainhas.values[0];
switch (value) {
case "meetingstart":
let voiceuser = message.guild.members.cache.filter(member => !member.roles.cache.has(ayar.mazeretPerms) && member.roles.highest.position >= enAltYetkiliRolü.position && member.voice.channel && !member.user.bot)
let nvoiceuser = message.guild.members.cache.filter(member => !member.roles.cache.has(ayar.mazeretPerms) && member.roles.highest.position >= enAltYetkiliRolü.position && !member.voice.channel && !member.user.bot)
let mazeret = message.guild.roles.cache.get(ayar.mazeretPerms).members.size;
message.reply({ embeds: [embed.setDescription(`**Katıldı Rolü Verilecek Kişi Sayısı: ${sayıEmoji(voiceuser.size)}**\n**Katıldı Rolü Alınacak Kişi Sayısı: ${sayıEmoji(nvoiceuser.size)}**\n**Mazeretli Kişi Sayısı: ${sayıEmoji(mazeret)}**\n\n**Toplantıda Olmayan ${sayıEmoji(nvoiceuser.size)} Kişiye ${ayar.katilmadiPerms ? `<@&${ayar.katilmadiPerms}>` : "Ayarlanmamış."} Rolü Veriliyor**\n**Toplantıda Olan ${sayıEmoji(voiceuser.size)} Kişiye ${ayar.katildiPerms ? `<@&${ayar.katildiPerms}>` : "Ayarlanmamış."} Rolü Veriliyor.**`)] })
Rainhas.message.delete().catch(e => {})
voiceuser.array().forEach((Rainha, index) => {
setTimeout(async () => {
Rainha.roles.add(ayar.katildiPerms).catch(e => {})
if(Rainha.roles.cache.has(ayar.katilmadiPerms)) Rainha.roles.remove(ayar.katilmadiPerms).catch(e => {})
if(Rainha.roles.cache.has(ayar.mazeretPerms)) Rainha.roles.remove(ayar.mazeretPerms).catch(e => {})  
}, 2 * 1000)
})
nvoiceuser.array().forEach((Rainha, index) => {
setTimeout(async () => {
Rainha.roles.add(ayar.katilmadiPerms).catch(e => {})
if(Rainha.roles.cache.has(ayar.katildiPerms)) Rainha.roles.remove(ayar.katildiPerms).catch(e => {})
}, 2 * 1000)
})
break;
case "meetingcall":
let nnvoiceuser = Rainhas.guild.members.cache.filter(member => !member.roles.cache.has(ayar.mazeretPerms) && member.roles.highest.position >= enAltYetkiliRolü.position && !member.voice.channel && !member.user.bot)
if(nnvoiceuser.length == 0) return Rainhas.reply({ embeds: [embed.setDescription(`**Sunucudaki Tüm Yetkililer Seste Bulunuyor!**`)] }).sil(15);
let mesaj = await message.reply({ embeds: [embed.setDescription(`**Seste Olmayan ${sayıEmoji(nnvoiceuser.size)} Kişiye DM Üzerinden Duyuru Geçiliyor!** *Lütfen Biraz Bekleyiniz.*`)] });
Rainhas.message.delete().catch(e => {})
nnvoiceuser.forEach((yetkili, index) => {
setTimeout(() => {
yetkili.send({content: message.guild.name+' Sunucusunda toplantı başladı. Yetkili olduğun halde toplantıda değilsin. Eğer toplantıya girmezsen yetkilerin alınacaktır.'}).then(x => mesaj.edit({embeds: [embed.setDescription(`${yetkili} yetkilisine özelden mesaj atıldı!`)]})).catch(err => message.channel.send(`${yetkili}, Sunucusunda toplantı başladı. Yetkili olduğun halde toplantıda değilsin. Eğer toplantıya girmezsen yetkilerin alınacaktır.`).then(x => mesaj.edit({embeds: [embed.setDescription(`${yetkili} yetkilisine özelden mesaj atılamadığı için kanalda etiketlendi!`)]})));
}, 2*1000);
})
break;
}
})
} 
};

function sayıEmoji(sayi) {
const guild = client.guilds.cache.get(c.guildID)
var basamakbir = sayi.toString().replace(/ /g, "     ");
var basamakiki = basamakbir.match(/([0-9])/g);
basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
if (basamakiki) {
basamakbir = basamakbir.replace(/([0-9])/g, d => {
return {
'0': `${guild.emojis.cache.find(x => x.name == emojis.sifir)}`,
'1': `${guild.emojis.cache.find(x => x.name == emojis.bir)}`,
'2': `${guild.emojis.cache.find(x => x.name == emojis.iki)}`,
'3': `${guild.emojis.cache.find(x => x.name == emojis.uc)}`,
'4': `${guild.emojis.cache.find(x => x.name == emojis.dort)}`,
'5': `${guild.emojis.cache.find(x => x.name == emojis.bes)}`,
'6': `${guild.emojis.cache.find(x => x.name == emojis.alti)}`,
'7': `${guild.emojis.cache.find(x => x.name == emojis.yedi)}`,
'8': `${guild.emojis.cache.find(x => x.name == emojis.sekiz)}`,
'9': `${guild.emojis.cache.find(x => x.name == emojis.dokuz)}`
}
[d];
})
}
return basamakbir;
}