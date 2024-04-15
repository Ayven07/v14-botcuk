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
const roleShield = global.roleShield;
const settings = require('../../Supervisor/src/configs/settings.json')
let { log } = console;
module.exports = async (oldRole, newRole) => {
let data = await panels.findOne({ guildID: settings.guildID })
let logs = await oldRole.guild.fetchAuditLogs({type: Discord.AuditLogEvent.RoleUpdate });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.roleShield == false || entry.executor.id == newRole.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}
if (await mainShield.checkWhitelist(entry.executor.id, "rol") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Rol Güncellendi!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
           
\`••❯\` Rolü Düzenliyen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Düzenlenen Rol: ${oldRole.name} \`(${oldRole.id})\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", roleShield)
}
let member = await oldRole.guild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(roleShield, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
newRole.edit({name: oldRole.name, color: oldRole.color, hoist: oldRole.hoist, permissions: oldRole.permissions, position: oldRole.position, mentionable: oldRole.mentionable, reason: `İzinsiz Rol Güncelleme İşlemi!`}).catch(e => {})
await mainShield.send(`
**❯** ${entry.executor} Bir **Rol Güncellendi!** ${response}

\`••❯\` Rolü Düzenliyen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Düzenlenen Rol: ${oldRole.name} \`(${oldRole.id})\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", roleShield)    
};
module.exports.conf = {
name: "roleUpdate",
};