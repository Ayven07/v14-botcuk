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
const panels = require("../schemas/panel")
const mainShield = global.mainShield;
const otherShields = global.otherShields;
const settings = require('../../Supervisor/src/configs/settings.json')
let { log } = console;
module.exports = async (sticker) => {
let data = await panels.findOne({ guildID: settings.guildID })
let logs = await sticker.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.StickerCreate });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.stickerShield == false || entry.executor.id == sticker.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}  
if (await mainShield.checkWhitelist(entry.executor.id, "sticker") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯**${entry.executor} Bir Sticker Oluşturdu! Üye Güvenli Listede Olduğu İçin İşlem Uygulanmadı!**
   
\`••❯\`Oluşturan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\`Sticker Bilgileri: \`${sticker.name}\` [Sticker URL](${sticker.url})
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", otherShields)
 }
let member = await sticker.guild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(otherShields, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
sticker.delete().catch(e => {})
await mainShield.send(`
**❯** ${entry.executor} Bir **Sticker Oluşturdu!** ${response}

\`••❯\` Oluşturan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Sticker Bilgileri: \`${sticker.name}\` [Sticker URL](${sticker.url})
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", otherShields)    
};
module.exports.conf = {
name: "stickerCreate",
};