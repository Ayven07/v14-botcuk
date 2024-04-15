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
const settings = require('../../Supervisor/src/configs/settings.json');
let { log } = console;
module.exports = async (oldGuild, newGuild) => {
let data = await panels.findOne({ guildID: settings.guildID })
if ((oldGuild.splash !== newGuild.splash) || (oldGuild.iconURL() !== newGuild.iconURL()) || (oldGuild.name !== newGuild.name) || (oldGuild.bannerURL() !== newGuild.bannerURL())) {
let logs = await oldGuild.fetchAuditLogs({ type: Discord.AuditLogEvent.GuildUpdate });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (data.guildShield == false || entry.executor.id == mainShield.guilds.cache.get(settings.guildID).ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}    
if (await mainShield.checkWhitelist(entry.executor.id, "guild") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Kullanıcısı **Sunucu Üzerinde İşlem Gerçekleştirdi!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**
       
\`••❯\` İşlem Yapan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Eski Sunucu Bilgileri: \`${oldGuild.name}\` ${oldGuild.bannerURL() !== null ? `[Banner](${oldGuild.bannerURL()})` : ""} ${oldGuild.iconURL() !== null ? `[Icon](${oldGuild.iconURL()})` : ""} ${oldGuild.splash !== null ? `[Invite Banner](${oldGuild.splash})` : ""}
\`••❯\` Değişen Sunucu Bilgileri: \`${newGuild.name}\` ${newGuild.bannerURL() !== null ? `[Banner](${newGuild.bannerURL()})` : ""} ${newGuild.iconURL() !== null ? `[Icon](${newGuild.iconURL()})` : ""} ${newGuild.splash !== null ? `[Invite Banner](${newGuild.splash})` : ""}
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", mainShield)
}
let member = await oldGuild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(mainShield, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
if (oldGuild.iconURL() !== newGuild.iconURL()) newGuild.setIcon(oldGuild.iconURL({ dynamic: true })).catch(e => {})
if (oldGuild.bannerURL() !== newGuild.bannerURL()) newGuild.setBanner(oldGuild.bannerURL({ size: 2048, dynamic: true })).catch(e => {})
if (oldGuild.name !== newGuild.name) newGuild.setName(oldGuild.name).catch(e => {})
if (oldGuild.splash !== newGuild.splash) newGuild.setSplash(oldGuild.splash).catch(e => {})
await mainShield.send(`
**❯** ${entry.executor} Kullanıcısı **Sunucu Üzerinde İşlem Gerçekleştirdi!** ${response}

\`••❯\` İşlem Yapan Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Eski Sunucu Bilgileri: \`${oldGuild.name}\` ${oldGuild.bannerURL() !== null ? `[Banner](${oldGuild.bannerURL()})` : ""} ${oldGuild.iconURL() !== null ? `[Icon](${oldGuild.iconURL()})` : ""} ${oldGuild.splash !== null ? `[Invite Banner](${oldGuild.splash})` : ""}
\`••❯\` Değişen Sunucu Bilgileri: \`${newGuild.name}\` ${newGuild.bannerURL() !== null ? `[Banner](${newGuild.bannerURL()})` : ""} ${newGuild.iconURL() !== null ? `[Icon](${newGuild.iconURL()})` : ""} ${newGuild.splash !== null ? `[Invite Banner](${newGuild.splash})` : ""}
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", mainShield)
}    
};
module.exports.conf = {
name: "guildUpdate",
};