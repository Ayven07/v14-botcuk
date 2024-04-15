const moment = require("moment");
require("moment-duration-format");
const ayar = require('../../configs/settings.json');
const emojis = require('../../configs/emojiName.json')
const Discord = require("discord.js");
const setups = require("../../schemas/setup")
const Menu = require('../../schemas/menus')
const client = global.client;
module.exports = {
conf: {
aliases: ['menu'],
name: "menü",
owner: true,
help: 'menü',
category: "owner"
},

exclosive: async (client, message, args, embed) => {
let Data = await Menu.find({})
let comp;
let defa = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder()
.setCustomId("ekle")
.setLabel("Ekleme & Düzenleme")
.setStyle(Discord.ButtonStyle.Success))
if(Data && Data.length >= 1) { 
let listele = []
Data.forEach(async (x) => {listele.push({label: x.İsim, description: `${moment(Date.now()).format("LLL")} ${message.guild.members.cache.get(x.Oluşturan) ? `- ${message.guild.members.cache.get(x.Oluşturan).user.username}` : ""}`, value: x.İsim})
})
comp = [defa, new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("sil")
.setPlaceholder("Aşağıdan silmek istediğiniz menüyü seçin!")
.addOptions(listele),),new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("kur")
.setPlaceholder("Aşağıdan oluşturmak istediğiniz menüyü seçin!")
.addOptions(listele) )]} else {comp = [defa]}
message.channel.send({embeds: [new Discord.EmbedBuilder().setDescription(`**Merhaba!** ${message.member.user.tag} (${message.member}),
${message.guild.name} sunucusuna ait olan rol seçim menüsü listesi aşağıda mevcut ekleme, düzenleme ve kaldırma işlemini buradan yapabilirsiniz.
**Kullanım Koşulları!**
\` ❯ \` Sunucuda bir rol seçim menüsü oluşturmak istiyorsan aşağıda ki düğme yardımıyla ekleyebilirsin.
\` ❯ \` Ekleme işlemleri bittikten sonra anlık olarak kurulum işlemini tekrar bu panel üzerinden yapabilirsin.
\` ❯ \` Düzenleme işlemi yaparken tekrardan aşağıda ki düğmeye basarak, düzenlenmesini istediğiniz rol seçim menüsü ismini girerek tekrardan ayarlarını güncelleyebilirsiniz.`)], components: comp}).then(async (msg) => {
const filter = i => i.user.id == message.member.id 
const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 120000 })
collector.on("collect", async (i) => {
if(i.customId == "sil") {
await Menu.deleteOne({İsim: i.values})
i.reply({content: `Başarıyla **${i.values}** isimli rol seçim menüsü silindi.`, ephemeral: true})
msg.delete().catch(err => {})
}
if(i.customId == "kur") {
let kurulcak = await Menu.findOne({İsim: i.values})
if(kurulcak) {
let Opt = [];
kurulcak.Roller.forEach(r => {
const role = message.guild.roles.cache.get(r);
if (role) {
Opt.push({
label: role.name,
value: r
});
} else {
Opt.push({
label: "null",
value: "rolsil"
});
}
});
let listMenu = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId(kurulcak.Secret)
.setPlaceholder(kurulcak.İsim)
.addOptions(Opt),)
message.channel.send({content: `${kurulcak.Yazı}`, components: [listMenu]}).then(async (oluşturuldu) => {
var filter = i => i.customId == kurulcak.Secret
let collector = oluşturuldu.createMessageComponentCollector({filter: filter})
collector.on('collect', async (i) => {
const member = await client.guilds.cache.get(ayar.guildID).members.fetch(i.user.id)
if (!member) return;
let Data = await Menu.findOne({Secret: kurulcak.Secret})
let customMap = new Map()
Data.Roller.forEach(r => customMap.set(r, r))
let roles = Data.Roller
var role = []
for (let index = 0; index < i.values.length; index++) {
let ids = i.values[index]
let den = customMap.get(ids)
role.push(den)
}
if (i.values[0] === "rolsil") {
await member.roles.remove(roles).catch(err => {})
} else {
if (!i.values.length) {
await member.roles.remove(roles).catch(err => {})
} else {
await member.roles.remove(roles).catch(err => {})
await member.roles.add(role).catch(err => {})
}
}
i.reply({ content: "Rolleriniz güncellendi.", ephemeral: true })
})
})
i.reply({content: `Başarıyla **${kurulcak.İsim}** isimli rol seçim menüsü kuruldu.`, ephemeral: true})
msg.delete().catch(err => {})
}
}
if(i.customId == "ekle") {
msg.delete().catch(err => {})
message.channel.send({content: `:tada: **${message.guild.name}**
Yeni bir rol seçim menüsü oluşturuluyor...`, embeds: [new Discord.EmbedBuilder().setDescription(`
Rol Seçim Menüsü: \` Ayarlanmadı! \`
Açıklama: \` Ayarlanmadı! \`
Roller: \` Ayarlanmadı! \`
Yeni oluşturulmakta olan rol seçim menünüze bir isim belirleyin.`)]}).then(async (x) => {
let rolSeçim = {
İsim: String,
Roller: Array,
Yazı: String,
Date: Date.now(),
Secret: oluştur(10),
Oluşturan: message.member.id,
}
var filt = m => m.author.id == message.member.id
let collector = x.channel.createMessageCollector({filter: filt, time: 60000, max: 1, errors: ["time"]})
collector.on("collect", async (m) => {
let mesaj = m.content
if(mesaj == "iptal" || mesaj == "ıptal") {
return x.edit({content: null, embeds: [new Discord.EmbedBuilder().setDescription(`Başarıyla rol seçim menü oluşturma aracı iptal edildi.`)]}).sil(15)
}
rolSeçim.İsim = mesaj
message.channel.send({content: `:tada: **${message.guild.name}**
Yeni bir rol seçim menüsü oluşturuluyor...`, embeds: [new Discord.EmbedBuilder().setDescription(`
Rol Seçim Menüsü: \`${rolSeçim.İsim}\`
Açıklama: \` Ayarlanmadı! \`
Roller: \` Ayarlanmadı! \`
Yeni oluşturulmakta olan rol seçim menünüze bir açıklama belirtin. Örn: \`Aşağıda ki rollerden istediğiniz rolü alabilirsiniz!\``)]})
.then(async (c) => { 
var filt = m => m.author.id == message.member.id
let collector = c.channel.createMessageCollector({filter: filt, time: 60000, max: 1, errors: ["time"]})
collector.on("collect", async (m) => {
let mesaj = m.content
if(mesaj == "iptal" || mesaj == "ıptal") {
return c.edit({content: null, embeds: [new Discord.EmbedBuilder().setDescription(`Başarıyla rol seçim menü oluşturma aracı iptal edildi.`)]}).sil(15)
}
rolSeçim.Yazı = m.content
c.delete().catch(err => {})
message.channel.send({content: `:tada: **${message.guild.name}**
Yeni bir rol seçim menüsü oluşturuluyor...`, embeds: [new Discord.EmbedBuilder().setDescription(`
Rol Seçim Menüsü: \`${rolSeçim.İsim}\`
Açıklama: \`${rolSeçim.Yazı}\`
Roller: \` Ayarlanmadı! \`
Yeni oluşturulmakta olan rol seçim menünüzde listelenecek rolleri belirtin.`).setFooter({ text:`En az 3 tane, en fazla 25 tane rol ekleyebilirsiniz.`})]}).then(async (v) => {
var filt = m => m.author.id == message.member.id
let collector = msg.channel.createMessageCollector({filter: filt, time: 60000, max: 1, errors: ["time"]})
collector.on("collect", async (m) => {
let mesaj = m.content
if(mesaj == "iptal" || mesaj == "ıptal") {
return v.edit({content: null, embeds: [new Discord.EmbedBuilder().setDescription(`Başarıyla rol seçim menü oluşturma aracı iptal edildi.`)]}).sil(16)
}
v.delete().catch(err => {})
let rolPushing = []
if(m.mentions.roles.size >= 1) {
rolPushing = m.mentions.roles.map(role => role.id)
} else {
let argss = m.content.split(" ");
argss = argss.splice(0)
let rolVerAbime = argss.filter(role => message.guild.roles.cache.some(role2 => role == role2.id))
rolPushing.push(...rolVerAbime)
}
rolSeçim.Roller = rolPushing
message.channel.send({embeds: [new Discord.EmbedBuilder().setDescription(`
Rol Seçim Menüsü: \`${rolSeçim.İsim}\`
Açıklama: \`${rolSeçim.Yazı}\`
Roller: ${rolSeçim.Roller.map(x => message.guild.roles.cache.get(x)).join(", ")}

Başarıyla **${rolSeçim.İsim}** isimli rol seçim menüsü <t:${Math.floor(Date.now() / 1000)}> tarihinde oluşturuldu.`)]}).then(async (oluşturuldu) => {
let secretKodu = oluştur(10)
await Menu.updateOne({İsim: rolSeçim.İsim}, { $set: { "Yazı": rolSeçim.Yazı, "Roller": rolSeçim.Roller, "Date": Date.now(), Secret: secretKodu, "Oluşturan": message.member.id,  }}, {upsert: true})
})})})})})
x.delete().catch(err => {})
})})}})})
    }
}


function oluştur(length) {
var result           = '';
var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var charactersLength = characters.length;
for ( var i = 0; i < length; i++ ) {
result += characters.charAt(Math.floor(Math.random() * charactersLength));
}
return result;
}   
