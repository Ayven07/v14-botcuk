const moment = require("moment");
moment.locale("tr");
const setups = require("../schemas/setup")
const boost = require("../schemas/booster")
const settings = require("../configs/settings.json")
module.exports = async (oldMember, newMember) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;   
if (oldMember.roles.cache.has(ayar.boosterRoles) && !newMember.roles.cache.has(ayar.boosterRoles)) {
let member = newMember
await member.roles.remove(ayar.blackRoles).catch(() => {});
await member.roles.remove(ayar.blueRoles).catch(() => {});
await member.roles.remove(ayar.whiteRoles).catch(() => {});
await member.roles.remove(ayar.redRoles).catch(() => {});
await member.roles.remove(ayar.yellowRoles).catch(() => {});
await member.roles.remove(ayar.pinkRoles).catch(() => {});
await member.roles.remove(ayar.purpleRoles).catch(() => {});
await member.roles.remove(ayar.orangeRoles).catch(() => {}); 
await member.roles.remove(ayar.greenRoles).catch(() => {});
await member.roles.remove(ayar.brownRoles).catch(() => {});
await member.roles.remove(ayar.burgundyRoles).catch(() => {});
await member.roles.remove(ayar.turquoiseRoles).catch(() => {});
await member.roles.remove(ayar.beigeRoles).catch(() => {});
await member.roles.remove(ayar.navyblueRoles).catch(() => {});
await member.roles.remove(ayar.lightblueRoles).catch(() => {});
await member.roles.remove(ayar.pistachiogreenRoles).catch(() => {}); 
const booster = await boost.findOne({guildID: settings.guildID, userID: oldMember.id})  
if(booster) {
let members = newMember
await members.setNickname(booster.names).catch(e => {})
}  
}
};  
module.exports.conf = {
name: "guildMemberUpdate",
};