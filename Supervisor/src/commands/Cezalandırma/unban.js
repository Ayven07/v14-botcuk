const moment = require("moment");
moment.locale("tr");
const Discord = require("discord.js")
const setups = require("../../schemas/setup")
const penals = require("../../schemas/penals");
const settings = require("../../configs/settings.json")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["unban"],
name: "unban",
help: "unban @Rainha/ID",
category: "cezalandirma"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers) && !ayar.banHammer.some(x => message.member.roles.cache.has(x))) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
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
    message.guild.members.unban(args[0], `${message.author.username} tarafından kaldırıldı!`).catch(() => {});
    const data = await penals.findOne({ userID: ban.user.id, guildID: settings.guildID, type: "BAN", active: true });
    if (data) {
      data.active = false;
      await data.save();
    }
    message.react(message.guild.emojiGöster(emojis.yes))
     message.reply({ content:`${message.guild.emojiGöster(emojis.yes)} **(${ban.user.globalName} - ${ban.user.id})** Adlı Üyenin Banı <t:${Math.floor(Date.now() / 1000)}:R> ${message.author} Tarafından Kaldırıldı!`})
    if (settings.dmMessages) ban.user.send({ content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından banınız kaldırıldı!`}).catch(() => {});

    const log = embed
.setAuthor({name: `${ban.user.globalName ? ban.user.globalName : ban.user.tag}`, iconURL: ban.user.avatarURL({dynamic: true})})
.setThumbnail(ban.user.avatarURL({dynamic: true}))
.setTitle("Bir Kullanıcı Yasağı Kaldırıldı!")
    .setDescription(`   
Banı Kaldırılan Üye: \`${ban.user.globalName ? ban.user.globalName : ban.user.tag} - ${ban.user.id}\`
Banı Kaldıran Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
        const banLog = await client.kanalBul("ban-log"); 
banLog.send({ embeds: [log]});
  },
};
