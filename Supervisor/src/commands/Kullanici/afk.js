const afk = require("../../schemas/afk");
const Discord = require("discord.js");
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["afk"],
name: "afk",
help: "afk",
category: "kullanici"      
},
exclosive: async (client, message, args, embed, prefix) => {
const sebep = args.join(" ") || "Çok Yakında Geleceğim!";
const erk = await afk.findOne({ userID: message.author.id })
if (erk && erk.reason) return message.reply("Zaten klavyeden uzakta modundasın!").sil(15)
let yasaklar = ["discord.gg/", ".gg/", "discord.gg", "https://discord.gg/"];
if (sebep && yasaklar.some(s => sebep.toLowerCase().includes(s))) {
message.channel.send({ embeds: [embed.setDescription(`Afk sebebine **Reklam** koyamazsın!`)] }).sil(15)
message.delete().catch(e => {})
return; }
if (message.member.manageable) message.member.setNickname(`[AFK] ${message.member.displayName}`).catch(e => {})
await afk.updateOne({ userID: message.author.id }, { $set: {date: Date.now(), reason: sebep } }, { upsert: true });
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({ embeds: [new Discord.EmbedBuilder().setTitle("Klavyeden Uzakta!").setDescription(`${message.author} adlı kullanıcı **${sebep}** sebebi ile klavyeden uzakta modunda!`)] }).sil(20)
}
};
  