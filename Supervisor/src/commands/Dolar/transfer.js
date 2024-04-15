const dolars = require("../../schemas/dolar");
let limit = new Map();
let ms = require("ms");
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["transfer", "gönder", "yolla", "transf"],
name: "transfer",
help: "transfer @Rainha/ID Miktar",
category: "kullanici",
},
exclosive: async (client, message, args, embed, prefix) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
let kanallar = ["dolar", "dolar-chat"]
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} dolar kanallarında kullanabilirsiniz.`}).sil(15)
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if (!member) { message.reply({ content:"Bir üye belirtmelisin!"}).sil(15) 
message.react(message.guild.emojiGöster(emojis.no))
return }
let dolarDatas = await dolars.findOne({ guildID: settings.guildID, userID: message.member.id });
let dolarData = await dolars.findOne({ guildID: settings.guildID, userID: member.id });
if (!dolarDatas || dolarDatas && !dolarDatas.hesap.length) return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Hesabın Bulunmamakta.`}).sil(15)   
if (!dolarData || dolarData && !dolarData.hesap.length) return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${member} Üyesinin Hesabı Bulunmamakta.`}).sil(15)
let sec = args[1];
if(!sec || !Number(args[1])) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Kaç **${settings.guildName}** doları göndermek istiyorsun?`}).sil(15)
if(sec >= 10001) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} 10.000 **${settings.guildName}** dolarından fazla bir **${settings.guildName}** doları gönderemezsin.`}).sil(15)
if(!dolarDatas.dolar) return message.reply(`Hiç **${settings.guildName}** doları yok!`) 
if(dolarDatas.dolar < sec) return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Yeterli miktar da **${settings.guildName}** doları yok! **${settings.guildName}** Doların: (\` ${dolarDatas ? Math.floor(parseInt(dolarDatas.dolar)) : 0} \` **${settings.guildName}** Doları)`}).sil(15)
message.reply({ content: `${message.member}, Başarıyla ${member} Kişisine \` ${Math.floor(parseInt(sec))} \` **${settings.guildName}** Doları Gönderdin. (Kalan **${settings.guildName}** Doların: \` ${dolarDatas ? Math.floor(parseInt(dolarDatas.dolar - sec)) : 0} \`)`})
await dolars.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { dolar: -sec } }, { upsert: true });
await dolars.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $inc: { dolar: +sec } }, { upsert: true });
}
}