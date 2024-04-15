const Discord = require("discord.js");
const registerData  = require("../../schemas/registerStats");
const settings = require("../../configs/settings.json")
const emojis = require('../../configs/emojiName.json')
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: ["taglıalım", "taglialim","tagli-alim"],
name: "taglı-alım",
help: "taglı-alım",
category: "owner"     
},
exclosive: async (client, message, args, embed) => {  
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;    
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ embeds: [embed.setDescription(`${message.member}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin!`)] })
let data = await registerData.findOne({ guildID: settings.guildID})
if(!data) new registerData({guildID: settings.guildID, tagMode: false}).save();
let kilits = new Discord.ButtonBuilder()
.setCustomId("ac")
.setLabel("Aç")  
.setStyle(Discord.ButtonStyle.Success)
.setEmoji(message.guild.emojiGöster(emojis.yes).id) 
let unkilits = new Discord.ButtonBuilder()
.setCustomId("kapa") 
.setLabel("Kapat")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji(message.guild.emojiGöster(emojis.no).id)       
const row = new Discord.ActionRowBuilder()
.addComponents([ kilits, unkilits]);
var msg = await message.reply({embeds: [embed.setDescription(`Bu komut sunucu içerisinde taglı alımı açıp kapatmanıza yarar.\n\`\`\`diff\n- Taglı alım modu şuan (${data && data.tagMode === true ? `Açık` : `Kapalı`})\n\`\`\``)],  components: [row] })
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (button) => {
if(button.customId === "ac") {
await button.deferUpdate();   
data.tagMode = true;
data.save();
msg.delete().catch(e => {})
message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} taglı alım modu başarıyla aktif edildi!`)] });
const guild = client.guilds.cache.get(settings.guildID)
const memberss = [...guild.members.cache.filter(member => !ayars.ownerRoles.some(x => !member.roles.cache.has(x)) && !member.roles.cache.has(ayars.vipRoles) && !member.roles.cache.has(ayars.boosterRoles) && !ayars.serverTag.some(tag => member.user.globalName.includes(tag)) && !member.user.bot).values()].splice(0, 10)
for await (const member of memberss) {
await member.roles.set(ayars.unregRoles).catch(err => {})
await member.setNickname(`${ayars.unregisterName}`).catch(e => {})  
} 
}
if(button.customId === "kapa") {
await button.deferUpdate();   
data.tagMode = false;
data.save();
msg.delete().catch(e => {})
message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} taglı alım modu başarıyla deaktif edildi!`)] });
}
})             
}
}

