const Discord = require('discord.js');
const settings = require("../../configs/settings.json")
const ceza = require("../../schemas/ceza");
const forceBans = require("../../schemas/forceBans");
const emojis = require('../../configs/emojiName.json')
const cezapuan = require("../../schemas/cezapuan")
const moment = require("moment");
moment.locale("tr");
const ms = require("ms");
const setups = require("../../schemas/setup")
const banLimit = new Map();
module.exports = {
conf: {
aliases: ["punish"],
name: "punish",
help: "punish @Rainha/ID",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ayar.banHammer.some(x => message.member.roles.cache.has(x))) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
return } 
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) { message.reply({ content:"Bir üye belirtmelisin!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return }
if (message.member.roles.highest.position <= member.roles.highest.position) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini cezalandıramazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
return
}
if (!member.manageable) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Bu üyeye ceza uygulayamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
return
}
const ban = await forceBans.findOne({ guildID: settings.guildID, userID: member.user.id });
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder().setCustomId("bir").setLabel("1").setStyle(Discord.ButtonStyle.Primary),
new Discord.ButtonBuilder().setCustomId("iki").setLabel("2").setStyle(Discord.ButtonStyle.Primary),
new Discord.ButtonBuilder().setCustomId("iptal").setLabel(message.guild.emojiGöster(emojis.no).id).setStyle(Discord.ButtonStyle.Danger)
);

let Rainha = new Discord.EmbedBuilder()
.setDescription(`Merhabalar ${message.member.toString()} aşağıdan cezalandırmak istediğiniz \n${member.toString()} adlı kullanıcı için bir cezalandırma şekli seçiniz.

I Sunucudan kalıcı şekilde yasaklamak.
II Reklamdan dolayı yasaklamak.

Sunucu içerisinde mute ve voicemute manuel olarak kullanılmaktadır.
`)
.setAuthor({ name: message.member.displayName, iconURL: message.member.avatarURL({ dynamic: true }) })
.setColor("Random")
.setFooter({ text: `1 dakika içinde buttonları kullanınız.` })

 let msg = await message.channel.send({ embeds: [Rainha], components : [row] })
 var filter = (button) => button.user.id === message.author.id;
 let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })

      collector.on("collect", async (button) => {

if(button.customId === "bir") {
if (ban) {
button.reply({ content :"Bu üye zaten banlı!", ephemeral: true })
return }
const reason = args.slice(1).join(" ") || "Açılmaz Ban";

if (settings.dmMessages) member.send({ content :`**${message.guild.name}** sunucusundan **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **kalıcı olarak** banlandınız!`}).catch(() => {});

message.guild.members.ban(member.user.id, { reason }).catch(() => {});
await new forceBans({ guildID: settings.guildID, userID: member.user.id, staff: message.author.id }).save();
const penal = await client.penalize(settings.guildID, member.user.id, "FORCE-BAN", true, message.author.id, reason);

msg.edit({ content :`${message.guild.emojiGöster(emojis.yes)} **${member ? member.toString() : member.user.globalName}** Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Kalıcı Olarak** Banlandı! Ceza Numarası: **(#${penal.id})**`, embeds: [], components: []})

const log = new Discord.EmbedBuilder()
.setColor("Random")
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setTitle("Bir Kullanıcı Kalıcı Yasaklandı!")
.setDescription(`
Banlanan Üye: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.user.id}\`
Banlayan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ban Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`       
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
const banLog = await client.kanalBul("ban-log"); 
banLog.send({embeds: [log]});
}

if(button.customId === "iki") {
  const ban = await client.fetchBan(message.guild, args[0]);
  const reason = args.slice(1).join(" ") || "Reklam";
  if (ban) { message.channel.send({ content:"Bu üye zaten banlı!", ephemeral: true })
  return }
  if (settings.banlimit > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == settings.banlimit) return message.channel.send({ content:"Saatlik ban sınırına ulaştın!", ephemeral: true })

  if (settings.dmMessages) member.send({ content:`**${message.guild.name}** sunucusundan **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **Reklam** sebebiyle banlandınız!`}).catch(() => {});
  message.guild.members.ban(member.user.id, { reason: `Reklam | Yetkili: ${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}`}).catch(() => {});
  const penal = await client.penalize(settings.guildID, member.user.id, "BAN", true, message.author.id, reason);

  msg.edit({ content :`${message.guild.emojiGöster(emojis.yes)} **${member ? member.toString() : member.user.globalName}** Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından Banlandı! Ceza Numarası: **(#${penal.id})**`, embeds: [], components: []})
if(message.guild.members.cache.get(member.id)) {
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { BanAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $inc: { cezapuan: 10 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
   const logs = await client.kanalBul("cezapuan-log");
    logs.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
}
  const log = embed
  .setTitle("Bir Kullanıcı Yasaklandı!")
  .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
  .setThumbnail(member.user.avatarURL({dynamic: true}))
  .setDescription(`
Banlanan Üye: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.user.id}\`
Banlayan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ban Sebebi: **Reklam**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
  .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const banLogs = await client.kanalBul("ban-log"); 
  banLogs.send({ embeds: [log]});

  if (settings.banlimit > 0 && !button.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
    if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
    else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
    setTimeout(() => {
      if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
    }, 1000 * 60 * 60);
  }
}

if(button.customId === "iptal") {
  if(msg) msg.delete().catch({})
  button.reply({ content :"Cezalandırma işlemi başarıyla iptal edildi.", ephemeral: true })
}
})
  },
};