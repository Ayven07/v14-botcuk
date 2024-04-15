const Discord = require("discord.js");
const moment = require("moment");
const setups = require("../schemas/setup")
const client = global.client
moment.locale("tr");
const a = require("../configs/settings.json")
const snipe = require("../schemas/snipe");
module.exports = async (message) => {
if (!message.author) return;
if(message.author && message.author.bot) return;
if(!message.guild) return;
const ayar = await setups.findOne({guildID: a.guildID})
if(!ayar) return;
if(!message.attachments.first()) {
await snipe.findOneAndUpdate({ guildID: a.guildID, channelID: message.channel.id }, { $set: { messageContent: message.content, userID: message.author && message.author.id, image: message.attachments.first() ? message.attachments.first().proxyURL : null, createdDate: message.createdTimestamp, deletedDate: Date.now() } }, { upsert: true });
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: `${ayar && ayar.botFooter ? ayar.botFooter : `${message.guild.name}`}`, iconURL: message.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || message.author.avatarURL({dynamic: true })}).setAuthor({ name: message.author.displayName, iconURL: message.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || message.author.avatarURL({ dynamic: true })})
.setDescription(`
${message.author} Tarafından <#${message.channel.id}> kanalında bir mesaj silindi.

\`\`\`fix

Silinen Mesaj: ${message.content}
Kanal: ${message.channel.name} - (${message.channel.id})
Kullanıcı: ${message.author.displayName} - (${message.author.id})
Mesaj ID: ${message.id}
Mesaj Tarihi: ${moment(Date.parse(new Date())).format("LLL")}

\`\`\``);
const channel = await client.kanalBul("message-log")
channel.send({ embeds: [embed] });
} else {
await snipe.findOneAndUpdate({ guildID: a.guildID, channelID: message.channel.id }, { $set: { messageContent: message.content, userID: message.author && message.author.id, image: message.attachments.first() ? message.attachments.first().proxyURL : null, createdDate: message.createdTimestamp, deletedDate: Date.now() } }, { upsert: true });
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: `${ayar && ayar.botFooter ? ayar.botFooter : `${message.guild.name}`}`, iconURL: message.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || message.author.avatarURL({dynamic: true })}).setAuthor({ name: message.author.displayName, iconURL: message.author.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || message.author.avatarURL({ dynamic: true })})
.setImage(message.attachments.first().proxyURL)
.setDescription(`
${message.author} Tarafından <#${message.channel.id}> kanalında bir fotoğraf silindi.

\`\`\`fix

Silinen Mesaj: ${message.content}
Kanal: ${message.channel.name} - (${message.channel.id})
Kullanıcı: ${message.author.displayName} - (${message.author.id})
Mesaj ID: ${message.id}
Mesaj Tarihi: ${moment(Date.parse(new Date())).format("LLL")}-

\`\`\``);
const channel = await client.kanalBul("message-log")
channel.send({ embeds: [embed] });
}
};
module.exports.conf = {
name: "messageDelete",
};