const moment = require("moment");
moment.locale("tr");
const Discord = require("discord.js")
const setups = require("../../schemas/setup")
const penals = require("../../schemas/penals");
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["unvmute"],
name: "unvmute",
help: "unvmute @Rainha/ID",
category: "cezalandirma"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ayar.muteHammer.some(x => message.member.roles.cache.has(x))) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply( { content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); return; }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply( { content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); return; }
    if (!ayar.vmuteRoles.some(x => member.roles.cache.has(x)) && member.voice.channelId && !member.voice.serverMute) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply( { content:"Bu üye muteli değil!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); return; }
    if (message.member.roles.highest.position <= member.roles.highest.position) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply( { content:"Kendinle aynı yetkide ya da daha yetkili olan birinin susturmasını kaldıramazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); return; }
    if (!member.manageable) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply( { content:"Bu üyenin susturmasını kaldıramıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); return; }

    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.remove(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && member.voice.serverMute) member.voice.setMute(false);
    const data = await penals.findOne({ userID: member.user.id, guildID: settings.guildID, type: "VOICE-MUTE", active: true });
    if (data) {
      data.active = false;
      data.removed = true;
      await data.save();
    }
    message.reply({ content:`${message.guild.emojiGöster(emojis.unvmute)} ${member.toString()} Üyesinin **Ses Kanallarındaki** Susturması <t:${Math.floor(Date.now() / 1000)}:R> ${message.author} Tarafından Kaldırıldı!`})
    if (settings.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${member.user.globalName ? member.user.globalName : member.user.tag}** tarafından **sesli kanallarda** olan susturmanız kaldırıldı!`}).catch(() => {});

    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcının Ses Kanallarındaki Cezası Kaldırıldı!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\` 
Mute Kaldıran Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
          .setFooter({ text:`${moment(Date.now()).format("LLL")}` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
  },
};

