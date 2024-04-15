const Discord = require("discord.js");
const snipe = require("../../schemas/snipe");
const moment = require("moment");
require("moment-duration-format");
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const a = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["snipe"],
name: "snipe",
help: "snipe #Kanal/ID",
category: "yetkili"
},
exclosive: async (client, message, args) => {
const ayar = await setups.findOne({guildID: a.guildID})
if(!ayar) return;  
if(!ayar.staffRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
{
message.react(message.guild.emojiGöster(emojis.no))
return
}
const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
if(!channel) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir kanal belirt.`}).sil(15)
if(channel.type != Discord.ChannelType.GuildText) return;
const data = await snipe.findOne({ guildID: a.guildID, channelID: channel.id });
if (!data) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Bu kanalda silinmiş bir mesaj bulunmuyor!"}).sil(15)
return }
let hembed = new Discord.EmbedBuilder().setAuthor({name: message.member.displayName, iconURL: message.author.avatarURL({dynamic: true})}).setColor('#330066')
message.react(message.guild.emojiGöster(emojis.yes))
hembed.setDescription(`
${data.messageContent ? `\nMesaj içeriği: **${data.messageContent}**` : ""}
Mesaj Sahibi: <@${data.userID}> - (\`${data.userID}\`)
Kanal: ${channel} - \`${channel.id}\`
Mesajın Yazılma Tarihi: <t:${Math.floor(data.createdDate / 1000)}:R>
Mesajın Silinme Tarihi: <t:${Math.floor(data.deletedDate / 1000)}:R>`);
message.reply({ embeds: [hembed] }).sil(15)
},
}
