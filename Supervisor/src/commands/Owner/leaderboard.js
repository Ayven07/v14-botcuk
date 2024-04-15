const settings = require("../../configs/settings.json");
const setups = require("../../schemas/setup")
const lb = require("../../schemas/leaderboard")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
const Discord = require("discord.js");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const db = require("../../schemas/inviter");
const emojis = require('../../configs/emojiName.json')
const regstats = require("../../schemas/registerStats");
const streamUser = require("../../schemas/streamUser")
const cameraUser = require("../../schemas/cameraUser")
module.exports = {
conf: {
aliases: ["lb"],
name: "leaderboard",
help: "leaderboard kur/sıfırla",
owner: true,
category: "owner"    
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})   
if(!ayar) return;
const guild = client.guilds.cache.get(settings.guildID)  
if(!args[0]) return message.reply({content: `${settings.prefix}leaderboard kur/sıfırla`}).sil(15)  
if(["kur", "kurulum", "setup"].some(x => x == args[0])) {
const lbd = await lb.findOne({guildID: settings.guildID})  
if(lbd) return message.reply({content: `Database de kayıtlı veri bulunmakta sıfırlamadan kurulum yapamazsın.`}).sil(15)
if(message) message.delete().catch(e => {})  
const voiceUsersData = await voiceUser.find({ guildID: guild.id }).sort({ topStat: -1 });
let list = voiceUsersData
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, index) => `❯ \` ${index+1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");
const messageUsersData = await messageUser.find({ guildID: guild.id }).sort({ topStat: -1 });
let mlist = messageUsersData
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, index) => `❯ \` ${index+1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${Number(x.topStat).toLocaleString()} Mesaj \``)
.join("\n");
const streamUsersData = await streamUser.find({ guildID: guild.id }).sort({ topStat: -1 });
let ylist = streamUsersData
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, index) => `❯ \` ${index+1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");    
const cameraUsersData = await cameraUser.find({ guildID: guild.id }).sort({ topStat: -1 });
let clist = cameraUsersData
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, index) => `❯ \` ${index+1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");    
let data = await db.find({ guildID: guild.id }).sort({ total: -1 });
let arr = [];
data.forEach((x) => arr.push({ id: x.userID, total: x.total }));
let dlist = data
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, index) => `❯ \` ${index + 1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${x.total} Davet \``)
.join("\n");
let kdata = await regstats.find({ guildID: guild.id }).sort({ top: -1 });
let karr = [];
kdata.forEach((x) => karr.push({ id: x.userID, top: x.top }));
let klist = kdata
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, i) => `❯ \` ${i + 1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${x.top} Kayıt \``)
.join("\n");  
let Embed = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic: true})})              
var messageListID = await message.channel.send({embeds: [Embed.setDescription(`${message.guild.emojiGöster(emojis.hos)} *Aşağıda **${message.guild.name}** Sunucusunun Genel Mesaj Sıralaması Listelenmektedir.*\n\n${mlist.length > 0 ? mlist : "Veri Bulunmuyor."}\n\n${message.guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
var voiceListID = await message.channel.send({embeds: [Embed.setDescription(`${message.guild.emojiGöster(emojis.hos)} *Aşağıda **${message.guild.name}**  Sunucusunun Genel Ses Sıralaması Listelenmektedir.*\n\n${list.length > 0 ? list : "Veri Bulunmuyor."}\n\n${message.guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
var registerListID = await message.channel.send({embeds: [Embed.setDescription(`${message.guild.emojiGöster(emojis.hos)} *Aşağıda **${message.guild.name}** Sunucusunun Genel Kayıt Sıralaması Listelenmektedir.*\n\n${klist.length > 0 ? klist : "Veri Bulunmuyor."}\n\n${message.guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
var inviteListID = await message.channel.send({embeds: [Embed.setDescription(`${message.guild.emojiGöster(emojis.hos)} *Aşağıda **${message.guild.name}** Sunucusunun Genel Davet Sıralaması Listelenmektedir.*\n\n${dlist.length > 0 ? dlist : "Veri Bulunmuyor."}\n\n${message.guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
var cameraListID = await message.channel.send({embeds: [Embed.setDescription(`${message.guild.emojiGöster(emojis.hos)} *Aşağıda **${message.guild.name}** Sunucusunun Genel Kamera Sıralaması Listelenmektedir.*\n\n${clist.length > 0 ? clist : "Veri Bulunmuyor."}\n\n${message.guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
var streamListID = await message.channel.send({embeds: [Embed.setDescription(`${message.guild.emojiGöster(emojis.hos)} *Aşağıda **${message.guild.name}** Sunucusunun Genel Yayın Sıralaması Listelenmektedir.*\n\n${ylist.length > 0 ? ylist : "Veri Bulunmuyor."}\n\n${message.guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
await lb.updateOne({ guildID: settings.guildID }, { $set: { channels: message.channel.id, messageListID: messageListID.id, voiceListID: voiceListID.id, registerListID: registerListID.id, inviteListID: inviteListID.id, cameraListID: cameraListID.id, streamListID: streamListID.id} }, { upsert: true });  
} 
if(["temizle", "sıfırla", "sifirla"].some(x => x == args[0])) {
const ldb = await lb.findOne({guildID: settings.guildID})  
if(!ldb) return message.reply({content: `Database de kayıtlı veri bulunmamakta kurulum yapmadan sıfırlayamazsın.`}).sil(15)
const kanal = message.guild.channels.cache.get(ldb.channels)
const messageList = await kanal.messages.fetch(ldb.messageListID);
const voiceList = await kanal.messages.fetch(ldb.voiceListID);
const registerList = await kanal.messages.fetch(ldb.registerListID);
const inviteList = await kanal.messages.fetch(ldb.inviteListID);
const cameraList = await kanal.messages.fetch(ldb.cameraListID);
const streamerList = await kanal.messages.fetch(ldb.streamListID);
if(messageList) messageList.delete().catch(e => {})
if(voiceList) voiceList.delete().catch(e => {})
if(registerList) registerList.delete().catch(e => {})
if(inviteList) inviteList.delete().catch(e => {})
if(cameraList) cameraList.delete().catch(e => {})
if(streamerList) streamerList.delete().catch(e => {})          
await lb.deleteMany({ guildID: settings.guildID});
message.reply({content: `Leaderboard Verileri Başarıyla Sıfırlandı.`})
}  
}
}