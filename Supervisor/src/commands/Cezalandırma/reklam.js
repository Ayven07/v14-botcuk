const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const jailLimit = new Map();
const ms = require("ms")
const emojis = require('../../configs/emojiName.json')
const Discord = require("discord.js")
moment.locale("tr");
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["reklam"],
name: "reklamcı",
help: "reklam @Rainha/ID Sebep",
category: "cezalandirma"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ayar.jailHammer.some(x => message.member.roles.cache.has(x))) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content :"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) { message.reply({ content :"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 15000));
    message.react(message.guild.emojiGöster(emojis.no)) 
    return }
    if (ayar.reklamRoles.some(x => member.roles.cache.has(x))) { message.reply({ content :"Bu üye zaten jailde!"}).then((e) => setTimeout(() => { e.delete(); }, 15000));
    message.react(message.guild.emojiGöster(emojis.no)) 
    return }
    const reason = args.slice(1).join("Sunucu İçi Reklam") || "Sunucu İçi Reklam";
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.reply({embeds: [embed.setDescription("Kendinle aynı yetkide ya da daha yetkili olan birini jailleyemezsin!")]}).sil(15)
    if (!member.manageable) return message.reply({ content :"Bu üyeyi jailleyemiyorum!"}).sil(15)
    if (settings.jaillimit > 0 && jailLimit.has(message.author.id) && jailLimit.get(message.author.id) == settings.jaillimit) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content :"Saatlik jail sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 7 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id }); 
    const collector = message.channel.createMessageCollector({
      filter: (m) => m.author.id === message.author.id,
      max: 1,
      time: 120000
    });
  var msj = await message.reply(`Kanıt göndermen gerekiyor! **2 dakika** içinde ekran görüntüsü atmalısın.`)
    collector.on('collect', async (msg) => {
      const attachment = msg.attachments.first()
      if (!attachment) {
        msj.delete().catch(e => {})
        message.channel.send(`${message.author} Ekran görüntüsü bulunamadı!`).sil(15)
        return;
      }
    if(attachment) {
    msj.delete().catch(e => {})  
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.cache.has(ayar.boosterRoles) ? member.roles.set([ayar.boosterRoles, ayar.reklamRoles[0]]).catch(e => {}) : member.roles.set(ayar.reklamRoles).catch(e => {}) 
    member.setNickname("[REKLAMCI]")  
    const penal = await client.penalize(settings.guildID, member.user.id, "REKLAM", true, message.author.id, reason);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
     message.reply({ content :`${message.guild.emojiGöster(emojis.jail)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından Jaillendi! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content :`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **Sunucu İçi Reklam** sebebiyle Cezalandırıldı.`}).catch(() => {});
    
    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Karantina'ya Atıldı!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Jail Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Sebebi: **Sunucu İçi Reklam**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`).setImage(attachment.proxyURL)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
const jailLog = await client.kanalBul("jail-log"); 
    jailLog.send({ embeds: [log]});
    }
    })
 if (settings.jaillimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
collector.on("end", (_, reason) => {
if(reason == "time") msj.edit({content: `Süre dolduğu için işlem iptal edildi.`}).sil(15)
})          
  },
};