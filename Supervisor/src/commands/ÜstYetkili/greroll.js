const { PermissionsBitField, Discord, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const giveaway = require('../../schemas/giveaway.js')
const moment = require("moment");
const emojis = require('../../configs/emojiName.json')
const ms = require("ms")
module.exports = {
conf: {
aliases: ["reroll", "greroll"],
name: "greroll",
help: "greroll [Mesaj ID]",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed, prefix) => {
if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !message.member.roles.cache.some(r => r.name === "Sponsor")) {
return message.reply({ content: `Yeterli Yetkin Bulunmamakta.`}).sil(15)
}
let mesaj = args[0]
if (isNaN(mesaj)) return message.reply({ content: `Lütfen komutu doğru kullan! ${prefix}.greroll [Mesaj-ID]`}).sil(15)
let data = await giveaway.findOne({ messageID: mesaj });
if (!data) return message.reply({ content: `Mesaj ID'sinde datada veri bulunamadı.` }).sil(15)
let arr = data.katilan;
let random = arr[Math.floor(Math.random() * arr.length)]
if(data.katilan.length <= 1) return;
message.channel.send({ content: `${message.guild.emojiGöster(emojis.konfeti)} <@${random}> tebrikler **${data.odul ? data.odul : "Bulunamadı."}** kazandın!` })
message.channel.send({embeds: [new EmbedBuilder().setTitle(`${message.guild.emojiGöster(emojis.konfeti)} Kazanan Tekrar Seçildi ${message.guild.emojiGöster(emojis.konfeti)}`).setFooter({ text : `Katılımcı Sayısı: ${arr.length}` }).setDescription(`${message.guild.emojiGöster(emojis.konfeti)} Çekiliş kazananı yeniden seçildi!\nÇekilişi Tekrarlatan: ${message.author}\n\nKazanan Katılımcı: <@${random}>`)], components: []})    
  },
};