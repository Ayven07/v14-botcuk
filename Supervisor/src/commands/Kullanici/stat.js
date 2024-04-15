const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const cameraUser = require("../../schemas/cameraUser");
const voiceUserParent = require("../../schemas/voiceUserParent");
const moment = require("moment");
const inviterSchema = require("../../schemas/inviter");
const settings = require("../../configs/settings.json")
require("moment-duration-format");
const emojis = require('../../configs/emojiName.json')
moment.locale("tr")
const setups = require("../../schemas/setup")
const streamUser = require("../../schemas/streamUser")

module.exports = {
    conf: {
        aliases: ["me","stat"],
        name: "stat",
        help: "stat @Rainha/ID",
        category: "kullanici"
    },
    exclosive: async (client, message, args) => {
        const ayar = await setups.findOne({ guildID: settings.guildID })
        if (!ayar) return;

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const msj = await message.reply("Veriler yükleniyor, lütfen bekleyin...");

        const inviterData = await inviterSchema.findOne({ guildID: settings.guildID, userID: member.user.id }).lean();

        const category = async (parentsArray) => {
            const data = await voiceUserParent.find({ guildID: settings.guildID, userID: member.id }).lean();
            const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
            let voiceStat = 0;
            for (var i = 0; i < voiceUserParentData.length; i++) {
                voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
            }
            return moment.duration(voiceStat).format("D [Gün], H [Saat], m [Dakika]");
        };  

        const Active1 = await messageUserChannel.find({ guildID: settings.guildID, userID: member.id }).sort({ channelData: -1 }).lean();
        const Active2 = await voiceUserChannel.find({ guildID: settings.guildID, userID: member.id }).sort({ channelData: -1 }).lean();
        let voiceTop;
        let messageTop;
        Active1.length > 0 ? messageTop = Active1.splice(0, 5).map(x => `\` - \` ${message.guild.channels.cache.get(x.channelID) ? message.guild.channels.cache.get(x.channelID) : "#silinmiş-kanal"}: **${Number(x.channelData).toLocaleString()} mesaj**`).join("\n") : messageTop = "Veri bulunmuyor."
        Active2.length > 0 ? voiceTop = Active2.splice(0, 5).map(x => `\` - \` <#${x.channelID}>: **${moment.duration(x.channelData).format("H [saat], m [dakika]")}**`).join("\n") : voiceTop = "Veri bulunmuyor.";

        const messageData = await messageUser.findOne({ guildID: settings.guildID, userID: member.id }).select('topStat monthStat weeklyStat dailyStat Date').lean();
        const voiceData = await voiceUser.findOne({ guildID: settings.guildID, userID: member.id }).select('topStat monthStat weeklyStat dailyStat').lean();
        const streamData = await streamUser.findOne({ guildID: settings.guildID, userID: member.id }).lean();  
        const cameraData = await cameraUser.findOne({ guildID: settings.guildID, userID: member.id }).lean();    

        const Embed = new Discord.MessageEmbed()
            .setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
            .setDescription(`${emojis.hos} ${member.toString()} üyesinin ${message.guild.name} sunucusunda toplam ses ve mesaj bilgileri aşağıda belirtilmiştir.`)
            .addField("Son Mesaj Aktifliği", `${messageData && messageData.Date ? moment(messageData.Date).format("LLL") : 'Tarih Bulunamadı.'}`)
            .addField("Hesap Oluşturma Tarihi", `${moment(member.user.createdAt).format("LLL")}`)
            .addField("Sunucuya Giriş Tarihi", `${moment(message.member.joinedAt).format("LLL")}`)
            .addField("Günlük / Haftalık / Aylık / Toplam Mesaj İstatistikleri", `
                Toplam Mesaj İstatistiği: ${messageData ? messageData.topStat : "0"} Mesaj
                Aylık Mesaj İstatistiği: ${messageData ? messageData.monthStat : "0"} Mesaj
                Haftalık İstatistiği: ${messageData ? messageData.weeklyStat : "0"} Mesaj
                Günlük Mesaj İstatistiği: ${messageData ? messageData.dailyStat : "0"} Mesaj
            `)
            .addField("Günlük / Haftalık / Aylık / Toplam Ses İstatistikleri", `
                Toplam Ses İstatistiği: ${moment.duration(voiceData ? voiceData.topStat : 0).format("D [gün], H [saat]")}
                Aylık Ses İstatistiği: ${moment.duration(voiceData ? voiceData.monthStat : 0).format("D [gün], H [saat]")}
                Haftalık Ses İstatistiği: ${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("D [gün], H [saat]")}
                Günlük Ses İstatistiği: ${moment.duration(voiceData ? voiceData.dailyStat : 0).format("D [gün], H [saat]")}
            `)
            .addField("En Çok Vakit Geçirdiği Ses Kanalları", `
                Public Odalar: ${await category(ayar.publicParents)}
                Secret Odalar: ${await category(ayar.privateParents)}
                Alone Odalar: ${await category(ayar.aloneParents)}
                Eğlence Odaları: ${await category(ayar.funParents)}
                Kayıt Odaları: ${await category(ayar.registerParents)}
            `)
            .addField("Mesaj Kanalı İstatistiği", `${messageTop}`)
            .addField("Ses Kanalı İstatistiği", `${voiceTop}`)
            .setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTimestamp();

        msj.edit({ embeds: [Embed] });
    }
}
