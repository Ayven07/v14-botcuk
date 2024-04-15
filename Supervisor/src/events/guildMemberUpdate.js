const Discord = require("discord.js")
const rollers = require("../schemas/rollog")
var moment = require('moment-timezone');
moment().tz("Europe/Istanbul").format('LL');
const client = global.client;
module.exports = async (oldMember, newMember) => {
let audit = await newMember.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.MemberRoleUpdate })
let ayar = audit.entries.first()
const channel = await client.kanalBul("rol-log")
let hedef = ayar.target 
let yapan = ayar.executor
if (yapan.bot) return
newMember.roles.cache.forEach(async role => {
if (!oldMember.roles.cache.has(role.id)) {
const emed = new Discord.EmbedBuilder()
.setAuthor({ name: hedef.tag, iconURL: hedef.avatarURL({ dynamic: true }) })
.setColor("Random")
.setDescription(`
${yapan} Tarafından <t:${String(Date.now()).slice(0, 10)}:R> \n${hedef} Kullanıcısına ${role} Rolü Verildi.

\`\`\`js

Rol Eklenen kişi: ${hedef.globalName ? hedef.globalName : hedef.tag} - ${hedef.id}
Rolü Ekleyen Kişi: ${yapan.globalName ? yapan.globalName : yapan.tag} - ${yapan.id}
Eklenen Rol: ${role.name} - ${role.id}
\`\`\``)  
.setFooter({ text: `${yapan.globalName ? yapan.globalName : yapan.tag}`, iconURL: yapan.avatarURL({ dynamic: true }) })
.setTimestamp()
channel.send({ embeds: [emed]}).catch(e => {});       
await rollers.updateOne({user: hedef.id}, { $push: { roller: { rol: role.id, mod: yapan.id, tarih: Date.now(), state: "Ekleme" } } }, { upsert: true})                          
}
});
oldMember.roles.cache.forEach(async role => {
if (!newMember.roles.cache.has(role.id)) {
const emeed = new Discord.EmbedBuilder()
.setAuthor({ name: hedef.tag, iconURL: hedef.avatarURL({ dynamic: true }) })
.setColor("Random")
.setDescription(`
${yapan} Tarafından <t:${String(Date.now()).slice(0, 10)}:R> \n${hedef} Kullanıcısından ${role} Rolü Alındı.         
          
\`\`\`js

Rolü Alınan kişi: ${hedef.globalName ? hedef.globalName : hedef.tag} - ${hedef.id}
Rolü Alan Kişi: ${yapan.globalName ? yapan.globalName : yapan.tag} - ${yapan.id}
Alınan Rol: ${role.name} - ${role.id}
\`\`\``)
.setFooter({ text: `${yapan.globalName ? yapan.globalName : yapan.tag}`, iconURL: yapan.avatarURL({ dynamic: true }) })
.setTimestamp()
channel.send({ embeds: [emeed]}).catch(e => {});
await rollers.updateOne({user: hedef.id}, { $push: { roller: {rol: role.id, mod: yapan.id, tarih: Date.now(), state: "Kaldırma" } } }, { upsert: true})                          
}
});
}
module.exports.conf = {
name: 'guildMemberUpdate',
};