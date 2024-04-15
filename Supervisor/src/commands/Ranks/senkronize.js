const coin = require("../../schemas/coin");
const Discord = require("discord.js");
const a = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["senkron", "senk"],
name: "senkronize",
help: "senkronize [üye] @Rainha/ID / [role] @Rol/ID",
category: "ustyetkili",
},
exclosive: async (client, message, args, embed) => {
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: `${message.author}, Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`}).sil(15)
if (args[0] === "kişi" || args[0] === "üye") {
const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
if (!member) return message.reply({ embeds: [embed.setDescription("Bir kullanıcı belirtmelisin!")]}).sil(15)
if (client.ranks.some(x => member.hasRole(x.role))) {
let rank = client.ranks.filter(x => member.hasRole(x.role));
rank = rank[rank.length-1];
await coin.findOneAndUpdate({ guildID: a.guildID, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
await coin.findOneAndUpdate({ guildID: a.guildID, userID: member.user.id }, { $inc: { coin: 1 } }, { upsert: true });
message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde **${message.guild.roles.cache.get(rank.role).name}** rolü bulundu ve puanı ${rank.coin} olarak değiştirildi!`)]})
} else return message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde sistemde ayarlı bir rol bulunamadı!`)]}).sil(15)
} else if (args[0] === "role" || args[0] === "rol") {
const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
if (!role) return message.reply({ embeds: [embed.setDescription("Bir rol belirtmelisin!")]}).sil(15)
if (role.members.length === 0) return message.reply({ embeds: [embed.setDescription("Bu rolde üye bulunmuyor!")]}).sil(15)
role.members.forEach(async member => {
if (member.user.bot) return;
if (client.ranks.some(x => member.hasRole(x.role))) {
let rank = client.ranks.filter(x => member.hasRole(x.role));
rank = rank[rank.length-1]; 
await coin.findOneAndUpdate({ guildID: a.guildID, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
await coin.findOneAndUpdate({ guildID: a.guildID, userID: member.user.id }, { $inc: { coin: 1 } }, { upsert: true });
message.channel.send({ embeds: [embed.setDescription(`${member.toString()} üyesinde **${message.guild.roles.cache.get(rank.role).name}** rolü bulundu ve puanı ${rank.coin} olarak değiştirildi!`)]})
} else return message.reply({ embeds: [embed.setDescription(`${member.toString()} üyesinde sistemde ayarlı bir rol bulunamadı!`)]}).sil(15)
});
} else return message.reply({ embeds: [embed.setDescription("Bir argüman belirtmelisin!")]}).sil(15)
}
};