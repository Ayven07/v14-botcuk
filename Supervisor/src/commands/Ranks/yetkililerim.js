    const Discord = require("discord.js");
    const settings = require("../../configs/settings.json")
    const client = global.client;
    const moment = require("moment");
    require("moment-duration-format");
    moment.locale("tr")
    const setups = require("../../schemas/setup")
    const emojis = require('../../configs/emojiName.json')
    const Users = require("../../schemas/users.js");
    module.exports = {
    conf: {
    aliases: ["yetkililer", "yetkilileri"],
    name: "yetkililerim",
    help: "yetkilileri @Rainha/ID",
    category: "yetkili"
    },
    exclosive: async (client, message, args, embed) => {
    const ayars = await setups.findOne({guildID: settings.guildID})
    if(!ayars) return;  
    if(settings.coinSystem === false) return message.reply({embeds: [embed.setDescription(`Terfi Sistemi Aktif Değil!`)]}).sil(15)
    if (!client.ranks.some((x) => message.member.roles.cache.has(x.role)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.react(message.guild.emojiGöster(emojis.no))
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;
    uye = message.guild.members.cache.get(uye.id)
    const row = new Discord.ActionRowBuilder()
    .addComponents(
    new Discord.ButtonBuilder()
    .setCustomId("geri")
    .setStyle(Discord.ButtonStyle.Secondary)
    .setEmoji("1137686672709005322"),
    new Discord.ButtonBuilder()
    .setCustomId("kapat")
    .setStyle(Discord.ButtonStyle.Secondary)
    .setEmoji("1137686658779709522"),
    new Discord.ButtonBuilder()
    .setCustomId("ileri")
    .setStyle(Discord.ButtonStyle.Secondary)
    .setEmoji("1137686676278362204"),
    );
    Users.findOne({_id: uye.id }, async (err, res) => {
    if (!res) return message.channel.send({embeds: [embed.setDescription(`${uye} isimli üyenin yetkili bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
    if(!res.Staffs) return message.channel.send({embeds: [embed.setDescription(`${uye} isimli üyenin yetkili bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
    let pages = res.Staffs.sort((a, b) => b.Date - a.Date)
    var currentPage = 1
    if (!pages && !pages.length || !pages[currentPage - 1]) return message.channel.send({embeds: [embed.setDescription(`${uye} isimli üyenin yetkili bilgisi bulunamadı.`)]}).then(x => setTimeout(() => {x.delete()}, 7500))
    embed.setFooter({text: `${message.guild.name} • ${currentPage} / ${pages.length}`, iconURL: message.guild.iconURL({dynamic: true})})
    const curPage = await message.reply({
    embeds: [embed.setDescription(`${uye}, üyesin yetkili bilgisi yükleniyor. Lütfen bekleyin.`)],
    components: [row]}).catch(err => {});
    if(curPage) await curPage.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.warn)} ${uye} isimli üyenin toplamda \` ${res.Staffs.length || 0} \` adet yetkilisi mevcut.

    ${pages.map((value, index) => `\` ${index + 1}. \` ${message.guild.members.cache.get(value.id) ? message.guild.members.cache.get(value.id) : `<@${value.id}>`}  \` ${moment.duration(Date.now() - value.Date).format("d [gün] H [saat], m [dakika] s [saniye]")} Önce \``).join("\n")} `) .setAuthor({ name: `${uye.user.globalName ? uye.user.globalName : uye.user.tag} üyesinin yetkili bilgileri;`, iconURL: uye.user.displayAvatarURL({dynamic: true})}).setThumbnail(uye.user.avatarURL({ dynamic: true }))]}).catch(err => {})
    const filter = (i) => i.user.id == message.member.id
    const collector = await curPage.createMessageComponentCollector({filter, time: 30000,});
    collector.on("collect", async (i) => {
    switch (i.customId) {
    case "ileri":
    if (currentPage == pages.length) break;
    currentPage++;
    break;
    case "geri":
    if (currentPage == 1) break;
    currentPage--;
    break;
    default:
    break;
    case "kapat": 
    i.deferUpdate().catch(err => {});
    curPage.delete().catch(err => {})
    return
    }
    await i.deferUpdate();
    await curPage.edit({embeds: [embed.setFooter({text: `${message.guild.name} • ${currentPage} / ${pages.length} `, iconURL: message.guild.iconURL({dynamic: true})}).setDescription(`${message.guild.emojiGöster(emojis.warn)} ${uye} isimli üyenin toplamda \` ${res.Staffs.length || 0} \` adet yetkilisi mevcut.

    ${pages.map((value, index) => `\` ${index + 1}. \` ${message.guild.members.cache.get(value.id) ? message.guild.members.cache.get(value.id) : `<@${value.id}>`} \` ${moment.duration(Date.now() - value.Date).format("d [gün] H [saat], m [dakika] s [saniye]")} Önce \``).join("\n")}`) .setAuthor({ name: `${uye.user.globalName ? uye.user.globalName : uye.user.tag} üyesinin yetkili bilgileri;`, iconURL: uye.user.displayAvatarURL({dynamic: true})}).setThumbnail(uye.user.avatarURL({ dynamic: true }))]}).catch(err => {});
    collector.resetTimer();
    });
    collector.on("end", () => {
    if(curPage) curPage.edit({embeds: [embed.setFooter({text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})}).setDescription(`${message.guild.emojiGöster(emojis.warn)} ${uye} isimli üyenin toplamda \`${res.Staffs.length || 0}\` adet yetkilisi mevcut.`) .setAuthor({ name: `${uye.user.globalName ? uye.user.globalName : uye.user.tag} üyesinin yetkili bilgileri;`, iconURL: uye.user.displayAvatarURL({dynamic: true})}).setThumbnail(uye.user.avatarURL({ dynamic: true }))],components: [],}).catch(err => {});
    })
    })
    }
    }