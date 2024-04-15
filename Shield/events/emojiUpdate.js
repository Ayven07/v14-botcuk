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
const otherShield = global.otherShield;
const settings = require('../../Supervisor/src/configs/settings.json')
let { log } = console;
module.exports = async (oldEmoji, newEmoji) => {
let data = await panels.findOne({ guildID: settings.guildID })
let logs = await oldEmoji.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.EmojiUpdate });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.emojiShield == false || entry.executor.id == oldEmoji.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}  
if (await mainShield.checkWhitelist(entry.executor.id, "emoji") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Emoji Güncelledi!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
   
\`••❯\` Güncelleyen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Eski Emoji Bilgileri: \`${oldEmoji.name}\` [Emoji URL](${oldEmoji.url})
\`••❯\` Yeni Emoji Bilgileri: \`${newEmoji.name}\` [Emoji URL](${newEmoji.url})
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", otherShield)
}
let member = await oldEmoji.guild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(otherShield, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
newEmoji.edit({ name: oldEmoji.name }).catch( e => {})
await mainShield.send(`
**❯** ${entry.executor} Bir **Emoji Güncelledi!** ${response}

\`••❯\` Güncelleyen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Eski Emoji Bilgileri: \`${oldEmoji.name}\` [Emoji URL](${oldEmoji.url})
\`••❯\` Yeni Emoji Bilgileri: \`${newEmoji.name}\` [Emoji URL](${newEmoji.url})
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", otherShield)    
};
module.exports.conf = {
name: "emojiUpdate",
};