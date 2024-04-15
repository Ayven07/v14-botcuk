const Discord = require("discord.js")
const Canvas = require("@napi-rs/canvas");
let kullanamayanlar = {}
let client = global.client
const emojis = require('../../configs/emojiName.json')
let db = new Map()
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["ship"],
name: "ship",
help: "ship @Rainha/ID",
category: "kullanici"
},
exclosive: async (client, message, args) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
let kanallar = ["ship", "ship-chat"]
const sayı = Math.floor(Math.random() * 101);    
if(!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) { 
if(kullanamayanlar[message.author.id]!=null) return message.reply(`${message.guild.emojiGöster(emojis.no)} **Bu komutu 15 saniye aralıklarla kullanabilirsin**!`).then(x => setTimeout(() => x.delete(), 15000))		 
kullanamayanlar[message.author.id]=1; 
setTimeout(() => { 
kullanamayanlar[message.author.id]=null; 
}, 15000);
}
if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ship kanallarında kullanabilirsin.`}).sil(15)    
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("tanis")
.setLabel("Tanış")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji("1140430126845263923"),);  
const row2 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("taniss")
.setLabel("Tanış")
.setStyle(Discord.ButtonStyle.Danger)
.setDisabled(true)  
.setEmoji("1140430126845263923"),); 
if(ayar.manRoles.some(x => message.member.roles.cache.has(x))) {    
const canvas = Canvas.createCanvas(700, 250);
const ctx = canvas.getContext("2d")
const image = ["https://media.discordapp.net/attachments/1001038575871201280/1001849828420104242/wallhaven-wqve97.png", "https://media.discordapp.net/attachments/1074780644749627414/1095779201510019184/20230412_213252.jpg", "https://media.discordapp.net/attachments/1074780644749627414/1095779201270939789/20230412_213309.jpg", "https://media.discordapp.net/attachments/1074780644749627414/1095779201031868516/20230412_213409.jpg", "https://media.discordapp.net/attachments/1074780644749627414/1095779200834740254/20230412_213448.jpg"]
const index = Math.floor(Math.random() * (image.length));
const bg = await Canvas.loadImage(`${image[index]}`)
ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
ctx.font = "75px 'Candara'"
ctx.fillStyle = "#f0f0f0"
const avatarSize = 150; 
const avatarY = 50;
const messageAuthor = await Canvas.loadImage(message.member.displayAvatarURL({}) ? message.member.displayAvatarURL({ format: "png" }) : message.member.avatarURL({ format: "png" }))
ctx.drawImage(messageAuthor, 50, 50, avatarSize, avatarSize)
ctx.font = "20px 'Arial'";
ctx.fillStyle = "#ffffff";
const authorNameWidth = ctx.measureText(message.member.displayName).width;
ctx.fillText(message.member.displayName, 50 + avatarSize / 2 - authorNameWidth / 2, 40);
const member = message.mentions.members.first() || message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.cache.has(ayar.womanRoles[0])).random()
if(!member) return;
const targetMention = await Canvas.loadImage(member.displayAvatarURL({}) ? member.displayAvatarURL({ format: "png" }) : member.avatarURL({ format: "png" }))
ctx.drawImage(targetMention, 500, 50, avatarSize, avatarSize)
const memberNameWidth = ctx.measureText(member.displayName).width;
ctx.fillText(member.displayName, 500 + avatarSize / 2 - memberNameWidth / 2, 40);
const barMaxHeight = avatarSize; 
const barWidth = 50; 
const barX = (canvas.width - barWidth) / 2;
const barY = avatarY;
const barHeight = (sayı / 100) * barMaxHeight;
let color;
if (sayı < 25) {
color = '#ff0000';
} else if (sayı < 50) {
color = '#ff8000'; 
} else if (sayı < 75) {
color = '#ffff00'; 
} else {
color = '#00ff00'; 
}
ctx.fillStyle = '#ffffff';
ctx.fillRect(barX, barY, barWidth, barMaxHeight);
ctx.fillStyle = color;
ctx.fillRect(barX, barY + barMaxHeight - barHeight, barWidth, barHeight);
const borderWidth = 5; 
const borderRadius = 15;
ctx.lineWidth = borderWidth;
ctx.strokeStyle = '#000000';
ctx.beginPath();
ctx.moveTo(barX + borderRadius, barY);
ctx.lineTo(barX + barWidth - borderRadius, barY);
ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + borderRadius);
ctx.lineTo(barX + barWidth, barY + barMaxHeight - borderRadius);
ctx.quadraticCurveTo(barX + barWidth, barY + barMaxHeight, barX + barWidth - borderRadius, barY + barMaxHeight);
ctx.lineTo(barX + borderRadius, barY + barMaxHeight);
ctx.quadraticCurveTo(barX, barY + barMaxHeight, barX, barY + barMaxHeight - borderRadius);
ctx.lineTo(barX, barY + borderRadius);
ctx.quadraticCurveTo(barX, barY, barX + borderRadius, barY);
ctx.closePath();
ctx.stroke();
ctx.lineWidth = borderWidth;
ctx.strokeStyle = '#000000';
ctx.strokeRect(barX, barY, barWidth, barMaxHeight);
ctx.fillStyle = "#000000";
ctx.font = "bold 23px 'Arial'";
ctx.fillText(`${sayı}`, barX + barWidth / 2 - ctx.measureText(`${sayı}`).width / 2, barY + barMaxHeight / 2 + ctx.measureText(`${sayı}`).actualBoundingBoxAscent / 2);     
if(sayı > 55 && sayı > 75) {
let attachment = new Discord.AttachmentBuilder(await canvas.encode('png'), {name: "ship.jpg"})  
let msg = await message.channel.send({ content: `>>> **[ ${message.member.displayName} ] İle [ ${member.displayName} ] Arasındaki İlişki.**`, components: [row], files: [attachment] })
db.set(message.member.id, { love: member.id }) 
return;}
if(sayı > 55 && sayı < 75) {
let attachment = new Discord.AttachmentBuilder(await canvas.encode('png'), {name: "ship.jpg"})  
let msg = await message.channel.send({ content: `>>> **[ ${message.member.displayName} ] İle [ ${member.displayName} ] Arasındaki İlişki.**`, components: [row], files: [attachment] })
db.set(message.member.id, { love: member.id }) 
return;}
if(sayı > 0 && sayı < 55) {
let attachment = new Discord.AttachmentBuilder(await canvas.encode('png'), {name: "ship.jpg"})  
message.channel.send({ content: `>>> **[ ${message.member.displayName} ] İle [ ${member.displayName} ] Arasındaki İlişki.**`, components: [row2], files: [attachment] })
return; }      
}        
if(ayar.womanRoles.some(x => message.member.roles.cache.has(x))) {    
const canvas = Canvas.createCanvas(700, 250);
const ctx = canvas.getContext("2d")
const image = ["https://media.discordapp.net/attachments/1001038575871201280/1001849828420104242/wallhaven-wqve97.png", "https://media.discordapp.net/attachments/1074780644749627414/1095779201510019184/20230412_213252.jpg", "https://media.discordapp.net/attachments/1074780644749627414/1095779201270939789/20230412_213309.jpg", "https://media.discordapp.net/attachments/1074780644749627414/1095779201031868516/20230412_213409.jpg", "https://media.discordapp.net/attachments/1074780644749627414/1095779200834740254/20230412_213448.jpg"]
const index = Math.floor(Math.random() * (image.length));
const bg = await Canvas.loadImage(`${image[index]}`)
ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
ctx.font = "75px 'Candara'"
ctx.fillStyle = "#f0f0f0"
const avatarSize = 150; 
const avatarY = 50;
const messageAuthor = await Canvas.loadImage(message.member.displayAvatarURL({}) ? message.member.displayAvatarURL({ format: "png" }) : message.member.avatarURL({ format: "png" }))
ctx.drawImage(messageAuthor, 50, 50, avatarSize, avatarSize)
ctx.font = "20px 'Arial'";
ctx.fillStyle = "#ffffff";
const authorNameWidth = ctx.measureText(message.member.displayName).width;
ctx.fillText(message.member.displayName, 50 + avatarSize / 2 - authorNameWidth / 2, 40);
const member = message.mentions.members.first() || message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.cache.has(ayar.manRoles[0])).random() 
if(!member) return;
const targetMention = await Canvas.loadImage(member.displayAvatarURL({}) ? member.displayAvatarURL({ format: "png" }) : member.avatarURL({ format: "png" }))
ctx.drawImage(targetMention, 500, 50, avatarSize, avatarSize)
const memberNameWidth = ctx.measureText(member.displayName).width;
ctx.fillText(member.displayName, 500 + avatarSize / 2 - memberNameWidth / 2, 40);
const barMaxHeight = avatarSize; 
const barWidth = 50; 
const barX = (canvas.width - barWidth) / 2;
const barY = avatarY;
const barHeight = (sayı / 100) * barMaxHeight;
ctx.fillStyle = '#ffffff';
ctx.fillRect(barX, barY, barWidth, barMaxHeight);
ctx.fillStyle = '#ff0000';
ctx.fillRect(barX, barY + barMaxHeight - barHeight, barWidth, barHeight);
const borderWidth = 5; 
const borderRadius = 15;
ctx.lineWidth = borderWidth;
ctx.strokeStyle = '#000000';
ctx.beginPath();
ctx.moveTo(barX + borderRadius, barY);
ctx.lineTo(barX + barWidth - borderRadius, barY);
ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + borderRadius);
ctx.lineTo(barX + barWidth, barY + barMaxHeight - borderRadius);
ctx.quadraticCurveTo(barX + barWidth, barY + barMaxHeight, barX + barWidth - borderRadius, barY + barMaxHeight);
ctx.lineTo(barX + borderRadius, barY + barMaxHeight);
ctx.quadraticCurveTo(barX, barY + barMaxHeight, barX, barY + barMaxHeight - borderRadius);
ctx.lineTo(barX, barY + borderRadius);
ctx.quadraticCurveTo(barX, barY, barX + borderRadius, barY);
ctx.closePath();
ctx.stroke();
ctx.fillStyle = "#000000";
ctx.font = "bold 20px 'Arial'";
ctx.fillText(`%${sayı}`, barX + barWidth / 2 - ctx.measureText(`%${sayı}`).width / 2, barY + barHeight / 2 + 10);    
if(sayı > 55 && sayı > 75) {
let attachment = new Discord.AttachmentBuilder(await canvas.encode('png'), {name: "ship.jpg"})  
let msg = await message.channel.send({ content: `>>> **[ ${message.member.displayName} ] İle [ ${member.displayName} ] Arasındaki İlişki.**`, components: [row], files: [attachment] })
db.set(message.member.id, { love: member.id }) 
return;}
if(sayı > 55 && sayı < 75) {
let attachment = new Discord.AttachmentBuilder(await canvas.encode('png'), {name: "ship.jpg"})  
let msg = await message.channel.send({ content: `>>> **[ ${message.member.displayName} ] İle [ ${member.displayName} ] Arasındaki İlişki.**`, components: [row], files: [attachment] })
db.set(message.member.id, { love: member.id }) 
return;}
if(sayı > 0 && sayı < 55) {
let attachment = new Discord.AttachmentBuilder(await canvas.encode('png'), {name: "ship.jpg"})  
message.channel.send({ content: `>>> **[ ${message.member.displayName} ] İle [ ${member.displayName} ] Arasındaki İlişki.**`, components: [row2], files: [attachment] })
return; }     
}
}     
};


client.on(Discord.Events.InteractionCreate, async (interaction) => {
if(interaction.isButton()) {      
const member = await client.guilds.cache.get(settings.guildID).members.fetch(interaction.member.id)
if (!member) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;
if(interaction.customId === "tanis") {
await interaction.deferUpdate();
let data = db.get(member.id)
if(!data) interaction.followUp({content: `${member} Tanışabilceğin kişi bulunamadı.`, ephemeral: true })
if(data) {
if(data.love == null) {
interaction.followUp({content: `${member} Daha önce bu kişiyle Tanışmışsın.`, ephemeral: true})
return }
interaction.followUp({content: `<@${data.love}>`, ephemeral: true})  
db.set(member.id, { love: null })
}
 }
  }
})  