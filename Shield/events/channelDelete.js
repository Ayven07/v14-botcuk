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
const mainShield = global.mainShield 
const channelShield = global.channelShield
const panels = require("../schemas/panel")
const settings = require('../../Supervisor/src/configs/settings.json')
let { log } = console;
module.exports = async (channel) => {
let dataa = await panels.findOne({ guildID: settings.guildID })
let logs = await channel.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.ChannelDelete });
let entry = logs.entries.first();
if (!entry || !entry.executor) {
return;}
if (dataa.channelShield == false || entry.executor.id == channel.guild.ownerId) {
return;}
if(await mainShield.mainBots(entry.executor.id)) {
return;}
let tür = { 2: "Ses Kanalı", 0: "Metin Kanalı", 5: "Duyuru Kanalı", 4: "Kategori", 13: "Sahne", 15: "Forum" }
if (await mainShield.checkWhitelist(entry.executor.id, "kanal") || await mainShield.checkWhitelist(entry.executor.id, "full")) {
return await mainShield.send(`
**❯** ${entry.executor} Bir **Kanal Silindi!** Üye Güvenli Listede Olduğu İçin **İşlem Uygulanmadı!**

\`••❯\` Kanalı Silen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Silinen Kanal: ${channel.name} \`(${channel.id})\` [\`${tür[channel.type]}\`]
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "yok", channelShield)
return;}
let member = await channel.guild.members.fetch(entry.executor.id);
let response = member.bannable ? "Ceza Uyguladım!" : "Yetkim Yetmediği İçin Ceza Uygulayamadım!"
if (member && member.bannable) { await mainShield.punish(channelShield, member.id, "ban") } else if(member && !member.bannable) { await mainShield.spunish(member.id, "ban")}
if (channel.type == 4) {
const tdata = await TextChannels.findOne({ channelID: channel.id });
const vdata = await VoiceChannels.findOne({ channelID: channel.id });
const cdata = await CategoryChannels.findOne({ channelID: channel.id });
const newParents = await channel.guild.channels.create({name: channel.name, position: cdata.position ? cdata.position : channel.position, type: Discord.ChannelType.GuildCategory})
if(newParents) {
const textChannels = await TextChannels.find({ parentID: channel.id });
const voiceChannels = await VoiceChannels.find({ parentID: channel.id });  
await TextChannels.updateOne({ parentID: channel.id }, { $set: { parentID: newParents.id } }, { upsert: true });
textChannels.forEach(c => {
const textChannel = channel.guild.channels.cache.get(c.channelID);
if (textChannel) textChannel.setParent(newParents, { lockPermissions: true });
});
await VoiceChannels.updateOne({ parentID: channel.id }, { $set: { parentID: newParents.id } }, { upsert: true });
voiceChannels.forEach(c => {
const voiceChannel = channel.guild.channels.cache.get(c.channelID);
if (voiceChannel) voiceChannel.setParent(newParents, { lockPermissions: true });
});    
const newOverwrite = [];
for (let index = 0; index < cdata.overwrites.length; index++) {
}
await newParents.permissionOverwrites.set(newOverwrite)   
channel.permissionOverwrites.cache.forEach(perm => {
let thisPermOverwrites = {};
perm.allow.toArray().forEach(p => {
thisPermOverwrites[p] = true;
});
perm.deny.toArray().forEach(p => {
thisPermOverwrites[p] = false;
});
newParents.permissionOverwrites.create(perm.id, thisPermOverwrites).catch(e => {})
});
}    
} else {
channel.clone({ parent: channel.parentId }).catch(e => {})
}
await mainShield.send(`
**❯** ${entry.executor} Bir **Kanal Silindi!** ${response}

\`••❯\` Kanalı Silen Kişi: ${entry.executor} \`(${entry.executor.id})\`
\`••❯\` Silinen Kanal: ${channel.name} \`(${channel.id})\` [\`${tür[channel.type]}\`]
\`••❯\` Tarih: <t:${Math.floor(Date.now() / 1000)}>`, "var", channelShield)
};
module.exports.conf = {
name: "channelDelete",
};