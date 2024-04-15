const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const muteLimit = new Map();
moment.locale("tr");
const Discord = require("discord.js")
const ms = require("ms");
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["mute","cmute"],
name: "mute",
help: "mute @Rainha/ID Süre Sebep",
category: "cezalandirma"
},
exclosive: async (client,message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ayar.muteHammer.some(x => message.member.roles.cache.has(x))) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
return } 
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) { message.reply({ content:"Bir üye belirtmelisin!"}).sil(15) 
    message.react(message.guild.emojiGöster(emojis.no))
    return }
    if (ayar.muteRoles.some(x => member.roles.cache.has(x))) { message.reply({ content:"Bu üye zaten susturulmuş!"}).then((e) => setTimeout(() => { e.delete(); }, 15000));
    message.react(message.guild.emojiGöster(emojis.no))
    return }
    const duration = args[1] ? ms(args[1]) : undefined;
    const reason = args.slice(2).join(" ")
    if (message.member.roles.highest.position <= member.roles.highest.position) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini susturamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return
    }
    if (!member.manageable) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Bu üyeyi susturamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return 
    }
    if (settings.chatmutelimit > 0 && muteLimit.has(message.author.id) && muteLimit.get(message.author.id) == settings.chatmutelimit) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:"Saatlik susturma sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
    return
    }
    if(duration && reason) {
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.add(ayar.muteRoles).catch(e => {});
    const penal = await client.penalize(settings.guildID, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezas = await client.kanalBul("cezapuan-log"); 
    cezas.send({ content:`${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({ content:`${message.guild.emojiGöster(emojis.mute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Text Kanallarında** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setColor("Random")
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Yazı Kanallarında Susturuldu!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
   const logKanal = await client.kanalBul("mute-log"); 
    logKanal.send({ embeds : [log]});

    if (settings.chatmutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
   } else if(!reason && !duration) {
    const row = new Discord.ActionRowBuilder().addComponents(
			new Discord.StringSelectMenuBuilder()
				.setCustomId("chatmuteceza")
				.setPlaceholder("Kullanıcının ceza türünü seçmek için tıkla!")
				.addOptions([
					{
						emoji: `${message.guild.emojiGöster(emojis.bir).id}`,
						label: `Sesteki olayı chat'e yansıtmak / konuyu uzatmak`,
						description: `5 Dakika`,
            value: "1",
					},			
          {
						emoji: `${message.guild.emojiGöster(emojis.iki).id}`,
						label: `Küfür, Ortam bozma, Troll, Soundpad`,			
            description: `10 Dakika`,
            value: "2",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.uc).id}`,
						label: `Flood, Spam`,
						description: `10 Dakika`,
            value: "3",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.dort).id}`,
						label: `Dizi veya filmler hakkında spoiler vermek`,
            description: `10 Dakika`,
            value: "4",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.bes).id}`,
						label: `Tartışmak, kavga etmek veya rahatsızlık çıkarmak, kışkırtmak`,		
            description: `15 Dakika`,
            value: "5",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.alti).id}`,
						label: `Ailevi küfür`,	
            description: `20 Dakika`,
            value: "6",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.yedi).id}`,
						label: `Siyaset`,
            description: `20 Dakika`,
						value: "7",
					},
					{
						emoji: `${message.guild.emojiGöster(emojis.sekiz).id}`,
						label: `Ortamı (${message.guild.name}) kötülemek`,
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
    var duration = ms("5m")
    var reason = "Sesteki olayı chat'e yansıtmak / konuyu uzatmak"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.add(ayar.muteRoles).catch(e => {});
    const penal = await client.penalize(settings.guildID, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezas = await client.kanalBul("cezapuan-log"); 
    cezas.send({ content: `${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({ content: `${message.guild.emojiGöster(emojis.mute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Text Kanallarında** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setColor("Random")
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Yazı Kanallarında Susturuldu!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
   const logKanal = await client.kanalBul("mute-log"); 
    logKanal.send({ embeds : [log]});

    if (settings.chatmutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
        }
if (button.values[0] === "2") {
    button.deferUpdate();	
    var duration = ms("10m")
    var reason = "Küfür, Ortam bozma, Troll, Soundpad"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.add(ayar.muteRoles).catch(e => {});
    const penal = await client.penalize(settings.guildID, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezas = await client.kanalBul("cezapuan-log"); 
    cezas.send({ content: `${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({ content: `${message.guild.emojiGöster(emojis.mute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Text Kanallarında** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setColor("Random")
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Yazı Kanallarında Susturuldu!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
   const logKanal = await client.kanalBul("mute-log"); 
    logKanal.send({ embeds : [log]});

    if (settings.chatmutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
        }
if (button.values[0] === "3") {
    button.deferUpdate();	
    var duration = ms("10m")
    var reason = "Flood, Spam"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.add(ayar.muteRoles).catch(e => {});
    const penal = await client.penalize(settings.guildID, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezas = await client.kanalBul("cezapuan-log"); 
    cezas.send({ content: `${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({ content: `${message.guild.emojiGöster(emojis.mute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Text Kanallarında** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setColor("Random")
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Yazı Kanallarında Susturuldu!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
   const logKanal = await client.kanalBul("mute-log"); 
    logKanal.send({ embeds : [log]});

    if (settings.chatmutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
        }
if (button.values[0] === "4") {
    button.deferUpdate();	
    var duration = ms("10m")
    var reason = "Dizi veya filmler hakkında spoiler vermek"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.add(ayar.muteRoles).catch(e => {});
    const penal = await client.penalize(settings.guildID, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezas = await client.kanalBul("cezapuan-log"); 
    cezas.send({ content: `${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({ content: `${message.guild.emojiGöster(emojis.mute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Text Kanallarında** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setColor("Random")
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Yazı Kanallarında Susturuldu!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
   const logKanal = await client.kanalBul("mute-log"); 
    logKanal.send({ embeds : [log]});

    if (settings.chatmutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
        }
if (button.values[0] === "5") {
    button.deferUpdate();	
    var duration = ms("15m")
    var reason = "Tartışmak, kavga etmek veya rahatsızlık çıkarmak, kışkırtmak"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.add(ayar.muteRoles).catch(e => {});
    const penal = await client.penalize(settings.guildID, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezas = await client.kanalBul("cezapuan-log"); 
    cezas.send({ content: `${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({ content: `${message.guild.emojiGöster(emojis.mute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Text Kanallarında** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setColor("Random")
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Yazı Kanallarında Susturuldu!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
   const logKanal = await client.kanalBul("mute-log"); 
    logKanal.send({ embeds : [log]});

    if (settings.chatmutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
        }
if (button.values[0] === "6") {
    button.deferUpdate();	
    var duration = ms("20m")
    var reason = "Ailevi küfür"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.add(ayar.muteRoles).catch(e => {});
    const penal = await client.penalize(settings.guildID, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezas = await client.kanalBul("cezapuan-log"); 
    cezas.send({ content: `${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({ content: `${message.guild.emojiGöster(emojis.mute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Text Kanallarında** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setColor("Random")
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Yazı Kanallarında Susturuldu!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
   const logKanal = await client.kanalBul("mute-log"); 
    logKanal.send({ embeds : [log]});

    if (settings.chatmutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
        }
if (button.values[0] === "7") {
    button.deferUpdate();	
    var duration = ms("20m")
    var reason = "Siyaset"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.add(ayar.muteRoles).catch(e => {});
    const penal = await client.penalize(settings.guildID, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezas = await client.kanalBul("cezapuan-log"); 
    cezas.send({ content: `${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({ content: `${message.guild.emojiGöster(emojis.mute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Text Kanallarında** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setColor("Random")
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Yazı Kanallarında Susturuldu!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
   const logKanal = await client.kanalBul("mute-log"); 
    logKanal.send({ embeds : [log]});

    if (settings.chatmutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
        }
if (button.values[0] === "8") {
    button.deferUpdate();	
    var duration = ms("30m")
    var reason = `Ortamı (${message.guild.name}) kötülemek`
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.add(ayar.muteRoles).catch(e => {});
    const penal = await client.penalize(settings.guildID, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezas = await client.kanalBul("cezapuan-log"); 
    cezas.send({ content: `${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({ content: `${message.guild.emojiGöster(emojis.mute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Text Kanallarında** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setColor("Random")
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Yazı Kanallarında Susturuldu!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
   const logKanal = await client.kanalBul("mute-log"); 
    logKanal.send({ embeds : [log]});

    if (settings.chatmutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
        }
if (button.values[0] === "9") {
    button.deferUpdate();	
    var duration = ms("1h")
    var reason = "Taciz, Kadın üyelere sarkmak"
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { cezapuan: 3 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: settings.guildID, userID: member.user.id });
    message.react(message.guild.emojiGöster(emojis.yes))
    member.roles.add(ayar.muteRoles).catch(e => {});
    const penal = await client.penalize(settings.guildID, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    const cezas = await client.kanalBul("cezapuan-log"); 
    cezas.send({ content: `${member} Aldığınız **#${penal.id}** ID'li Ceza İle ${cezapuanData ? cezapuanData.cezapuan : 0} Ceza Puanına Ulaştınız!`});
    msg.delete().catch(e => {})
    const time = ms(duration).replace("s", " Saniye").replace("m", " Dakika").replace("h", " Saat").replace("d", " Gün").replace("w", " Hafta")
    message.reply({ content: `${message.guild.emojiGöster(emojis.mute)} ${member.toString()} Üyesi <t:${Math.floor(Date.now() / 1000)}:R> " **${reason}** " Sebebiyle ${message.author} Tarafından **Text Kanallarında** \` ${time} \` Susturuldu! Ceza Numarası: **(#${penal.id})**`})
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda **${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}** tarafından **${reason}** sebebiyle **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setColor("Random")
      .setAuthor({name: `${member.user.globalName ? member.user.globalName : member.user.tag}`, iconURL: member.user.avatarURL({dynamic: true})})
      .setThumbnail(member.user.avatarURL({dynamic: true}))
      .setTitle("Bir Kullanıcı Yazı Kanallarında Susturuldu!")
      .setDescription(`
Kullanıcı: \`${member.user.globalName ? member.user.globalName : member.user.tag} - ${member.id}\`
Mute Atan Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} - ${message.author.id}\`
Ceza Süresi: **${time}**
Ceza Sebebi: **${reason}**
Ceza ID: \`#${penal.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
`)
      .setFooter({ text:`${moment(Date.now()).format("LLL")} (Ceza ID: #${penal.id})` })
   const logKanal = await client.kanalBul("mute-log"); 
    logKanal.send({ embeds : [log]});

    if (settings.chatmutelimit > 0 && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
        }      
if(button.values[0] == "iptal") {
if(msg) msg.delete().catch(e => {})  
}
      })
collector.on("end", (_, reason) => {
if(reason == "time" && msg) msg.delete().catch(e => {})
})   
}      
  },
};