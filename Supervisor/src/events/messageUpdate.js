const Discord = require("discord.js");
const moment = require("moment");
const setups = require("../schemas/setup")
const client = global.client
const a = require("../configs/settings.json")
module.exports = async (oldMessage, newMessage) => {
if (!newMessage.author) return;
if(newMessage.author && newMessage.author.bot) return;
if(!newMessage.guild) return;
const ayar = await setups.findOne({guildID: a.guildID})
if(!ayar) return;
if(!newMessage.attachments.first()) {
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: `${ayar && ayar.botFooter ? ayar.botFooter : `${newMessage.guild.name}`}`, iconURL: newMessage.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || newMessage.author.avatarURL({dynamic: true })}).setAuthor({ name: newMessage.author.displayName, iconURL: newMessage.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || newMessage.author.avatarURL({ dynamic: true })})
const channel = await client.kanalBul("message-log")
channel.send({embeds: [embed.setDescription(`
${newMessage.author} Tarafından <#${newMessage.channel.id}> kanalında bir mesaj güncellendi.

\`\`\`fix

Eski Mesaj: ${oldMessage.content} 
Yeni Mesaj: ${newMessage.content}
Kanal: ${newMessage.channel.name} - (${newMessage.channel.id})
Kullanıcı: ${newMessage.author.displayName} - (${newMessage.author.id})
Mesaj ID: ${newMessage.id}
Mesaj Tarihi: ${moment(Date.parse(new Date())).format("LLL")}

\`\`\``)]});
} else {
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: `${ayar && ayar.botFooter ? ayar.botFooter : `${newMessage.guild.name}`}`, iconURL: newMessage.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || newMessage.author.avatarURL({dynamic: true })}).setAuthor({ name: newMessage.author.displayName, iconURL: newMessage.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29_413.png" || newMessage.author.avatarURL({ dynamic: true })})
const channel = await client.kanalBul("message-log")
channel.send({embeds: [embed.setDescription(`
${newMessage.author} Tarafından <#${newMessage.channel.id}> kanalında bir fotoğraf güncellendi.

\`\`\`fix

Eski Mesaj: ${oldMessage.content}
Yeni Mesaj: ${newMessage.content}
Kanal: ${newMessage.channel.name} - (${newMessage.channel.id})
Kullanıcı: ${newMessage.author.displayName} - (${newMessage.author.id})
Mesaj ID: ${newMessage.id}
Mesaj Tarihi: ${moment(Date.parse(new Date())).format("LLL")}
\`\`\``).setImage(newMessage.attachments.first().proxyURL)]});
}
};
module.exports.conf = {
name: "messageUpdate",
};