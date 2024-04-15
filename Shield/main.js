const { WebhookClient, EmbedBuilder, AuditLogEvent, Events, Collection, ChannelType, PermissionFlagsBits } = require('discord.js')
let conf = require('./config');
const { readdir } = require('fs');
const fs = require('fs');
const Discord = require("discord.js")
const whitelist = require(`./schemas/whitelist`)
const RoleModel = require("./schemas/role");
const CategoryChannels = require("./schemas/categoryChannels");
const TextChannels = require("./schemas/textChannels");
const VoiceChannels = require("./schemas/voiceChannels");
const request = require('request');
const setups = require("./schemas/setup");
const panels = require("./schemas/panel")
const settings = require('../Supervisor/src/configs/settings.json')
let { log } = console;
const { Rainha } = require('../client')
let mainShield = global.mainShield = new Rainha();
let roleShield = global.roleShield = new Rainha();
let channelShield = global.channelShield = new Rainha();
let otherShield = global.otherShield = new Rainha()
let otherShields = global.otherShields = new Rainha()
let chatShield = global.chatShield = new Rainha()
const { Client } = require('discord.js-selfbot-v13');
const selfShield = global.selfShield = new Client({checkUpdate: false});
let Bots = global.clients = [mainShield, roleShield, channelShield, otherShield, otherShields, chatShield, selfShield]
Rainha.MongoLogin(settings.mongoUrl)

mainShield.mainBots = async function(id) {
const member = mainShield.guilds.cache.get(settings.guildID).members.cache.get(id);
if(member) {
if (settings.owners.some(x => x == id) || conf.bots.some(w => w == id) || id == chatShield.user.id || id == selfShield.user.id || id == mainShield.user.id || id == otherShields.user.id || id == roleShield.user.id || id == otherShield.user.id || id == channelShield.user.id) return true;    
} return false;
}

mainShield.checkWhitelist = async function(id, type) {
let member = mainShield.guilds.cache.get(settings.guildID).members.cache.get(id);
if(!member) return;  
let res = await whitelist.findOne({guildID: settings.guildID});
if (!res) {
res = {"full": [], "guild": [], "rol": [], "kanal": [], "bankick": [], "emoji": [], "bot": [], "sticker": [],  "swear": [], "advert": [],
}
await whitelist.updateOne({ guildID: settings.guildID}, {}, {upsert: true, setDefaultsOnInsert: true}).exec()
} else {
if(type == "full") {  
if (member && res.full.some(id => member.id == id) || res.full.some(id => member.roles.cache.has(id))) return true;
} else if(type == "guild") {  
if (member && res.guild.some(id => member.id == id) || res.guild.some(id => member.roles.cache.has(id))) return true;
} else if(type == "rol") {  
if (member && res.rol.some(id => member.id == id) || res.rol.some(id => member.roles.cache.has(id))) return true;
} else if(type == "kanal") {  
if (member && res.kanal.some(id => member.id == id) || res.kanal.some(id => member.roles.cache.has(id))) return true;
} else if(type == "bankick") {  
if (member && res.bankick.some(id => member.id == id) || res.bankick.some(id => member.roles.cache.has(id))) return true;
} else if(type == "emoji") {  
if (member && res.emoji.some(id => member.id == id) || res.emoji.some(id => member.roles.cache.has(id))) return true;
} else if(type == "bot") {  
if (member && res.bot.some(id => member.id == id) || res.bot.some(id => member.roles.cache.has(id))) return true;
} else if(type == "sticker") {  
if (member && res.sticker.some(id => member.id == id) || res.sticker.some(id => member.roles.cache.has(id))) return true;
} else if(type == "swear") {  
if (member && res.swear.some(id => member.id == id) || res.swear.some(id => member.roles.cache.has(id))) return true;
} else if(type == "advert") {  
if (member && res.advert.some(id => member.id == id) || res.advert.some(id => member.roles.cache.has(id))) return true;
}
} return false;
}

async function sendMessageToOwners(guild, ownerIds, message) {
const embed = new Discord.EmbedBuilder().setColor("Random")
for (const ownerId of ownerIds) {
const owner = await guild.members.cache.get(ownerId);
if (owner instanceof Discord.GuildMember) {
 owner.send({ embeds: [embed.setDescription(message)] }).catch(err => console.error(`Mesaj gönderilirken hata oluştu: ${err}`));
}
}
}

mainShield.send = async function(Rainha, etiket, client) {
const embed = new Discord.EmbedBuilder().setColor("Random")
const guild = client.guilds.cache.get(settings.guildID)
const kanal = guild.channels.cache.find((x) => x.name == 'guard-log')
const owner = guild.members.cache.get(guild.ownerId)
if(etiket == "var") {
 sendMessageToOwners(guild, settings.owners, Rainha)
 kanal.send({content: `@everyone`, embeds: [embed.setDescription(Rainha)]}).catch(() => owner.send(`${embed}`, "yok", mainShield))
} else if(etiket == "yok") {
 sendMessageToOwners(guild, settings.owners, Rainha)  
 kanal.send({embeds: [embed.setDescription(Rainha)]}).catch(() => owner.send(`${embed}`, "yok", mainShield))
}
}
mainShield.punish = async function(client, member, type) {
if (!["ban"].some(Rainha => type == Rainha)) return;
let guild = client.guilds.cache.get(settings.guildID);
let user = guild.members.cache.get(member)
if(!user) return guild.members.ban(member, { reason: "Guard Sunucu Koruma" }).catch(() => {});
switch (type) {        
case 'ban':
if(!user.bannable) return log(`[HATA] ${user && user.user.username} Kullanıcısına [BAN] İşlemi Uygulanamadı!`)
user.ban({reason: "Guard Sunucu Koruma"}).catch(() => {})
log(`[CEZA] ${user && user.user.username} Kullanıcısına [BAN] İşlemi Uygulandı!`)
break;                                       
}    
}
mainShield.spunish = async function(member, type) {
if (!["ban"].some(Rainha => type == Rainha)) return;
let guild = selfShield.guilds.cache.get(settings.guildID);
let user = guild.members.cache.get(member)
if(!user) return guild.members.ban(member, { reason: "Taç Guard Sunucu Koruma" }).catch(() => {});
switch (type) {        
case 'ban':
if(!user.bannable) return log(`[HATA] ${user && user.user.username} Kullanıcısına [BAN] İşlemi Uygulanamadı!`)
user.ban({reason: "Taç Guard Sunucu Koruma"}).catch(e => {})
log(`[CEZA] ${user && user.user.username} Kullanıcısına [BAN] İşlemi Uygulandı!`)
break;                          
}    
}

fs.readdir("./events", (err, files) => {
if (err) return console.error(err);
files
.filter((file) => file.endsWith(".js"))
.forEach((file) => {
let prop = require(`./events/${file}`);
if (!prop.conf) return;
mainShield.on(prop.conf.name, prop);
console.log(`[EVENT] ${prop.conf.name} eventi yüklendi!`);
});
});

const commands = mainShield.commands = new Collection();
const aliases = mainShield.aliases = new Collection();
readdir("./commands/", (err, files) => {
if (err) console.error(err)
files.forEach(f => {
readdir("./commands/" + f, (err2, files2) => {
if (err2) console.log(err2)
files2.forEach(file => {
let prop = require(`./commands/${f}/` + file);
console.log(`[KOMUT] ${prop.name} Yüklendi!`);
commands.set(prop.name, prop);
prop.aliases.forEach(alias => { aliases.set(alias, prop.name); });
});
});
});
});

mainShield.on(Events.MessageCreate, async (message) => {
if (!message.guild) return;
if(!message.content.startsWith(conf.prefix)) return;
const args = message.content.slice(1).trim().split(/ +/g);
const commands = args.shift().toLowerCase();
const cmd = mainShield.commands.get(commands) || [...mainShield.commands.values()].find((e) => e.aliases && e.aliases.includes(commands));
const embed = new EmbedBuilder().setColor(`Random`).setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) }).setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
if (cmd) return cmd.execute(mainShield, message, args, embed);
})

mainShield.on(Events.ClientReady, async () => {
var guild = mainShield.guilds.cache.get(settings.guildID) 
setInterval(() => {
mainShield.channelBackUp(guild, guild.id)
mainShield.roleBackUp(guild, guild.id)  
}, 600000);  
voiceJoin(mainShield)
})
mainShield.on(Events.VoiceStateUpdate, async (oldState, newState) => {
if(oldState.member.id === mainShield.user.id && oldState.channelId && !newState.channelId) {
voiceJoin(mainShield)
}
})
Rainha.BotLogin(mainShield, conf.mainShield)

roleShield.on(Events.ClientReady, async () => {
let data = await panels.findOne({ guildID: settings.guildID })
if(!data) new panels({guildID: settings.guildID, urlShield: false, guildShield: false, roleShield: false, channelShield: false, botShield: false, emojiShield: false, stickerShield: false, bankickShield: false, swearShield: false, advertShield: false}).save();  
voiceJoin(roleShield)
})
roleShield.on(Events.VoiceStateUpdate, async (oldState, newState) => {
if(oldState.member.id === roleShield.user.id && oldState.channelId && !newState.channelId) {
voiceJoin(roleShield)
}
})
Rainha.BotLogin(roleShield, conf.roleShield)

channelShield.on(Events.ClientReady, async () => {
voiceJoin(channelShield)
})
channelShield.on(Events.VoiceStateUpdate, async (oldState, newState) => {
if(oldState.member.id === channelShield.user.id && oldState.channelId && !newState.channelId) {
voiceJoin(channelShield)
}
})
Rainha.BotLogin(channelShield, conf.channelShield)

otherShield.on(Events.ClientReady, async () => {
voiceJoin(otherShield)
})
otherShield.on(Events.VoiceStateUpdate, async (oldState, newState) => {
if(oldState.member.id === otherShield.user.id && oldState.channelId && !newState.channelId) {
voiceJoin(otherShield)
}
})
Rainha.BotLogin(otherShield, conf.otherShield)

otherShields.on(Events.ClientReady, async () => {
voiceJoin(otherShields)
})
otherShields.on(Events.VoiceStateUpdate, async (oldState, newState) => {
if(oldState.member.id === otherShields.user.id && oldState.channelId && !newState.channelId) {
voiceJoin(otherShields)
}
})
Rainha.BotLogin(otherShields, conf.othersShield)

chatShield.on(Events.ClientReady, async () => {
voiceJoin(chatShield)
})
chatShield.on(Events.VoiceStateUpdate, async (oldState, newState) => {
if(oldState.member.id === chatShield.user.id && oldState.channelId && !newState.channelId) {
voiceJoin(chatShield)
}
})
Rainha.BotLogin(chatShield, conf.chatShield)

selfShield.on(Discord.Events.ClientReady, async () => { 
let data = await panels.findOne({ guildID: settings.guildID })
setInterval(() => {
if(data && data.urlShield == true) {
if(selfShield.guilds.cache.get(settings.guildID).premiumSubscriptionCount < 0 && selfShield.guilds.cache.get(settings.guildID).premiumSubscriptionCount < 13) return;   
if(selfShield.guilds.cache.get(settings.guildID).vanityURLCode == conf.serverURL) return;
mainShield.setVanityURL(conf.serverURL)  
}   
}, 10000)  
voiceJoin(selfShield)
})
selfShield.on("voiceStateUpdate", async (oldState, newState) => {
if(oldState.member.id === selfShield.user.id && oldState.channelId && !newState.channelId) {
voiceJoin(selfShield)
}
})
Rainha.SelfLogin(selfShield, conf.selfShield)

mainShield.on(Events.GuildMemberRemove, async (member) => {
var veri = await whitelist.findOne({guildID: settings.guildID}) 
if(!veri) return;
if (await mainShield.mainBots(member.id)) return;       
if (veri.full.includes(member.id)) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { full: member.id } }, { upsert: true }); 
} 
if (veri.guild.includes(member.id)) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { guild: member.id } }, { upsert: true }); 
} 
if (veri.rol.includes(member.id)) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { rol: member.id } }, { upsert: true }); 
} 
if (veri.kanal.includes(member.id)) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { kanal: member.id } }, { upsert: true }); 
} 
if (veri.bankick.includes(member.id)) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { bankick: member.id } }, { upsert: true }); 
} 
if (veri.emoji.includes(member.id)) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { emoji: member.id } }, { upsert: true }); 
} 
if (veri.bot.includes(member.id)) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { bot: member.id } }, { upsert: true }); 
} 
if (veri.sticker.includes(member.id)) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { sticker: member.id } }, { upsert: true }); 
}
if (veri.swear.includes(member.id)) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { swear: member.id } }, { upsert: true }); 
} 
if (veri.advert.includes(member.id)) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { advert: member.id } }, { upsert: true }); 
}
})

mainShield.roleBackUp = async function(guild, guildID) {    
await RoleModel.deleteMany({});
guild.roles.cache.forEach(async role => {
let roleChannelOverwrites = [];
await guild.channels.cache.filter(c => c.permissionOverwrites && c.permissionOverwrites.cache.has(role.id)).forEach(c => {
let channelPerm = c.permissionOverwrites.cache.get(role.id);
let pushlanacak = {
id: c.id,
allow: channelPerm.allow.toArray(),
deny: channelPerm.deny.toArray()
};
roleChannelOverwrites.push(pushlanacak);
});
await RoleModel.updateOne({roleID: role.id}, {$set: {guildID: guild.id, roleID: role.id, name: role.name, color: role.hexColor, hoist: role.hoist, position: role.rawPosition, permissions: role.permissions.bitfield, mentionable: role.mentionable, time: Date.now(), members: role.members.map(m => m.id), channelOverwrites: roleChannelOverwrites}}, {upsert: true});
});
log("Rollerin Verileri Başarıyla Yedeklendi!")
};

mainShield.channelBackUp = async function(guild, guildID) {
await TextChannels.deleteMany({});
await VoiceChannels.deleteMany({});
await CategoryChannels.deleteMany({});
if (guild) {
const channels = [...guild.channels.cache.values()];
for (let index = 0; index < channels.length; index++) {
const channel = channels[index];
let ChannelPermissions = [];
if (channel.permissionOverwrites) {
channel.permissionOverwrites.cache.forEach(perm => {
ChannelPermissions.push({ id: perm.id, type: perm.type, allow: perm.allow.toArray(), deny: perm.deny.toArray() });
});
}
if (channel.type == 4) { 
await CategoryChannels.updateOne({ channelID: channel.id }, {$set: {channelID: channel.id, name: channel.name, type: channel.type, position: channel.rawPosition, overwrites: ChannelPermissions,}},{ upsert: true });
}  
if ((channel.type == 0) || (channel.type == 5)) {
await TextChannels.updateOne({ channelID: channel.id }, {$set: { channelID: channel.id, name: channel.name, type: channel.type, nsfw: channel.nsfw, parentName: channel.parent ? channel.parent.name : null, parentID: channel.parentId, position: channel.rawPosition, rateLimit: channel.rateLimitPerUser, overwrites: ChannelPermissions,}},{ upsert: true });
}  
if (channel.type == 2) {
await VoiceChannels.updateOne({ channelID: channel.id }, {$set: { channelID: channel.id, name: channel.name, type: channel.type, bitrate: channel.bitrate, userLimit: channel.userLimit, parentName: channel.parent ? channel.parent.name : null, parentID: channel.parentId, position: channel.rawPosition,  overwrites: ChannelPermissions,}},{ upsert: true });
}
}     
console.log("Kanal Verileri Başarıyla Yedeklendi!");
}
}

Promise.prototype.sil = function (time) {
if (this) this.then(s => {
if (s.deletable) {
setTimeout(async () => {
s.delete().catch(e => { });
}, time * 1000)
}
});
};

mainShield.setVanityURL = async function(url) {
if(selfShield.guilds.cache.get(settings.guildID).vanityURLCode === conf.serverURL) return;    
const headers = {"authorization": selfShield.token, "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"};
const payload = { "code": url };
request.patch({url: `https://discord.com/api/v10/guilds/${settings.guildID}/vanity-url`, headers: headers, json: payload }, (error, response, body) => {
if (response.statusCode == 200) {    
let obj = {
vanityURL: url,
guildID: settings.guildID   
}
selfShield.emit(Discord.Events.VanitySuccess, obj)
} else {
let obj = {
error:response.body.message
}
selfShield.emit(Discord.Events.VanityError, obj)
}
});
}


mainShield.giveBot = async (length) => {
if (length > Bots.length) length = Bots.length;
let availableBots = Bots.filter(e => !e.Busy);
if (availableBots.length <= 0) availableBots = Bots.sort((x, y) => x.Uj - y.Uj).slice(0, length);
return availableBots;
};
    
mainShield.processBot = async (bot, busy, job, equal = false) => {
bot.Busy = busy;
if (equal) bot.Uj = job;
else bot.Uj += job;
let index = Bots.findIndex(e => e.user.id == bot.user.id);
Bots[index] = bot;
};
    
mainShield.getClients = async (count) => {
return Bots.slice(0, count);
};
    
mainShield.sleep = async (ms) => {
return new Promise(resolve => setTimeout(resolve, ms));
};

async function voiceJoin(client) {
setInterval(() => { sesKontrol(); }, 5000);
async function sesKontrol() { 
const { joinVoiceChannel, getVoiceConnection} = require("@discordjs/voice");
const connection = getVoiceConnection(settings.guildID);
if (connection) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;
const VoiceChannel = client.channels.cache.get(ayar.voiceChannel);
if (VoiceChannel) { joinVoiceChannel({
channelId: VoiceChannel.id,
guildId: VoiceChannel.guild.id,
adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
selfDeaf: true,
selfMute: true,
group: client.user.id
})}
 }
}

Discord.Guild.prototype.emojiGöster = function(content) {
let emoji = mainShield.emojis.cache.find(e => e.name === content) || mainShield.emojis.cache.find(e => e.id === content) || mainShield.emojis.cache.find(e => e.id === content) || mainShield.emojis.cache.find(e => e.name === content)
if(!emoji) return;
return emoji;
}