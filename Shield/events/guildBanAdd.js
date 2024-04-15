let conf = require('../config');
const { readdir } = require('fs');
const Discord = require("discord.js")
const whitelist = require(`../schemas/whitelist`)
const RoleModel = require("../schemas/role");
const CategoryChannels = require("../schemas/categoryChannels");
const TextChannels = require("../schemas/textChannels");
const VoiceChannels = require("../schemas/voiceChannels");
const request = require('request');
const mainShield = global.mainShield;
const otherShields = global.otherShields;
const setups = require("../schemas/setup");
const panels = require("../schemas/panel")
const settings = require('../../Supervisor/src/configs/settings.json')
let { log } = console;
module.exports = async (member) => {
let data = await panels.findOne({ guildID: settings.guildID })  
let logs = await member.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.MemberBanAdd });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.bankickShield == false || entry.executor.id == member.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;} 
if(member.user.bot) {
return;}
if (await mainShield.checkWhitelist(entry.executor.id, "bankick") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Kullanıcıyı Banladı!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
   
\`••❯\` Banlayan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Banlanan Kişi: ${member.user.tag} \`(${member.user.id})\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", otherShields)
}
let members = await member.guild.members.fetch(entry.executor.id);
let response = members.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (members && members.bannable) { await mainShield.punish(otherShields, members.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
member.guild.members.unban(member.user.id).catch(e => {})
await mainShield.send(`
**❯** ${entry.executor} Bir **Kullanıcıyı Banladı!** ${response}

\`••❯\` Banlayan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Banlanan Kişi: ${member.user.tag} \`(${member.user.id})\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", otherShields)     
};
module.exports.conf = {
name: "guildBanAdd",
};