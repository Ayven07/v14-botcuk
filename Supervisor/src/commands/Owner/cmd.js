const bannedCmd = require("../../schemas/bannedcmd");
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json");
module.exports = {
conf: {
aliases: ['cmd'],
name: "cmd",
help: "cmd yasakla @Rainha/ID",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed) => {
if(args[0] == "yasakla" || args[0] == "banned") {
let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
if(!member) return message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} Bir Kullanıcı Belirt.`)]}).sil(15)  
var veri = await bannedCmd.findOne({guildID: settings.guildID}) || {"kullanici": []};                                             
if (veri.kullanici.includes(member.id)) {
await bannedCmd.updateOne({ guildID: settings.guildID }, { $pull: { kullanici: member.id } }, { upsert: true });
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla ${member} kullanıcısının yasağı kaldırıldı.`)]})  
} else {
await bannedCmd.updateOne({ guildID: settings.guildID }, { $push: { kullanici: member.id } }, { upsert: true });
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla ${member} kullanıcısı yasaklıya eklendi.`)]})  
} 
}  
}
}