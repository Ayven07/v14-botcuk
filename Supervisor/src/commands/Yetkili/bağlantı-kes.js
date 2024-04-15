const settings = require("../../configs/settings.json")
const Discord = require("discord.js");
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: ["kes", "baglanti-kes", "bağlantıkes"],
name: "bağlantı-kes",
help: "kes @Rainha/ID",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;      
if(!ayar.staffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.ViewAuditLog) && !message.member.permissions.has(8n)) return message.channel.send({ content: `${message.author}, Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`}).sil(15)
if(!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.ViewAuditLog) && !message.member.permissions.has(8n) && ayar.staffRoles.some(x => message.member.roles.cache.has(x))) {
const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])	
if(!user) return message.reply({embeds: [embed.setDescription(`Bağlantısını kesmek istediğin kullanıcıyı belirtmelisin!`)]}).sil(15)		
if(user.id == message.author.id) return;
if(!user.voice.channel) return message.reply({embeds: [embed.setDescription(`Bağlantısını kesmek istediğiniz kullanıcı sesli odalarda bulunmuyor.`)]}).sil(15)				
if(ayar.registerParents.some((x) => x !== user.voice.channel.parentId)) return message.reply({embeds: [embed.setDescription(`Yalnızca kayıt odalarından birisinin bağlantısını kesebilirsiniz! Bu kullanıcı şu an "*${user.voice.channel.name}*" kanalında bulunmakta.`)]}).sil(15)			
if(message.member.roles.highest.rawPosition < user.roles.highest.rawPosition) return message.reply({embeds: [embed.setDescription(`Rolleri senden yüksek birinin ses kanallarında ki bağlantısını kesemezsin.`)]}).sil(15)		
const Embed = new Discord.EmbedBuilder()
.setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
.setDescription(`${user} üyesi "*${user.voice.channel.name}*" ses kanalından çıkarıldı.`)
.setColor("Random");
await user.voice.disconnect();
message.reply({ embeds: [Embed] })				
} else if(message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && message.member.permissions.has(Discord.PermissionsBitField.Flags.ViewAuditLog) && message.member.permissions.has(8n)) {
const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])	
if(!user) return message.reply({embeds: [embed.setDescription(`Bağlantısını kesmek istediğin kullanıcıyı belirtmelisin!`)]}).sil(15)		
if(user.id == message.author.id) return;
if(!user.voice.channel) return message.reply({embeds: [embed.setDescription(`Bağlantısını kesmek istediğiniz kullanıcı sesli odalarda bulunmuyor.`)]}).sil(15)				
if(message.member.roles.highest.rawPosition < user.roles.highest.rawPosition) return message.reply({embeds: [embed.setDescription(`Rolleri senden yüksek birinin ses kanallarında ki bağlantısını kesemezsin.`)]}).sil(15)		
const Embed = new Discord.EmbedBuilder()
.setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
.setDescription(`${user} üyesi "*${user.voice.channel.name}*" ses kanalından çıkarıldı.`)
.setColor("Random");
await user.voice.disconnect();
message.reply({ embeds: [Embed] })			
}
}
} 