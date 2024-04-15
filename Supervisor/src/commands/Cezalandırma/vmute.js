const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const vmuteLimit = new Map();
moment.locale("tr");
const Discord = require("discord.js")
const ms = require("ms");
const emojis = require('../../configs/emojiName.json')
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["vmute","voicemute"],
name: "vmute",
help: "vmute @Rainha/ID Süre Sebep",
category: "cezalandirma"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ayar.muteHammer.some(x => message.member.roles.cache.has(x))) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({content: "Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    if (ayar.vmuteRoles.some(x => member.roles.cache.has(x))) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({content: "Bu üye zaten susturulmuş!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    const duration = args[1] ? ms(args[1]) : undefined;
    const reason = args.slice(2).join(" ")
    if (message.member.roles.highest.position <= member.roles.highest.position) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({content:"Kendinle aynı yetkide ya da daha yetkili olan birini susturamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    if (!member.manageable) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Bu üyeyi susturamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    if (settings.voicemutelimit > 0 && vmuteLimit.has(message.author.id) && vmuteLimit.get(message.author.id) == settings.voicemutelimit) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Saatlik susturma sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    if(reason && duration) {
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
      member.roles.add(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(ayar.vmuteRoles);
    }
    const penal = await client.penalize(settings.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
  cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
 message.react(message.guild.emojiGöster(emojis.yes))
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({content:`${message.guild.emojiGöster(emojis.vmute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Sesli Kanallarda** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle **sesli kanallarda** susturuldunuz!`}).catch(() => {});
    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Ses Kanallarında Susturuldu!")
    .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
    .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
 
    if (settings.voicemutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
   } else if(!reason && !duration) {
   const row = new Discord.ActionRowBuilder().addComponents(
			new Discord.StringSelectMenuBuilder()
				.setCustomId("voicemuteceza")
				.setPlaceholder("Kullanıcının ceza türünü seçmek için tıkla!")
				.addOptions([
					{
						emoji: `${message.guild.emojiGöster(emojis.bir).id}`,
						label: `Küfür, Ortam bozma, Troll, Soundpad`,
            description: `10 Dakika`,           
            value: "1",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.iki).id}`,
						label: `Dizi veya filmler hakkında spoiler vermek`,
            description: `10 Dakika`,
						value: "2",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.uc).id}`,
						label: `Tartışmak, kavga etmek veya rahatsızlık çıkarmak, kışkırtmak`,
            description: `15 Dakika`,
						value: "3",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.dort).id}`,
						label: `Ailevi küfür`,
            description: `20 Dakika`,
						value: "4",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.bes).id}`,
						label: `Siyaset`,
            description: `20 Dakika`,
						value: "5",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.alti).id}`,
						label: `Sorun çözme terk`,
            description: `20 Dakika`,
						value: "6",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.yedi).id}`,
						label: `Ortamı (${message.guild.name}) kötülemek`,
            description: `30 Dakika`,
						value: "7",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.sekiz).id}`,
						label: `Secreta uyarılara rağmen izinsiz giriş`,
            description: `30 Dakika`,
						value: "8",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.dokuz).id}`,
						label: `Taciz, Kadın üyelere sarkmak`,
            description: `1 Saat`,
						value: "9",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.no).id}`,
						label: `İptal`,
						value: "iptal",
					},
				]),
		);
 var msg = await message.reply({embeds: [embed.setDescription(`${message.member} Merhaba! ${member} Kullanıcısına <t:${Math.floor(Date.now() / 1000)}> Tarihinde Vermek İstediğiniz Ceza Türünü Aşağıdan Seçiniz.`)], components: [row]})
   var filter = (button) => button.user.id === message.author.id;
		const collector = msg.createMessageComponentCollector({
			filter,
			time: 30000,
		});

		collector.on("collect", async (button) => {		
    if (button.values[0] === "1") {
    button.deferUpdate();	
    var duration = ms("10m")
    var reason = "Küfür, Ortam bozma, Troll, Soundpad"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
      member.roles.add(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(ayar.vmuteRoles);
    }
    const penal = await client.penalize(settings.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    message.react(message.guild.emojiGöster(emojis.yes))
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({content:`${message.guild.emojiGöster( emojis.vmute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Sesli Kanallarda** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle **sesli kanallarda** susturuldunuz!`}).catch(() => {});
    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Ses Kanallarında Susturuldu!")
    .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
    .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
 
    if (settings.voicemutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }  
    }
    if (button.values[0] === "2") {
    button.deferUpdate();	
    var duration = ms("10m")
    var reason = "Dizi veya filmler hakkında spoiler vermek"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
      member.roles.add(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(ayar.vmuteRoles);
    }
    const penal = await client.penalize(settings.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    message.react(message.guild.emojiGöster(emojis.yes))
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({content:`${message.guild.emojiGöster(emojis.vmute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Sesli Kanallarda** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle **sesli kanallarda** susturuldunuz!`}).catch(() => {});
    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Ses Kanallarında Susturuldu!")
    .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
    .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
 
    if (settings.voicemutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }  
    }
    if (button.values[0] === "3") {
    button.deferUpdate();	
    var duration = ms("15m")
    var reason = "Tartışmak, kavga etmek veya rahatsızlık çıkarmak, kışkırtmak"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
      member.roles.add(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(ayar.vmuteRoles);
    }
    const penal = await client.penalize(settings.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    message.react(message.guild.emojiGöster(emojis.yes))
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({content:`${message.guild.emojiGöster(emojis.vmute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Sesli Kanallarda** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle **sesli kanallarda** susturuldunuz!`}).catch(() => {});
      const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Ses Kanallarında Susturuldu!")
    .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
    .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
 
    if (settings.voicemutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }  
    }
    if (button.values[0] === "4") {
    button.deferUpdate();	
    var duration = ms("20m")
    var reason = "Ailevi küfür"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
      member.roles.add(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(ayar.vmuteRoles);
    }
    const penal = await client.penalize(settings.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    message.react(message.guild.emojiGöster(emojis.yes))
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({content:`${message.guild.emojiGöster(emojis.vmute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Sesli Kanallarda** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle **sesli kanallarda** susturuldunuz!`}).catch(() => {});
     const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Ses Kanallarında Susturuldu!")
    .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
    .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
 
    if (settings.voicemutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }  
    }
    if (button.values[0] === "5") {
    button.deferUpdate();	
    var duration = ms("20m")
    var reason = "Siyaset"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
      member.roles.add(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(ayar.vmuteRoles);
    }
    const penal = await client.penalize(settings.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    message.react(message.guild.emojiGöster(emojis.yes))
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({content:`${message.guild.emojiGöster(emojis.vmute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Sesli Kanallarda** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle **sesli kanallarda** susturuldunuz!`}).catch(() => {});
    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Ses Kanallarında Susturuldu!")
    .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
    .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
 
    if (settings.voicemutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }  
    }
    if (button.values[0] === "6") {
    button.deferUpdate();	
    var duration = ms("20m")
    var reason = "Sorun çözme terk"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
      member.roles.add(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(ayar.vmuteRoles);
    }
    const penal = await client.penalize(settings.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    message.react(message.guild.emojiGöster(emojis.yes))
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({content:`${message.guild.emojiGöster(emojis.vmute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Sesli Kanallarda** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle **sesli kanallarda** susturuldunuz!`}).catch(() => {});
    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Ses Kanallarında Susturuldu!")
    .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
    .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
 
    if (settings.voicemutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }  
    }
    if (button.values[0] === "7") {
    button.deferUpdate();	
    var duration = ms("30m")
    var reason = `Ortamı (${message.guild.name}) kötülemek`
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
      member.roles.add(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(ayar.vmuteRoles);
    }
    const penal = await client.penalize(settings.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    message.react(message.guild.emojiGöster(emojis.yes))
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({content:`${message.guild.emojiGöster(emojis.vmute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Sesli Kanallarda** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle **sesli kanallarda** susturuldunuz!`}).catch(() => {});
    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Ses Kanallarında Susturuldu!")
    .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
    .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
 
    if (settings.voicemutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }  
    }
    if (button.values[0] === "8") {
    button.deferUpdate();	
    var duration = ms("30m")
    var reason = "Secreta uyarılara rağmen izinsiz giriş"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
      member.roles.add(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(ayar.vmuteRoles);
    }
    const penal = await client.penalize(settings.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    message.react(message.guild.emojiGöster(emojis.yes))
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({content:`${message.guild.emojiGöster(emojis.vmute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Sesli Kanallarda** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle **sesli kanallarda** susturuldunuz!`}).catch(() => {});
    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Ses Kanallarında Susturuldu!")
    .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
    .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
 
    if (settings.voicemutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }  
    }
    if (button.values[0] === "9") {
    button.deferUpdate();	
    var duration = ms("1h")
    var reason = "Taciz, Kadın üyelere sarkmak"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { VoiceMuteAmount: 1 } }, {upsert: true});
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
      member.roles.add(ayar.vmuteRoles).catch(e => {});
    if (member.voice.channelId && !member.voice.serverMute) {
      member.voice.setMute(true);
      member.roles.add(ayar.vmuteRoles);
    }
    const penal = await client.penalize(settings.guildID, member.user.id, "VOICE-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    message.react(message.guild.emojiGöster(emojis.yes))
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({content:`${message.guild.emojiGöster(emojis.vmute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Sesli Kanallarda** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle **sesli kanallarda** susturuldunuz!`}).catch(() => {});
    const log = embed
.setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
.setThumbnail(member.user.avatarURL({dynamic: true}))
    .setTitle("Bir Kullanıcı Ses Kanallarında Susturuldu!")
    .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
    .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
  const muteLog = await client.kanalBul("vmute-log"); 
  muteLog.send({ embeds: [log]});
 
    if (settings.voicemutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!vmuteLimit.has(message.author.id)) vmuteLimit.set(message.author.id, 1);
      else vmuteLimit.set(message.author.id, vmuteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vmuteLimit.has(message.author.id)) vmuteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }  
    }
    if(button.values[0] === "iptal") {
    if(msg) msg.delete().catch(e => {}) 
    }
      })
   }
  },
};
