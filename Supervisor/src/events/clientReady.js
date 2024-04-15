const client = global.client;
const settings = require("../configs/settings.json")
const penals = require("../schemas/penals");
const bannedTag = require("../schemas/bannedTag");
const Discord = require("discord.js")
const tasks = require("../schemas/tasks")
const lb = require("../schemas/leaderboard")
const dolars = require("../schemas/dolar");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const db = require("../schemas/inviter");
const emojis = require('../configs/emojiName.json')
const regstats = require("../schemas/registerStats");
const streamUser = require("../schemas/streamUser")
const cameraUser = require("../schemas/cameraUser")
const setups = require("../schemas/setup")
module.exports = async () => {  
const guild = client.guilds.cache.get(settings.guildID)
guild.invites.fetch()
.then(invites => {
const codeUses = new Map();
invites.each(inv => codeUses.set(inv.code, inv.uses));
client.invites.set(guild.id, codeUses);
})
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;
voiceJoin(client)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
setInterval(() => { BannedTag(); }, 10 * 1000); 
setInterval(() => { RolsuzeKayitsizVerme(); }, 10 * 1000); 
setInterval(() => { TagAlıncaKontrol(); }, 10 * 1000);
setInterval(() => { TagBırakanKontrol(); }, 10 * 1000);
setInterval(() => { leaderBoard(); }, 600000 * 3)
setInterval(() => { DolarEvent(guild); }, 600000 * 3)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const logKanal = await client.kanalBul("mute-log");
const logKanals = await client.kanalBul("vmute-log"); 
const logsKanal = await client.kanalBul("jail-log");
setInterval(async () => {  
const guild = client.guilds.cache.get(settings.guildID);
if (!guild) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
const finishedPenals = await penals.find({ guildID: guild.id, active: true, temp: true, finishDate: { $lte: Date.now() } });
finishedPenals.forEach(async (x) => {
const member = guild.members.cache.get(x.userID);
if (!member) return;
if (x.type === "CHAT-MUTE") {
x.active = false;
await x.save();
await member.roles.remove(ayar.muteRoles).catch(e => {});
logKanal.send({ embeds: [new Discord.EmbedBuilder().setColor("Random").setAuthor({name: member.user.tag, iconURL: member.user.avatarURL({dynamic: true})}).setThumbnail(member.user.avatarURL({dynamic: true})).setDescription(`${member.toString()} Adlı Kullanıcının **Text Kanallarındaki** Mute Süresi Doldu.`)]}).catch(e => {});
}
if (x.type === "TEMP-JAIL") {
x.active = false;
await x.save();
await member.setRoles(ayar.unregRoles).catch(e => {});
logsKanal.send({ embeds: [new Discord.EmbedBuilder().setColor("Random").setAuthor({name: member.user.tag, iconURL: member.user.avatarURL({dynamic: true})}).setThumbnail(member.user.avatarURL({dynamic: true})).setDescription(`${member.toString()} Adlı Kullanıcının Jail Süresi Bittiği İçin Kaldırıldı.`)]}).catch(e => {});
} 
if (x.type === "VOICE-MUTE") {
if (member.voice.channelId) {
x.removed = true;
await x.save();
if (member.voice.serverMute) member.voice.setMute(false).catch(e => {});
}
x.active = false;
await x.save();
member.roles.remove(ayar.vmuteRoles).catch(e => {});
logKanals.send({ embeds: [new Discord.EmbedBuilder().setColor("Random").setAuthor({name: member.user.tag, iconURL: member.user.avatarURL({dynamic: true})}).setThumbnail(member.user.avatarURL({dynamic: true})).setDescription(`${member.toString()} Adlı Kullanıcının **Ses Kanallarındaki** Mute Süresi Doldu.`)]}).catch(e => {});
}
});
const activePenals = await penals.find({ guildID: guild.id, active: true });
activePenals.forEach(async (x) => {
const member = guild.members.cache.get(x.userID);
if (!member) return;
if (x.type === "CHAT-MUTE" && !ayar.muteRoles.some((x) => member.roles.cache.has(x))) return member.roles.add(ayar.muteRoles).catch(e => {});
if ((x.type === "JAIL" || x.type === "TEMP-JAIL") && !ayar.jailRoles.some((x) => member.roles.cache.has(x))) return member.setRoles(ayar.jailRoles).catch(e => {});
if (x.type === "VOICE-MUTE") {
if (!ayar.vmuteRoles.some((x) => member.roles.cache.has(x))) member.roles.add(ayar.vmuteRoles).catch(e => {});
if (member.voice.channelId && !member.voice.serverMute) member.voice.setMute(true).catch(e => {});
}
});
}, 750);              
setInterval(() => { gorevKontrol(); }, 15* 1000)    
};
module.exports.conf = {
name: "ready"
};

async function voiceJoin(clients) {
setInterval(() => { sesKontrol(); }, 5000);
async function sesKontrol() { 
const { joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");
const connection = getVoiceConnection(settings.guildID);
if (connection) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;
const VoiceChannel = clients.channels.cache.get(ayar.voiceChannel);
if (VoiceChannel) { joinVoiceChannel({
channelId: VoiceChannel.id,
guildId: VoiceChannel.guild.id,
adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
selfDeaf: true,
selfMute: true,
group: clients.user.id
})}
}
}
async function gorevKontrol() {
client.guilds.cache.forEach(async (guild) =>
await tasks.findOneAndUpdate({ guildID: guild.id, active: true, finishDate: { $lte: Date.now() } }, { active: false }))
}
async function TagAlıncaKontrol() { 
const guild = client.guilds.cache.get(settings.guildID)
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;
if(ayar.tagSystem == false) return;
const members = [...guild.members.cache.filter(member => ayar.serverTag.some(tag => member.user.globalName && member.user.globalName.includes(tag) || member.user.username.includes(tag)) && !member.user.bot && !member.roles.cache.has(ayar.jailRoles) && !member.roles.cache.has(ayar.tagRoles)).values()].splice(0, 10)
for await (const member of members) {
if(member.displayName.includes(ayar.defaultTag) && member.manageable) await member.setNickname(member.displayName.replace(ayar.defaultTag, ayar.nameTag))
await member.roles.add(ayar.tagRoles).catch(err => {})
}
};
async function TagBırakanKontrol() {
const guild = client.guilds.cache.get(settings.guildID)
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;
if(ayar.tagSystem == false) return;
const memberss = [...guild.members.cache.filter(member => !ayar.serverTag.some(tag => member.user.globalName && member.user.globalName.includes(tag) || member.user.username.includes(tag)) && !member.user.bot && member.roles.cache.has(ayar.tagRoles)).values()].splice(0, 10)
for await (const member of memberss) {
if(member.displayName.includes(ayar.nameTag) && member.manageable) await member.setNickname(member.displayName.replace(ayar.nameTag, ayar.defaultTag)).catch(e => { });
await member.roles.remove(ayar.tagRoles).catch(err => {})
}
const registerData  = require("../schemas/registerStats");
let data = await registerData.findOne({ guildID: settings.guildID})
if(data && data.tagMode === true) {
const guild = client.guilds.cache.get(settings.guildID)
const memberss = [...guild.members.cache.filter(member => !ayar.ownerRoles.some(x => member.roles.cache.has(x)) && !member.roles.cache.has(ayar.vipRoles) && !member.roles.cache.has(ayar.boosterRoles) && !ayar.serverTag.some(tag => member.user.globalName && member.user.globalName.includes(tag) || member.user.username.includes(tag)) && !member.user.bot).values()].splice(0, 10)
for await (const member of memberss) {
await member.roles.set(ayar.unregRoles).catch(err => {})
await member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(e => {})  
} 
}  
};
async function RolsuzeKayitsizVerme()  {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
const guild = client.guilds.cache.get(settings.guildID);
let Rainha = guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== guild.id).size == 0)
Rainha.forEach(r => {
if(r.voice) r.voice.disconnect().catch(e => {})
r.roles.add(ayar.unregRoles).catch(err => {})
r.setNickname(`${ayar.defaultTag} ${ayar.unregName}`).catch(err => {})
})
};
async function BannedTag()  {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;    
const res = await bannedTag.findOne({ guildID: settings.guildID });
if (!res) return;
const guild = client.guilds.cache.get(settings.guildID)
const members = [...guild.members.cache.filter(member => !member.roles.cache.has(ayar.bannedTagRoles)).values()]
for await (const member of members) {  
res.taglar.forEach((x) => {
if(member.user.globalName && !member.user.globalName.includes(x) || !member.user.username.includes(x)) return; 
if(member.user.globalName && member.user.globalName.includes(x) || member.user.username.includes(x)) { 
member.roles.set(ayar.bannedTagRoles).catch(e => {})
member.setNickname("Yasaklı Tag").catch(e => {})
}
})
}
} 

async function leaderBoard()  {
const guild = client.guilds.cache.get(settings.guildID)  
const ayar = await setups.findOne({guildID: guild.id })   
if(!ayar) return;
const ldb = await lb.findOne({guildID: guild.id })   
if(!ldb) return;
if(ldb && !ldb.channels) return;
if(!ldb.messageListID) return;
if(!ldb.voiceListID) return;
if(!ldb.registerListID) return;
if(!ldb.inviteListID) return;
if(!ldb.cameraListID) return;
if(!ldb.streamListID) return;
const kanal = guild.channels.cache.get(ldb.channels)
const messageList = await kanal.messages.fetch(ldb.messageListID);
const voiceList = await kanal.messages.fetch(ldb.voiceListID);
const registerList = await kanal.messages.fetch(ldb.registerListID);
const inviteList = await kanal.messages.fetch(ldb.inviteListID);
const cameraList = await kanal.messages.fetch(ldb.cameraListID);
const streamerList = await kanal.messages.fetch(ldb.streamListID);
const voiceUsersData = await voiceUser.find({ guildID: guild.id }).sort({ topStat: -1 });
let list = voiceUsersData
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, index) => `❯ \` ${index+1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");
const messageUsersData = await messageUser.find({ guildID: guild.id }).sort({ topStat: -1 });
let mlist = messageUsersData
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, index) => `❯ \` ${index+1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${Number(x.topStat).toLocaleString()} Mesaj \``)
.join("\n");
const streamUsersData = await streamUser.find({ guildID: guild.id }).sort({ topStat: -1 });
let ylist = streamUsersData
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, index) => `❯ \` ${index+1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");    
const cameraUsersData = await cameraUser.find({ guildID: guild.id }).sort({ topStat: -1 });
let clist = cameraUsersData
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, index) => `❯ \` ${index+1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");    
let data = await db.find({ guildID: guild.id }).sort({ total: -1 });
let arr = [];
data.forEach((x) => arr.push({ id: x.userID, total: x.total }));
let dlist = data
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, index) => `❯ \` ${index + 1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${x.total} Davet \``)
.join("\n");
let kdata = await regstats.find({ guildID: guild.id }).sort({ top: -1 });
let karr = [];
kdata.forEach((x) => karr.push({ id: x.userID, top: x.top }));
let klist = kdata
.filter((x) => guild.members.cache.get(x.userID))
.splice(0, 30)
.map((x, i) => `❯ \` ${i + 1}. \` ${guild.members.cache.has(x.userID) ? guild.members.cache.get(x.userID) : client.users.fetch(x.userID).globalName}: \` ${x.top} Kayıt \``)
.join("\n");  
let embed = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({ name: guild.name, iconURL: guild.iconURL({dynamic: true})})                
await voiceList.edit({embeds: [embed.setDescription(`${guild.emojiGöster(emojis.hos)} *Aşağıda **${guild.name}**  Sunucusunun Genel Ses Sıralaması Listelenmektedir.*\n\n${list.length > 0 ? list : "Veri Bulunmuyor."}\n\n${guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
await messageList.edit({embeds: [embed.setDescription(`${guild.emojiGöster(emojis.hos)} *Aşağıda **${guild.name}** Sunucusunun Genel Mesaj Sıralaması Listelenmektedir.*\n\n${mlist.length > 0 ? mlist : "Veri Bulunmuyor."}\n\n${guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
await registerList.edit({embeds: [embed.setDescription(`${guild.emojiGöster(emojis.hos)} *Aşağıda **${guild.name}** Sunucusunun Genel Kayıt Sıralaması Listelenmektedir.*\n\n${klist.length > 0 ? klist : "Veri Bulunmuyor."}\n\n${guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
await inviteList.edit({embeds: [embed.setDescription(`${guild.emojiGöster(emojis.hos)} *Aşağıda **${guild.name}** Sunucusunun Genel Davet Sıralaması Listelenmektedir.*\n\n${dlist.length > 0 ? dlist : "Veri Bulunmuyor."}\n\n${guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
await cameraList.edit({embeds: [embed.setDescription(`${guild.emojiGöster(emojis.hos)} *Aşağıda **${guild.name}** Sunucusunun Genel Kamera Sıralaması Listelenmektedir.*\n\n${clist.length > 0 ? clist : "Veri Bulunmuyor."}\n\n${guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
await streamerList.edit({embeds: [embed.setDescription(`${guild.emojiGöster(emojis.hos)} *Aşağıda **${guild.name}** Sunucusunun Genel Yayın Sıralaması Listelenmektedir.*\n\n${ylist.length > 0 ? ylist : "Veri Bulunmuyor."}\n\n${guild.emojiGöster(emojis.info)} *Güncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>*`)]})
}


client.dolarEvent = async function (guild) {
const ayar = await setups.findOne({guildID: guild.id})
if(!ayar) return;
const sayı = Math.floor(Math.random() * 405);  
const miktar = sayı;
var Button = new Discord.ButtonBuilder()
.setLabel("Ödülü Al!")
.setCustomId("odulsal")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji(guild.emojiGöster(emojis.konfeti).id)
const row = new Discord.ActionRowBuilder()
.addComponents([Button])
const mesaj = await guild.channels.cache.get(ayar.chatChannel).send({embeds: [new Discord.EmbedBuilder().setImage(guild.bannerURL({size: 1024, dynamic: true})).setAuthor({name: guild.name, iconURL: guild.iconURL({dynamic: true})}).setDescription(`
Merhaba **${guild.name}** Üyeleri,

**${settings.guildName} Doları** Almak İster Misin? Hemen Başkası Almadan Button'a Bass.`)], components: [row]})
let collector = await mesaj.createMessageComponentCollector({ time: 10000 })
collector.on("collect", async (button) => {
if(button.customId === "odulsal") {
const dolarData = await dolars.findOne({ guildID: guild.id, userID: button.member.id });
if(!dolarData || dolarData && !dolarData.hesap.length) return button.reply({content: `${button.member} Dolar Hesabın Olmadığı İçin Dolar Alamazsın.`, ephemeral: true})
await button.deferUpdate();
await collector.stop();
await mesaj.edit({embeds: [new Discord.EmbedBuilder().setImage(guild.bannerURL({size: 1024, dynamic: true})).setAuthor({name: guild.name, iconURL: guild.iconURL({dynamic: true})}).setDescription(`>>> ${button.member}, Tebrikler **${miktar} ${settings.guildName} Doları** Kazandın.`)], components: []})
await dolars.findOneAndUpdate({ guildID: guild.id, userID: button.member.id }, { $inc: { dolar: miktar } }, { upsert: true });  
}
})
collector.on("end", (_, reason) => {
if(reason == "time") mesaj.edit({components: []}).sil(15)
})
}