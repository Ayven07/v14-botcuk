const moment = require("moment");
const cezapuans = require("../../schemas/cezapuan");
const ceza = require("../../schemas/ceza")
const name = require("../../schemas/names");
const penals = require("../../schemas/penals");
const uyari = require("../../schemas/uyarisayi")
require("moment-duration-format");
const a = require("../../configs/settings.json")
const Discord = require("discord.js");
const emojis = require('../../configs/emojiName.json')
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const streamUser = require('../../schemas/streamUser')
const cameraUser = require('../../schemas/cameraUser')
const voiceUserParent = require("../../schemas/voiceUserParent");
const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
module.exports = {
conf: {
aliases: ["sifirla", "sf","sıfırla"],
name: "sıfırla",
help: "sıfırla @Rainha/ID",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed) => {
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator))
{
message.reply({ content:"Bu işlemi yapamazsın dostum!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return;
}
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member; 
var DeleteName = new Discord.ButtonBuilder()
.setLabel("İsim Sıfırla")
.setCustomId("isim_sıfırla")
.setStyle(Discord.ButtonStyle.Secondary)
var DeletePenalty = new Discord.ButtonBuilder()
.setLabel("Ceza Puan Sıfırla")
.setCustomId("cezapuan_sıfırla")
.setStyle(Discord.ButtonStyle.Secondary)
var DeletePenal = new Discord.ButtonBuilder()
.setLabel("Sicil Sıfırla")
.setCustomId("sicil_sıfırla")
.setStyle(Discord.ButtonStyle.Secondary)
var DeleteStat = new Discord.ButtonBuilder()
.setLabel("Stat Sıfırla")
.setCustomId("stat_sıfırla")
.setStyle(Discord.ButtonStyle.Secondary)
var Iptal = new Discord.ButtonBuilder()
.setLabel("İptal")
.setCustomId("iptal_button")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji("909485171240218634")
const row = new Discord.ActionRowBuilder().addComponents([DeleteName, DeletePenalty, DeletePenal, DeleteStat, Iptal])
embed.addFields({name: `Veri Sıfırlama Paneli`, value: `
${message.guild.emojiGöster(emojis.nokta)} İsim Geçmişi Sıfırlama
${message.guild.emojiGöster(emojis.nokta)} Ceza Puan Sıfırlama
${message.guild.emojiGöster(emojis.nokta)} Sicil Sıfırlama
${message.guild.emojiGöster(emojis.nokta)} Stat Sıfırlama

${member.toString()} üyesine ait sıfırlamak istediğin veriyi aşağıdaki butonlar yardımıyla sıfırlayabilirsiniz.`, inline: true})
let msg = await message.channel.send({ embeds: [embed], components: [row] });
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (button) => {
if(button.customId === "isim_sıfırla") {
await button.deferUpdate();
await name.deleteMany({userID: member.user.id, guildID: a.guildID}, { upsert: true })
const isim = new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.yes)} ${member.toString()} üyesinin isim geçmiş verileri ${message.author} tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde temizlendi!`)
msg.edit({embeds : [isim], components : []})  
}
if(button.customId === "cezapuan_sıfırla") {
await button.deferUpdate();
await cezapuans.deleteMany({userID: member.user.id, guildID: a.guildID}, { upsert: true })
await ceza.deleteMany({userID: member.user.id, guildID: a.guildID}, { upsert: true })
const cezapuan = new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.yes)}  ${member.toString()} üyesinin ceza puan verileri ${message.author} tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde temizlendi!`) 
msg.edit({embeds: [cezapuan], components : []})  
}
if(button.customId === "sicil_sıfırla") {   
await button.deferUpdate();
await penals.deleteMany({userID: member.user.id, guildID: a.guildID}, { upsert: true })
await uyari.deleteMany({userID: member.user.id, guildID: a.guildID}, { upsert: true })
const sicil = new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.yes)}  ${member.toString()} üyesinin sicil verileri ${message.author} tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde temizlendi!`) 
msg.edit({embeds: [sicil], components : []})  
}
if(button.customId === "stat_sıfırla") {   
await button.deferUpdate();
await messageUser.deleteMany({ guildID: a.guildID, userID: member.user.id }, { upsert: true });
await voiceUser.deleteMany({ guildID: a.guildID, userID: member.user.id }, { upsert: true });
await streamUser.deleteMany({ guildID: a.guildID, userID: member.user.id }, { upsert: true });
await cameraUser.deleteMany({ guildID: a.guildID, userID: member.user.id }, { upsert: true });
await voiceUserParent.deleteMany({ guildID: a.guildID, userID: member.user.id }, { upsert: true });
await messageUserChannel.deleteMany({ guildID: a.guildID, userID: member.user.id }, { upsert: true })
await voiceUserChannel.deleteMany({ guildID: a.guildID, userID: member.user.id }, { upsert: true })
const stat = new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.yes)}  ${member.toString()} üyesinin stat verileri ${message.author} tarafından <t:${Math.floor(Date.now() / 1000)}> tarihinde temizlendi!`) 
msg.edit({embeds: [stat], components : []})  
}
if(button.customId === "iptal_button") {   
await button.deferUpdate();
const iptal = new Discord.EmbedBuilder().setDescription(`${message.guild.emojiGöster(emojis.yes)} Sıfırlama işlemi iptal edildi`) 
msg.edit({embeds: [iptal], components : []})  
}
})
}
};