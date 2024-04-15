const setups = require("../schemas/setup")
const Discord = require("discord.js");  
const a = require("../configs/settings.json")
const messageUser = require("../schemas/messageUser");
const messageGuild = require("../schemas/messageGuild");
const guildChannel = require("../schemas/messageGuildChannel");
const userChannel = require("../schemas/messageUserChannel");
const emojis = require('../configs/emojiName.json')
const client = global.client;
const nums = new Map();
const coin = require("../schemas/coin")
const dolars = require("../schemas/dolar");
const setup = require("../schemas/memberSetup")
module.exports = async (message) => {
if (message.author.bot || !message.guild || message.content.startsWith(a.prefix)) return;   
const ayar = await setups.findOne({guildID: a.guildID})
if(!ayar) return; 
await userChannel.findOneAndUpdate({ guildID: a.guildID,  userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true })
if(message.channel.id !== ayar.chatChannel) return;
await messageUser.findOneAndUpdate({ guildID: a.guildID, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1, threeWeeklyStat: 1, monthStat: 1} }, { upsert: true })
await messageUser.findOneAndUpdate({ guildID: a.guildID, userID: message.author.id }, { $set: { Date: Date.now() } }, { upsert: true })
await messageGuild.findOneAndUpdate({ guildID: a.guildID }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1, threeWeeklyStat: 1, monthStat: 1 } }, { upsert: true })
await guildChannel.findOneAndUpdate({ guildID: a.guildID, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true })
if (a.coinSystem === true && client.ranks.some((x) => message.member.roles.cache.has(x.role))) {
const num = nums.get(message.author.id);
if (num && (num % a.messageCount) === 0) {
nums.set(message.author.id, num + 1);
await coin.findOneAndUpdate({ guildID: a.guildID, userID: message.author.id }, { $inc: { coin: a.messageCoin } }, { upsert: true });
const coinData = await coin.findOne({ guildID: a.guildID, userID: message.author.id });
if (coinData && client.ranks.some(x => coinData.coin === x.coin)) {
let newRank = client.ranks.filter(x => coinData.coin >= x.coin);
newRank = newRank[newRank.length-1];
const oldRank = client.ranks[client.ranks.indexOf(newRank)-1];
await message.member.roles.add(newRank.role).catch(e => {}) 
if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(x => message.member.roles.cache.has(x)) || oldRank && !Array.isArray(oldRank.role) && message.member.roles.cache.has(oldRank.role)) message.member.roles.remove(oldRank.role);
const channel = await client.kanalBul("rank-log")
const embed = new Discord.EmbedBuilder().setColor("Random");
channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yldz)} ${message.member.toString()} üyesi **${coinData.coin}** puan hedefine ulaştı ve **${Array.isArray(newRank.role) ? newRank.role.map(x => `${message.guild.roles.cache.get(x).name}`).join(" | ") : `${message.guild.roles.cache.get(newRank.role).name}`}** rolü verildi! ${message.guild.emojiGöster(emojis.konfeti)}`)]});
}
} else nums.set(message.author.id, num ? num + 1 : 1);
message.member.görevGüncelle(a.guildID, "mesaj", 1, message.channel);
}

const logKanal = await client.kanalBul("level-up")
const mesajData = await messageUser.findOne({ guildID: a.guildID, userID: message.author.id });
if(mesajData) {
const datas = await setup.findOne({guildID: a.guildID, userID: message.author.id})
if(!datas) new setup({guildID: a.guildID, userID: message.author.id, levelSystem: true, monthlySystem: true}).save();
if(datas && datas.levelSystem == false) return;
if(mesajData.topStat == 2500 && mesajData.topStat < 5000) {
if(message.member.roles.cache.has(ayar.chatBronzeRoles)) return;  
logKanal.send(`💬 ${message.author} tebrikler! Mesaj istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **${message.guild.roles.cache.get(ayar.chatBronzeRoles).name}** rolüne terfi edildin!`).catch(e => {})
message.member.roles.add(ayar.chatBronzeRoles).catch(e => {})
}
if(mesajData.topStat == 5000 && mesajData.topStat < 10000) {
if(message.member.roles.cache.has(ayar.chatSilverRoles)) return;  
logKanal.send(`💬 ${message.author} tebrikler! Mesaj istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **${message.guild.roles.cache.get(ayar.chatSilverRoles).name}** rolüne terfi edildin!`).catch(e => {})
message.member.roles.add(ayar.chatSilverRoles).catch(e => {})
message.member.roles.remove(ayar.chatBronzeRoles).catch(e => {})
}
if(mesajData.topStat == 10000 && mesajData.topStat < 20000) {
if(message.member.roles.cache.has(ayar.chatGoldRoles)) return;  
logKanal.send(`💬 ${message.author} tebrikler! Mesaj istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **${message.guild.roles.cache.get(ayar.chatGoldRoles).name}** rolüne terfi edildin!`).catch(e => {})
message.member.roles.add(ayar.chatGoldRoles).catch(e => {})
message.member.roles.remove(ayar.chatSilverRoles).catch(e => {})
}
if(mesajData.topStat == 20000 && mesajData.topStat < 40000) {
if(message.member.roles.cache.has(ayar.chatDiamondRoles)) return;  
logKanal.send(`💬 ${message.author} tebrikler! Mesaj istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **${message.guild.roles.cache.get(ayar.chatDiamondRoles).name}** rolüne terfi edildin!`).catch(e => {})
message.member.roles.add(ayar.chatDiamondRoles).catch(e => {})
message.member.roles.remove(ayar.chatGoldRoles)
}
if(mesajData.topStat == 40000) {
if(message.member.roles.cache.has(ayar.chatEmeraldRoles)) return;  
logKanal.send(`💬 ${message.author} tebrikler! Mesaj istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **${message.guild.roles.cache.get(ayar.chatEmeraldRoles).name}** rolüne terfi edildin!`).catch(e => {})
message.member.roles.add(ayar.chatEmeraldRoles).catch(e => {})
message.member.roles.remove(ayar.chatEmeraldRoles).catch(e => {})
}
}  
const dolarData = await dolars.findOne({ guildID: a.guildID, userID: message.author.id });
if(dolarData) {
if(!dolarData || dolarData && !dolarData.hesap.length) return;
await dolars.findOneAndUpdate({ guildID: a.guildID, userID: message.author.id }, { $inc: { dolar: 1 } }, { upsert: true });  
}
};
module.exports.conf = {
name: "messageCreate",
};
