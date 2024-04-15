const joinedAt = require("../schemas/voiceJoinedAt");
const voiceUser = require("../schemas/voiceUser");
const voiceGuild = require("../schemas/voiceGuild");
const guildChannel = require("../schemas/voiceGuildChannel");
const userChannel = require("../schemas/voiceUserChannel");
const userParent = require("../schemas/voiceUserParent");
const Discord = require("discord.js");
const a = require("../configs/settings.json")
const Guild = require("../schemas/pGuild");
const User = require("../schemas/pUser")
const client = global.client;
const emojis = require('../configs/emojiName.json')
const coin = require("../schemas/coin");
const setups = require("../schemas/setup")
const setup = require("../schemas/memberSetup")
const streamUser = require("../schemas/streamUser")
const streamJoinedAt = require("../schemas/streamJoinedAt")
const cameraUser = require("../schemas/cameraUser")
const cameraJoinedAt = require("../schemas/cameraJoinedAt")
module.exports = async (oldState, newState) => {
if (oldState.member && oldState.member.user.bot || newState.member && newState.member.user.bot) return;
const ayar = await setups.findOne({guildID: a.guildID})
if(!ayar) return;   
if (!oldState.channelId && newState.channelId) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
let joinedAtData = await joinedAt.findOne({ userID: oldState.id });
if (!joinedAtData) {
await joinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true, new: true})
joinedAtData = await joinedAt.findOne({ userID: oldState.id });
}
const data = Date.now() - joinedAtData.date;
if(!oldState) return;
if (oldState.channelId && !newState.channelId) {
await saveDatas(oldState, oldState.channel, data);
await joinedAt.deleteOne({ userID: oldState.id });
} else if (oldState.channelId && newState.channelId) {
await saveDatas(oldState, oldState.channel, data);
await joinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}

//////////////Yayin Data///////////
if (oldState.channelId && !oldState.streaming && newState.channelId && newState.streaming) await streamJoinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
let streamJoinedAtData = await streamJoinedAt.findOne({ userID: oldState.id });
if (!streamJoinedAtData) {
await streamJoinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true, new: true})
streamJoinedAtData = await streamJoinedAt.findOne({ userID: oldState.id });
}
const ydata = Date.now() - streamJoinedAtData.date;
if(!oldState) return;
if (oldState.streaming && !newState.streaming) {
await streamDatas(oldState, oldState.channel, ydata);
await streamJoinedAt.deleteOne({ userID: oldState.id });
} else if (oldState.channelId && oldState.streaming && newState.channelId && newState.streaming) {
await streamDatas(oldState, oldState.channel, ydata);
await streamJoinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}
////////////// Kamera Data////////////
if (oldState.channelId && !oldState.selfVideo && newState.channelId && newState.selfVideo) await cameraJoinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
let cameraJoinedAtData = await cameraJoinedAt.findOne({ userID: oldState.id });
if (!cameraJoinedAtData) {
await cameraJoinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true, new: true})
cameraJoinedAtData = await cameraJoinedAt.findOne({ userID: oldState.id });
}
const cdata = Date.now() - cameraJoinedAtData.date;
if(!oldState) return;
if (oldState.selfVideo && !newState.selfVideo) {
await cameraDatas(oldState, oldState.channel, cdata);
await cameraJoinedAt.deleteOne({ userID: oldState.id });
} else if (oldState.selfVideo && newState.selfVideo) {
await cameraDatas(oldState, oldState.channel, cdata);
await cameraJoinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
}
let datas = await Guild.findOne({ guildId: newState.guild.id });
if(datas?.private_voices?.mode == false) return;
if(!newState.member) return;
let user = await User.findOne({ userId: newState.member.user.id });
if (!user) {
await User.create({ userId: newState.member.user.id })
}
let channelId = await datas?.private_voices?.channelId;
let categoryId = await datas?.private_voices?.categoryId;
if (oldState?.channelId !== datas?.private_voices?.channelId && oldState.channel?.parentId == datas?.private_voices?.categoryId && oldState.channel?.members.size === 0) {
if(oldState.channel?.parentId != datas?.private_voices?.categoryId) return;
if(!oldState.channel?.parentId) return;
oldState.channel.delete().catch(e => {})
await User.updateOne({ userId: newState.member.user.id }, {$set: {'private_voices.voiceId': null, 'private_voices.lock': true }, }, {upsert: true})
}
if (datas?.private_voices?.mode === true) {
if (newState.channel?.id == channelId) {
if(!ayar.manRoles.some(x => newState.member.roles.cache.has(x)) && !ayar.womanRoles.some(x => newState.member.roles.cache.has(x))) return newState.member.voice.disconnect().catch(e => {})
await newState.guild.channels.create({
name: `${newState.member.displayName}`,
type: Discord.ChannelType.GuildVoice,
userLimit: 1,
parent: categoryId,
permissionOverwrites: [{ id: newState.member.id, allow: [Discord.PermissionFlagsBits.Stream, Discord.PermissionFlagsBits.Speak, Discord.PermissionFlagsBits.Connect, Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.MuteMembers, Discord.PermissionFlagsBits.DeafenMembers]}, {id: newState.guild.id, deny: [Discord.PermissionFlagsBits.Connect, Discord.PermissionFlagsBits.SendMessages]}, { id: ayar.unregRoles[0], deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect] }, { id: ayar.jailRoles[0], deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect] }, { id: ayar.reklamRoles[0], deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]}, { id: ayar.fakeAccRoles[0], deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect] }, { id: ayar.bannedTagRoles[0], deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]}]}).catch(e => {}).then(async (channel) => {
await User.updateOne({ userId: newState.member.user.id }, { $set: {'private_voices.voiceId': channel.id }, }, {upsert: true})
await newState.setChannel(channel).catch(e => {})
})
}
}
const logKanal = await client.kanalBul("level-up")
const voiceData = await voiceUser.findOne({ guildID: a.guildID, userID: oldState.id });
if(voiceData) {
const datas = await setup.findOne({guildID: a.guildID, userID: oldState.id})
if(!datas) new setup({guildID: a.guildID, userID: oldState.id, levelSystem: true, monthlySystem: true}).save();
if(datas && datas.levelSystem == false) return; 
if(voiceData.topStat >= 360000000 && voiceData.topStat < 1080000000) {
if(oldState.member.roles.cache.has(ayar.voiceBronzeRoles)) return;
logKanal.send(`🔊 ${oldState.member} tebrikler! Ses istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **${oldState.guild.roles.cache.get(ayar.voiceBronzeRoles).name}** rolüne terfi edildin!`).catch(e => {})
oldState.member.roles.add(ayar.voiceBronzeRoles).catch(e => {})
}
if(voiceData.topStat >= 1080000000 && voiceData.topStat < 2700000000) {
if(oldState.member.roles.cache.has(ayar.voiceSilverRoles)) return;
logKanal.send(`🔊 ${oldState.member} tebrikler! Ses istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **${oldState.guild.roles.cache.get(ayar.voiceSilverRoles).name}** rolüne terfi edildin!`).catch(e => {})
oldState.member.roles.add(ayar.voiceSilverRoles).catch(e => {})
oldState.member.roles.remove(ayar.voiceBronzeRoles).catch(e => {})
}
if(voiceData.topStat >= 2700000000 && voiceData.topStat < 7200000000) {
if(oldState.member.roles.cache.has(ayar.voiceGoldRoles)) return;
logKanal.send(`🔊 ${oldState.member} tebrikler! Ses istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **${oldState.guild.roles.cache.get(ayar.voiceGoldRoles).name}** rolüne terfi edildin!`).catch(e => {})
oldState.member.roles.add(ayar.voiceGoldRoles).catch(e => {})
oldState.member.roles.remove(ayar.voiceSilverRoles).catch(e => {})
}
if(voiceData.topStat >= 7200000000 && voiceData.topStat < 14400000000) {
if(oldState.member.roles.cache.has(ayar.voiceDiamondRoles)) return;
logKanal.send(`🔊 ${oldState.member} tebrikler! Ses istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **${oldState.guild.roles.cache.get(ayar.voiceDiamondRoles).name}** rolüne terfi edildin!`).catch(e => {})
oldState.member.roles.add(ayar.voiceDiamondRoles).catch(e => {})
oldState.member.roles.remove(ayar.voiceGoldRoles).catch(e => {})
}
if(voiceData.topStat >= 14400000000) {
if(oldState.member.roles.cache.has(ayar.voiceEmeraldRoles)) return;
logKanal.send(`🔊 ${oldState.member} tebrikler! Ses istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **${oldState.guild.roles.cache.get(ayar.voiceEmeraldRoles).name}** rolüne terfi edildin!`).catch(e => {})
oldState.member.roles.add(ayar.voiceEmeraldRoles).catch(e => {})
oldState.member.roles.remove(ayar.voiceDiamondRoles).catch(e => {})
}
}
};


async function saveDatas(user, channel, data) {
const ayars = await setups.findOne({guildID: a.guildID})
if(!ayars) return;  
if(user.id == '1144032209263677500') return;
await voiceUser.findOneAndUpdate({ guildID: a.guildID, userID: user.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data, threeWeeklyStat: data, monthStat: data} }, { upsert: true })
await voiceGuild.findOneAndUpdate({ guildID: a.guildID }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data, threeWeeklyStat: data, monthStat: data} }, { upsert: true })
if(channel && channel) await guildChannel.findOneAndUpdate({ guildID: a.guildID, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true })
if(channel && channel) await userChannel.findOneAndUpdate({ guildID: a.guildID, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true })
if (channel && channel.parent) await userParent.findOneAndUpdate({ guildID: a.guildID, userID: user.id, parentID: channel.parentId }, { $inc: { parentData: data } }, { upsert: true });
if (a.coinSystem === true && client.ranks.some((x) => user.member && user.member.roles.cache.has(x.role))) {
if(user.member && user.member.voice.deaf == true) return;  
if (channel && channel.parent && ayars.publicParents.includes(channel && channel.parentId)) {
if (data >= (1000 * 60) * a.voiceCount) await coin.findOneAndUpdate({ guildID: a.guildID, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / a.voiceCount) * a.publicCoin } }, { upsert: true });
} else if (data >= (1000 * 60) * a.voiceCount) await coin.findOneAndUpdate({ guildID: a.guildID, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / a.voiceCount) * a.voiceCoin } }, { upsert: true });
const coinData = await coin.findOne({ guildID: a.guildID, userID: user.id });
if (coinData && client.ranks.some(x => x.coin >= coinData.coin)) {
let newRank = client.ranks.filter(x => coinData.coin >= x.coin);
newRank = newRank[newRank.length-1];
if (newRank && Array.isArray(newRank.role) && !newRank.role.some(x => user.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.role) && !user.member.roles.cache.has(newRank.role)) {
const oldRank = client.ranks[client.ranks.indexOf(newRank)-1];
await user.member.roles.add(newRank.role).catch(e => {})
if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(x => user.member.roles.cache.has(x)) || oldRank && !Array.isArray(oldRank.role) && user.member.roles.cache.has(oldRank.role)) user.member.roles.remove(oldRank.role);
const embed = new Discord.EmbedBuilder().setColor("Random");
const channel = await client.kanalBul("rank-log")
channel.send({ embeds: [embed.setDescription(`${user.guild.emojiGöster(emoji.yldz)} ${user.member.toString()} üyesi **${coinData.coin}** puan hedefine ulaştı ve **${Array.isArray(newRank.role) ? newRank.role.map(x => `${user.guild.roles.cache.get(x).name}`).join(" | ") : `${user.guild.roles.cache.get(newRank.role).name}`}** ${user.guild.emojiGöster(emojis.konfeti)}`)]});
}
}
user.member.görevGüncelle(a.guildID, "ses", data, channel);
}
}
async function streamDatas(user, channel, ydata) {  
await streamUser.findOneAndUpdate({ guildID: a.guildID, userID: user.id }, { $inc: { topStat: ydata, dailyStat: ydata, weeklyStat: ydata, twoWeeklyStat: ydata, threeWeeklyStat: ydata, monthStat: ydata} }, { upsert: true })
if (a.coinSystem === true && client.ranks.some((x) => user.member && user.member.roles.cache.has(x.role))) {
user.member.görevGüncelle(a.guildID, "yayin", ydata, channel);
}
}
async function cameraDatas(user, channel, cdata) {  
await cameraUser.findOneAndUpdate({ guildID: a.guildID, userID: user.id }, { $inc: { topStat: cdata, dailyStat: cdata, weeklyStat: cdata, twoWeeklyStat: cdata, threeWeeklyStat: cdata, monthStat: cdata} }, { upsert: true })
if (a.coinSystem === true && client.ranks.some((x) => user.member && user.member.roles.cache.has(x.role))) {
user.member.görevGüncelle(a.guildID, "camera", cdata, channel);
}
}
module.exports.conf = {
name: "voiceStateUpdate",
};

