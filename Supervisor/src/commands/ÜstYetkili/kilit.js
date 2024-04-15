const setups = require("../../schemas/setup")
const Discord = require("discord.js");
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["kilit","lock"],
name: "kilit",
help: "kilit",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed, prefix) => {
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;  
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)) return;
let kilits = new Discord.ButtonBuilder()
.setCustomId("kilit")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji(message.guild.emojiGöster(emojis.on).id) 
let unkilits = new Discord.ButtonBuilder()
.setCustomId("unkilit")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji(message.guild.emojiGöster(emojis.off).id) 
const row = new Discord.ActionRowBuilder()
.addComponents([ kilits, unkilits]);
var msg = await message.reply({embeds: [embed.setDescription(`${message.member} Kanal Kilidini Aktifleştirmek Ve Deaktifleştirmek İçin Butonları Kullanınız.`)], components: [row]})
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (button) => {
if(button.customId === "kilit") {
await button.deferUpdate();
await message.channel.permissionOverwrites.edit(button.guild.id, {SendMessages: false}).then(async() => {}).catch(e => {});  
await message.channel.permissionOverwrites.edit(ayars.womanRoles[0], {SendMessages: false}).then(async() => {}).catch(e => {});
await message.channel.permissionOverwrites.edit(ayars.manRoles[0], {SendMessages: false}).then(async() => {
row.components[0].setDisabled(true) 
msg.edit({components: [row]})}).catch(e => {});
}
if(button.customId === "unkilit") {
await button.deferUpdate();
await message.channel.permissionOverwrites.edit(button.guild.id, {SendMessages: true}).then(async() => {}).catch(e => {});  
await message.channel.permissionOverwrites.edit(ayars.womanRoles[0], {SendMessages: null}).then(async() => {}).catch(e => {}); 
await message.channel.permissionOverwrites.edit(ayars.manRoles[0], {SendMessages: null}).then(async() => {
row.components[1].setDisabled(true) 
msg.edit({components: [row]})}).catch(e => {});
}
})
},
};
