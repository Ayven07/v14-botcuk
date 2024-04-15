const dolars = require("../../schemas/dolar");
let ms = require("ms");
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["hesapolustur", "hesap-olustur", "hesapoluştur","hesap-oluştur"],
name: "hesapoluştur",
help: "hesapoluştur",
category: "kullanici",
},
exclosive: async (client, message, args) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
let kanallar = ["dolar", "dolar-chat"]
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} dolar kanallarında kullanabilirsiniz.`}).sil(15)
let data = await dolars.findOne({userID: message.author.id, guildID: settings.guildID});
if(!data || data && !data.hesap.length) {
await dolars.findOneAndUpdate({userID: message.author.id, guildID: settings.guildID}, {$push: {hesap: 1}}, {upsert: true})
await dolars.findOneAndUpdate({userID: message.author.id, guildID: settings.guildID}, {$inc: {dolar: 500}}, {upsert: true})
message.reply({ content:`${message.guild.emojiGöster(emojis.yes)} ${message.author} Başarıyla **${settings.guildName}** doları hesabını oluşturdun, oyunlarımızı deneyimlemen için hesabına **500** hediye **${settings.guildName}** doları yolladım. İyi eğlenceler!`})
} else if(data) {
message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Zaten daha önceden bir hesap oluşturmuşsun!`}).sil(15)
}
}}