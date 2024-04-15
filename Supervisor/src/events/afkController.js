const Discord = require("discord.js");
const afk = require("../schemas/afk");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
module.exports = async (message) => {
if (message.author.bot || !message.guild) return; 
if(!message) return;
const data = await afk.findOne({ userID: message.author.id }) || [];
if (data.reason) {
if (message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", "")).catch(e => {})
message.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`${message.member} adlı kullanıcı **AFK** modundan çıktı! Tekrar hoş geldin!\nKullanıcı ${moment.duration(Date.now() - data.date).format("d [gün] H [saat], m [dakika] s [saniye]")} den beri \`${data.reason}\` sebebiyle **AFK** modundaydı!`)] }).sil(15)
await afk.updateOne({ userID: message.author.id }, { $unset: { reason: {} } });
return }
const member = message.mentions.members.first();
if (!member) return;
const afkData = await afk.findOne({ userID: member.user.id }) || []
if (data.reason) {
await message.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`<@` + message.author.id + `> Etiketlediğiniz kullanıcı ${moment.duration(Date.now() - data.date).format("d [gün] H [saat], m [dakika] s [saniye]")} den beri \`${afkData.reason}\` sebebiyle **AFK**`)] }).sil(15)
return }
};
module.exports.conf = {
name: "messageCreate",
};