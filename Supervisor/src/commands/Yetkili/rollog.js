const Discord = require('discord.js');
const roller = require("../../schemas/rollog");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
module.exports = {
conf: {
aliases: ["rollog"],
name: "rollog",
help: "rollog @Rainha/ID",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("önce")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1137686672709005322"),
new Discord.ButtonBuilder()
.setCustomId("kapat")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1137686658779709522"),
new Discord.ButtonBuilder()
.setCustomId("sonra")
.setStyle(Discord.ButtonStyle.Secondary)
.setEmoji("1137686676278362204"),
);
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.ViewAuditLog)) return;
const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const Veri = await roller.findOne({ user: Member.id });
if (!Veri) return message.reply({ content: "<@" + Member.id + "> kişisinin rol bilgisi veritabanında bulunmadı."})
let page = 1;
let rol = Veri.roller.sort((a, b) => b.tarih - a.tarih)
let liste = rol.map(x => `**[${x.state == "Ekleme" ? "Ekleme" : "Kaldırma" }]** <@${x.mod}>: <@&${x.rol}> - <t:${Math.floor(x.tarih / 1000)}:R>`)
var msg = await message.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}`).setTimestamp().setAuthor({ name: `${Member.user.displayName} üyesinin rol geçmişi;`, iconURL: Member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`}).setThumbnail(Member.user.avatarURL({ dynamic: true }))], components: [row]});
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async (button) => {       
if (liste.length > 10) {
if(button.customId === "sonra") {
await button.deferUpdate();
if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
page += 1;
let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${rollogVeri}`).setTimestamp().setAuthor({ name: `${Member.user.displayName} üyesinin rol geçmişi;`, iconURL: Member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`}).setThumbnail(Member.user.avatarURL({ dynamic: true }))]});
}   
if(button.customId === "önce") {
await button.deferUpdate();
if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
page -= 1;
let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${rollogVeri}`).setTimestamp().setAuthor({ name: `${Member.user.displayName} üyesinin rol geçmişi;`, iconURL: Member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`}).setThumbnail(Member.user.avatarURL({ dynamic: true }))]});
}
if(button.customId === "kapat") {
await button.deferUpdate();
await msg.delete().catch(e => {});
}
}
})
},
};