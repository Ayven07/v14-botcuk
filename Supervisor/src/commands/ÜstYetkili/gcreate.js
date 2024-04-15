const { PermissionsBitField, ButtonStyle, Discord, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const giveaway = require('../../schemas/giveaway')
const moment = require("moment");
const emojis = require('../../configs/emojiName.json')
const ms = require("ms")
module.exports = {
conf: {
aliases: ["giveaway", "gstart", "çekiliş", "cekilis"],
name: "gcreate",
help: "çekiliş 10m 1 Nitro",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed, prefix) => {
if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !message.member.roles.cache.some(r => r.name === "Sponsor")) {
return message.reply({ content: `Yeterli Yetkin Bulunmamakta.`}).sil(15)
}
let zaman = args[0]
let kazanan = args[1]
let oduls = args.slice(2).join(" ");
let arr = [];
if (!zaman) return message.reply({ content: `Lütfen komutu doğru kullan! ${prefix}çekiliş 10m 1 Nitro`}).sil(15)
if (!kazanan) return message.reply({ content: `Lütfen komutu doğru kullan! ${prefix}çekiliş 10m 1 Nitro`}).sil(15)
if (isNaN(kazanan)) return message.reply({ content: `Lütfen komutu doğru kullan! ${prefix}çekiliş 10m 1 Nitro` }).sil(15)
if (!oduls) return message.reply({ content: `komutu doğru kullan! ${prefix}.çekiliş 10m 1 Nitro` }).sil(15)
let sure = ms(zaman)
let kalan = Date.now() + sure
if (message) message.delete().catch(e => {})
let gcreate = new ButtonBuilder()
.setCustomId("katil")
.setStyle(ButtonStyle.Secondary)
.setEmoji("1141806054611619861")  
const row = new ActionRowBuilder()
.addComponents([gcreate]);
let msg = await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`${message.guild.emojiGöster(emojis.konfeti)} ${oduls} ${message.guild.emojiGöster(emojis.konfeti)}`).setFooter({ text : `Kazanacak kişi sayısı: ${kazanan} | Bitiş Süresi: ${moment(kalan).format("LLL")}` }).setDescription(`Katılmak için ${message.guild.emojiGöster(emojis.konfeti)} tıklayın!\nSüre: <t:${Math.floor(kalan / 1000)}:R> (<t:${Math.floor(kalan / 1000)}:f>)\nBaşlatan: ${message.author}`)], components: [row]})
await giveaway.updateOne({ messageID: msg.id }, { $set: { odul: oduls } }, { upsert: true })
setTimeout(() => {    
if (arr.length <= kazanan) {
if (msg) msg.edit({embeds: [new EmbedBuilder().setTitle(`${message.guild.emojiGöster(emojis.konfeti)} ${oduls} ${message.guild.emojiGöster(emojis.konfeti)}`).setDescription(`${message.guild.emojiGöster(emojis.konfeti)} Çekilişe katılım olmadığından çekiliş iptal edildi!`)], components: []})
return; }  
let kazananSayisi = Math.min(kazanan, arr.length);
let kazananlar = [];
for(let i = 0; i < kazananSayisi; i++) {
let index = Math.floor(Math.random() * arr.length);
kazananlar.push(arr[index]);
arr.splice(index, 1);
}
kazananlar.forEach(kazanan => {
message.channel.send({ content: `${message.guild.emojiGöster(emojis.konfeti)} <@${kazanan}> tebrikler! **${oduls}** kazandın.` });
});
if (msg) msg.edit({embeds: [new EmbedBuilder().setTitle(`${message.guild.emojiGöster(emojis.konfeti)} ${oduls} ${message.guild.emojiGöster(emojis.konfeti)}`).setFooter({ text : `Katılımcı Sayısı: ${arr.length + kazananlar.length}` }).setDescription(`${message.guild.emojiGöster(emojis.konfeti)} Çekiliş Sonuçlandı!\nÇekilişi Başlatan: ${message.author}\n\nKazanan Katılımcılar: ${kazananlar.map(k => `<@${k}>`).join(", ")}`)], components: []})
}, sure)
let collector = await msg.createMessageComponentCollector({})
collector.on("collect", async (button) => {
button.deferUpdate(true)
if (button.customId == "katil") {
let tikdata = await giveaway.findOne({ messageID: button.message.id })
if (tikdata?.katilan.includes(button.member.id)) return;
await giveaway.updateOne({ messageID: msg.id }, { $push: { katilan: button.member.id } }, { upsert: true })
arr.push(button.member.id)
let kuran = tikdata?.katilan.length + 1 || 1
gcreate.setLabel(`${kuran}`)
if (msg) msg.edit({embeds: [new EmbedBuilder().setTitle(`${message.guild.emojiGöster(emojis.konfeti)} ${oduls} ${message.guild.emojiGöster(emojis.konfeti)}`).setFooter({ text : `Kazanacak kişi sayısı: ${kazanan} | Bitiş Süresi: ${moment(kalan).format("LLL")}` }).setDescription(`Katılmak için ${message.guild.emojiGöster(emojis.konfeti)} tıklayın!\nSüre: <t:${Math.floor(kalan / 1000)}:R> (<t:${Math.floor(kalan / 1000)}:f>)\nBaşlatan: ${message.author}\n\nKatılımcı Sayısı: ${kuran}\nSon Katılan Üye: ${button.member}`)], components: [row]})
}
})
},
};