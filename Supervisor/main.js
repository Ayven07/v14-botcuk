const Discord = require("discord.js");
const { Rainha } = require('../client')
const client = global.client = new Rainha()
const settings = require("./src/configs/settings.json");
const setups = require("./src/schemas/setup")
const tasks = require('./src/schemas/tasks')
const coins = require('./src/schemas/coin')
const emojis = require('./src/configs/emojiName.json')
const fs = require("fs");
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.invites = new Discord.Collection();
client.cooldown = new Map();
client.ranks = [
{ role: "", coin: 1 },
{ role: "", coin: 20 },
]

fs.readdir('./src/commands/', (err, files) => {
if (err) console.error(err);
files.forEach(f => {
fs.readdir("./src/commands/" + f, (err2, files2) => {
files2.forEach(file => {
let props = require(`./src/commands/${f}/` + file);
console.log(`${props.conf.name} komutu yüklendi!`);
client.commands.set(props.conf.name, props);
props.conf.aliases.forEach(alias => {
client.aliases.set(alias, props.conf.name);
});
})
})
});
});

fs.readdir("./src/events", (err, files) => {
if (err) return console.error(err);
files
.filter((file) => file.endsWith(".js"))
.forEach((file) => {
let prop = require(`./src/events/${file}`);
if (!prop.conf) return;
client.on(prop.conf.name, prop);
console.log(`[EVENT] ${prop.conf.name} eventi yüklendi!`);
});
});

Rainha.MongoLogin(settings.mongoUrl)
Rainha.BotLogin(client, settings.token)

client.on(Discord.VoiceStateUpdate, async (oldState, newState) => { 
if(oldState.member.id === client.user.id && oldState.channelId && !newState.channelId) {
voiceJoin(client)  
}
}) 
///////////////Fonksiyon//////////////
Discord.Collection.prototype.array = function () {
return [...this.values()]
}
Array.prototype.random = function() {
return this[(Math.floor(Math.random()*this.length))];
};  
Discord.Guild.prototype.emojiGöster = function(content) {
let emoji = client.emojis.cache.find(e => e.name === content) || client.emojis.cache.find(e => e.id === content) || client.emojis.cache.find(e => e.id === content) || client.emojis.cache.find(e => e.name === content)
if(!emoji) return;
return emoji;
}
client.kanalBul = async function(content) {
const guild = client.guilds.cache.get(settings.guildID);
if (!guild) return;
const isChannelName = guild.channels.cache.some(channel => channel.name === content);
let kanal;
if (isChannelName) {
kanal = guild.channels.cache.find(e => e.name === content);
} else {
kanal = guild.channels.cache.get(content);
}
return kanal;
}

Array.prototype.last = function () {
return this[this.length - 1];
};

Promise.prototype.sil = function (time) {
if (this) this.then(s => {
if (s.deletable) {
setTimeout(async () => {
s.delete().catch(e => { });
}, time * 1000)
}
});
};
Discord.GuildMember.prototype.görevGüncelle = async function (guildID, type, data, channel = null) {
const guild = client.guilds.cache.get(guildID)
if(!guild) return;
const taskData = await tasks.find({ guildID, userID: this.user.id, type, active: true });
taskData.forEach(async (x) => {
if (channel && x.channels && x.channels.some((x) => x !== channel.id)) return; x.completedCount += data;
if (x.completedCount >= x.count) {
x.active = false; x.completed = true;
await coins.updateOne({ guildID, userID: this.user.id }, { $inc: { coin: x.prizeCount } }, { upsert: true })
const embed = new Discord.EmbedBuilder().setAuthor({name: this.user.username, iconURL: this.user.avatarURL({dynamic: true})}).setFooter({text: guild.name, iconURL: guild.iconURL({dynamic: true})})
const channel = await client.kanalBul('gorev-log')
channel.send({content: `${this.toString()}`, embeds: [embed.setDescription(`
${guild.emojiGöster(emojis.konfeti)} **${this.toString()} Tebrikler ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} Görevini Bitirdin!**

${guild.emojiGöster(emojis.warn)} __**GÖREV DETAYLARI**__
${guild.emojiGöster(emojis.nokta)} **Görev Tipi:** \` ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} \`
${guild.emojiGöster(emojis.nokta)} **Görev Detayları:** \` ${x.message} \` 
${guild.emojiGöster(emojis.nokta)} **Görev Ödülü:** \` ${x.prizeCount} Puan \``)]})
}
await x.save();
});
};      
Discord.GuildMember.prototype.hasRole = function (role, every = true) {
return (Array.isArray(role) && (every && role.every((x) => this.roles.cache.has(x)) || !every && role.some((x) => this.roles.cache.has(x))) || !Array.isArray(role) && this.roles.cache.has(role))
};
function getRandomInt(min, max) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
}
client.fetchUser = async (userID) => {
try {
return await client.users.fetch(userID);
} catch (err) {
return undefined;
}
};
client.fetchBan = async (guild, userID) => {
try {
return await guild.bans.fetch(userID);
} catch (err) {
return undefined;
}
};
function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
}
}
client.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
Discord.GuildMember.prototype.setRoles = function (roles) {
if (!this.manageable) return;
const newRoles = this.roles.cache.filter(x => x.managed).map(x => x.id).concat(roles);
return this.roles.set(newRoles).catch(() => {});
};
async function errors(content, sex) {
if (sex) {
const sexString = sex?.message
const embed = new Discord.EmbedBuilder()
if (sexString) embed.setDescription("```js\n" + (sexString.length > 2000 ? `${sexString.substr(0, 1900)}...` : sexString) + "\n```");
var channel = await client.kanalBul("error_log")
channel.send({embeds: [embed]})
} else {
const sexString = sex?.message
const embed = new Discord.EmbedBuilder()
if (sexString) embed.setDescription("```js\n" + (sexString.length > 2000 ? `${sexString.substr(0, 1900)}...` : sexString) + "\n```");
embed.addFields({ name: "Description", value: content || sex?.message || "." });
var channel = await client.kanalBul("error_log")
channel.send({embeds: [embed]})
}
}
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
client.penalize = async (guildID, userID, type, active = true, staff, reason, temp = false, finishDate = undefined) => {
const penals = require("./src/schemas/penals");
let id = await penals.find({ guildID });
id = id ? id.length + 1 : 1;
return await new penals({ id, userID, guildID, type, active, staff, reason, temp, finishDate }).save();
};

client.on(Discord.Events.UserUpdate, async (old, nev) => {
let guild = await (client.guilds.cache.get(settings.guildID))
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;
if(ayar.tagSystem == false) return;
let uye = guild.members.cache.get(old.id)
const regstats = require("./src/schemas/registerStats");
let embed = new Discord.EmbedBuilder().setColor('Random').setFooter({ text: `${ayar.botFooter ? ayar.botFooter : `${old.guild.name}`}` }).setTimestamp()
let tagges = guild.members.cache.filter(s => ayar.serverTag.some(a => s.user.globalName && s.user.globalName.includes(a))).size
const log = await client.kanalBul("taglı-log");
const tags = ayar.serverTag.join(" - ")
if(ayar.serverTag.some(tag => nev.globalName && nev.globalName.includes(tag))) {
uye.roles.add(ayar.tagRoles).catch(e => { });
if(uye.displayName.includes(ayar.defaultTag) && uye.manageable) await uye.setNickname(uye.displayName.replace(ayar.defaultTag, ayar.nameTag)).catch(e => { });
if (log) log.send({ embeds: [embed.setDescription(`
${uye} kullanıcısı ${tags} tagını aldığı için <@&${ayar.tagRoles}> verildi.

\`\`\`js

Önce: ${old.globalName ? old.globalName : old.tag} | Sonra: ${nev.globalName ? nev.globalName : nev.tag}

Aktif taglı sayısı: ${tagges}
\`\`\``)] })
} else if(ayar.serverTag.some(tag => old.globalName && old.globalName.includes(tag) && nev.globalName && !nev.globalName.includes(tag))) {      
uye.roles.remove(ayar.tagRoles).catch(e => {})
const enAltYt = ayar.registerPerms
uye.roles.remove(uye.roles.cache.filter(s => s.position >= enAltYt.position)).catch(e => { });
if(uye.displayName.includes(ayar.nameTag) && uye.manageable) await uye.setNickname(uye.displayName.replace(ayar.nameTag, ayar.defaultTag)).catch(e => { });
if (log) log.send({ embeds: [embed.setDescription(`
${uye} kullanıcısı ${tags} tagını saldığı için <@&${ayar.tagRoles}> alındı.

\`\`\`js
Önce: ${old.globalName ? old.globalName : old.tag} | Sonra: ${nev.globalName ? nev.globalName : nev.tag}

Aktif taglı sayısı: ${tagges}
\`\`\``)] })
}    
});

