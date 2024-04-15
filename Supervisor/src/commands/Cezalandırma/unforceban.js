const moment = require("moment");
moment.locale("tr");
const Discord = require("discord.js")
const penals = require("../../schemas/penals");
const settings = require("../../configs/settings.json")
const forceBans = require("../../schemas/forceBans")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["unforceban"],
name: "unforceban",
help: "unforceban @Rainha/ID",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed) => {
if (!args[0]) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
return }
const ban = await client.fetchBan(message.guild, args[0]);   
if (!ban) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Bu üye banlı değil!"}).then((e) => setTimeout(() => { e.delete(); }, 15000));
return }
const forcebans = await forceBans.findOne({userID: args[0]})
if(!forcebans) 
{ 
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Bu üye kalıcı banlı değil!"}).then((e) => setTimeout(() => { e.delete(); }, 15000));
return }
await forceBans.deleteMany({userID: args[0]})
message.guild.members.unban(args[0], `${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} tarafından kaldırıldı!`).catch(() => {});
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({ content:`${message.guild.emojiGöster(emojis.yes)} **(${ban.user.globalName && ban.user.globalName} - ${ban.user.id})** Adlı Üyenin Kalıcı Banı <t:${Math.floor(Date.now() / 1000)}:R> ${message.author} Tarafından Kaldırıldı!`})
if (settings.dmMessages) ban.user.send({ content:`**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından kalıcı banınız kaldırıldı!`}).catch(() => {});
const log = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({name: `${ban.user.globalName ? ban.user.globalName : ban.user.tag}`, iconURL: ban.user.avatarURL({dynamic: true})})
.setThumbnail(ban.user.avatarURL({dynamic: true}))
.setTitle("Bir Kullanıcı Kalıcı Yasağı Kaldırıldı!")
.setDescription(`   
Banı Kaldırılan Üye: \`${ban.user.globalName ? ban.user.globalName : ban.user.tag} - ${ban.user.id}\`
Banı Kaldıran Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
const banLog = await client.kanalBul("ban-log"); 
banLog.send({ embeds: [log]});
},
};

