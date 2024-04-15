const moment = require("moment");
require("moment-duration-format");
const ms = require("ms")
const tasks = require("../../schemas/tasks.js");
const settings = require("../../configs/settings.json");
const Discord = require("discord.js");
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
let zaman = new Map();
module.exports = {
conf: {
aliases: ["gorev", "görev-al", "gorev-al"],
name: "görev",
help: "görev-al",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
if(settings.coinSystem === false) return message.reply({embeds: [embed.setDescription(`Terfi Sistemi Aktif Değil!`)]}).sil(15)
if(!client.ranks.some((x) => message.member.roles.cache.has(x.role))) return;  
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;
  
const rows = new Discord.StringSelectMenuBuilder()
.setCustomId(`görevs`)
.setPlaceholder(`${message.guild.name} Görev Seçeneği.`)
.setMinValues(0)
.setMaxValues(1)
.addOptions(
{
label: `Mesaj Görevi`,
value: `chat`,
description: `${ayars.chatChannel ? `${message.guild.channels.cache.get(ayars.chatChannel).name} Kanalında Mesaj Yazma Görevi.` : 'Bulunamadı.'}`,
emoji: `💭`
}, 
{
label: `Ses Görevi`,
value: `voice`,
description: 'Sunucu Sesli Kanallarında Bulunma / Vakit Geçirme Görevi.',
emoji: `🔉`
},
{
label: `Davet Görev`,
value: `inv`,
description: 'Sunucumuza Yeni Üyeler Davet(Invite) Etme Görevi.',
emoji: `📩`
},
{
label: `Taglı Görevi`,
value: `tags`,
description: 'Üyelere / Kullanıcılara Tag Aldırma Görevi.',
emoji: `👤`
},
{
label: `Kayıt Görevi`,
value: `reg`,
description: 'Sunucumuza Yeni Gelen Üyeleri Karşılama / Kayıt Etme Görevi.',
emoji: `📍`
},
{
label: `Yetkili Görevi`,
value: `yt`,
description: 'Üyelere / Kullanıcılara Yetki Aldırma Görevi.',
emoji: `🎈`
},
{
label: `Yayın Görevi`,
value: `yayins`,
description: 'Streamer Kanallarında Yayın Açma Görevi.',
emoji: `🖥`
},
{
label: `Kamera Görevi`,
value: `cameras`,
description: "Kamera Kanallarında Kamera Açma Görevi.",
emoji: `📷`
},
{
label: `İptal`,
value: `iptal`,
emoji: `${message.guild.emojiGöster(emojis.no).id}`
})
const row = new Discord.ActionRowBuilder()
.addComponents(rows) 
const taskk = await tasks.find({ guildID: settings.guildID, userID: message.author.id });
if (zaman.get(message.author.id) == 1) return message.reply({ content: `<@${message.author.id}> Bu komutu 8 saatte 1 kezden fazla kullanamazsınız.` }).sil(15);
if(taskk.filter((x) => x.active).length >= 2) return message.reply({embeds:[embed.setDescription(`En Fazla Günde 2 Görevin Bulunabilir!`)]}).sil(15);
let mesaj = await message.reply({ components: [row], embeds: [embed.setDescription(`
${message.guild.emojiGöster(emojis.link)} ${message.member} Görev Seçme Paneline Hoşgeldin;

:tada: _Seçtiğiniz Tipe Göre Rastgele Adetli Görev Verilecek!_

${message.guild.emojiGöster(emojis.nokta)} \` 💭 Mesaj Görevi \` 
${message.guild.emojiGöster(emojis.nokta)} \` 🔉 Ses Görevi \` 
${message.guild.emojiGöster(emojis.nokta)} \` 📩 Davet Görevi\` 
${message.guild.emojiGöster(emojis.nokta)} \` 👤 Taglı Görevi \` 
${message.guild.emojiGöster(emojis.nokta)} \` 📍 Kayıt Görevi \`
${message.guild.emojiGöster(emojis.nokta)} \` 🎈 Yetkili Görevi \` 
${message.guild.emojiGöster(emojis.nokta)} \` 🖥 Yayın Görevi \` 
${message.guild.emojiGöster(emojis.nokta)} \` 📷 Kamera Görevi \`

${message.guild.emojiGöster(emojis.warn)} __Aşağıdaki Menüden Kendinize Ait Bir Görev Seçebilirsiniz Seçerken Görev Açıklamasına Bakınız.__

${message.guild.emojiGöster(emojis.warn)} __Görev Seçtikten Sonra Tamamladığınız Takdirde Daha Hızlı Yetki Atlarsınız.__

${message.guild.emojiGöster(emojis.warn)} __Görev Durumunu/Süresini/Puan Katkısını__ \` .ystat \` __Komutu İle Öğrenebilirsiniz.__
`).setThumbnail(message.author.displayAvatarURL({ dynamic: true }))] })
const filter = (xd) => xd.user.id == message.author.id;
const collector = mesaj.createMessageComponentCollector({filter})
collector.on("collect", async (interaction) => {
if (interaction.customId === "görevs") {
const value = interaction.values[0];
function getRandomInt(min, max) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
}
let mesajRandom = getRandomInt(300, 400)
let davetRandom = getRandomInt(5, 10)
let sesRandom = getRandomInt(60, 300)
let yayinRandom = getRandomInt(60, 300)
let cameraRandom = getRandomInt(60, 300)              
let taglıRandom = getRandomInt(1, 5)
let yetkiliRandom = getRandomInt(1, 3)
let teyitRandom = getRandomInt(5, 20)
let puanRandom = getRandomInt(1, 130)
let count = value == "chat" ? mesajRandom : value == "yayins" ? yayinRandom : value == "cameras" ? cameraRandom : value == "inv" ? davetRandom : value == "voice" ? sesRandom : value == "tags" ? taglıRandom : value == "yt" ? yetkiliRandom : value == "reg" ? teyitRandom : 0           
let taskMessage;
switch (value) {
case "inv":
taskMessage = `**Sunucumuza ${count} kişi davet et!**`;
break;
case "chat":
taskMessage = ayars.chatChannel
? `**${ayars.chatChannel ? `<#${ayars.chatChannel}>` : 'Bulunamadı.'} ${count} mesaj at!**`
: `**Metin kanallarında ${count} mesaj at!**`;
break;
case "voice":
taskMessage = ayars.publicParents
? `**Public Kanallarında ${moment.duration(count).format("H [saat], m [dk], s [sn]")} vakit geçir!`
: `**Seste ${moment.duration(count).format("H [saat], m [dk], s [sn]")} vakit geçir!**`;
break;
case "yayins":
taskMessage = ayars.publicParents
? `**Yayın Kanallarında ${moment.duration(count).format("H [saat], m [dk], s [sn]")} yayın aç!`
: `**Seste ${moment.duration(count).format("H [saat], m [dk], s [sn]")} yayın aç!**`;
break;
case "cameras":
taskMessage = ayars.publicParents
? `**Kamera Kanallarında ${moment.duration(count).format("H [saat], m [dk], s [sn]")} kamera aç!`
: `**Seste ${moment.duration(count).format("H [saat], m [dk], s [sn]")} kamera aç!**`;
break;
case "tags":
taskMessage = `**${count} kişiye tag aldır!**`;
break;
case "yt":
taskMessage = `**${count} kişiye yetki aldır!**`;
break;  
case "reg":
taskMessage = `**Sunucumuzda ${count} kişi kayıt et!**`;
break;
}
if (value == "chat") {
await interaction.deferUpdate();
collector.stop();
const id = await tasks.find({ guildID: settings.guildID });
await new tasks({ guildID: settings.guildID, userID: interaction.member.id, id: id ? id.length + 1 : 1, type: "mesaj", count: count, prizeCount: puanRandom, active: true, finishDate: moment().add(6, 'hours'), date: Date.now(), channels: ayars.chatChannel, message: `${ayars.chatChannel ? `<#${ayars.chatChannel}>` : 'Bulunamadı.'} kanalında ${count} mesaj at!` }).save();
await interaction.deferReply({ ephemeral: true }).catch(e => {}), mesaj.edit({ components: [], embeds: [embed.setDescription(`**${interaction.member} bugün ${ayars.chatChannel ? `<#${ayars.chatChannel}>` : 'Bulunamadı.'} kanalında \`${count}\` mesaj atma görevi aldın!**`)], ephemeral: true })
}
if (value == "voice") {
await interaction.deferUpdate();
collector.stop(); 
count = 1000 * 60 * count;  
const id = await tasks.find({ guildID: settings.guildID, userID: interaction.member.id});         
await new tasks({ guildID: settings.guildID, userID: interaction.member.id, id: id ? id.length + 1 : 1, type: "ses", count: count, prizeCount: puanRandom, active: true, finishDate: moment().add(6, 'hours'), date: Date.now(), channels: null, message: `Ses kanallarında ${moment.duration(count).format("H [saat], m [dk], s [sn]")} vakit geçir!` }).save();    
await interaction.deferReply({ ephemeral: true }).catch(e => {}), mesaj.edit({ components: [], embeds: [embed.setDescription(`**${interaction.member} bugün ses kanallarında \`${moment.duration(count).format("H [saat], m [dk], s [sn]")}\` ses aktifliği görevi aldın!**`)], ephemeral: true })
zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
setTimeout(() => {
zaman.delete(message.author.id)
}, 8 * 60 * 60 * 1000)
}
if (value == "inv") {
await interaction.deferUpdate();
collector.stop(); 
const id = await tasks.find({ guildID: settings.guildID });
await new tasks({ guildID: settings.guildID, userID: interaction.member.id, id: id ? id.length + 1 : 1, type: "invite", count: count, prizeCount: puanRandom, active: true, finishDate: moment().add(6, 'hours'), date: Date.now(), channels: null, message: `${count} adet invite yap!` }).save();
await interaction.deferReply({ ephemeral: true }).catch(e => {}), mesaj.edit({ components: [], embeds: [embed.setDescription(`**${interaction.member} bugün \`${count}\` adet davet görevi aldın!**`)], ephemeral: true })
zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
setTimeout(() => {
zaman.delete(message.author.id)
}, 8 * 60 * 60 * 1000)
}
if (value == "tags") {
await interaction.deferUpdate();
if(ayars.tagSystem == false) return;
collector.stop();
const id = await tasks.find({ guildID: settings.guildID });
await new tasks({ guildID: settings.guildID, userID: interaction.member.id, id: id ? id.length + 1 : 1, type: "tagli", count: count, prizeCount: puanRandom, active: true, finishDate: moment().add(6, 'hours'), date: Date.now(), channels: null, message: `${count} adet taglı üye çek!` }).save();  
await interaction.deferReply({ ephemeral: true }).catch(e => {}), mesaj.edit({ components: [], embeds: [embed.setDescription(`**${interaction.member} bugün \`${count}\` adet taglı üye çekme görevi aldın!**`)], ephemeral: true })
zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
setTimeout(() => {
zaman.delete(message.author.id)
}, 8 * 60 * 60 * 1000)
}
if (value == "reg") {
await interaction.deferUpdate();
collector.stop();
const id = await tasks.find({ guildID: settings.guildID });
await new tasks({ guildID: settings.guildID, userID: interaction.member.id, id: id ? id.length + 1 : 1, type: "kayıt", count: count, prizeCount: puanRandom, active: true, finishDate: moment().add(6, 'hours'), date: Date.now(), channels: null, message: `${count} adet kayıt yap!` }).save();
await interaction.deferReply({ ephemeral: true }).catch(e => {}), mesaj.edit({ components: [], embeds: [embed.setDescription(`**${interaction.member} bugün \`${count}\` adet kayıt yapma görevi aldın!**`)], ephemeral: true })
zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
setTimeout(() => {
zaman.delete(message.author.id)
}, 8 * 60 * 60 * 1000)
}         
if (value == "yt") {
await interaction.deferUpdate();
collector.stop(); 
const id = await tasks.find({ guildID: settings.guildID });
await new tasks({ guildID: settings.guildID, userID: interaction.member.id, id: id ? id.length + 1 : 1, type: "yetkili", count: count, prizeCount: puanRandom, active: true, finishDate: moment().add(6, 'hours'), date: Date.now(), channels: null, message: `${count} adet yetkili üye çek!` }).save();  
await interaction.deferReply({ ephemeral: true }).catch(e => {}), mesaj.edit({ components: [], embeds: [embed.setDescription(`**${interaction.member} bugün \`${count}\` adet yetkili üye çekme görevi aldın!**`)], ephemeral: true })
zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
setTimeout(() => {
zaman.delete(message.author.id)
}, 8 * 60 * 60 * 1000)
}
if (value == "yayins") {
await interaction.deferUpdate();
collector.stop();
count = 1000 * 60 * count;  
const id = await tasks.find({ guildID: settings.guildID, userID: interaction.member.id});         
await new tasks({ guildID: settings.guildID, userID: interaction.member.id, id: id ? id.length + 1 : 1, type: "yayin", count: count, prizeCount: puanRandom, active: true, finishDate: moment().add(6, 'hours'), date: Date.now(), channels: null, message: `Ses kanallarında ${moment.duration(count).format("H [saat], m [dk], s [sn]")} yayın aç!` }).save();    
await interaction.deferReply({ ephemeral: true }).catch(e => {}), mesaj.edit({ components: [], embeds: [embed.setDescription(`**${interaction.member} bugün ses kanallarında \`${moment.duration(count).format("H [saat], m [dk], s [sn]")}\` yayın açma görevi aldın!**`)], ephemeral: true })
zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
setTimeout(() => {
zaman.delete(message.author.id)
}, 8 * 60 * 60 * 1000)
}
if (value == "cameras") {
await interaction.deferUpdate();
collector.stop();  
count = 1000 * 60 * count;  
const id = await tasks.find({ guildID: settings.guildID, userID: interaction.member.id});         
await new tasks({ guildID: settings.guildID, userID: interaction.member.id, id: id ? id.length + 1 : 1, type: "camera", count: count, prizeCount: puanRandom, active: true, finishDate: moment().add(6, 'hours'), date: Date.now(), channels: null, message: `Ses kanallarında ${moment.duration(count).format("H [saat], m [dk], s [sn]")} kamera aç!` }).save();    
await interaction.deferReply({ ephemeral: true }).catch(e => {}), mesaj.edit({ components: [], embeds: [embed.setDescription(`**${interaction.member} bugün ses kanallarında \`${moment.duration(count).format("H [saat], m [dk], s [sn]")}\` kamera açma görevi aldın!**`)], ephemeral: true })        
zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
setTimeout(() => {
zaman.delete(message.author.id)
}, 8 * 60 * 60 * 1000)
}
}
})
}
}