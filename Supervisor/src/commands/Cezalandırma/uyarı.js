const moment = require("moment");
const ceza = require("../../schemas/ceza");
moment.locale("tr");
const warnLimit = new Map();
const Discord = require("discord.js")
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
const emojis = require('../../configs/emojiName.json')
const penals = require("../../schemas/penals")
const uyarisayi = require("../../schemas/uyarisayi")
const cezapuan = require("../../schemas/cezapuan")
module.exports = {
conf: {
aliases: ["uyarı","warn", "uyari", "uyar"],
name: "uyarı",
help: "uyarı @Rainha/ID [Sebep]",
category: "cezalandirma"
},

exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ayar.warnHammer.some(x => message.member.roles.cache.has(x))) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:  "Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return; }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content: "Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 15000));
    return; }
    const reason = args.slice(1).join(" ") || "Belirtilmedi!";
    if (message.member.roles.highest.position <= member.roles.highest.position) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content: "Kendinle aynı yetkide ya da daha yetkili olan birini uyaramazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return; }
    if (settings.warnlimit > 0 && warnLimit.has(message.author.id) && warnLimit.get(message.author.id) == settings.warnlimit) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Saatlik uyarma sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return; }
    const uyariData = await uyarisayi.findOne({ guildID: settings.guildID, userID: member.user.id });
    if(uyariData && uyariData.sayi == 3) return message.reply({embeds: [embed.setDescription(`${message.member}, ${member} *Kullanıcısının Uyarı Sayısı Şuanda 3 Olduğu İçin Uyaramazsınız*`)]}).sil(15)
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 5 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    const penal = await client.penalize(settings.guildID, member.user.id, "WARN", false, message.author.id, reason);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
 cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
 await uyarisayi.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { sayi: 1 } }, { upsert: true });

    const data = await penals.find({ guildID: settings.guildID, userID: member.user.id, type: "WARN" });
    message.react(message.guild.emojiGöster(emojis.yes))
     message.reply({ content: `${message.guild.emojiGöster(emojis.uyari)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından Uyarıldı! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle uyarıldınız!`}).catch(() => {});
    const log = embed
   .setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Uyarı Cezası Aldı!")
      .setDescription(`
Uyarılan Üye: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.user.id}\`
Uyaran Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Uyarı Sayısı: \`${uyariData ? Math.floor(parseInt(uyariData.sayi)) : 1}\`
Uyarı Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
 .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
 const warnLog = await client.kanalBul("warn-log"); 
 warnLog.send({ embeds: [log]});
const uyariDatas = await uyarisayi.findOne({ guildID: settings.guildID, userID: member.user.id })
 if(uyariDatas.sayi == 0 || uyariDatas.sayi == 1) return await member.roles.add(ayar.warnOneRoles).catch(e => {})
 if(uyariDatas.sayi == 2) return await member.roles.remove(ayar.warnOneRoles).catch(e => {}) && await member.roles.add(ayar.warnTwoRoles).catch(e => {}) 
 if(uyariDatas.sayi == 3) return await member.roles.remove(ayar.warnTwoRoles).catch(e => {}) && await member.roles.add(ayar.warnThreeRoles).catch(e => {})
 if (settings.warnlimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
 if (!warnLimit.has(message.author.id)) warnLimit.set(message.author.id, 1);
      else warnLimit.set(message.author.id, warnLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (warnLimit.has(message.author.id)) warnLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }       
  },
};
