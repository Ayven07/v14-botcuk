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
const mainShield = global.mainShield;
const otherShield = global.otherShield;
const panels = require("../schemas/panel")
const settings = require('../../Supervisor/src/configs/settings.json')
let { log } = console;
module.exports = async (emoji) => {
let data = await panels.findOne({ guildID: settings.guildID })
let logs = await emoji.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.EmojiCreate });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.emojiShield == false || entry.executor.id == emoji.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}    
if (await mainShield.checkWhitelist(entry.executor.id, "emoji") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Emoji Oluşturdu!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
        
\`••❯\` Oluşturan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Emoji Bilgileri: \`${emoji.name}\` [Emoji URL](${emoji.url})
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", otherShield)
}
let member = await emoji.guild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(otherShield, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
emoji.delete().catch(e => {})
await mainShield.send(`
**❯** ${entry.executor} Bir **Emoji Oluşturdu!** ${response}

\`••❯\` Oluşturan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Emoji Bilgileri: \`${emoji.name}\` [Emoji URL](${emoji.url})
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", otherShield)    
};
module.exports.conf = {
name: "emojiCreate",
};