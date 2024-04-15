const Discord = require('discord.js');
const settings = require("../../configs/settings.json")
const moment = require("moment")
moment.locale("tr")
const emojis = require('../../configs/emojiName.json')
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: ["tag-say"],
name: "tagsay",
help: "tagsay",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed, prefix) => { 
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;  
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator))
{
message.reply({ content:"Bu işlemi yapamazsın dostum!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return;
}
const ServerTag = args.slice(0).join(" ") || ayars.serverTag;
let page = 1;
const memberss = message.guild.members.cache.filter((member) => ayars.serverTag.some(x => member.user.globalName && member.user.globalName.includes(x) || member.user.username.includes(x)) && !member.user.bot);
let liste = memberss.map((member) => `${member} - \`${member.user.globalName ? member.user.globalName : member.user.tag}\``) || `**${ServerTag}** taglı kullanıcı yok`
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
var msg = await message.channel.send({ embeds: [embed.setDescription(`Kullanıcı adında **${ServerTag}** tagı olan **${memberss.size}** kişi bulunuyor:\n\n ${liste.slice(page == 1 ? 0 : page * 40 - 40, page * 40).join('\n')}`)], components: [row]});
var filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })    
collector.on("collect", async (button) => {           
if (liste.length > 40) {
if(button.customId === "sonra") {
await button.deferUpdate();
if (liste.slice((page + 1) * 40 - 40, (page + 1) * 40).length <= 0) return;
page += 1;
let tagsay = liste.slice(page == 1 ? 0 : page * 40 - 40, page * 40).join("\n");
msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`Kullanıcı adında **${ServerTag}** tagı olan **${memberss.size}** kişi bulunuyor:\n\n${tagsay}`)] });
}
if(button.customId === "önce") {
await button.deferUpdate();
if (liste.slice((page - 1) * 40 - 40, (page - 1) * 40).length <= 0) return;
page -= 1;
let tagsay = liste.slice(page == 1 ? 0 : page * 40 - 40, page * 40).join("\n");
msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`Kullanıcı adında **${ServerTag}** tagı olan **${memberss.size}** kişi bulunuyor:\n\n${tagsay}`)] });
}
}
if(button.customId === "kapat") {
await button.deferUpdate();
if(msg) msg.delete().catch(e => {})
}          
})
}
}