let conf = require('../config');
const { readdir } = require('fs');
const Discord = require("discord.js")
const whitelist = require(`../schemas/whitelist`)
const RoleModel = require("../schemas/role");
const CategoryChannels = require("../schemas/categoryChannels");
const TextChannels = require("../schemas/textChannels");
const VoiceChannels = require("../schemas/voiceChannels");
const request = require('request');
const setups = require("../schemas/setup");
const mainShield = global.mainShield 
const channelShield = global.channelShield
const panels = require("../schemas/panel")
const settings = require('../../Supervisor/src/configs/settings.json')
let { log } = console;
module.exports = async (oldChannel, newChannel) => {
let data = await panels.findOne({ guildID: settings.guildID })
let logs = await oldChannel.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.ChannelUpdate });
let entry = logs.entries.first();
let tür = { 2: "Ses Kanalı", 0: "Metin Kanalı", 5: "Duyuru Kanalı", 4: "Kategori", 13: "Sahne", 15: "Forum" }
if (!entry || !entry.executor) {
return;}
if (data.channelShield == false || entry.executor.id == newChannel.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}
if (await mainShield.checkWhitelist(entry.executor.id, "kanal") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Kanal Güncellendi!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
           
\`••❯\` Kanalı Güncelliyen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Güncellenen Kanal: ${oldChannel.name} \`(${oldChannel.id})\` [\`${tür[oldChannel.type]}\`]
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", channelShield)
return;}
let member = await newChannel.guild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(channelShield, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
oldChannel.guild.channels.edit(newChannel.id, {name:oldChannel.name, position:oldChannel.position, topic:oldChannel.topic, nsfw:oldChannel.nsfw, parent:oldChannel.parent, userLimit:oldChannel.userLimit, bitrate:oldChannel.bitrate,}).catch(e => {})
await mainShield.send(`
**❯** ${entry.executor} Bir **Kanal Güncellendi!** ${response}

\`••❯\` Kanalı Güncelliyen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Güncellenen Kanal: ${oldChannel.name} \`(${oldChannel.id})\` [\`${tür[oldChannel.type]}\`]
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", channelShield)
};
module.exports.conf = {
name: "channelUpdate",
};