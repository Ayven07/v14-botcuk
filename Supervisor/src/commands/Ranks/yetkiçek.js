const settings = require("../../configs/settings.json")
const coin = require("../../schemas/coin");
const emojis = require('../../configs/emojiName.json')
const users = require("../../schemas/users");
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: ["yetkicek", "yc"],
name: "yetkiçek",
help: "yetkiçek @Rainha/ID",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed) => {
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;  
if (!ayars.roleAddRoles.some((x) => message.member.roles.cache.has(x)) && !message.member.permissions.has(8n)) return message.channel.send({ content: `${message.author}, Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`}).sil(15)
let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!üye) return message.reply(`Bir Kullanıcı Etiketle`).sil(15)
if(message.member.roles.highest.position <= üye.roles.highest.position) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:`Senden yüksekte olan birisinin yetkisini çekemezsin.`}).sil(15)
return }
if(message.author.id === üye.id) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:`Kendini yetkiden çekemezsin.`}).sil(15)
return }
let kontrol = await users.findOne({_id: üye.id})
if(kontrol && !kontrol.Staff) return message.reply({content: `${üye} isimli üye zaten yetkili olarak belirlenmemiş.`}).sil(15)
let altYetki = message.guild.roles.cache.get(ayars.registerPerms)
if(altYetki) await üye.roles.remove(üye.roles.cache.filter(rol => altYetki.position <= rol.position)).catch(err => {});
await message.channel.send({content: `${message.guild.emojiGöster(emojis.yes)} ${üye} Kişisinin Yetkisi ${message.author} Tarafından Alındı.`})    
coin.updateOne({ guildID: settings.guildID, userID: üye.id }, { $set: { coin: 0 } }, { upsert: true }).exec();
users.updateOne({_id: üye.id}, { $set: { Staff: false } }, { upsert: true }).exec();
}
};