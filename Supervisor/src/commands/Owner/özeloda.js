const Discord = require("discord.js");
const settings = require("../../configs/settings.json");
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const Guild = require("../../schemas/pGuild");
module.exports = {
conf: {
aliases: ["ozeloda","privateroom"],
name: "özeloda",
help: "özeloda kur/sıfırla",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;    
let data = await Guild.findOne({ guildId: settings.guildID });
if (!data) {
await Guild.create({ guildId: settings.guildID });
}
if(!args[0]) return message.reply({content: `Doğru şekilde komutu kullanınız!\n${settings.prefix}ozeloda sifirla/kur`}).sil(15)
if(["sifirla", "sıfırla"].some(x => x == args[0])) {
let newdata = await Guild.findOne({ guildId: settings.guildID });
if (newdata?.private_voices?.categoryId && newdata?.private_voices?.channelId != null) {
let data = await Guild.findOne({ guildId: settings.guildID })
await message.reply({embeds: [embed.setDescription(`${message.author} *Özel Oda Bulunduğu İçin Silindi.*`)]})  
let channelId = await message.guild.channels.cache.get(data?.private_voices?.channelId)
let textId = await message.guild.channels.cache.get(data?.private_voices?.textId)
let categoryId = await message.guild.channels.cache.get(data?.private_voices?.categoryId)
if(channelId) await channelId?.delete().catch(() => {})
if(textId) await textId?.delete().catch(() => {})
if(categoryId) await categoryId?.delete().catch(() => {})
return await Guild.updateOne({ guildId: settings.guildID }, {$set: {'private_voices': {}}})       
} 
} else if(["setup", "kur"].some(x => x == args[0])) {      
let newdata = await Guild.findOne({ guildId: settings.guildID });
if (newdata?.private_voices?.categoryId && newdata?.private_voices?.channelId != null) return;
let categoryId = await message.guild.channels.create({
name: `${settings.guildName} Özel Oda Sistemi`,
type: Discord.ChannelType.GuildCategory,
})
let channelId = await message.guild.channels.create({
name: `Özel Oda Oluştur`,
type: Discord.ChannelType.GuildVoice,
parent: categoryId,
userLimit: 1,
permissionOverwrites: [
{
id: settings.guildID,
allow: [Discord.PermissionsBitField.Flags.Connect],
deny: [Discord.PermissionsBitField.Flags.Speak]
}, {
id: ayar.unregRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}, {
id: ayar.jailRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}, {
id: ayar.reklamRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}, {
id: ayar.fakeAccRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}, {
id: ayar.bannedTagRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}                   
]
})
let textId = await message.guild.channels.create({
name: `özel-oda-panel`,
parent: categoryId,
topic: `Özel Oda Ayarları`,
permissionOverwrites: [
{
id: settings.guildID,
deny: [Discord.PermissionsBitField.Flags.SendMessages]
}, {
id: ayar.unregRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages]
}, {
id: ayar.jailRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}, {
id: ayar.reklamRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}, {
id: ayar.fakeAccRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}, {
id: ayar.bannedTagRoles[0],
deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.Connect]
}              
]
})
let rename = new Discord.ButtonBuilder().setCustomId('rename').setLabel("İsim Değiştir").setEmoji('📝').setStyle(Discord.ButtonStyle.Primary);
let ekleme = new Discord.ButtonBuilder().setCustomId('ekleme').setLabel("Kullanıcı Ekle").setEmoji('1049789118655234128').setStyle(Discord.ButtonStyle.Success)
let cikarma = new Discord.ButtonBuilder().setCustomId('cikarma').setLabel("Kullanıcı Kaldır").setEmoji('1062063761416011796').setStyle(Discord.ButtonStyle.Danger)
let limit = new Discord.ButtonBuilder().setCustomId('limit').setLabel("Oda Limiti").setEmoji('1058336359883997224').setStyle(Discord.ButtonStyle.Primary)
let kick = new Discord.ButtonBuilder().setCustomId('kick').setLabel("Sesten At").setEmoji('1049788943194923058').setStyle(Discord.ButtonStyle.Danger)
let Buttons = new Discord.ActionRowBuilder().addComponents([ekleme, cikarma, kick, rename, limit])
let Embed = new Discord.EmbedBuilder().setAuthor({ name: `${message.guild.name} Özel Oda Panel`, iconURL: message.guild.iconURL() })
            .setDescription(`
\`\`\`cs
# Özel Oda Sistemi Bilgilendirmesi.
\`\`\`
${message.guild.emojiGöster(emojis.hos)} Sunucuda bulunan özel oda sistemi buradaki butonlar yardımı ile ayarlanabilir , kontrol edilebilir ve size özel bir hale gelmiş olur. Aşağıda butonlar hakkında bilgi verilmiştir.

${message.guild.emojiGöster(emojis.star)} **Kullanıcı Ekle:** Girdiğiniz ID 'ye sahip kişi odanıza giriş yapabilir.   
${message.guild.emojiGöster(emojis.star)} **Kullanıcı Kaldır:** Girdiğiniz ID 'ye sahip kişinin odaya girme izni kaldırılır.                 
${message.guild.emojiGöster(emojis.star)} **Sesten At:** Odanızdaki kişiyi sesten atar.
${message.guild.emojiGöster(emojis.star)} **İsim Değiştir:** Odanızın İsmi Değişir.               
${message.guild.emojiGöster(emojis.star)} **Oda Limiti:** Odanızın kullanıcı limitini belirlersiniz.              
                
${message.guild.emojiGöster(emojis.link)} **__NOT__**: Eğer odanız herkese kitli durumdaysa ve bir yetkili sizden izinsiz odanıza girerse bunu sunucu yönetimine bildiriniz.                `)
.setThumbnail(message.guild.iconURL({ dynamic:true, size: 2048}))
textId.send({ embeds: [Embed], components: [Buttons] })
await Guild.updateOne({ guildId: settings.guildID }, { $set: { 'private_voices.mode': true, 'private_voices.categoryId': categoryId, 'private_voices.channelId': channelId, 'private_voices.textId': textId}})
await message.reply({ content: `Kanallar başarıyla oluşturuldu.` })
}
}
}
