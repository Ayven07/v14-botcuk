const setups = require("../schemas/setup")
const settings = require("../configs/settings.json")
const Discord = require('discord.js')
const Guild = require("../schemas/pGuild");
const User = require("../schemas/pUser")
let zaman = new Map();
let bzaman = new Map();
const ms = require('ms')
const penals = require("../schemas/penals");
const emojis = require('../configs/emojiName.json')
const messageUser = require("../schemas/messageUser");
const db = require("../schemas/vrcRoleCommands");
const voiceUser = require("../schemas/voiceUser");
const voiceUserParent = require("../schemas/voiceUserParent");
const nameData = require("../schemas/names")
const setup = require("../schemas/memberSetup")
const moment = require("moment");
const Users = require("../schemas/users.js");
const coin = require("../schemas/coin");
const client = global.client;
const inviterSchema = require("../schemas/inviter");
const Menu = require('../schemas/menus')
moment.locale("tr");
module.exports = async (interaction) => {
if(!interaction.guild) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return; 
const member = await interaction.guild.members.fetch(interaction.member.user.id)
if (!member) return;
if (interaction.customId === "renk") {
let color = new Map([
["siyah", ayar.blackRoles],
["mavi", ayar.blueRoles],
["beyaz", ayar.whiteRoles],
["kirmizi", ayar.redRoles],
["sari", ayar.yellowRoles], 
["pembe", ayar.pinkRoles],
["mor", ayar.purpleRoles],
["turuncu", ayar.orangeRoles],
["yesil", ayar.greenRoles],
["kahverengi", ayar.brownRoles],
["bordo", ayar.burgundyRoles],
["turkuaz", ayar.turquoiseRoles],
["bej", ayar.beigeRoles],
["lacivert", ayar.navyblueRoles],
["mavitwo", ayar.lightblueRoles],
["yesiltwo", ayar.pistachiogreenRoles],          
])
let role = color.get(interaction.values[0])
let renkroller = [ayar.blackRoles, ayar.blueRoles, ayar.whiteRoles, ayar.redRoles, ayar.yellowRoles, ayar.pinkRoles, ayar.purpleRoles, ayar.orangeRoles, ayar.greenRoles, ayar.brownRoles, ayar.burgundyRoles, ayar.turquoiseRoles, ayar.beigeRoles, ayar.navyblueRoles, ayar.lightblueRoles, ayar.pistachiogreenRoles]
if (!member.roles.cache.has(ayar.tagRoles) && !member.roles.cache.has(ayar.boosterRoles) && !member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "Rollerin güncellenirken bir sorun meydana geldi **(İsminde Sunucu Tag'ı Yoktur veya Boost basmamışsın)**" , ephemeral: true })
if (interaction.values[0] === "rolsil") {
await member.roles.remove(renkroller)
} else {
if (!interaction.values.length) {
await member.roles.remove(renkroller).catch(err => {})
} else if (interaction.values.length > 1) {
await member.roles.add(role).catch(err => {})
} else {
await member.roles.remove(renkroller).catch(err => {})
await member.roles.add(role).catch(err => {})
}
}
interaction.reply({ content: "Rolleriniz düzenlendi.", ephemeral: true }).catch(e => {})
} 
if (interaction.customId === "takim") {
let takimMap = new Map([
["fb", ayar.fbRoles],
["gs", ayar.gsRoles],
["bjk", ayar.bjkRoles],
["ts", ayar.tsRoles],
])
let roles = [ayar.fbRoles, ayar.gsRoles, ayar.bjkRoles, ayar.tsRoles]
const role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = takimMap.get(ids)
role.push(den)
}
if (interaction.values[0] === "rolsil") {
await member.roles.remove(roles)
} else {
if (!interaction.values.length) {
await member.roles.remove(roles).catch(err => {})
} else if (interaction.values.length > 1) {
await member.roles.add(roles).catch(err => {})
} else {
await member.roles.remove(roles).catch(err => {})
await member.roles.add(role).catch(err => {})
}
}
interaction.reply({ content: "Rolleriniz düzenlendi.", ephemeral: true }).catch(e => {})
} 
if (interaction.customId === "etkinliks") {
let eventsMap = new Map([
["etkinlik", ayar.etkinlikRoles],
["cekilis", ayar.cekilisRoles],
])
let roles = [ayar.etkinlikRoles, ayar.cekilisRoles]
const role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = eventsMap.get(ids)
role.push(den);
}
if (interaction.values[0] === "rolsil") {
await member.roles.remove(roles)
} else {
if (!interaction.values.length) {
await member.roles.remove(roles).catch(err => {})
} else if (interaction.values.length > 1) {
await member.roles.add(roles).catch(err => {})
} else {
await member.roles.remove(roles).catch(err => {})
await member.roles.add(role).catch(err => {})
}
}
interaction.reply({ content: "Rolleriniz düzenlendi.", ephemeral: true }).catch(e => {})
}
if (interaction.customId === "burc") {
let burçMap = new Map([
["koç", ayar.kocRoles],
["boğa", ayar.bogaRoles],
["ikizler", ayar.ikizlerRoles],
["yengeç", ayar.yengecRoles],
["aslan", ayar.aslanRoles],
["başak", ayar.basakRoles],
["terazi", ayar.teraziRoles],
["akrep", ayar.akrepRoles],
["yay", ayar.yayRoles],
["oğlak", ayar.oglakRoles],
["kova", ayar.kovaRoles],
["balık", ayar.balikRoles],
])
let roles = [ayar.akrepRoles, ayar.yengecRoles, ayar.ikizlerRoles, ayar.yayRoles, ayar.aslanRoles, ayar.teraziRoles, ayar.basakRoles, ayar.kovaRoles, ayar.balikRoles, ayar.oglakRoles, ayar.bogaRoles, ayar.kocRoles]
const role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = burçMap.get(ids)
role.push(den)
}
if (interaction.values[0] === "rolsil") {
await member.roles.remove(roles)
} else {
if (!interaction.values.length) {
await member.roles.remove(roles).catch(err => {})
} else if (interaction.values.length > 1) {
await member.roles.add(roles).catch(err => {})
} else {
await member.roles.remove(roles).catch(err => {})
await member.roles.add(role).catch(err => {})
}
}
interaction.reply({ content: "Rolleriniz düzenlendi.", ephemeral: true }).catch(e => {})
} 
if (interaction.customId === "iliski") {
let LoveMap = new Map([
["couple", ayar.coupleRoles],
["alone", ayar.aloneRoles],
["sy", ayar.syRoles],
])
let roles = [ayar.coupleRoles, ayar.aloneRoles, ayar.syRoles]
const role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = LoveMap.get(ids)
role.push(den)
}
if (interaction.values[0] === "rolsil") {
await member.roles.remove(roles)
} else {
if (!interaction.values.length) {
await member.roles.remove(roles).catch(err => {})
} else if (interaction.values.length > 1) {
await member.roles.add(roles).catch(err => {})
} else {
await member.roles.remove(roles).catch(err => {})
await member.roles.add(role).catch(err => {})
}
}
interaction.reply({ content: "Rolleriniz düzenlendi.", ephemeral: true }).catch(e => {})
} 
if (interaction.customId === "games") {
let GameMap = new Map([
["csgo", ayar.csRoles],
["lol", ayar.lolRoles],
["valorant", ayar.valorantRoles],
["gta5", ayar.gtavRoles],
["pubg", ayar.pubgRoles],
["fortnite", ayar.fortniteRoles],
["minecraft", ayar.minecraftRoles],
["mobilelegends", ayar.mlbbRoles],
["amongus", ayar.amongusRoles],
])
let roles = [ayar.amongusRoles, ayar.pubgRoles, ayar.csRoles, ayar.fortniteRoles, ayar.gtavRoles, ayar.valorantRoles, ayar.lolRoles, ayar.mlbbRoles, ayar.minecraftRoles]
const role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = GameMap.get(ids)
role.push(den)
}
if (interaction.values[0] === "rolsil") {
await member.roles.remove(roles)
} else {
if (!interaction.values.length) {
await member.roles.remove(roles).catch(err => {})
} else if (interaction.values.length > 3) {
await member.roles.add(roles).catch(err => {})
} else {
await member.roles.remove(roles).catch(err => {})
await member.roles.add(role).catch(err => {})
}
}
interaction.reply({ content: "Rolleriniz düzenlendi.", ephemeral: true }).catch(e => {})
} 
const modal = new Discord.ModalBuilder()
.setCustomId('sbasvuru')
.setTitle('Sorunları İlet')
const s = new Discord.TextInputBuilder()
.setCustomId('soruns')
.setLabel('Sorunu Anlatır Mısınız ?')
.setStyle(Discord.TextInputStyle.Short) 
.setPlaceholder('Örn: Kayıt ederken bir hata oluştu ve kayıt edemiyorum.');
const sx = new Discord.ActionRowBuilder().addComponents(s);
modal.addComponents(sx);
if(interaction.isButton()) {
if(interaction.customId === "bsorun") {
interaction.showModal(modal, {
client: client, 
interaction: interaction, 
})
}
}
if (interaction.customId === 'sbasvuru') {
const cevap = interaction.fields.getTextInputValue('soruns');
await interaction.reply({content: `Sorun'un Başarıyla İletildi!`, ephemeral: true }).catch(() => {});
const roles = member.roles.cache.filter(role => role.id !== settings.guildID).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
const rolleri = []
if (roles.length > 6) {
const lent = roles.length - 6
let itemler = roles.slice(0, 6)
itemler.map(x => rolleri.push(x))
rolleri.push(`${lent} daha.`)
} else {
roles.map(x => rolleri.push(x))
}
const embed = new Discord.EmbedBuilder()
const channel = await client.kanalBul("sikayet-log");
if(channel) channel.send({embeds: [embed
.setTitle("🎉 Yeni Sorun Başvuru 🎉")
.setDescription(`
${member.guild.emojiGöster(emojis.uyari)} **__Kullanıcı Hakkında__**
${member.guild.emojiGöster(emojis.nokta)} **ID: \`${member.id}\`**
${member.guild.emojiGöster(emojis.nokta)} **Kullanıcı: ${member} (\`${member.user.globalName ? member.user.globalName : member.user.tag}\`)**
${member.guild.emojiGöster(emojis.nokta)} **Rolleri: ${rolleri.join(", ")}**

${member.guild.emojiGöster(emojis.uyari)} **__Sorun Hakkında__**
${member.guild.emojiGöster(emojis.nokta)} **Sorunu: ${cevap}**
`).setFooter({iconURL: member.avatarURL({dynamic: true}), text: `Kullanıcı ${member.user.gobalName ? member.user.globalName : member.user.tag}`})]})            
}
const modals = new Discord.ModalBuilder()
.setCustomId('öbasvuru')
.setTitle('İstek & Öneri Formu')
const ss = new Discord.TextInputBuilder()
.setCustomId('öneris')
.setLabel('İstek Veya Öneriniz Nedir ?')
.setStyle(Discord.TextInputStyle.Short) 
.setPlaceholder('İsteğinizi Ve Önerinizi Bize İletin.');
const sxx = new Discord.ActionRowBuilder().addComponents(ss);
modals.addComponents(sxx);
if(interaction.isButton()) {
if(interaction.customId === "böneri") {
interaction.showModal(modals, {
client: client, 
interaction: interaction, 
})
}
}
if (interaction.customId === 'öbasvuru') {
const cevap = interaction.fields.getTextInputValue('öneris');
await interaction.reply({content: `Önerin Başarıyla İletildi!`, ephemeral: true }).catch(() => {});
const roles = member.roles.cache.filter(role => role.id !== settings.guildID).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
const rolleri = []
if (roles.length > 6) {
const lent = roles.length - 6
let itemler = roles.slice(0, 6)
itemler.map(x => rolleri.push(x))
rolleri.push(`${lent} daha.`)
} else {
roles.map(x => rolleri.push(x))
}
const embed = new Discord.EmbedBuilder()
const channel = await client.kanalBul("öneri-log");
if(channel) channel.send({embeds: [embed
.setTitle("🎉 Yeni İstek & Öneri Başvuru 🎉")
.setDescription(`
${member.guild.emojiGöster(emojis.uyari)} **__Kullanıcı Hakkında__**
${member.guild.emojiGöster(emojis.nokta)} **ID: \`${member.id}\`**
${member.guild.emojiGöster(emojis.nokta)} **Kullanıcı: ${member} (\`${member.user.globalName ? member.user.globalName : member.user.tag}\`)**
${member.guild.emojiGöster(emojis.nokta)} **Rolleri: ${rolleri.join(", ")}**

${member.guild.emojiGöster(emojis.uyari)} **__İstek & Öneri Hakkında__**
${member.guild.emojiGöster(emojis.nokta)} **İstek & Önerisi: ${cevap}**
`).setFooter({iconURL: member.avatarURL({dynamic: true}), text: `Kullanıcı ${member.user.gobalName ? member.user.globalName : member.user.tag}`})]})              
}
const modalss = new Discord.ModalBuilder()
.setCustomId('ybasvuru')
.setTitle('Yetkili Başvuru')
const sss = new Discord.TextInputBuilder()
.setCustomId('isim')
.setLabel('İsminiz Ve Yaşınız ?')
.setStyle(Discord.TextInputStyle.Short) 
.setPlaceholder('Buraya İsminizi Ve Yaşınızı Yazınız!');
const ssss = new Discord.TextInputBuilder()
.setCustomId('nedens')
.setLabel('Sunucumuz İçin Neler Yapabilirsiniz ?')
.setStyle(Discord.TextInputStyle.Short) 
.setPlaceholder('Buraya Nedeninizi Yazınız!');	
const sssss = new Discord.TextInputBuilder()
.setCustomId('aktifligi')
.setLabel('Sunucumuzda Günlük Aktifliğiniz ?')
.setStyle(Discord.TextInputStyle.Short) 
.setPlaceholder('Buraya Aktifliğinizi Yazınız!');
const ssssss = new Discord.TextInputBuilder()
.setCustomId('bilgi')
.setLabel('Kendiniz Hakkında Biraz Bilgi ?')
.setStyle(Discord.TextInputStyle.Short) 
.setPlaceholder('Buraya Kendiniz Hakkında Bilgi Yazınız!'); 
const sxxx = new Discord.ActionRowBuilder().addComponents(sss);
const sxxxx = new Discord.ActionRowBuilder().addComponents(ssss);
const sxxxxx = new Discord.ActionRowBuilder().addComponents(sssss);
const sxxxxxx = new Discord.ActionRowBuilder().addComponents(ssssss);
modalss.addComponents(sxxx, sxxxx, sxxxxx, sxxxxxx);
if(interaction.isButton()) {
if(interaction.customId === "basvuru") {
if(ayar.tagSystem == true && !ayar.serverTag.some((s) => member.user.globalName && member.user.globalName.includes(s))) 
{  
interaction.reply({content: `kullanıcı adında tagımız (\`${ayar.serverTag.join(" - ")}\`) olmadığı için başvuru yapamazsınız.`, ephemeral: true }).catch(() => {});
return }
if (bzaman.get(member.id) >= 1) return interaction.reply({content: "<@"+member+"> Bu komutu 1 saat'de bir kullanabilirsin.", ephemeral: true}).catch(() => {});
if(ayar.staffRoles.some(x => member.roles.cache.has(x)) && ayar.registerRoles.some(oku => member.roles.cache.has(oku)) && ayar.ownerRoles.some(oku => member.roles.cache.has(oku)) && member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
{	
interaction.reply({content: `Zaten Sunucumuzda Yetkilisiniz.`, ephemeral: true})  
return } 	
interaction.showModal(modalss, {
client: client, 
interaction: interaction, 
})
}
}
if (interaction.customId === 'ybasvuru') {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onayla")
.setEmoji(interaction.guild.emojiGöster(emojis.yes).id)
.setLabel("Onayla")
.setStyle(Discord.ButtonStyle.Success),
new Discord.ButtonBuilder()
.setCustomId("reddet")
.setLabel("Reddet")
.setEmoji(interaction.guild.emojiGöster(emojis.no).id)
.setStyle(Discord.ButtonStyle.Danger),
);
const nedeni = interaction.fields.getTextInputValue('nedens');
const aktiflik = interaction.fields.getTextInputValue('aktifligi');   
const ismi = interaction.fields.getTextInputValue('isim');
const bilgisi = interaction.fields.getTextInputValue('bilgi');     
await interaction.reply({content: ` Yetkili Başvurun Başarıyla İletildi!`, ephemeral: true }).catch(() => {});
bzaman.set(member.id, (bzaman.get(member.id) || 1));
setTimeout(() => {
bzaman.delete(member.id)
}, 1000 * 60 * 60 * 1)
const roles = member.roles.cache.filter(role => role.id !== settings.guildID).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
const rolleri = []
if (roles.length > 6) {
const lent = roles.length - 6
let itemler = roles.slice(0, 6)
itemler.map(x => rolleri.push(x))
rolleri.push(`${lent} daha.`)
} else {
roles.map(x => rolleri.push(x))
}
const messageData = await messageUser.findOne({ guildID: settings.guildID, userID: member.id });
const voiceData = await voiceUser.findOne({ guildID: settings.guildID, userID: member.id });    
const embed = new Discord.EmbedBuilder()
const channel = await client.kanalBul("basvuru-log");
if(channel) channel.send({content: `${ayar.roleAddRoles.map((x) => `<@&${x}>`).join(', ')} İlgilenmeniz Gereken Başvuru Var!`, embeds: [embed
.setTitle("🎉 Yeni Yetkili Başvuru 🎉")
.setDescription(`
${member.guild.emojiGöster(emojis.uyari)} **__Kullanıcı Hakkında__**
${member.guild.emojiGöster(emojis.nokta)} **ID: \`${member.id}\`**
${member.guild.emojiGöster(emojis.nokta)} **Kullanıcı: ${member} (\`${member.user.globalName ? member.user.globalName : member.user.tag}\`)**
${member.guild.emojiGöster(emojis.nokta)} **Rolleri: ${rolleri.join(", ")}**

${member.guild.emojiGöster(emojis.uyari)} **__Başvuru Hakkında__**
${member.guild.emojiGöster(emojis.nokta)} **İsmi Ve Yaşı: ${ismi}**
${member.guild.emojiGöster(emojis.nokta)} **Sunucumuz için neler yapabilir: ${nedeni}**
${member.guild.emojiGöster(emojis.nokta)} **Sunucumuzda günlük aktifliği: ${aktiflik}**
${member.guild.emojiGöster(emojis.nokta)} **Kendisi hakkında biraz bilgi: ${bilgisi}**

${member.guild.emojiGöster(emojis.uyari)} **__Kullanıcı Stat Bilgileri__**
${member.guild.emojiGöster(emojis.nokta)} **Toplam Ses:** \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
${member.guild.emojiGöster(emojis.nokta)} **Toplam Mesaj:** \`${messageData ? messageData.topStat : 0} mesaj\`

${member.guild.emojiGöster(emojis.uyari)} **Not: Başvuruyu Onaylamak/Reddetmek İçin Buttonları Kullanınız!**
`).setFooter({iconURL: member.avatarURL({dynamic: true}), text: `Kullanıcı ${member.user.gobalName ? member.user.globalName : member.user.tag}`})], components: [row]}).then(async function(mesaj){

mesaj.createMessageComponentCollector(user => user.clicker.user.id == member.id).on(`collect`, async(button) => {
if(button.customId === "onayla") {
if (!ayar.roleAddRoles.some(x => button.member.roles.cache.has(x)) && !button.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;
button.deferUpdate()
row.components[0].setDisabled(true) 
row.components[1].setDisabled(true) 
mesaj.edit({ components: [row] }); 
const Sembed = new Discord.EmbedBuilder()
const channel = await client.kanalBul("basvuru-log");
channel.send({embeds: [Sembed.setDescription(`${member.guild.emojiGöster(emojis.yes)} Başarıyla ${member} Kullanıcısının Başvurusu ${button.member} Tarafından Onaylandı!`)]})
member.send(`${interaction.guild.name} Sunucusundaki Yetkili Başvurun **${button.member.user.tag}** Tarafından Başarıyla Onaylandı!:tada::tada::tada:`).catch(err => channel.send({content: `>>> ${member} kullanıcısının özel mesajları kapalı. DM üzerinden bilgilendirme mesajı gönderemedim, lütfen kendiniz bilgilendirme yapınız.` }))
member.roles.add(ayar.staffStartRoles).catch(e => {});
if(settings.coinSystem === true && !client.ranks.some((x) => interaction.member.roles.cache.has(x.role))) {
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: interaction.member.id }, { $inc: { coin: settings.yetkiCoin } }, { upsert: true });       
interaction.member.görevGüncelle(settings.guildID, "yetkili", 1, message.channel);
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $inc: { coin: 2 } }, { upsert: true });       
} else if(interaction.member.permissions.has(8n)) {
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $inc: { coin: 2 } }, { upsert: true });       
}
await Users.updateOne({ _id: member.id }, { $set: { "Staff": true, "StaffGiveAdmin": interaction.member.id, Date: Date.now() } }, { upsert: true }).exec();
await Users.updateOne({ _id: interaction.member.id }, { $push: { "Staffs": { id: member.id, Date: Date.now() } } }, { upsert: true }).exec();
}
if(button.customId === "reddet") {  
if (!ayar.roleAddRoles.some(x => button.member.roles.cache.has(x)) && !button.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;
button.deferUpdate()
row.components[0].setDisabled(true) 
row.components[1].setDisabled(true) 
mesaj.edit({ components: [row] });    
const Embed = new Discord.EmbedBuilder()
const channel = await client.kanalBul("basvuru-log");
if(channel) channel.send({embeds: [Embed.setDescription(`${member.guild.emojiGöster(emojis.yes)} Başarıyla ${member} Kullanıcısının Başvurusu ${button.member} Tarafından Reddedildi!`)]})
member.send(`${interaction.guild.name} Sunucusundaki Yetkili Başvurun **${button.member.user.tag}** Tarafından Reddedildi! 😔`).catch(err => channel.send({content: `>>> ${member} kullanıcısının özel mesajları kapalı. DM üzerinden bilgilendirme mesajı gönderemedim, lütfen kendiniz bilgilendirme yapınız.` }))
}
})})             
}

if(interaction.isButton()) {
const category = async (parentsArray) => {
const data = await voiceUserParent.find({ guildID: settings.guildID, userID: interaction.member.id });
const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
let voiceStat = 0;
for (var i = 0; i <= voiceUserParentData.length; i++) {
voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
}
return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
};
if(interaction.customId === "katilma") {
interaction.reply({content: `Sunucuya Katılma Tarihiniz: <t:${Math.floor(interaction.member.joinedTimestamp / 1000)}:R> `, ephemeral: true }).catch(() => {});
}
if(interaction.customId === "rol") {
interaction.reply({content: `Üzerinde Bulunan Rollerin Listesi : ${interaction.member.roles.cache.filter(xd => xd.name !== "@everyone").map(x => x).join("\n")}`, ephemeral: true }).catch(() => {});
}
if(interaction.customId === "acilis") {
interaction.reply({content: `Hesabınızın Açılış Tarihi: <t:${Math.floor(interaction.member.user.createdTimestamp / 1000)}> `, ephemeral: true }).catch(() => {});
}
if(interaction.customId === "invite2") {
const inviterData = await inviterSchema.findOne({ guildID: settings.guildID, userID: interaction.member.id });
const total = inviterData ? inviterData.total : 0;
const regular = inviterData ? inviterData.regular : 0;
const bonus = inviterData ? inviterData.bonus : 0;
const leave = inviterData ? inviterData.leave : 0;
const fake = inviterData ? inviterData.fake : 0;
interaction.reply({content: `${interaction.member.toString()}, üyesinin <t:${Math.floor(Date.now() / 1000)}>  tarihinden itibaren **${interaction.guild.name}** sunucusunda toplam invite bilgileri aşağıda belirtilmiştir.
${member.guild.emojiGöster(emojis.stat)} Toplam **${inviterData ? inviterData.regular : 0}** davet.
${member.guild.emojiGöster(emojis.nokta)} **(${inviterData ? inviterData.bonus : 0} bonus, ${inviterData ? inviterData.leave : 0} ayrılmış, ${inviterData ? inviterData.fake : 0} fake)\**
`, ephemeral: true }).catch(() => {});
}
if(interaction.customId === "kayit") {
if(interaction.member.roles.cache.get(ayar.boosterRoles)) return;     
await interaction.member.roles.set(ayar.unregRoles).catch(e => {})
interaction.reply({content: `${interaction.member.toString()} üyesi başarıyla kayıtsıza atıldı!`, ephemeral: true }).catch(() => {});
}
if(interaction.customId === "sunucu") {
const moment = require("moment");
moment.locale("tr");
let data = await penals.find({ guildID: settings.guildID, userID: interaction.member.id, }).sort({ date: -1 });
if (data.length === 0) return interaction.reply({ content:`${interaction.guild.emojis.cache.find(x => x.name == emojis.yes)} ${member.toString()} sicilin temiz!`, ephemeral: true})
data = data.map((x) => `#${x.id} ${x.active ? `${interaction.guild.emojis.cache.find(x => x.name == emojis.yes)}` : `${interaction.guild.emojis.cache.find(x => x.name == emojis.no)}`} **[${x.type}]** ${moment(x.date).format("LLL")} tarihinde <@${x.staff}> tarafından **${x.reason}** nedeniyle ${x.type.replace("-", " ")} cezası almışsın.\n`).join("\n");
for (var i = 0; i < Math.floor(data.length / 2000); i++) {
interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(data.slice(0, 2000))], ephemeral: true});
data = data.slice(2000);
}
if (data.length > 0) interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(data)], ephemeral: true}).catch(() => {});
}
if(interaction.customId === "isim") {
const data = await nameData.findOne({ guildID: settings.guildID, userID: interaction.member.id });
const ambed = new Discord.EmbedBuilder()
.setThumbnail(interaction.member.user.avatarURL({ dynamic: true, size: 2048 }))
.setTitle(`${interaction.member.user.globalName ? interaction.member.user.globalName : interaction.member.user.tag} üyesinin isim bilgileri:`)
.setDescription(`${member.guild.emojiGöster(emojis.no)} Kişinin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu.\n\n${data ? data.names.splice(0, 5).map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol}) (<@${x.yetkili}>) [ <t:${Math.floor(x.date / 1000)}:R> ]`).join("\n") : `Veri Bulunamadı.`}    `)      
interaction.reply({embeds: [ambed], ephemeral: true }).catch(() => {});
}
if(interaction.customId === "mesaj5") {
const messageData = await messageUser.findOne({ guildID: settings.guildID, userID: interaction.member.id });
const messageWeekly = messageData ? messageData.weeklyStat : 0;
const messageDaily = messageData ? messageData.dailyStat : 0;
interaction.reply({content: `
${member.guild.emojiGöster(emojis.uyari)} ${interaction.member.toString()}, üyesinin <t:${Math.floor(Date.now() / 1000)}>  tarihinden itibaren **${interaction.guild.name}** sunucusunda toplam mesaj bilgileri aşağıda belirtilmiştir.
${member.guild.emojiGöster(emojis.stat)} **Mesaj İstatistiği**
${member.guild.emojiGöster(emojis.nokta)} Toplam: **${messageData ? messageData.topStat : 0}**
${member.guild.emojiGöster(emojis.nokta)} Haftalık Mesaj: **${Number(messageWeekly).toLocaleString()} mesaj**
${member.guild.emojiGöster(emojis.nokta)} Günlük Mesaj: **${Number(messageDaily).toLocaleString()} mesaj**`, ephemeral: true }).catch(() => {});
}
if(interaction.customId === "ses5") {
const voiceData = await voiceUser.findOne({ guildID: settings.guildID, userID: interaction.member.id });
const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]");
const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]");
interaction.reply({content: `
${member.guild.emojiGöster(emojis.uyari)} ${interaction.member.toString()}, üyesinin <t:${Math.floor(Date.now() / 1000)}>  tarihinden itibaren **${interaction.guild.name}** sunucusunda toplam ses bilgileri aşağıda belirtilmiştir.
${member.guild.emojiGöster(emojis.stat)} **Sesli Sohbet İstatistiği**
${member.guild.emojiGöster(emojis.nokta)} Toplam: **${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika] s [saniye]")}**
${member.guild.emojiGöster(emojis.nokta)} Haftalık Ses: **${voiceWeekly}**
${member.guild.emojiGöster(emojis.nokta)} Günlük Ses: **${voiceDaily}**`, ephemeral: true }).catch(() => {});
}
}
if(interaction.isButton()) {
if(interaction.customId === "kurallar") {
const embed = new Discord.EmbedBuilder().setColor("#2f3136")
interaction.reply({embeds: [embed.addFields(
{name: `\`Kural 1\` **DM Kuralı**`,
value: `Sunucu içerisinde yaşanan bir tartışmayı özel mesajlara (DM) taşımak yasaktır. Taşınması durumunda sunucu yetkilileri duruma müdahale edebilir.`, inline: true },  
{name: `\`Kural 2\` **Tehdit Kuralı**`,
value: `Bir kullanıcıyı herhangi bir şekilde (özel mesajlar/sunucu içi) tehdit etmeniz durumunda sunucumuzdan kalıcı olarak uzaklaştırılırsınız.`, inline: true },
{name: `\`Kural 3\` **Küfür & Hakaret Kuralı**`,
value: `Sesli ve yazılı sohbet kanalları içerisinde herhangi bir şekilde küfür veya hakaret edici bir söz kullanmak yasaktır.\n\nİsminizde küfür, hakaret veya topluluğu kışkırtacak (herhangi bir şahsı rencide edici) ibare bulunması yasaktır.`, inline: true },
{name: `\`Kural 4\` **Dil Kuralı**`,
value: `Sunucu ana dili Türkçe olduğu için sunucu içerisinde Türkçe dışındaki dilleri kullanmak yasaktır.`, inline: true },
{name: `\`Kural 5\` **Profil Kuralı**`,
value: `Topluluğu koruma amacıyla profil fotoğrafınızda cinsellik, kan, vahşet vb. rahatsız edici içerik bulundurmanız yasaktır.
**Profilinizde discord linki yasaktır.**`, inline: true },
{name: `\`Kural 6\` **Etiket Kuralı**`,
value: `Herhangi bir kullanıcıyı rahatsız etme amacı ile birçok kez etiketlemek, @Man ve @Woman rolündeki kişileri etiketlemek yasaktır.`, inline: true },
{name: `\`Kural 7\` **Sohbet Kuralları**`,
value: `Kişisel olmadığı, cinsel unsur içermediği, nefret söylemi bulundurmadığı ve abartılmadığı sürece argo söylemler serbesttir.\n\nKişisel promosyon, kanal üzerinde herhangi bir reklam, kişisel bilgilerin paylaşımı, ifşalama, tehdit, şantaj vb. yasaktır.\n\nSohbet kanaları içerisinde Flood, Spam ve Caps-lock kullanımı, dini ve siyasi mizah yasaktır.\n\nBir kişiyi rencide edici bilgi, fotoğraf vb. paylaşımı yasaktır.\n\nDil, din, ırk, cinsiyet vb. ayrımcılıklar yasaktır.`, inline: true })], ephemeral: true}).catch(() => {});                         
}
if(interaction.customId === "booster") {
const embed = new Discord.EmbedBuilder().setColor("#2f3136")
interaction.reply({embeds: [embed.setDescription(`Bir sunucuya takviye yapmak o sunucuya ekstra özellikler sağlıyorsa kullanıcılar neden bu özelliklerden faydalanmasın? \n\nİşte takviye yaparak elde edeceğiniz avantajlar:`).addFields(
{name:`\`1\``,
value: `Üye listesinde herkesten ayrı görünen eşsiz ve harika bir <@&${ayar.boosterRoles}> rolü.`, inline: true },
{name:`\`2\``,
value: `Kullanıcı isminizi değiştirebileceğiniz \`.b\` komutuna erişim.`, inline: true },
{name:`\`3\``,
value: `Sohbet kanallarında harici emojileri kullanabilme hakkı.`, inline: true },
{name:`\`4\``,
value: `Sunucu içerisine 2 adet emoji ekleyebilme hakkı.`, inline: true },
{name:`\`5\``,
value: `Sunucu içerisindeki kullanıcı adı renginizi değiştirebilme özelliği. #rol-al`, inline: true }       )], ephemeral: true}).catch(() => {});
}
if(interaction.customId === "tag") {
const embed = new Discord.EmbedBuilder().setColor("#2f3136")
interaction.reply({embeds: [embed.setDescription(`Sunucumuzun tagı olan \`${ayar.serverTag}\` sembolünü kullanıcı adınıza ekleyerek tagımızı alabilir ve harika avantajlara sahip olabilirsiniz.\n\nİşte tag alarak elde edeceğiniz avantajlar:`).addFields(
{name:`\`1\``,
value: `Üye listesinde herkesten ayrı görünen eşsiz ve harika bir <@&${ayar.tagRoles}> rolü.`, inline: true },
{name:`\`2\``,
value: `Sunucu içerisindeki kullanıcı adı renginizi değiştirebilme özelliği.`, inline: true },
{name:`\`3\``,
value: `Sunucu içerisinde yetkili başvurusu yapabilme hakkı.`, inline: true },
{name:`\`4\``,
value: `Sunucu içerisine 1 adet emoji ekleyebilme hakkı.`, inline: true },
{name:`\`5\``,
value: `Taglılara özel çekilişlere katılabilme hakkı.`, inline: true }       )], ephemeral: true}).catch(() => {});
}
if(interaction.customId === "reklam") {
const embed = new Discord.EmbedBuilder().setColor("#2f3136")
interaction.reply({embeds: [embed.setDescription(`
Bir sunucuya reklam verdirmek o sunucuya ekstra özellikler sağlıyorsa kullanıcılar neden bu özelliklerden faydalanmasın?\n\nİşte reklam satın alarak kazanacağınız avantajlar:`).addFields(
{name:`\`1\``,
value: `Çekiliş kanalında 5 günlük bir çekiliş. (Katılım zorunluluğu!)`, inline: true },
{name:`\`2\``,
value: `Herkese açık bir kanalda reklam & Yeni gelenlere etiket!`, inline: true },
{name:`\`3\``,
value: `Herkese açık bir kanalda reklam.`, inline: true },
{name:`\`4\``,
value: `Tüm kullanıcılara tek seferde DM üzerinden reklam.`, inline: true },
{name:`\`5\``,
value: `Sadece kullanıcıların gördüğü duyurular kanalında reklam.`, inline: true })], ephemeral: true}).catch(() => {});
}  
}
if(interaction.isStringSelectMenu()) {
if(interaction.values[0] === "kullanicik") {         
interaction.reply({content: `${client.commands.filter((x) => x.conf.help && x.conf.category == "kullanici").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.prefix}${x.conf.help}`).splice(0, 300).join("\n")}`, ephemeral: true}).catch(e => {})           
}
if(interaction.values[0] === "eglencek") {         
interaction.reply({content: `${client.commands.filter((x) => x.conf.help && x.conf.category == "eglence").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.prefix}${x.conf.help}`).splice(0, 300).join("\n")}`, ephemeral: true}).catch(e => {})           
}
if(interaction.values[0] === "ozelkk") {   
let res = await db.find({})      
interaction.reply({content: `${res.length > 0 ? res.map(x => `${settings.prefix}${x.cmdName} @Rainha/ID`).join("\n") : "Özel Komut Bulunmamakta."}`, ephemeral: true}).catch(e => {})           
}
if(interaction.values[0] === "cezalandirmak") {         
interaction.reply({content: `${client.commands.filter((x) => x.conf.help && x.conf.category == "cezalandirma").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.prefix}${x.conf.help}`).splice(0, 300).join("\n")}`, ephemeral: true}).catch(e => {})           
}
if(interaction.values[0] === "yetkilik") {         
interaction.reply({content: `${client.commands.filter((x) => x.conf.help && x.conf.category == "yetkili").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.prefix}${x.conf.help}`).splice(0, 300).join("\n")}`, ephemeral: true}).catch(e => {})           
}
if(interaction.values[0] === "ustyetkilik") {         
interaction.reply({content: `${client.commands.filter((x) => x.conf.help && x.conf.category == "ustyetkili").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.prefix}${x.conf.help}`).splice(0, 300).join("\n")}`, ephemeral: true}).catch(e => {})           
}
if(interaction.values[0] === "ownerk") {         
interaction.reply({content: `${client.commands.filter((x) => x.conf.help && x.conf.category == "owner").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${settings.prefix}${x.conf.help}`).splice(0, 300).join("\n")}`, ephemeral: true}).catch(e => {})           
}
}
if(interaction.customId === "yardimss") {   
    const row = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.StringSelectMenuBuilder()
        .setCustomId('helps')
        .setPlaceholder('Bot komutlarını görüntülemek için tıklayınız!')
        .addOptions([
            {
                label: "Kullanıcı",
                description: 'Kullanıcı komutlarını görüntülemek için tıklayınız.',
                value: 'kullanicik',
                emoji: '1139834661493805126',
            },
          {
                label: 'Eğlence',
                description: 'Eğlence komutlarını görüntülemek için tıklayınız.',
                value: 'eglencek',
                emoji: '1139834661493805126',
            },
          {
                label: 'Özel Komutlar',
                description: 'Özel Komutları görüntülemek için tıklayınız.',
                value: 'ozelkk',
                emoji: '1139834661493805126',
            },
          {
                label: 'Cezalandırma',
                description: 'Cezalandırma komutlarını görüntülemek için tıklayınız.',
                value: 'cezalandirmak',
                emoji: '1139834661493805126',
            },
          {
                label: 'Yetkili',
                description: 'Yetkiki komutlarını görüntülemek için tıklayınız.',
                value: 'yetkilik',
                emoji: '1139834661493805126',
            },
          {
                label: 'Üst Yetkili',
                description: 'Üst Yetkili komutlarını görüntülemek için tıklayınız.',
                value: 'ustyetkilik',
                emoji: '1139834661493805126',
            },
          {
                label: 'Owner',
                description: 'Owner komutlarını görüntülemek için tıklayınız.',
                value: 'ownerk',
                emoji: '1139834661493805126',
            },
        ]),
    );    
interaction.reply({ content: `**Merhaba!** Yardım almak ister misin?\nAşağıda bulunan menüden yardım almak istediğiniz kategoriyi seçin. ${interaction.guild.emojiGöster(emojis.konfeti)}`, components: [row], ephemeral: true}).catch((e) => {})  
}
if(interaction.customId === "ayliks") {   
const db = await setup.findOne({guildID: settings.guildID, userID: member.id})
if(!db) new setup({guildID: settings.guildID, userID: member.id, levelSystem: true, monthlySystem: true}).save();
if(db) {
if(db.monthlySystem == false) await setup.updateOne({guildID: settings.guildID, userID: member.id}, {$set: { monthlySystem: true } }, { upsert: true }), interaction.reply({content: 'Başarıyla Aylık Rol Sistemi Aktif Hale Getirildi.', ephemeral: true}).catch((e) => {})  
if(db.monthlySystem == true) await setup.updateOne({guildID: settings.guildID, userID: member.id}, {$set: { monthlySystem: false } }, { upsert: true }), interaction.reply({content: 'Başarıyla Aylık Rol Sistemi Deaktif Hale Getirildi.', ephemeral: true}).catch((e) => {})   
}
}
if(interaction.customId === "levels") {   
const db = await setup.findOne({guildID: settings.guildID, userID: member.id})
if(!db) new setup({guildID: settings.guildID, userID: member.id, levelSystem: true, monthlySystem: true}).save();
if(db) {
if(db.levelSystem == false) await setup.updateOne({guildID: settings.guildID, userID: member.id}, {$set: { levelSystem: true } }, { upsert: true }), interaction.reply({content: 'Başarıyla Level Rol Sistemi Aktif Hale Getirildi.', ephemeral: true}).catch((e) => {})  
if(db.levelSystem == true) await setup.updateOne({guildID: settings.guildID, userID: member.id}, {$set: { levelSystem: false } }, { upsert: true }), interaction.reply({content: 'Başarıyla Level Rol Sistemi Deaktif Hale Getirildi.', ephemeral: true}).catch((e) => {})   
}
}
const modalsss = new Discord.ModalBuilder()
.setCustomId('bisims')
.setTitle('Booster Panel')
const sssssss = new Discord.TextInputBuilder()
.setCustomId('isim')
.setLabel('İsminiz ?')
.setStyle(Discord.TextInputStyle.Short) 
.setPlaceholder('Buraya İsminizi Yazınız!');
const sxxxxxxxx = new Discord.ActionRowBuilder().addComponents(sssssss);
modalsss.addComponents(sxxxxxxxx);
if(interaction.isButton()) {
if(interaction.customId === "boosters") {    
if(!interaction.member.roles.cache.has(ayar.boosterRoles)) return interaction.reply({content: `<@&${ayar.boosterRoles}> Booster Olmadığın İçin Bu Sistemi Kullanamazsın.`, ephemeral: true}).catch(() => {});
if (zaman.get(member.id) >= 1) return interaction.reply({content: "<@"+member+"> Bu komutu 15 dakika'da bir kullanabilirsin.", ephemeral: true}).catch(() => {});
interaction.showModal(modalsss, {
client: client, 
interaction: interaction, 
})
}
}
if(interaction.customId === "bisims") { 
const bilgisi = interaction.fields.getTextInputValue('isim');   
const engel = ["!", "'", "?", "$", "#", "%", ",", "."];  
if(engel.some(char => bilgisi.toLowerCase().includes(char))) return interaction.reply({content: 'İsmine Özel Karakter Koyamazsın.', ephemeral: true}).catch(() => {});
if(bilgisi.length >= 18) return interaction.reply({content: 'İsmin 18 Karakterden Uzun Olamaz.', ephemeral: true}).catch(() => {});
await member.setNickname(`${member.user.globalName && member.user.globalName.includes(ayar.nameTag) ? ayar.nameTag : (ayar.defaultTag ? ayar.defaultTag : (ayar.nameTag || ""))} ${bilgisi}`).catch(() => {});
await interaction.reply({content: `Başarıyla İsmin **${bilgisi}** Olarak Değiştirildi.`, ephemeral: true }).catch(() => {});
zaman.set(member.id, (zaman.get(member.id) || 1));
setTimeout(() => {
zaman.delete(member.id)
}, 1000 * 60 * 15 * 1)
}
if(interaction.customId === "levelss") { 
const mesaj = await interaction.reply({content: 'Veri Yükleniyor...', ephemeral: true})
const [mesajData, sesData] = await Promise.all([
messageUser.findOne({ guildID: settings.guildID, userID: member.id }),
voiceUser.findOne({ guildID: settings.guildID, userID: member.id })
]);
let [mbilgi, sbilgi] = await Promise.all([
mcontrol(mesajData),
scontrol(sesData)
]);
mesaj.edit({ content: `${mbilgi}\n\n${sbilgi}`, ephemeral: true }).catch(() => {});
}
if(interaction.customId === "aylikss") { 
const mesaj = await interaction.reply({content: 'Veri Yükleniyor...', ephemeral: true})
let bilgi = await monthlycontrol(member)
mesaj.edit({ content: `${bilgi}`, ephemeral: true }).catch(() => {});
}
if (interaction.customId === "serversetups") {
if(interaction.values[0] == 'wembed') {
if(ayar.welcomeMessageEmbed == false) {
await setups.updateOne({guildID: settings.guildID}, {$set: { welcomeMessageEmbed: true } }, {upsert: true})
await interaction.deferReply({ ephemeral: true }).catch(e => {})
interaction.reply({content: 'Başarıyla Hoşgeldin Mesajı Embed Olarak Ayarlandı.', ephemeral: true}).catch((err) => {})
} else if(ayar.welcomeMessageEmbed == true) {
await setups.updateOne({guildID: settings.guildID}, {$set: { welcomeMessageEmbed: false } }, {upsert: true}) 
await interaction.deferReply({ ephemeral: true }).catch(e => {})
interaction.reply({content: 'Başarıyla Hoşgeldin Mesajı Normal Olarak Ayarlandı.', ephemeral: true}).catch((err) => {})
}
}
if(interaction.values[0] == 'tagsystem') {
if(ayar.tagSystem == false) {
await setups.updateOne({guildID: settings.guildID}, {$set: { tagSystem: true } }, {upsert: true})
interaction.reply({content: 'Başarıyla Tag Sistemi Aktif Olarak Ayarlandı.', ephemeral: true}).catch((err) => {})
} else if(ayar.tagSystem == true) {
await setups.updateOne({guildID: settings.guildID}, {$set: { tagSystem: false } }, {upsert: true}) 
interaction.reply({content: 'Başarıyla Tag Sistemi Deaktif Olarak Ayarlandı.', ephemeral: true}).catch((err) => {})
}
}
if(interaction.values[0] == 'ageSystem') {
if(ayar.ageSystem == false) {
await setups.updateOne({guildID: settings.guildID}, {$set: { ageSystem: true } }, {upsert: true})
interaction.reply({content: 'Başarıyla Yaş Sistemi Aktif Olarak Ayarlandı.', ephemeral: true}).catch((err) => {})
} else if(ayar.ageSystem == true) {
await setups.updateOne({guildID: settings.guildID}, {$set: { ageSystem: false } }, {upsert: true}) 
interaction.reply({content: 'Başarıyla Yaş Sistemi Deaktif Olarak Ayarlandı.', ephemeral: true}).catch((err) => {})
}
}
if(interaction.values[0] == 'autoregister') {
if(ayar.otoRegister == false) {
await setups.updateOne({guildID: settings.guildID}, {$set: { otoRegister: true } }, {upsert: true}) 
interaction.reply({content: 'Başarıyla Oto Kayıt Sistemi Aktif Olarak Ayarlandı.', ephemeral: true}).catch((err) => {})
} else if(ayar.otoRegister == true) {
await setups.updateOne({guildID: settings.guildID}, {$set: { otoRegister: false } }, {upsert: true}) 
interaction.reply({content: 'Başarıyla Oto Kayıt Sistemi Deaktif Olarak Ayarlandı.', ephemeral: true}).catch((err) => {})
}
}
if(interaction.values[0] == 'iptal') {
if(interaction) interaction.message.delete().catch((err) => {})
}
}  
if(interaction.isButton()) {
if (interaction.customId === 'detete') return;
let data = await Guild.findOne({ guildId: settings.guildID });
let user_olddata = await User.findOne({ userId: interaction.user.id });
if (!user_olddata) { await User.create({ userId: interaction.user.id }) }
let user_data = await User.findOne({ userId: interaction.user.id });
if (data?.private_voices?.mode === true) {
if (interaction.member?.voice.channel && interaction.channel.id === data?.private_voices?.textId && interaction.channel.id === data.private_voices.textId && interaction.member?.voice.channel.id === user_data?.private_voices?.voiceId && interaction.member.voice.channel.id === user_data.private_voices.voiceId) {
if (interaction.customId === 'rename') {
const Modal = new Discord.ModalBuilder()
.setCustomId('myModal')
.setTitle('Kanal adı değişikliği');
const Input = new Discord.TextInputBuilder()
.setCustomId('Input')
.setPlaceholder('Özel Oda¹')
.setLabel("Yeni bir ad girin")
.setStyle(Discord.TextInputStyle.Short)
.setMinLength(1)
.setMaxLength(24)
let firstActionRow = new Discord.ActionRowBuilder().addComponents(Input);
Modal.addComponents(firstActionRow);
await interaction.showModal(Modal);
}                  
            if (interaction.customId === 'ekleme') {
                const Modal = new Discord.ModalBuilder()
                    .setCustomId('ekleme')
                    .setTitle('Kullanıcı Ekleme');
                const Input = new Discord.TextInputBuilder()
                    .setCustomId('InputEkleme')
                    .setPlaceholder('Kullanıcı İd')
                    .setLabel("Kullanıcı kimliği girin")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setMinLength(1)
                    .setMaxLength(20)
              let firstActionRow = new Discord.ActionRowBuilder().addComponents(Input);
                Modal.addComponents(firstActionRow);
                await interaction.showModal(Modal);
            }
            if (interaction.customId === 'limit') {
                const Modal = new Discord.ModalBuilder()
                    .setCustomId('limit')
                    .setTitle('Kullanıcı sınırını değiştir');
                const Input = new Discord.TextInputBuilder()
                    .setCustomId('InputLimit')
                    .setPlaceholder('0 - 99')
                    .setLabel("Yeni bir kullanıcı sınırı girin")
                    .setStyle(Discord.TextInputStyle.Short)

                    .setMinLength(1)

                    .setMaxLength(2)
               let firstActionRow = new Discord.ActionRowBuilder().addComponents(Input);
                Modal.addComponents(firstActionRow);
                await interaction.showModal(Modal);
            }
          if (interaction.customId === 'kick') {
                const Modal = new Discord.ModalBuilder()
                    .setCustomId('kick')
                    .setTitle('Kullanıcı sınırını değiştir');
                const Input = new Discord.TextInputBuilder()
                    .setCustomId('InputKick')
                    .setPlaceholder('Kullanıcı İd')
                    .setLabel("kullanıcı kimliğini girin")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setMinLength(1)
                    .setMaxLength(20)
              let firstActionRow = new Discord.ActionRowBuilder().addComponents(Input);
                Modal.addComponents(firstActionRow);
                await interaction.showModal(Modal);
            }
            if (interaction.customId === 'cikarma') {
                const Modal = new Discord.ModalBuilder()
                    .setCustomId('cikarma')
                    .setTitle("Kullanıcı Çıkarma");
                const Input = new Discord.TextInputBuilder()
                    .setCustomId('InputCikarma')
                    .setPlaceholder('Kullanıcı İd')
                    .setLabel("kullanıcı kimliğini girin")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setMinLength(1)
                    .setMaxLength(20)
               let firstActionRow = new Discord.ActionRowBuilder().addComponents(Input);
                Modal.addComponents(firstActionRow);
                await interaction.showModal(Modal);
}
} else {
if(interaction.customId == 'kick' && interaction.customId == 'cikarma' && interaction.customId == 'ekleme' && interaction.customId == 'limit' && interaction.customId == 'rename') return;
interaction.reply({ content: `Bu komutu kullanmak için özel odanız olması gerekir.`, ephemeral: true }).catch(() => {});   
}     
}
}
if (interaction.isModalSubmit()) {
if (interaction.customId === 'myModal') {
const input = interaction.fields.getTextInputValue('Input');
interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`**${input}** Yeni kanal adı`)], ephemeral: true })
await interaction.member.voice.channel.setName(input).catch(() => null)
}
if (interaction.customId === 'ekleme') {
let user_data = await User.findOne({ userId: interaction.user.id });
let input = interaction.fields.getTextInputValue('InputEkleme');
if(isNaN(input)) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Lütfen Kullanıcı İd Gir.`)], ephemeral: true })                
if(!interaction.guild.members.cache.get(input)) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Böyle bir kullanıcı bulunamadı.`)], ephemeral: true })                
interaction.guild.members.fetch(input).then(x => {
if (!x) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Böyle bir kullanıcı bulunamadı.`)], ephemeral: true })                
interaction.reply({embeds: [new Discord.EmbedBuilder().setDescription(`${x} Kullanıcısına Kanala Bağlanma İzni Verildi!`)], ephemeral: true})
interaction.member.voice.channel.permissionOverwrites.edit(x.id, { ViewChannel: true, Connect: true, Speak: true, Stream: true}).catch(() => null)
})
}  
if (interaction.customId === 'limit') {
let input = interaction.fields.getTextInputValue('InputLimit');
if (isNaN(input)) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Geçersiz bir numara girdiniz.`)], ephemeral: true })
if((input >= 5) || input == 0) return interaction.reply({embeds: [new Discord.EmbedBuilder().setDescription(`Oda Sayısı 4'den Fazla Olamaz.`)], ephemeral: true})		
interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`**${input}** kullanıcı sınırı ayarlandı`)], ephemeral: true })
await interaction.member.voice.channel.setUserLimit(input).catch(() => null)
}
if (interaction.customId === 'cikarma') {
let user_data = await User.findOne({ userId: interaction.user.id });
let input = interaction.fields.getTextInputValue('InputCikarma');
if(isNaN(input)) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Lütfen Kullanıcı İd Gir.`)], ephemeral: true })                
if(!interaction.guild.members.cache.get(input)) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Böyle bir kullanıcı bulunamadı.`)], ephemeral: true })                
interaction.guild.members.fetch(input).then(x => {
if (!x) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Böyle bir kullanıcı bulunamadı.`)], ephemeral: true })                
interaction.reply({embeds: [new Discord.EmbedBuilder().setDescription(`${x} Kullanıcısından Kanala Bağlanma İzni Alındı!`)], ephemeral: true})
interaction.member.voice.channel.permissionOverwrites.edit(x.id, { ViewChannel: null, Connect: null, Speak: null, Stream: null}).catch(() => null)
})
}
if (interaction.customId === 'kick') {
let user_data = await User.findOne({ userId: interaction.user.id });
let input = interaction.fields.getTextInputValue('InputKick');
if(isNaN(input)) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Lütfen Kullanıcı İd Gir.`)], ephemeral: true })                
if(!interaction.guild.members.cache.get(input)) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Böyle bir kullanıcı bulunamadı.`)], ephemeral: true })                
interaction.guild.members.fetch(input).then(x => {
if (!x.voice.channel) return interaction.reply({embeds: [new Discord.EmbedBuilder().setDescription(`${x} Kullanıcısı Bir Ses Kanalında Bulunmuyor!`)], ephemeral: true});
if (x.voice.channel.id !== user_data.private_voices.voiceId) return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Belirtilen katılımcı sizin ses kanalında değil.`)], ephemeral: true })
interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`**${x.user}** ses kanalından atıldı.`)], ephemeral: true })
x.voice.disconnect().catch(e => {})
}, y => {
interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Geçersiz bir kimlik girdiniz.`)], ephemeral: true })
})
await interaction.member.voice.channel.setUserLimit(input).catch(() => null)
}
}
let Database = await Menu.find({})
if(Database && Database.length >= 1) {
for (let index = 0; index < Database.length; index++) {
let menu = interaction.customId
let Data = Database[index]
if(Data.Secret == menu) {
let customMap = new Map()
Data.Roller.forEach(r => customMap.set(r, r))
let roles = Data.Roller
var role = []
for (let index = 0; index < interaction.values.length; index++) {
let ids = interaction.values[index]
let den = customMap.get(ids)
role.push(den)
}
if (interaction.values[0] === "rolsil") {
await member.roles.remove(roles).catch((e) => {})
} else {
if (!interaction.values.length) {
await member.roles.remove(roles).catch(err => {})
} else {
await member.roles.remove(roles).catch(err => {})
await member.roles.add(role).catch(err => {})
}
}
interaction.reply({ content: "Rolleriniz güncellendi.", ephemeral: true }).catch((e) => {})
}
}
}
if (interaction.customId === "suphekontrol") {
if(!ayar.fakeAccRoles.some(x => interaction.member.roles.cache.has(x))) return interaction.reply({content: `Zaten Kayıtlısın Sunucuda.`, ephemeral: true})
if (Date.now() - interaction.user.createdTimestamp < ms("7d")) {
const embed = new Discord.EmbedBuilder().setDescription(`*Hesabının kuruluş tarihi: <t:${Math.floor(interaction.member.user.createdTimestamp / 1000)}>\n\nHesabın: <t:${Math.floor(interaction.member.user.createdTimestamp / 1000)}:R> kurulmuş\n\nHesabının kuruluş tarihi 7 günü geçmediği için seni şüpheliden çıkartamadım. Daha sonra tekrar kontrol edebilirsin.*`)
.setColor("Red");
interaction.reply({ embeds: [embed], ephemeral: true });
} else {
await interaction.member.roles.set(ayar.unregRoles).catch(e => {})
const embed = new Discord.EmbedBuilder().setColor("Green").setDescription(`*Hesabının kuruluş tarihi: <t:${Math.floor(interaction.member.user.createdTimestamp / 1000)}>\n\nHesabın: <t:${Math.floor(interaction.member.user.createdTimestamp / 1000)}:R> kurulmuş\n\nHesabının kuruluş tarihi 7 günü geçtiği için seni şüpheliden çıkarttım. Teyit kanallarımıza girip kayıt olabilirsin.*`);
interaction.reply({ embeds: [embed], ephemeral: true });
}
}
}; 
module.exports.conf = {
name: "interactionCreate",
};

async function mcontrol(veri){
const ayar = await setups.findOne({guildID: settings.guildID})
const guild = client.guilds.cache.get(settings.guildID)
if(!ayar) return;
const chatRoles = [
{limit: 2500, role: 'chatBronzeRoles'},
{limit: 5000, role: 'chatSilverRoles'},
{limit: 10000, role: 'chatGoldRoles'},
{limit: 20000, role: 'chatDiamondRoles'},
{limit: 40000, role: 'chatEmeraldRoles'}
];
let nextRank = '';
let remainingMessages = 0;
if (veri) {
for (let i = 0; i < chatRoles.length; i++) {
if (veri.topStat < chatRoles[i].limit) {
nextRank = ayar[chatRoles[i].role];
remainingMessages = chatRoles[i].limit - veri.topStat;
break;
}
}
if (nextRank !== '') {
return `**${guild.roles.cache.get(nextRank).name}** Rolüne Ulaşmak İçin **${remainingMessages}** Mesaj Daha Atman Gerekli`;
} else {
return `**${guild.roles.cache.get(ayar.chatEmeraldRoles).name}** Rolüne Ulaştın!`;
}
} else {
return 'Veri Alınamadı.';
}
}
async function scontrol(veri) {
const ayar = await setups.findOne({guildID: settings.guildID})
const guild = client.guilds.cache.get(settings.guildID)
if(!ayar) return;
const voiceRoles = [
{limit: 360000000, role: 'voiceBronzeRoles'},
{limit: 1080000000, role: 'voiceSilverRoles'},
{limit: 2700000000, role: 'voiceGoldRoles'},
{limit: 7200000000, role: 'voiceDiamondRoles'},
{limit: 14400000000, role: 'voiceEmeraldRoles'}
];
let nextRank = '';
let remainingVoice = 0;
if(veri) {
for (let i = 0; i < voiceRoles.length; i++) {
if (veri.topStat < voiceRoles[i].limit) {
nextRank = ayar[voiceRoles[i].role];
remainingVoice = voiceRoles[i].limit - veri.topStat;
break;
}
}
if (nextRank !== '') {
return `**${guild.roles.cache.get(nextRank).name}** Rolüne Ulaşmak İçin **${moment.duration(remainingVoice).format("D [Gün], H [Saat], m [Dakika]")}** Daha Seslerde Vakit Geçirmen Gerekli`;
} else {
return `**${guild.roles.cache.get(ayar.voiceEmeraldRoles).name}** Rolüne Ulaştın!`;
}
} else {
return 'Veri Alınamadı.';
}
}

async function monthlycontrol(member) {
const ayar = await setups.findOne({ guildID: settings.guildID });
const guild = client.guilds.cache.get(settings.guildID);
if (!ayar) return;
const monthRoles = [
{limit: 30, role: 'oneMonthRoles'},
{limit: 90, role: 'threeMonthRoles'},
{limit: 180, role: 'sixMonthRoles'},
{limit: 270, role: 'nineMonthRoles'},
{limit: 365, role: 'oneYearRoles'}
];
const joinDate = new Date(member.joinedAt); 
let nextRank = '';
let kalanZaman = 0;
if (joinDate) {
const kalanGün = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24)); 
for (let i = 0; i < monthRoles.length; i++) {
if (kalanGün < monthRoles[i].limit) {
nextRank = ayar[monthRoles[i].role];
kalanZaman = monthRoles[i].limit - kalanGün;
break;
}
}
if (nextRank !== '') {
return `**${guild.roles.cache.get(nextRank).name}** Rolüne Ulaşmak İçin **${kalanZaman}** Gün Daha Sunucuda Bulunman Gerekli`;
} else {
return;
}
} else {
return 'Veri Alınamadı.';
}
}