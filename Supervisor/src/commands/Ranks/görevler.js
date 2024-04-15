const moment = require("moment");
require("moment-duration-format");
const tasks = require("../../schemas/tasks.js");
const settings = require("../../configs/settings.json");
const emojis = require('../../configs/emojiName.json')
const Discord = require("discord.js");
module.exports = {
conf: {
aliases: ["gorevler", "görevler", "yapmamgerekenler"],
name: "görevler",
help: "görevler @Rainha/ID",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
if(settings.coinSystem === false) return message.reply({embeds: [embed.setDescription(`Terfi Sistemi Aktif Değil!`)]}).sil(15)
if(!client.ranks.some((x) => message.member.roles.cache.has(x.role)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.react(message.guild.emojiGöster(emojis.no))
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
if(!!client.ranks.some((x) => member.roles.cache.has(x.role)) && !member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.react(message.guild.emojiGöster(emojis.no))
const msj = await message.reply({embeds: [embed.setDescription(`${message.guild.name} sunucusunda ${member} kullanıcısına ait veriler yükleniyor. Lütfen bekleyin!`)]})
const mtask = await tasks.find({ guildID: settings.guildIDd, userID: member.user.id });
msj.edit({embeds: [embed.setDescription(`
Toplam Görev Sayısı: \`${mtask.length}\`
Tamamlanmış Görev Sayısı: \`${mtask.filter((x) => x.completed).length}\`
Tamamlanmamış Görev Sayısı: \`${mtask.filter((x) => !x.completed).length}\`
Aktif Görev Sayısı: \`${mtask.filter((x) => x.active).length}\`
${mtask.filter((x) => x.active).map((x) => `\`#${x.id}\` ${x.message} \n${x.completedCount >= x.count ? `${message.guild.emojiGöster(emojis.yes)}` + " **Tamamlandı!**" : `${progressBar(x.completedCount, x.count, 8)} \`${x.type === "ses" || x.type === "yayin" || x.type == "camera" ? `${moment.duration(x.completedCount).format("H [saat], m [dk], s [sn]")} / ${moment.duration(x.count).format("H [saat], m [dk], s [sn]")}` : `${x.completedCount} / ${x.count}`}\` \nKalan Süre: \`${moment.duration(x.finishDate - Date.now()).format("H [saat], m [dakika] s [saniye]")}\` \nÖdül: ${message.guild.emojiGöster(emojis.link)} **${x.prizeCount} puan**`}`).join("\n\n")}        `)]})    
}
}

function progressBar(value, maxValue, size) {
const guild = client.guilds.cache.get(settings.guildID)
const fill = `${guild.emojiGöster(emojis.fill)}`;
const fillStart = `${guild.emojiGöster(emojis.fillStart)}`;
const fillEnd = `${guild.emojiGöster(emojis.fillEnd)}`;
const empty = `${guild.emojiGöster(emojis.empty)}`;
const emptyEnd = `${guild.emojiGöster(emojis.emptyEnd)}`;  
const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
const emptyProgress = size - progress > 0 ? size - progress : 0;
const progressText = fill.repeat(progress);
const emptyProgressText = empty.repeat(emptyProgress);
return emptyProgress > 0 ? fillStart+progressText+emptyProgressText+emptyEnd : fillStart+progressText+emptyProgressText+fillEnd;
};