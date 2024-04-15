const Discord = require('discord.js');
const emojis = require('../../configs/emojiName.json')
const regstats = require("../../schemas/registerStats");
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: [],
name: "teyitler",
help: "teyitler @Rainha/ID",
category: "kayit"
},
exclosive: async (client, message, args, embed, prefix) => { 
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;  
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
if(!ayars.registerRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content: `Yetkin bulunmamakta.\Yetkili olmak istersen başvurabilirsin.`}).sil(15)
return }
const data = await regstats.findOne({ guildID: settings.guildID, userID: member.id });
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({ embeds: [embed.setDescription(`  
${message.guild.emojiGöster(emojis.stat)} Toplam kayıt bilgisi: **${data ? data.top : 0}**
${message.guild.emojiGöster(emojis.stat)} Toplam erkek kayıt bilgisi: **${data ? data.erkek : 0}**
${message.guild.emojiGöster(emojis.stat)} Toplam kız kayıt bilgisi: **${data ? data.kız : 0}**`)] });  
  },
};