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
module.exports = async (oldSticker, newSticker) => {
let data = await panels.findOne({ guildID: settings.guildID })
let logs = await oldSticker.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.StickerUpdate });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.stickerShield == false || entry.executor.id == oldSticker.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}  
if (await mainShield.checkWhitelist(entry.executor.id, "sticker") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Sticker Güncelledi!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
   
\`••❯\` Güncelleyen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Eski Sticker Bilgileri: \`${oldSticker.name}\` [Sticker URL](${oldSticker.url})
\`••❯\` Yeni Sticker Bilgileri: \`${newSticker.name}\` [Sticker URL](${newSticker.url})
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", otherShields)
return; }
let member = await oldSticker.guild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(otherShields, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
newSticker.edit({ name: oldSticker.name, tags: oldSticker.tags, description: oldSticker.description }).catch(e => {})
await mainShield.send(`
**❯** ${entry.executor} Bir **Sticker Güncelledi!** ${response}

\`••❯\` Güncelleyen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Eski Sticker Bilgileri: \`${oldSticker.name}\` [Sticker URL](${oldSticker.url})
\`••❯\` Yeni Sticker Bilgileri: \`${newSticker.name}\` [Sticker URL](${newSticker.url})
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", otherShields)    
};
module.exports.conf = {
name: "stickerUpdate",
};