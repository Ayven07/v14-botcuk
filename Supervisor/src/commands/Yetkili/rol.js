const Discord = require("discord.js")
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const a = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["rol", "rolver","rol-ver","r"],
name: "rolver",
help: "rol ver/al @Rainha/ID @Rol/ID",
category: "yetkili"
},
exclosive: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({guildID: a.guildID})
if(!ayar) return;  
if(!ayar.roleAddRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
{
message.reply({ content:`Malesef yetkin bulunmamakta dostum.`}).sil(15)
return }
if (!args[0]) return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Kullanımı: ${prefix}r al/ver Kullanıcı Rol`}).sil(15)
if (args[0] != "al") {
if (args[0] != "ver") {
return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Kullanımı: ${prefix}r al/ver Kullanıcı Rol`}).sil(15)
}
}
if (!args[1]) return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Bir üye etiketle ve tekrardan dene!`}).sil(15)
let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[1])
if (!rMember) return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Bir üye etiketle ve tekrardan dene!`}).sil(15)
if (!args[2]) return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Rolü belirtmelisin.`}).sil(15)
let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
if (!role) return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Belirtmiş olduğun rolü bulamadım ! Düzgün bir rol etiketle veya ID belirtip tekrar dene.`}).sil(15)
if (message.member.roles.highest.rawPosition <= role.rawPosition) return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} Kendi rolünden yüksek veya eşit bir rolle işlem yapamazsın.`}).sil(15)
if (args[0] == "al") {
if(role.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles) && role.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels) && role.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild) && role.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && ayar.ownerRoles.some(x => x == role.id) && ayar.banHammer.some(x => x == role.id) && ayar.roleAddRoles.some(x => x == role.id)) return message.reply({embeds: [embed.setDescription(`${message.member}, ${role} Rolünü Almaya İzniniz Bulunmamakta.`)]}).sil(15)          
if (rMember.roles.cache.has(role.id)) {
await rMember.roles.remove(role.id).catch(e => {});
message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(`${rMember} Kişisinden ${role} rolünü aldım.`)]})
} else {
message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(`${rMember} Kişisinde ${role} rolü mevcut değil.`)]}).sil(15)
}
}
if (args[0] == "ver") {
if(role.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles) && role.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels) && role.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild) && role.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && ayar.ownerRoles.some(x => x == role.id) && ayar.banHammer.some(x => x == role.id) && ayar.roleAddRoles.some(x => x == role.id)) return message.reply({embeds: [embed.setDescription(`${message.member}, ${role} Rolünü Vermeye İzniniz Bulunmamakta.`)]}).sil(15)
if (!rMember.roles.cache.has(role.id)) {
await rMember.roles.add(role.id).catch(e => {});
message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(`${rMember} Kişisine ${role} rolünü ekledim.`)]})
} else {
message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(`${rMember} Kişisinde ${role} rolü zaten mevcut.`)]}).sil(15)
}
}    
},
};