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
module.exports = async (member) => {
if(!member.user.bot) return;
let data = await panels.findOne({ guildID: settings.guildID })
let logs = await member.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.BotAdd });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.botShield == false || entry.executor.id == member.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;} 
if (await mainShield.checkWhitelist(entry.executor.id, "bot") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Bot Ekledi!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
   
\`••❯\` Ekleyen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Eklenen Bot: ${member.user.tag} \`(${member.user.id})\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", otherShield)
}
let members = await member.guild.members.fetch(entry.executor.id);
let response = members.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(otherShield, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
if (members && members.bannable) { await mainShield.punish(otherShield, members.id, "ban") } else if(members && !members.bannable) { await mainShield.spunish(members.id, "ban")}
await mainShield.send(`
**❯** ${entry.executor} Bir **Bot Ekledi!** ${response}

\`••❯\` Ekleyen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Eklenen Bot: ${member.user.tag} \`(${member.user.id})\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", otherShield)       
};
module.exports.conf = {
name: "guildMemberAdd",
};