const coin = require("../../schemas/coin");
const settings = require("../../configs/settings.json");
module.exports = {
conf: {
aliases: ["coin", "puan"],
name: "puan",
help: "puan [ekle/sil] [kullanıcı] [sayı]",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed, prefix) => {
if(settings.coinSystem === false) return message.reply({embeds: [embed.setDescription(`Terfi Sistemi Aktif Değil!`)]}).sil(15)
const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
if (!member) return message.channel.send({ content:"Bir kullanıcı belirtmelisin!"}).sil(15)
if (args[0] === "ekle" || args[0] === "add") {
if (!message.member.permissions.has(8n)) return;
const count = parseInt(args[2]);
if (!count) return message.channel.send({ content:"Eklemek için bir sayı belirtmelisin!"}).sil(15)
if (!count < 0) return message.channel.send({ content:"Eklenecek sayı 0'dan küçük olamaz!"}).sil(15)
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { coin: count } }, { upsert: true });
const coinData = await coin.findOne({ guildID: settings.guildID, userID: member.user.id });
let addedRoles = "";
if (coinData && client.ranks.some(x => coinData.coin >= x.coin && !member.roles.cache.has(x.role))) {
const roles = client.ranks.filter(x => coinData.coin >= x.coin && !member.roles.cache.has(x.role));
addedRoles = roles;
member.roles.add(roles[roles.length-1].role).catch(e => {})
embed.setColor("Random");
const channel = await client.kanalBul("rank-log")
channel.send({ embeds: [embed.setDescription(`${member.toString()} üyesine ${message.member.toString()} tarafından **${count}** adet puan eklendi ve kişiye ${roles.filter(x => roles.indexOf(x) === roles.length-1).map(x => `<@&${x.role}>`).join("\n")} rolleri verildi!`)]});
}
message.channel.send({ embeds: [embed.setDescription(`Başarıyla ${member.toString()} kullanıcısına **${count}** adet puan eklendi! \n\n${addedRoles.length > 0 ? `Verilen roller: \n${addedRoles.filter(x => addedRoles.indexOf(x) === addedRoles.length-1).map(x => `<@&${x.role}>`).join("\n")}` : ""}`)]});
} else if (args[0] === "sil" || args[0] === "remove") {
if (!message.member.permissions.has(8n)) return;
const count = Number(args[2]);
if (!count) return message.channel.send({ content:"Çıkarılacak için bir sayı belirtmelisin!"}).sil(15)
if (!count < 0) return message.channel.send({ content:"Çıkarılacak sayı 0'dan küçük olamaz!"}).sil(15)
let coinData = await coin.findOne({ guildID: settings.guildIDd, userID: member.user.id });
if (!coinData || coinData && count > coinData.coin) return message.channel.send({ content:"Çıkarmak istediğiniz sayı, kişinin mevcut puanından büyük olamaz!"}).sil(15)
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { coin: -count } }, { upsert: true });
coinData = await coin.findOne({ guildID: settings.guildID, userID: member.user.id });
let removedRoles = "";
if (coinData && client.ranks.some(x => coinData.coin < x.coin && member.roles.cache.has(x.role))) {
const roles = client.ranks.filter(x =>  coinData.coin < x.coin && member.roles.cache.has(x.role));
removedRoles = roles;
roles.forEach(x => {
member.roles.remove(x.role).catch(e => {})
});
embed.setColor("Random");
channel.send({ embeds: [embed.setDescription(`${member.toString()} üyesinden ${message.member.toString()} tarafından **${count}** adet puan çıkarıldı ve kişiden ${roles.map(x => `<@&${x.role}>`).join(", ")} rolleri alındı!`)]});
}
message.channel.send({ embeds: [embed.setDescription(`Başarıyla ${member.toString()} kullanıcısından **${count}** adet puan çıkarıldı! \n\n${removedRoles.length > 0 ? `Alınan roller: \n${removedRoles.map(x => `<@&${x.role}>`).join("\n")}` : ""}`)]});
} 
}
};