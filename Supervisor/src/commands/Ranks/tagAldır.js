const Discord = require("discord.js");
const coin = require("../../schemas/coin");
const settings = require("../../configs/settings.json")
const Users = require("../../schemas/users.js");
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["tag-aldır", "tagaldır", "taglı", "tagli", "tagaldir"],
name: "tagAldır",
help: "tagaldır @Rainha/ID",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
const ayars = await setups.findOne({guildID: settings.guildID}) 
if(!ayars) return;
if(ayars.tagSystem == false) return; 
if(settings.coinSystem === false) return message.reply({embeds: [embed.setDescription(`Terfi Sistemi Aktif Değil!`)]}).sil(15)
if (!client.ranks.some((x) => message.member.roles.cache.has(x.role))) return message.react(message.guild.emojiGöster(emojis.no))
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.channel.send({ content:"Bir üye belirtmelisin!"}).sil(15)
return }
if(!ayars.serverTag.some(s => member.user.globalName && member.user.globalName.includes(s))) {
message.reply({embeds: [embed.setDescription(`${member.toString()} isimli üyenin kullanıcı adında tagımız (\`${ayars.serverTag.join(" - ")}\`) olmadığı için tag aldıramazsınız.`)]}).sil(15)
return }
var kontrol = await Users.findOne({_id: member.id})
if(kontrol && kontrol.Tagged) return message.reply({content: `${member} isimli üye zaten bir başkası tarafından taglı olarak belirlenmiş.`}).sil(15)
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onay")
.setLabel("Kabul Et")
.setStyle(Discord.ButtonStyle.Success)
.setEmoji("915754671728132126"),
new Discord.ButtonBuilder()
.setCustomId("red")
.setLabel("Reddet")
.setStyle(Discord.ButtonStyle.Danger)
.setEmoji("920412153712889877"),
);
const row2 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onayy")
.setLabel("İşlem Başarılı")
.setStyle(Discord.ButtonStyle.Success)
.setDisabled(true),
);
const row3 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("redd")
.setLabel("İşlem Başarısız")
.setStyle(Discord.ButtonStyle.Danger)
.setDisabled(true),
);
embed.setFooter({ text: `60 saniye içerisinde butonlara basılmazsa işlem iptal edilecektir.`, iconURL: message.author.avatarURL({ dynamic: true })})
embed.setDescription(`${member.toString()}, ${message.member.toString()} üyesi sana tag aldırmak istiyor. Kabul ediyor musun?`)
const msg = await message.reply({ content: `${member.toString()}`, embeds: [embed], components: [row]});
var filter = button => button.user.id === member.user.id;
var collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async (button) => {
if(button.customId === "onay") {
await button.deferUpdate();
const Embed = new Discord.EmbedBuilder()
Embed.setTimestamp()
Embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Başarıyla ${member.toString()} üyesi ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> taglı olarak belirlendi!`)       
if(settings.coinSystem === true && !client.ranks.some((x) => message.member.roles.cache.has(x.role))) {
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { coin: settings.taggedCoin } }, { upsert: true });
message.member.görevGüncelle(settings.guildID, "tagli", 1, message.channel);
}
await Users.updateOne({ _id: member.id }, { $set: { "Tagged": true, "TaggedGiveAdmin": message.author.id } }, { upsert: true }).exec();
await Users.updateOne({ _id: message.author.id }, { $push: { "Taggeds": { id: member.id, Date: Date.now() } } }, { upsert: true }).exec();    
msg.edit({embeds: [Embed], components : [row2]})  
}
if(button.customId === "red") {
await button.deferUpdate();
const Embeds = new Discord.EmbedBuilder()
Embeds.setTimestamp()
Embeds.setDescription(`${message.guild.emojiGöster(emojis.no)} ${message.author} ${member} Adlı kullanıcı senin taglı aldırma isteğini redetti.`)
msg.edit({ embeds: [Embeds], components : [row3]})
}
});
}
}