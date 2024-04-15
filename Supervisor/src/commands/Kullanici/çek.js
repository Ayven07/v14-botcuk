const Discord = require("discord.js");
const emojis = require('../../configs/emojiName.json')
const moment = require("moment");
moment.locale("tr");
module.exports = {
conf: {
aliases: ["çek", "cek"],
name: "çek",
help: "çek @Rainha/ID",
category: "kullanici"    
},
exclosive: async (client, message, args, embed, prefix) => {
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if (!message.member.voice.channel) {
return message.reply({ content: "Bir ses kanalında olmalısın!" }).sil(15)
}
if (!member) {
return message.reply({ content: "Bir üye etiketle ve tekrardan dene!" }).sil(15)
}
if (!member.voice.channel) {
return message.reply({ content: "Bu kullanıcı herhangi bir ses kanalında bulunmuyor!" }).sil(15)
}
if (message.member.voice.channel === member.voice.channel) {
return message.reply({ content: "Zaten aynı kanaldasınız!" }).sil(15)
}
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onay")
.setLabel("Kabul Et")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("915754671728132126"),
new Discord.ButtonBuilder()
.setCustomId("red")
.setLabel("Reddet")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("920412153712889877"),
);


const row2 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("redd")
.setLabel("İşlem Başarısız")
.setStyle(Discord.ButtonStyle.Secondary)
.setDisabled(true),
);

const row3 = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("onayy")
.setLabel("İşlem Başarılı")
.setStyle(Discord.ButtonStyle.Secondary)
.setDisabled(true),
);

if (message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
member.voice.setChannel(message.member.voice.channel.id);
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 })).setDescription(`${message.author} ${member} kişisini yanınıza taşıdınız.`)] });
} else {
let Rainha = new Discord.EmbedBuilder()  
.setDescription(`${member}, ${message.author} seni \`${message.member.voice.channel.name}\` odasına çekmek istiyor. Kabul ediyor musun?`)
.setFooter({ text: `Lütfen 30 saniye içerisinde işlem iptal edilecektir.`})
.setAuthor({ name: member.displayName, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
let msg = await message.channel.send({ content: `${member}`, embeds: [Rainha], components: [row] })
var filter = button => button.user.id === member.user.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (button) => {
if (button.customId === "onay") {
await button.deferUpdate();
const embeds = new Discord.EmbedBuilder()
.setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true }) })
.setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
.setTimestamp()
.setDescription(`${message.author}, ${member} kişisini yanınıza taşıdınız.`)
member.voice.setChannel(message.member.voice.channel.id);
msg.edit({ embeds: [embeds], components: [row3] })
}
if (button.customId === "red") {
await button.deferUpdate();
const embedss = new Discord.EmbedBuilder()
.setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
.setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
.setTimestamp()
 .setDescription(`${message.author}, ${member} yanına taşıma işlemi iptal edildi.`)
msg.edit({ embeds: [embedss], components: [row2] })
}
      });
    }
  }
}