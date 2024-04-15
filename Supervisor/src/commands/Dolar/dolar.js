const dolars = require("../../schemas/dolar");
let limit = new Map();
let ms = require("ms");
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["dolar"],
name: "dolar",
help: "dolar [ekle/sil] [kullanıcı] [sayı]",
owner: true,
category: "sahip",
},
exclosive: async (client, message, args, embed, prefix) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
let kanallar = ["dolar", "dolar-chat"]
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} dolar kanallarında kullanabilirsiniz.`}).sil(15)   
const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
if (!member) return message.reply({ content:"Bir kullanıcı belirtmelisin!"}).sil(15)
if (args[0] === "ekle" || args[0] === "add") {
const count = parseInt(args[2]);
if (!count) return message.reply({ content:"Eklemek için bir sayı belirtmelisin!"}).sil(15)
if (!count < 0) return message.reply({ content:"Eklenecek sayı 0'dan küçük olamaz!"}).sil(15)
await dolars.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { dolar: count } }, { upsert: true });
message.reply({ embeds: [embed.setDescription(`Başarıyla ${member.toString()} kullanıcısına **${count}** **${settings.guildName}** Doları eklendi!`)]});
} else if (args[0] === "sil" || args[0] === "remove") {
const count = parseInt(args[2]);
if (!count) return message.reply({ content:"Çıkarılacak için bir sayı belirtmelisin!"}).sil(15)
if (!count < 0) return message.reply({ content:"Çıkarılacak sayı 0'dan küçük olamaz!"}).sil(15)
let dolarData = await dolars.findOne({ guildID: settings.guildID, userID: member.user.id });
if (!dolarData || dolarData && count > dolarData.dolar) return message.reply({ content:`Çıkarmak istediğiniz sayı, kişinin mevcut **${settings.guildName}** dolarından büyük olamaz!`});
await dolars.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { dolar: -count } }, { upsert: true });
message.reply({ embeds: [embed.setDescription(`Başarıyla ${member.toString()} kullanıcısından **${count}** **${settings.guildName}** Doları silindi!`)]});
}
}
}