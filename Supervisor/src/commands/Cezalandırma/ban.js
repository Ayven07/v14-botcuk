const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const banLimit = new Map();
moment.locale("tr");
const setups = require("../../schemas/setup")
const Discord = require("discord.js");
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["ban","yargı"],
name: "ban",
help: "ban @Rainha/ID Sebep",
category: "cezalandirma"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers) && !ayar.banHammer.some(x => message.member.roles.cache.has(x))) { message.reply({ content:"Yeterli yetkin bulunmuyor!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return }
if (!args[0]) { message.reply({ content:"Bir üye belirtmelisin!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return }
const user = message.mentions.users.first() || await client.fetchUser(args[0]);
if (!user) { message.reply({ content:"Böyle bir kullanıcı bulunamadı!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return }
const ban = await client.fetchBan(message.guild, args[0]);
if (ban) { message.reply({ content:"Bu üye zaten banlı!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return }
const reason = args.slice(1).join(" ") || "Belirtilmedi!";
const member = message.guild.members.cache.get(user.id);
if (message.guild.members.cache.has(user.id) && message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return message.reply({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini banlayamazsın!"}).sil(15)
if (member && !member.bannable) return message.reply({ content:"Bu üyeyi banlayamıyorum!"}).sil(15)
if (settings.banlimit > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == settings.banlimit) return message.reply({ content:"Saatlik ban sınırına ulaştın!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.yes))
if (settings.dmMessages) user.send({ content:`**${message.guild.name}** sunucusundan, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle banlandınız!`}).catch(() => {});
const penal = await client.penalize(settings.guildID, user.id, "BAN", true, message.author.id, reason);
if(message.guild.members.cache.get(user.id)) {
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $push: { ceza: 1 } }, { upsert: true });
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $inc: { top: 1 } }, { upsert: true });
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { BanAmount: 1 } }, {upsert: true});
await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
const logs = await client.kanalBul("cezapuan-log");
logs.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
}
message.guild.members.ban(user.id, { reason: `${reason} | Yetkili: ${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}` }).catch(() => {});
const Embed = embed
.setColor("Random")
.setAuthor({ name: `${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}`, iconURL: message.author.avatarURL({ dynamic: true }) })
.setImage("https://media.discordapp.net/attachments/1061350563775783004/1064216448706281632/a_4157779f8043232e0ed42f9dc918cfa7.gif")
.setDescription(`${message.guild.emojiGöster(emojis.ban)} **${member ? member.toString() : user.globalName}** Üyesi <t:${Math.floor(Date.now() / 1000)}:R> Sunucudan " **${reason}** " Sebebiyle ${message.author} Tarafından Banlandı! Ceza Numarası: (**#${penal.id}**)`)
message.reply({ embeds: [Embed]});
const log = new Discord.EmbedBuilder()
.setTitle("Bir Kullanıcı Yasaklandı!")
.setColor("Random")
.setAuthor({name: `${user.globalName ? user.globalName : user.tag}`, iconURL: user.avatarURL({dynamic: true})})
.setThumbnail(user.avatarURL({dynamic: true}))
.setDescription(` 
Banlanan Üye: \`${user.globalName ? user.globalName : user.tag} - ${user.id}\`
Banlayan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ban Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
const logKanal = await client.kanalBul("ban-log");
logKanal.send({ embeds: [log]});
if (settings.banlimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
setTimeout(() => {
if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
},
};

