const { CronJob } = require("cron");
const client = global.client;
const Discord = require("discord.js")
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const streamUser = require("../schemas/streamUser")
const messageGuild = require("../schemas/messageGuild");
const voiceGuild = require("../schemas/voiceGuild");
const conf = require("../configs/settings.json")
const cameraUser = require("../schemas/cameraUser")
const setups = require("../schemas/setup")
const setup = require("../schemas/memberSetup")
const tasks = require('../schemas/tasks')
const leaveLimit = require('../schemas/leaveLimit')
module.exports = async () => {
const ayar = await setups.findOne({guildID: conf.guildID})
if(!ayar) return; 
const daily = new CronJob("0 0 * * *", () => {
client.guilds.cache.forEach(async (guild) => {
guild.members.cache.forEach(async (member) => {
await leaveLimit.deleteMany({guildID: conf.guildID})
await messageGuild.findOneAndUpdate({ guildID: conf.guildID }, { $set: { dailyStat: 0 } }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: conf.guildID }, { $set: { dailyStat: 0 } }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { dailyStat: 0 } }, { upsert: true });
});
});
}, null, true, "Europe/Istanbul");
daily.start();

const weekly = new CronJob("0 0 * * 0", () => {
client.guilds.cache.forEach(async (guild) => {
guild.members.cache.forEach(async (member) => {
await messageGuild.findOneAndUpdate({ guildID: conf.guildID }, { $set: { weeklyStat: 0} }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: conf.guildID }, { $set: { weeklyStat: 0} }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { weeklyStat: 0} }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { weeklyStat: 0} }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { weeklyStat: 0} }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { weeklyStat: 0} }, { upsert: true });
});
});
}, null, true, "Europe/Istanbul");
weekly.start();

const weeklyTwo = new CronJob("0 0 */2 * *", () => {
client.guilds.cache.forEach(async (guild) => {
guild.members.cache.forEach(async (member) => {
await messageGuild.findOneAndUpdate({ guildID: conf.guildID }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: conf.guildID }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { twoWeeklyStat: 0} }, { upsert: true });
});
});
}, null, true, "Europe/Istanbul");
weeklyTwo.start();

const weeklyThree = new CronJob("0 0 */3 * *", () => {
client.guilds.cache.forEach(async (guild) => {
guild.members.cache.forEach(async (member) => {
await messageGuild.findOneAndUpdate({ guildID: conf.guildID }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: conf.guildID }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { threeWeeklyStat: 0} }, { upsert: true });
});
});
}, null, true, "Europe/Istanbul");
weeklyThree.start();

const month = new CronJob("0 0 1 * *", () => {
client.guilds.cache.forEach(async (guild) => {
guild.members.cache.forEach(async (member) => {
await messageGuild.findOneAndUpdate({ guildID: conf.guildID }, { $set: { monthStat: 0} }, { upsert: true });
await voiceGuild.findOneAndUpdate({ guildID: conf.guildID }, { $set: { monthStat: 0} }, { upsert: true });
await messageUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { monthStat: 0} }, { upsert: true });
await voiceUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { monthStat: 0} }, { upsert: true });
await streamUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { monthStat: 0} }, { upsert: true });
await cameraUser.findOneAndUpdate({ guildID: conf.guildID, userID: member.user.id }, { $set: { monthStat: 0} }, { upsert: true });
});
 });
}, null, true, "Europe/Istanbul");
month.start();
  
const weeklyr = new CronJob("0 0 * * 0", () => {
const sunucu = client.guilds.cache.get(conf.guildID); 
sunucu.members.cache.forEach(async member => {
const datas = await setup.findOne({guildID: conf.guildID, userID: member.id})
if(!datas) new setup({guildID: conf.guildID, userID: member.id, levelSystem: true, monthlySystem: true}).save();
if(datas && datas.monthlySystem == false) return;
if(Date.now() - member.joinedAt > 1000 * 60 * 60 * 24 * 30) {
await member.roles.add(ayar.oneMonthRoles)}
if(Date.now() - member.joinedAt > 1000 * 60 * 60 * 24 * 90) {
await member.roles.remove(ayar.oneMonthRoles)
await member.roles.add(ayar.threeMonthRoles)}
if(Date.now() - member.joinedAt > 1000 * 60 * 60 * 24 * 180) {
await member.roles.remove(ayar.threeMonthRoles)
await member.roles.add(ayar.sixMonthRoles)}
if(Date.now() - member.joinedAt > 1000 * 60 * 60 * 24 * 270) {
await member.roles.remove(ayar.sixMonthRoles)
await member.roles.add(ayar.nineMonthRoles)}
if(Date.now() - member.joinedAt > 1000 * 60 * 60 * 24 * 365) {
await member.roles.remove(ayar.nineMonthRoles)
await member.roles.add(ayar.oneYearRoles)}
})
}, null, true, "Europe/Istanbul");
weeklyr.start();
  
};
module.exports.conf = {
name: "ready",
};