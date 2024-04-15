
const settings = require("../../configs/settings.json")
const Discord = require("discord.js");
const emojis = require('../../configs/emojiName.json')
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: ["mazeret"],
name: "mazeret",
help: "mazeret",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;      
if (!ayar.staffRoles.some(x => message.member.roles.cache.has(x)) && !message.member.permissions.has(8n)) return message.channel.send({ content: `${message.author}, Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`}).sil(15)
const reason = args.slice(0).join(" ")
if(!reason) return message.reply({embeds: [embed.setDescription(`Bir Mazeret Sebebi Belirtmelisin.`)]}).sil(15)
if(reason.length < 10) return message.reply({embeds: [embed.setDescription(`En Az 10 Karakter Bir Mazeret Sebebi Yazmalısın.`)]}).sil(15)    
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla **${reason}** Sebebiyle Mazeretini Bildirdin.\n\n${message.guild.emojiGöster(emojis.uyari)} **NOT: Mazeretin Onaylandığında Mazeretli Rolün Verilecektir.**`)]})  
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onayli")
.setLabel("Kabul Et")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji("915754671728132126"),
new Discord.ButtonBuilder()
.setCustomId("redli")
.setLabel("Reddet")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji("920412153712889877"),
);
const channel = await client.kanalBul("mazeret-log")
var msg = await channel.send({embeds: [new Discord.EmbedBuilder().setTitle("🎉 Yeni Mazeret Başvuru 🎉").setDescription(`
${message.guild.emojiGöster(emojis.uyari)} **__Kullanıcı Hakkında__**
${message.guild.emojiGöster(emojis.nokta)} **ID: \`${message.member.id}\`**
${message.guild.emojiGöster(emojis.nokta)} **Kullanıcı: ${message.member} (\`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}\`)**`)
.addFields({name: `${message.guild.emojiGöster(emojis.uyari)} **__Mazeret Hakkında__**`,
value: `${message.guild.emojiGöster(emojis.nokta)} **${reason}**`})], components: [row]})
let member = message.member
let collector = await msg.createMessageComponentCollector({})
collector.on("collect", async (button) => {
if(button.customId === "onayli") {
if (!ayar.roleAddRoles.some(x => button.member.roles.cache.has(x)) && !button.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;
row.components[0].setDisabled(true) 
row.components[1].setDisabled(true) 
await button.deferUpdate();
msg.edit({components: [row]})
const Sembed = new Discord.EmbedBuilder()
const channel = await client.kanalBul("mazeret-log");
channel.send({embeds: [Sembed.setDescription(`${member.guild.emojiGöster(emojis.yes)} Başarıyla ${member} Kullanıcısının Başvurusu ${button.member} Tarafından Onaylandı.`)]}).catch(e => {})
member.send(`${message.guild.name} Sunucusundaki Mazeret Başvurun **${button.member.user.globalName ? button.member.user.globalName : button.member.user.tag}** Tarafından Başarıyla Onaylandı!:tada::tada::tada:`).catch(err => channel.send({content: `>>> ${member} kullanıcısının özel mesajları kapalı. DM üzerinden bilgilendirme mesajı gönderemedim, lütfen kendiniz bilgilendirme yapınız.` }))
member.roles.add(ayar.mazeretPerms).catch(e => {}).then(()=> {
setTimeout(async () => {
if(!member.roles.cache.has(ayar.mazeretPerms)) return;
member.roles.remove(ayar.mazeretPerms).catch(e => {})  
}, 518400000)    
})
}
if(button.customId === "redli") {
if (!ayar.roleAddRoles.some(x => button.member.roles.cache.has(x)) && !button.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;
row.components[0].setDisabled(true) 
row.components[1].setDisabled(true) 
await button.deferUpdate();
msg.edit({components: [row]})
const Embed = new Discord.EmbedBuilder()
const channel = await client.kanalBul("mazeret-log");
if(member.roles.cache.has(ayar.mazeretPerms)) member.roles.remove(ayar.mazeretPerms).catch(e => {})  
channel.send({embeds: [Embed.setDescription(`${member.guild.emojiGöster( emojis.yes)} Başarıyla ${member} Kullanıcısının Başvurusu ${button.member} Tarafından Reddedildi!`)]}).catch(e => {})
member.send(`${message.guild.name} Sunucusundaki Mazeret Başvurun **${button.member.user.globalName ? button.member.user.globalName : button.member.user.tag}** Tarafından Reddedildi! 😔`).catch(err => channel.send({content: `>>> ${member} kullanıcısının özel mesajları kapalı. DM üzerinden bilgilendirme mesajı gönderemedim, lütfen kendiniz bilgilendirme yapınız.` }))
}  
})  
}
}