const Discord = require("discord.js");
const settings = require("../../configs/settings.json");
const emojis = require('../../configs/emojiName.json')
const setups = require("../../schemas/setup")
const messageUser = require("../../schemas/messageUser");
const messageGuild = require("../../schemas/messageGuild");
const voiceUser = require("../../schemas/voiceUser");
const voiceGuild = require("../../schemas/voiceGuild");
const streamUser = require('../../schemas/streamUser')
const cameraUser = require('../../schemas/cameraUser')
module.exports = {
conf: {
aliases: ["statsıfırla", "stat-sifirla", "statsifirla"],
name: "stat-sıfırla",
help: "stat-sıfırla",
category: "owner"    
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})   
if(message.member.id != message.guild.ownerId && !settings.owners.includes(message.member.id)) return;
if(!args[0]) return message.reply({content: `${message.member}, Doğru kullanım; ${settings.prefix}stat-sıfırla all/aylık/haftalık/günlük`})
if (args[0] === 'günlük') {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onay")
.setLabel("Onayla")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("915754671728132126"),
new Discord.ButtonBuilder()
.setCustomId("red")
.setLabel("İptal")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("920412153712889877"),);
const mesaj = await message.reply({embeds: [embed.setDescription(`${message.member}, Merhaba **${message.guild.name}** Sunucusunun Günlük Stat Verilerini Sıfırlamak İstediğine Emin Misin.?`).setFooter({text: 'Not: Aşağıdaki Button Yardımıyla İşlemi Seçiniz'})], components: [row]})
var filter = (button) => button.user.id === message.member.id;
let collector = await mesaj.createMessageComponentCollector({ filter })
collector.on("collect", async (button) => {
if (button.customId == "onay") {
await button.deferUpdate(); 
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
message.guild.members.cache.forEach(async (member) => {
await messageGuild.findOneAndUpdate({ guildID: settings.guildID }, { $set: { dailyStat: 0 } }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: settings.guildID }, { $set: { dailyStat: 0 } }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
})
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla Sunucunun Tüm Stat Verileri Sıfırlandı.`)], components: [row]})
}
if (button.customId == "red") {
await button.deferUpdate(); 
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla İşlem İptal Edildi.`)], components: [row]})
} 
})
return; } else if(args[0] === 'haftalık') {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onays")
.setLabel("Onayla")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("915754671728132126"),
new Discord.ButtonBuilder()
.setCustomId("reds")
.setLabel("İptal")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("920412153712889877"),);
const mesaj = await message.reply({embeds: [embed.setDescription(`${message.member}, Merhaba **${message.guild.name}** Sunucusunun Haftalık Stat Verilerini Sıfırlamak İstediğine Emin Misin.?`).setFooter({text: 'Not: Aşağıdaki Button Yardımıyla İşlemi Seçiniz'})], components: [row]})
var filter = (button) => button.user.id === message.member.id;
let collector = await mesaj.createMessageComponentCollector({ filter })
collector.on("collect", async (button) => {
if (button.customId == "onays") {
await button.deferUpdate(); 
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
message.guild.members.cache.forEach(async (member) => {
await messageGuild.findOneAndUpdate({ guildID: settings.guildID }, { $set: { weeklyStat: 0 } }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: settings.guildID }, { $set: { weeklyStat: 0 } }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { weeklyStat: 0 } }, { upsert: true });
})
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla Sunucunun Tüm Stat Verileri Sıfırlandı.`)], components: [row]})
}
if (button.customId == "reds") {
await button.deferUpdate(); 
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla İşlem İptal Edildi.`)], components: [row]})
} 
})
return; } else if(args[0] === 'aylık') {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onayt")
.setLabel("Onayla")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("915754671728132126"),
new Discord.ButtonBuilder()
.setCustomId("redt")
.setLabel("İptal")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("920412153712889877"),);
const mesaj = await message.reply({embeds: [embed.setDescription(`${message.member}, Merhaba **${message.guild.name}** Sunucusunun Aylık Stat Verilerini Sıfırlamak İstediğine Emin Misin.?`).setFooter({text: 'Not: Aşağıdaki Button Yardımıyla İşlemi Seçiniz'})], components: [row]})
var filter = (button) => button.user.id === message.member.id;
let collector = await mesaj.createMessageComponentCollector({ filter })
collector.on("collect", async (button) => {
if (button.customId == "onayt") {
await button.deferUpdate(); 
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
message.guild.members.cache.forEach(async (member) => {
await messageGuild.findOneAndUpdate({ guildID: settings.guildID }, { $set: { monthStat: 0 } }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: settings.guildID }, { $set: { monthStat: 0 } }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { monthStat: 0 } }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { monthStat: 0 } }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { monthStat: 0 } }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { monthStat: 0 } }, { upsert: true });
})
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla Sunucunun Tüm Stat Verileri Sıfırlandı.`)], components: [row]})
}
if (button.customId == "redt") {
await button.deferUpdate(); 
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla İşlem İptal Edildi.`)], components: [row]})
} 
})
return; } else if(args[0] === 'all') {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onayt")
.setLabel("Onayla")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("915754671728132126"),
new Discord.ButtonBuilder()
.setCustomId("redt")
.setLabel("İptal")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("920412153712889877"),);
const mesaj = await message.reply({embeds: [embed.setDescription(`${message.member}, Merhaba **${message.guild.name}** Sunucusunun Toplam Stat Verilerini Sıfırlamak İstediğine Emin Misin.?`).setFooter({text: 'Not: Aşağıdaki Button Yardımıyla İşlemi Seçiniz'})], components: [row]})
var filter = (button) => button.user.id === message.member.id;
let collector = await mesaj.createMessageComponentCollector({ filter })
collector.on("collect", async (button) => {
if (button.customId == "onayt") {
await button.deferUpdate(); 
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
message.guild.members.cache.forEach(async (member) => {
await messageGuild.findOneAndUpdate({ guildID: settings.guildID }, { $set: { topStat: 0 } }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: settings.guildID }, { $set: { topStat: 0 } }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { topStat: 0 } }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { topStat: 0 } }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { topStat: 0 } }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { topStat: 0 } }, { upsert: true });
})
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla Sunucunun Tüm Stat Verileri Sıfırlandı.`)], components: [row]})
}
if (button.customId == "redt") {
await button.deferUpdate(); 
row.components[0].setDisabled(true);
row.components[1].setDisabled(true);
if(mesaj) mesaj.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla İşlem İptal Edildi.`)], components: [row]})
} 
})
return;}
}
}