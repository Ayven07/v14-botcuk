let zaman = new Map();
const Discord = require("discord.js")
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["kayıtsız-etiketle", "kayitsizetiketle", "kayıtsızetiketle"],
name: "kayitsiz-etiketle",
help: "kayitsiz-etiketle",
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
if (zaman.get(message.author.id) >= 1) return message.reply("<@"+message.member+"> Bu komutu 1 saatte bir kullanabilirsin.").sil(15)
zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
setTimeout(() => {
zaman.delete(message.author.id)
}, 1000 * 60 * 60 * 1)
message.react(message.guild.emojiGöster(emojis.yes))
if(ayars.welcomeChannel) await message.guild.channels.cache.get(ayars.welcomeChannel).send({ content:`<@&${ayars.unregRoles}> hey, yönetici sizi teyit kanallarına çağırıyor.`}).catch(e => {})
}
};