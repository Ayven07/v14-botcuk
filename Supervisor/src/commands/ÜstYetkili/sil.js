const Discord = require("discord.js")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["sil","temizle"],
name: "sil",
help: "sil [Miktar]",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed) => {
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) return;
if (!args[0]) return message.channel.send({ content:`${message.guild.emojiGöster(emojis.no)} Bir miktar belirtmelisin!`}).sil(15)
if (isNaN(args[0])) return message.channel.send({ content:`${message.guild.emojiGöster(emojis.no)} Belirttiğin miktar bir sayı olmalı!`}).sil(15)
if(args[0] > 100) return;
await message.delete().catch(e => {})
await message.channel.bulkDelete(args[0]).catch(e => {});
message.channel.send({ content:`${message.guild.emojiGöster(emojis.yes)} ${args[0]} adet mesaj silindi!`}).sil(15)
},
};
    
    
  
  