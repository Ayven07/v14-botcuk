const moment = require("moment");
moment.locale("tr");
const Discord = require("discord.js")
const penals = require("../../schemas/penals");
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["unjail"],
name: "unjail",
help: "unjail @Rainha/ID",
category: "cezalandirma"
},
exclosive: async (client, message,  args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ayar.jailHammer.some(x => message.member.roles.cache.has(x))) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    if (!ayar.jailRoles.some(x => member.roles.cache.has(x))) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Bu üye jailde değil!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    if (!message.member.permissions.has(8n) && member.roles.highest.position >= message.member.roles.highest.position) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Kendinle aynı yetkide ya da daha yetkili olan birinin jailini kaldıramazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    if (!member.manageable) {
    message.react(message.guild.emojiGöster(emojis.no))  
    message.reply({ content:"Bu üyeyi jailden çıkaramıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    
    member.roles.cache.has(ayar.boosterRoles) ? member.roles.set([ayar.boosterRoles, ayar.unregRoles[0]]) : member.roles.set(ayar.unregRoles).catch(e => {});
    member.setNickname(`${ayar.defaultTag} ${ayar.unregName}`)
    const data = await penals.findOne({ userID: member.user.id, guildID: settings.guildID, $or: [{ type: "JAIL" }, { type: "TEMP-JAIL" }], active: true });
    if (data) {
      data.active = false;
      await data.save();
    }
    message.react(message.guild.emojiGöster(emojis.yes))
    message.reply({ content:`${message.guild.emojiGöster(emojis.yes)} ${member.toString()} Üyesinin Jaili <t:${Math.floor(Date.now() / 1000)}:R> ${message.author} Tarafından Kaldırıldı!`})
    if (settings.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, jailiniz kaldırıldı!`}).catch(() => {});

    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcının Karantina Cezası Kaldırıldı!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Jaili Kaldıran Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
          .setFooter({ text:`${moment(Date.now()).format("LLL")}`})
    const jailLog = await client.kanalBul("jail-log"); 
   jailLog.send({ embeds: [log]});
  },
};
