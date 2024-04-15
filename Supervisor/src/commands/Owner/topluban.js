const Discord = require("discord.js")
const moment = require("moment");
const emojis = require('../../configs/emojiName.json')
require("moment-duration-format")
moment.locale("tr")
module.exports = {
conf: {
aliases: [],
name: "topluban",
help: "topluban @ID",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed) => {
if(!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.react(message.guild.emojiGöster(emojis.no))  
if (args.length < 1)
return message.reply({ content: `Banlanacak kişilerin ID'lerini belirt.`, ephemeral: true }).sil(15)
const members = args.filter((id) => message.guild.members.cache.has(id)).map((id) => message.guild.members.cache.get(id));
if (members.length < 1)
return message.reply({ content: `Banlanacak kişiler 1 veya 1'den az olamaz.`, ephemeral: true }).sil(15)     
let yes = new Discord.ButtonBuilder()
.setCustomId("evet")
.setLabel("Evet")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji(message.guild.emojiGöster(emojis.yes).id) 
let no = new Discord.ButtonBuilder()
.setCustomId("hayir")
.setLabel("Hayır")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji(message.guild.emojiGöster(emojis.no).id)       
 const row = new Discord.ActionRowBuilder()
.addComponents([ yes, no]);
const Rainha = await message.reply({embeds: [embed.setDescription(`${members.map((member, idx) => `**${idx + 1}. ${member.toString()}**`).join("\n")}\nBu üyeleri banlamak istiyor musun?`)], components: [row]})
var filter = (button) => button.user.id === message.author.id;
let collector = await Rainha.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (button) => {
if(button.customId === "evet") {
await button.deferUpdate();   
await Rainha.edit({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${members.length} adet kullanıcı başarıyla yasaklandı.`)]})
for (const member of members) {
if (member.bannable)
await member.ban({ days: 7, reason: "Toplu ban" }).catch( e => {})
}
}
if(button.customId === "hayir") {
await button.deferUpdate();   
Rainha.delete().catch(e => {})  
}            
})  
}
}