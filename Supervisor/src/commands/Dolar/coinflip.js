const dolars = require("../../schemas/dolar");
let limit = new Map();
let ms = require("ms");
const emojis = require('../../configs/emojiName.json')
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["cf"],
name: "coinflip",
help: "coinflip <Miktar>",
category: "kullanici",
},
exclosive: async (client, message, args, embed, prefix) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
let kanallar = ["dolar", "dolar-chat"]
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} dolar kanallarında kullanabilirsiniz.`}).sil(15)
let dolarData = await dolars.findOne({ guildID: settings.guildID, userID: message.author.id });  
if (!dolarData || dolarData && !dolarData.hesap.length) return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Komutu kullanabilmek için Hesap oluşturmanız gerekmektedir.`}).sil(15)
if (!dolarData || dolarData && !dolarData.dolar) return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Komutu kullanabilmek için **${settings.guildName}** dolarına ihtiyacın var.`}).sil(15)
let data = limit.get(message.author.id) || {dailyCoinTime: 0};
let timeout = 1000*8
let gunluk = data.dailyCoinTime
if (gunluk !== null && timeout - (Date.now() - gunluk) > 0) {
let time = ms(timeout - (Date.now() - gunluk));
message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Bu komutu ${time} sonra kullanabilirsin.`}).sil(15)
} else {
limit.set(message.author.id, {dailyCoinTime: Date.now()})
setTimeout(() => {
limit.delete(message.author.id)
}, 1000*8)
let sec = args[0]
if(!sec || !Number(args[0])) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Kaç **${settings.guildName}** doları ile oynamak istiyorsun?`}).sil(15)
if(sec >= 10001) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} 10.000 **${settings.guildName}** doları fazla bir **${settings.guildName}** doları ile oyun oynamayazsın.`}).sil(15)
let res = await dolars.findOne({guildID: settings.guildID, userID: message.author.id})
if(!res.dolar) return message.reply(`Hiç **${settings.guildName}** doları yok!`) 
if(res.dolar < sec) return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Yeterli miktar da **${settings.guildName}** doları yok! **${settings.guildName}** Doların: (**${res.dolar}** **${settings.guildName}** Doları)`}).sil(15)
let carpma = sec * 2 
let mesaj = await message.reply({ content:`
**Bahis Devam Ediyor!**

\` ${carpma} \` **${settings.guildName}** Doları için bahis döndürülüyor!
    
Belirlenen Miktar: \` ${sec} \` **${settings.guildName}** Doları`})
let randomizeCoinCal = Math.random(); 
if (randomizeCoinCal >= 0.3) {
await dolars.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { dolar: -sec } }, { upsert: true });
setTimeout(() => { 
mesaj.edit({ content:`
**Bahis Bitti!**
    
${message.guild.emojiGöster(emojis.no)} **Kaybettin!**
Kaybedilen Miktar: \` ${sec} \` **${settings.guildName}** Doları`})
}, 2000)
} else {
await dolars.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { dolar: +carpma } }, { upsert: true });
setTimeout(() => { 
mesaj.edit({ content:`
**Bahis Bitti!**
                 
:tada: **Kazandın!**
Kazanılan Miktar: \` ${carpma} \` **${settings.guildName}** Doları`})
}, 2000)
}
}
}
}