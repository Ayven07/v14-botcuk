const Discord = require("discord.js")
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["kayıtsız","ks","kayitsiz"],
name: "kayitsiz",
help: "kayitsiz @Rainha/ID",
category: "kayit"
},
exclosive: async (client, message, args, embed, prefix) => { 
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;  
if(!ayars.registerRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:`Yetkin bulunmamakta.\Yetkili olmak istersen başvurabilirsin.`}).sil(15)
return }
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Bir üye belirtmelisin!"}).sil(15)
return }
if (!message.member.permissions.has(8n) && member.roles.highest.position >= message.member.roles.highest.position) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini kayıtsıza atamazsın!"}).sil(15)
return }
if (!member.manageable) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content: "Bu üyeyi kayıtsıza atamıyorum!"}).sil(15) 
return }
message.react(message.guild.emojiGöster(emojis.yes))
member.roles.set(ayars.unregRoles).catch(e => {});
member.setNickname(`${ayars.defaultTag} ${ayars.unregName}`).catch(e => {});
message.reply({ content:`${message.guild.emojiGöster(emojis.yes)} ${member} üyesi ${message.author} tarafından kayıtsıza atıldı!`})
},
};