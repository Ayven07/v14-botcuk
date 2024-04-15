const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const jailLimit = new Map();
const ms = require("ms")
moment.locale("tr");
const setups = require("../../schemas/setup")
const Discord = require("discord.js")
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["jail"],
name: "jail",
help: "jail @Rainha/ID Sebep",
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
    if (ayar.jailRoles.some(x => member.roles.cache.has(x))) { message.reply({ content :"Bu üye zaten jailde!"}).then((e) => setTimeout(() => { e.delete(); }, 15000));
    message.react(message.guild.emojiGöster(emojis.no))
    return }
    const reason = args.slice(1).join(" ") 
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.reply({embeds: [embed.setDescription("Kendinle aynı yetkide ya da daha yetkili olan birini jailleyemezsin!")]}).sil(15)
    if (!member.manageable) return message.reply({ content :"Bu üyeyi jailleyemiyorum!"}).sil(15)
    if (settings.jaillimit > 0 && jailLimit.has(message.author.id) && jailLimit.get(message.author.id) == settings.jaillimit) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content :"Saatlik jail sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return }
    if(reason && reason.toLowerCase().includes('reklam')) {
    message.reply({content: `${message.member} Reklam cezalandırmalarını bu kısımdan yapamazsın.`}).sil(15)  
    message.react(message.guild.emojiGöster(emojis.no))
    return; }
    if(reason) {
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 7 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    
    member.roles.cache.has(ayar.boosterRoles) ? member.roles.set([ayar.boosterRoles, ayar.jailRoles[0]]).catch(e => {}) : member.roles.set(ayar.jailRoles).catch(e => {});

    message.react(message.guild.emojiGöster(emojis.yes))
    const penal = await client.penalize(settings.guildID, member.user.id, "JAIL", true, message.author.id, reason);
  const logs = await client.kanalBul("cezapuan-log");
   logs.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
 message.reply({ content :`${message.guild.emojiGöster(emojis.jail)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından Jaillendi! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content :`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle jaillendiniz.`}).catch(() => {});
    

    const log = embed
      .setAuthor({ name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL:  member.user.avatarURL({ dynamic: true }) })
      .setTitle("Bir Kullanıcı Karantina'ya Atıldı!")
      .setColor("Random")
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Jail Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
const logKanal = await client.kanalBul("jail-log");
    logKanal.send({ embeds: [log]});

    if (settings.jaillimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
 } else if(!reason) {
const row = new Discord.ActionRowBuilder().addComponents(
			new Discord.StringSelectMenuBuilder()
				.setCustomId("jailceza")
				.setPlaceholder("Kullanıcının ceza türünü seçmek için tıkla!")
				.addOptions([
					{
						emoji: `${message.guild.emojiGöster(emojis.bir).id}`,
						label: `Sunucunun düzenini bozacak hal ve davranış`,
            description: `1 Gün`,
						value: "1",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.iki).id}`,
						label: `Din / ırkçılık / siyaset`,
            description: `2 Gün`,
						value: "2",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.uc).id}`,
						label: `Tehdit / Şantaj / İftira atmak / Kandırmak`,
            description: `2 Gün`,
						value: "3",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.dort).id}`,
						label: `Uyarılara rağmen küfür ve trol`,
            description: `2 Gün`,
						value: "4",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.bes).id}`,
						label: `Taciz`,
            description: `7 Gün`,
						value: "5",
					},
          {
						emoji: `${message.guild.emojiGöster(emojis.alti).id}`,
						label: `Diğer.`,
            description: `Süresiz`,
						value: "6",
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
var duration = ms("1d")
var reason = "Sunucunun düzenini bozacak hal ve davranış"
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 7 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    member.roles.cache.has(ayar.boosterRoles) ? member.roles.set([ayar.boosterRoles, ayar.jailRoles[0]]) : member.roles.set(ayar.jailRoles).catch(e => {});
    message.react(message.guild.emojiGöster(emojis.yes))
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    const penal = await client.penalize(settings.guildID, member.user.id, "TEMP-JAIL", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    message.reply({ content:`${message.guild.emojiGöster(emojis.jail)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından \` ${time} \` Boyunca Jaillendi! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle, ${time} boyunca jaillendiniz.`}).catch(() => {});
    
    const log = embed
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Karantina'ya Atıldı!")
      .setDescription(`
Jail Atılan Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Jail Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
const jailLog = await client.kanalBul("jail-log"); 
      jailLog.send({ embeds: [log]});

    if (settings.jaillimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
 }
    if (button.values[0] === "2") {
    button.deferUpdate();	   
var duration = ms("2d")
var reason = "Din / ırkçılık / siyaset"
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 7 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    member.roles.cache.has(ayar.boosterRoles) ? member.roles.set([ayar.boosterRoles, ayar.jailRoles[0]]) : member.roles.set(ayar.jailRoles).catch(e => {});
    message.react(message.guild.emojiGöster(emojis.yes))
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    const penal = await client.penalize(settings.guildID, member.user.id, "TEMP-JAIL", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    message.reply({ content:`${message.guild.emojiGöster(emojis.jail)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından \` ${time} \` Boyunca Jaillendi! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle, ${time} boyunca jaillendiniz.`}).catch(() => {});
    
    const log = embed
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Karantina'ya Atıldı!")
      .setDescription(`
Jail Atılan Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Jail Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
const jailLog = await client.kanalBul("jail-log"); 
      jailLog.send({ embeds: [log]});

    if (settings.jaillimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
 }
    if (button.values[0] === "3") {
    button.deferUpdate();	   
var duration = ms("2d")
var reason = "Tehdit / Şantaj / İftira atmak / Kandırmak"
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 7 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    member.roles.cache.has(ayar.boosterRoles) ? member.roles.set([ayar.boosterRoles, ayar.jailRoles[0]]) : member.roles.set(ayar.jailRoles).catch(e => {});
    message.react(message.guild.emojiGöster(emojis.yes))
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    const penal = await client.penalize(settings.guildID, member.user.id, "TEMP-JAIL", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    message.reply({ content:`${message.guild.emojiGöster(emojis.jail)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından \` ${time} \` Boyunca Jaillendi! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle, ${time} boyunca jaillendiniz.`}).catch(() => {});
    
    const log = embed
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Karantina'ya Atıldı!")
      .setDescription(`
Jail Atılan Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Jail Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
const jailLog = await client.kanalBul("jail-log"); 
      jailLog.send({ embeds: [log]});

    if (settings.jaillimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
 }
    if (button.values[0] === "4") {
    button.deferUpdate();	   
var duration = ms("2d")
var reason = "Uyarılara rağmen küfür ve trol"
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 7 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    member.roles.cache.has(ayar.boosterRoles) ? member.roles.set([ayar.boosterRoles, ayar.jailRoles[0]]) : member.roles.set(ayar.jailRoles).catch(e => {});
    message.react(message.guild.emojiGöster(emojis.yes))
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    const penal = await client.penalize(settings.guildID, member.user.id, "TEMP-JAIL", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    message.reply({ content:`${message.guild.emojiGöster(emojis.jail)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından \` ${time} \` Boyunca Jaillendi! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle, ${time} boyunca jaillendiniz.`}).catch(() => {});
    
    const log = embed
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Karantina'ya Atıldı!")
      .setDescription(`
Jail Atılan Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Jail Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
const jailLog = await client.kanalBul("jail-log"); 
      jailLog.send({ embeds: [log]});

    if (settings.jaillimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
 }
    if (button.values[0] === "5") {
    button.deferUpdate();	   
var duration = ms("7d")
var reason = "Taciz"
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 7 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    member.roles.cache.has(ayar.boosterRoles) ? member.roles.set([ayar.boosterRoles, ayar.jailRoles[0]]) : member.roles.set(ayar.jailRoles).catch(e => {});
    message.react(message.guild.emojiGöster(emojis.yes))
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    const penal = await client.penalize(settings.guildID, member.user.id, "TEMP-JAIL", true, message.author.id, reason, true, Date.now() + duration);
    const cezaLog = await client.kanalBul("cezapuan-log"); 
    cezaLog.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    message.reply({ content:`${message.guild.emojiGöster(emojis.jail)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından \` ${time} \` Boyunca Jaillendi! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content:`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle, ${time} boyunca jaillendiniz.`}).catch(() => {});
    
    const log = embed
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Karantina'ya Atıldı!")
      .setDescription(`
Jail Atılan Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Jail Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
const jailLog = await client.kanalBul("jail-log"); 
      jailLog.send({ embeds: [log]});

    if (settings.jaillimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
 }
if (button.values[0] === "6") {
button.deferUpdate();	   
var reason = "Diğer."
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { JailAmount: 1 } }, {upsert: true});
await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 7 } }, { upsert: true });
const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
member.roles.cache.has(ayar.boosterRoles) ? member.roles.set([ayar.boosterRoles, ayar.jailRoles[0]]).catch(e => {}) : member.roles.set(ayar.jailRoles).catch(e => {});
message.react(message.guild.emojiGöster(emojis.yes))
const penal = await client.penalize(settings.guildID, member.user.id, "JAIL", true, message.author.id, reason);
const logs = await client.kanalBul("cezapuan-log");
logs.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
msg.delete().catch(e => {})
message.reply({ content :`${message.guild.emojiGöster(emojis.jail)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından Jaillendi! Ceza Numarası: **(#${penal.id})**`})
if (settings.dmMessages) member.send({ content :`**${message.guild.name}** sunucusunda, **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından, **${reason}** sebebiyle jaillendiniz.`}).catch(() => {});
const log = embed
.setAuthor({ name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL:  member.user.avatarURL({ dynamic: true }) })
.setTitle("Bir Kullanıcı Karantina'ya Atıldı!")
.setColor("Random")
.setThumbnail(member.user.avatarURL({dynamic: true}))
.setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Jail Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>`)
.setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
const logKanal = await client.kanalBul("jail-log");
logKanal.send({ embeds: [log]});
if (settings.jaillimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
setTimeout(() => {
if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
}, 1000 * 60 * 60);
}
}
if(button.values[0] == "iptal") {
if(msg) msg.delete().catch(e => {})  
}
})
}
},
};
