const { PermissionFlagsBits, Events, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const settings = require('../../../Supervisor/src/configs/settings.json')
const emojis = require('../../../Supervisor/src/configs/emojiName.json')
const safe = require("../../schemas/safe")
module.exports = {
name: "panels",
aliases: ["panels"],

execute: async (client, message, args, embed) => {      
if(!settings.owners.some(Rainha => message.author.id == Rainha)) return;
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("allBackup")
                .setLabel("Tümünü Yedekle")
                .setEmoji(`1122566922647650414`)
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("channelBackup")
                    .setLabel("Kanalları Yedekle")
                    .setEmoji(`1122566921125118022`)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("roleBackup")
                    .setLabel("Rolleri Yedekle")
                    .setEmoji(`1122566919753576498`)
                    .setStyle(ButtonStyle.Secondary),
            );

        const buttons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("ytLock")
                .setLabel("Yönetici Rolleri Kapat")
                .setEmoji(`1122566923838820493`)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("ytUnlock")
                .setLabel("Yönetici Rolleri Aç")
                .setEmoji(`1122566923838820493`)
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("restart")
                    .setLabel(`Botları Yeniden Başlat`)
                    .setEmoji(`1122567825043755069`)
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("exit")
                    .setLabel("Backup İşlemi İptal")
                    .setEmoji(`1121810741226381332`)
                    .setStyle(ButtonStyle.Secondary),
            )
var msj = await message.reply({ embeds: [embed  
.setAuthor({ name: 'Sunucu Backup & Koruma Paneli'})
.setDescription(`
${message.guild.emojiGöster(emojis.yes)} Sunucu ile ilgili işlem(leri) aşağıdaki panel ile seçiniz unutmayınız ki yaptığınız işlemler **geri alınamaz** ve **kurtarılamaz!**

${message.guild.emojiGöster(emojis.star)} \`Tümünü Yedekle:\` Tüm **Kanal & Rol & Katagori & Emoji** verilerini databaseye işler veri kurulum işleminde buradan veriyi çeker.

${message.guild.emojiGöster(emojis.star)} \`Kanalları Yedekle:\` Tüm **Kanal & Katagorileri** yedeklemeye başlar.

${message.guild.emojiGöster(emojis.star)} \`Rolleri Yedekle:\` Tüm **Rol & Üye** verilerini yedeklemeye başlar.

${message.guild.emojiGöster(emojis.star)} \`Yönetici Rolleri Kapat:\` Sunucudaki **Tüm Yönetici** rollerini kapatır.
           
${message.guild.emojiGöster(emojis.star)} \`Yönetici Rolleri Aç:\` Sunucuda kapatılan **Yönetici Rolleri** tekrar açar.

${message.guild.emojiGöster(emojis.star)} \`Botları Yeniden Başlat:\` Guard & Backup botlarını **yeniden başlatır!**
`)
.setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})
.setThumbnail(message.guild.iconURL({dynamic:true}))], components: [buttons, buttons2] })
var filter = (menu) => menu.user.id === message.author.id;
const collector = msj.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (interaction) => {
if(interaction.customId === "channelBackup") {
interaction.reply({ content: `> ${message.guild.emojiGöster(emojis.yes)} **Kanalların Yedekleri Alınıyor!**`, ephemeral: true }).then(x => {
client.channelBackUp(interaction.guild, settings.guildID)})
}
if(interaction.customId === "roleBackup") {
interaction.reply({ content: `> ${message.guild.emojiGöster(emojis.yes)} **Rollerin Yedekleri Alınıyor!**`, ephemeral: true }).then(x => {
client.roleBackUp(interaction.guild, settings.guildID)})
}
if(interaction.customId === "ytLock") {
let veri = await safe.findOne({
guildID: settings.guildID}) || {"Permissions": []};
const izinler = [PermissionFlagsBits.Administrator]
const data = [];
message.guild.roles.cache.filter(rol => izinler.some(rol2 => rol.permissions.has(rol2)) && rol.managed == false).forEach(role => {
data.push({ id: role.id })
})
await safe.updateOne({ guildID: settings.guildID }, { $set: { Permissions: data } }, { upsert: true });
if (veri.Permissions.length > 0) {
const yetkiPermleri = [PermissionFlagsBits.Administrator]
message.guild.roles.cache.filter(rol => rol.editable).filter(rol => yetkiPermleri.some(yetki => rol.managed == false && rol.permissions.has(yetki))).forEach(async (rol) => rol.setPermissions(PermissionFlagsBits.Administrator).catch(e => {}))
}  
interaction.reply({content: `> ${message.guild.emojiGöster(emojis.yes)} Başarılı! ${data.map(x => `<@&${x.id}>`).join("\n")} **Rol(lerin) İzinleri Sıfırlandı!**`, ephemeral: true})
} 
if(interaction.customId === "ytUnlock") {
let veri = await safe.findOne({
guildID: settings.guildID}) || {"Permissions": []};
if(veri.Permissions.length > 0) { 
for (let i = 0; i < veri.Permissions.length; i++) {
const elm = veri.Permissions[i];
message.guild.roles.cache.get(elm.id).setPermissions(8n).catch(e => {})
}
} 
interaction.reply({content: `> ${message.guild.emojiGöster(emojis.yes)} Başarılı! **Yetkileri Geri Açtınız!**`, ephemeral: true})
}  
if(interaction.customId === "allBackup") {
interaction.reply({ content: `> ${message.guild.emojiGöster(emojis.yes)} **Rol Ve Kanalların Yedekleri Alınıyor!**`, ephemeral: true }).then(x => {
client.channelBackUp(interaction.guild, settings.guildID)
client.roleBackUp(interaction.guild, settings.guildID)})
}

if(interaction.customId === "restart") {
interaction.reply({content: `> ${message.guild.emojiGöster(emojis.yes)} Başarılı! Bot(lar) **Yeniden Başlatılıyor!**`, ephemeral: true}).then(x => {
process.exit(0)
})
}

if(interaction.customId === "exit") {
interaction.reply({ content: `> **Panel Silindi!**`, ephemeral: true }).then(x => {
interaction.message.delete().catch(e => {})})  
}
})
}
}