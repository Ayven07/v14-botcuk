const dolars = require("../../schemas/dolar");
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["cuzdan", "cash", "cüzdan", "dolarim", "dolarım"],
name: "cuzdan",
help: "cuzdan",
category: "kullanici",
},
exclosive: async (client, message, args, embed, prefix) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
let kanallar = ["dolar", "dolar-chat"]
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} dolar kanallarında kullanabilirsiniz.`}).sil(15)
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
let dolarData = await dolars.findOne({ guildID: settings.guildID, userID: member.id });
if (!dolarData || dolarData && !dolarData.hesap.length) return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${member} Üyesinin Hesabı Bulunmamakta.`}).sil(15)
message.reply({ content: `${member} kişisinin bakiyesi: \` ${dolarData ? Math.floor(parseInt(dolarData.dolar)) : 0} \` **${settings.guildName}** Doları.`})
}
}