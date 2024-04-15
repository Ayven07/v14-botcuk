const dolars = require("../../schemas/dolar");
let limit = new Map();
let ms = require("ms");
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["günlük", "gunluk"],
name: "daily",
help: "daily",
category: "kullanici",
},
exclosive: async (client, message, args) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
let kanallar = ["dolar", "dolar-chat"]
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} dolar kanallarında kullanabilirsiniz.`}).sil(15)
let data = await dolars.findOne({userID: message.author.id, guildID: settings.guildID});
if (!data || data && !data.hesap.length) return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Komutu kullanabilmek için Hesap oluşturmanız gerekmektedir.`}).sil(15)
let timeout = 1000*60*60*24
const sayi = Math.floor(Math.random() * 450) + 1
let gunluk = data.dolarTime
if (gunluk !== null && timeout - (Date.now() - gunluk) > 0) {
let time = ms(timeout - (Date.now() - gunluk));
message.channel.send({content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Bu komutu ${time} sonra kullanabilirsin.`}).sil(16)
} else {
await dolars.findOneAndUpdate({userID: message.author.id, guildID: settings.guildID}, {$inc: {dolar: sayi}, $set: {dolarTime: Date.now()}}, {upsert: true})
message.channel.send({ content:`${message.guild.emojiGöster(emojis.yes)} ${message.author} Başarılı bir şekilde günlük ödülünü aldın. (Ödülün: **${sayi}** **${settings.guildName}** Doları)`})
}  
}
}