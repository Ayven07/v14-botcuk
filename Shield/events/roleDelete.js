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
let Bots = [global.mainShield, global.roleShield, global.channelShield, global.otherShield, global.otherShields, global.chatShield, global.selfShield]
module.exports = async (role) => {
let dataa = await panels.findOne({ guildID: settings.guildID })
let logs = await role.guild.fetchAuditLogs({type: Discord.AuditLogEvent.RoleDelete });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (dataa.roleShield == false || entry.executor.id == role.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}
if (await mainShield.checkWhitelist(entry.executor.id, "rol") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Rol Sildi!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
 
\`••❯\` Rolü Silen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Silinen Rol: ${role.name} \`(${role.id})\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", roleShield)
}
let member = await role.guild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(roleShield, member.id, "ban")} else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
var Role = await role.guild.roles.create({name: role.name, color: role.color, hoist: role.hoist, permissions: role.permissions, position: role.rawPosition, mentionable: role.mentionable, reason: "Silinen Rol Geri Açıldı!"}).catch(e => {})
let data = await RoleModel.findOne({ guildID: role.guild.id, roleID: role.id })
if (!data) return log(`Veritabanında (${role.id}) ID'ye Sahip Bir Rol Bulunamadı!`) 
await mainShield.send(`
**❯** ${entry.executor} Bir **Rol Sildi!** ${response}

\`••❯\` Rolü Silen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Silinen Rol: ${role.name} \`(${role.id})\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", roleShield)
setTimeout(() => {
let channelWrites = data.channelOverwrites;
if (channelWrites) channelWrites.forEach((Rainha, index) => {
let channel = role.guild.channels.cache.get(Rainha.id);
if (!channel) return;
setTimeout(() => {
let obj = {};
Rainha.allow.forEach(p => {
obj[p] = true;
});
Rainha.deny.forEach(p => {
obj[p] = false;
});
channel.permissionOverwrites.create(Role, obj).catch(e => {})
}, index * 5000);
});
}, 5000);

let length = data.members.length;
let clientsCount = Bots.length
let clients = mainShield.getClients(clientsCount);
if (length <= 0) return;
let availableBots = Bots.filter(e => !e.Busy);
if (availableBots.length <= 0) availableBots = Bots.sort((x, y) => y.Uj - x.Uj).slice(0, Math.round(length / Bots.length));
let perAnyBotMembers = Math.floor(length / availableBots.length);
if (perAnyBotMembers < 1) perAnyBotMembers = 1;
for (let index = 0; index < availableBots.length; index++) {
const bot = availableBots[index];
let ids = data.members.slice(index * perAnyBotMembers, (index + 1) * perAnyBotMembers);
if (ids.length <= 0) { mainShield.processBot(bot, false, -perAnyBotMembers); break; }
let guild = bot.guilds.cache.get(settings.guildID); 
ids.every(async id => {
let member = guild.members.cache.get(id);
if(!member){
console.log(`Oto Silinen Rol Kurulumundan sonra ${bot.user.username} - ${id} adlı üyeyi sunucuda bulamadım.`);
return true;}
await member.roles.add(Role.id).then(e => {console.log(`Oto Silinen Rol kurulumundan sonra ${member.user.username} adlı üye ${Role.name} rolünü aldı.`);}).catch(e => {console.log(`[${Role.id}] Olayından sonra ${member.user.username} adlı üyeye rol veremedim.`);});});
mainShield.processBot(bot, false, -perAnyBotMembers); }      
};
module.exports.conf = {
name: "roleDelete",
};