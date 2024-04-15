const moment = require("moment");
const cezapuan = require("../../schemas/cezapuan")
const ceza = require("../../schemas/ceza")
moment.locale("tr");
const Discord = require("discord.js")
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["cezapuan","cp"],
name: "cezapuan",
help: "cezapuan @Rainha/ID",
category: "cezalandirma"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers) &&  !ayar.banHammer.some(x => message.member.roles.cache.has(x))) { message.reply({ content:"Yeterli yetkin bulunmuyor!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return 
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
if (!member) { message.reply({ content:"Böyle bir kullanıcı bulunamadı!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return 
}
const cezaData = await ceza.findOne({ guildID: settings.guildID, userID: member.id });
const cezapuanData = await cezapuan.findOne({ userID: member.user.id });
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({ content:`${member} kişisinin toplamda **${cezapuanData ? cezapuanData.cezapuan : 0}** ceza puanı ve (Toplam **${cezaData ? cezaData.ceza.length : 0}** Ceza) olarak gözükmekte!`})
},
};
