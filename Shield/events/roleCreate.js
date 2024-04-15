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
const roleShield = global.roleShield;
const panels = require("../schemas/panel")
const settings = require('../../Supervisor/src/configs/settings.json')
let { log } = console;
module.exports = async (role) => {
let data = await panels.findOne({ guildID: settings.guildID })
let logs = await role.guild.fetchAuditLogs({type: Discord.AuditLogEvent.RoleCreate });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.roleShield == false || entry.executor.id == role.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}
if (await mainShield.checkWhitelist(entry.executor.id, "rol") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Rol Açtı!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
           
\`••❯\` Rolü Açan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Açılan Rol: ${role.name} \`(${role.id})\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", roleShield)
}
let member = await role.guild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(roleShield, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
role.delete({ reason: `İzinsiz Rol Açma İşlemi!` }).catch(e => {})
await mainShield.send(`
**❯** ${entry.executor} Bir **Rol Açtı!** ${response}

\`••❯\` Rolü Açan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Açılan Rol: ${role.name} \`(${role.id})\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", roleShield)    
};
module.exports.conf = {
name: "roleCreate",
};