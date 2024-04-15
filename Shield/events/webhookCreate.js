const Discord = require("discord.js")
const mainShield = global.mainShield 
const channelShield = global.channelShield
const panels = require("../schemas/panel")
const settings = require('../../Supervisor/src/configs/settings.json')
module.exports = async (channel) => {
let data = await panels.findOne({ guildID: settings.guildID })
let logs = await channel.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.WebhookCreate });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.channelShield == false || entry.executor.id == channel.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}
if (await mainShield.checkWhitelist(entry.executor.id, "kanal") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Webhook Oluşturuldu!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
           
\`••❯\` Webhook Açan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Açılan Webhook: ${channel.name} 
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", channelShield)
return;}
let member = await channel.guild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(channelShield, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
const webhooks = await channel.fetchWebhooks();
webhooks.forEach(async element => {
await element.delete().catch((e) => {})
});
await mainShield.send(`
**❯** ${entry.executor} Bir **Webhook Açıldı!** ${response}

\`••❯\` Webhook Açan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Açılan Webhook: ${channel.name} 
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", channelShield)
};
module.exports.conf = {
name: "webhooksUpdate",
};