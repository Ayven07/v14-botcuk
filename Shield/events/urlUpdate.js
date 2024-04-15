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
const mainShield = global.mainShield
const settings = require('../../Supervisor/src/configs/settings.json')
let { log } = console;
module.exports = async (oldGuild, newGuild) => {
let data = await panels.findOne({ guildID: settings.guildID })
if(newGuild.premiumTier != "3") return;
if (newGuild.vanityURLCode !== conf.serverURL) {
let logs = await oldGuild.fetchAuditLogs({ type: Discord.AuditLogEvent.GuildUpdate });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.guildShield == false || entry.executor.id == mainShield.guilds.cache.get(settings.guildID).ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}         
if(await mainShield.checkWhitelist(entry.executor.id, "guild") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
await mainShield.send(`
**❯** ${entry.executor} Kullanıcısı **URL Üzerinde İşlem Gerçekleştirdi!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!** 

\`••❯\` URL'ye İşlem Yapan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Eski URL: \`${oldGuild.vanityURLCode}\`
\`••❯\` Değiştirilen URL: \`${newGuild.vanityURLCode}\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", mainShield)  
}
let member = await oldGuild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım! Self Bot Üzerinden İşlem Gerçekleştiriyorum."
if (member && member.bannable) { await mainShield.punish(mainShield, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
mainShield.setVanityURL(conf.serverURL)
await mainShield.send(`
**❯** ${entry.executor} Kullanıcısı **URL Üzerinde İşlem Gerçekleştirdi!** ${response}

\`••❯\` URL'ye İşlem Yapan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Eski URL: \`${oldGuild.vanityURLCode}\`
\`••❯\` Değişen URL: \`${newGuild.vanityURLCode}\`
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", mainShield)
}    
};
module.exports.conf = {
name: "guildUpdate",
};