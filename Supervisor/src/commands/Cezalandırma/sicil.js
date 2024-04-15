const moment = require("moment");
moment.locale("tr");
const Discord = require("discord.js");
const emojis = require('../../configs/emojiName.json')
const penals = require("../../schemas/penals");
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["sicil"],
name: "sicil",
help: "sicil @Rainha/ID",
category: "cezalandirma"
},
exclosive: async (client, message, args, embed) => {
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
let data = await penals.find({ guildID: settings.guildID, userID: member.user.id, }).sort({ date: -1 });
if (data.length === 0) return message.reply({ content:`${message.guild.emojiGöster(emojis.yes)} ${member.toString()} üyesinin sicili temiz!`}).then((e) => setTimeout(() => { e.delete(); }, 15000));
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
    data = data.map((x, index) => `\`${index+1}\` (\`${x.type}\`) <t:${Math.floor(x.date / 1000)}> tarihinde <@${x.staff}> tarafından \`${x.reason}\` sebebiyle cezalandırıldı.`)
    let page = 1;
    let liste = data
    const Rainha = embed
    .setAuthor({ name: `${member.user.globalName ? member.user.globalName : member.user.tag} üyesinin ceza bilgileri;`, iconURL: member.user.avatarURL({dynamic: true})})
    .setDescription(`${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}`)
    .setFooter({text: `Sayfa • ${page}`})    
    .setThumbnail(member.user.avatarURL({ dynamic: true }))

   var msg = await message.reply({ embeds: [Rainha], components: [row]});
 var filter = (button) => button.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })
       
        collector.on("collect", async (button) => {
              
        if (liste.length > 10) {

       if(button.customId === "sonra") {
        await button.deferUpdate();

                    if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                    page += 1;
                    let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit({ embeds: [embed.setAuthor({ name: `${member.user.displayName} üyesinin ceza bilgileri;`, iconURL: member.user.displayAvatarURL({ dynamic: true }) }).setThumbnail(member.user.avatarURL({ dynamic: true })).setColor("Random").setDescription(`${rollogVeri}`).setTimestamp().setFooter({text: `Sayfa • ${page}`})]});
                }
        
       if(button.customId === "önce") {
        await button.deferUpdate();

                    if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                    page -= 1;
                    let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit({ embeds: [embed.setAuthor({ name: `${member.user.displayName} üyesinin ceza bilgileri;`, iconURL: member.user.displayAvatarURL({ dynamic: true })}).setThumbnail(member.user.avatarURL({ dynamic: true })).setColor("Random").setDescription(`${rollogVeri}`).setTimestamp().setFooter({text: `Sayfa • ${page}`})]});
                }
       
       if(button.customId === "kapat") {
        await button.deferUpdate();
        row.components[0].setDisabled(true) 
        row.components[1].setDisabled(true) 
        row.components[2].setDisabled(true) 
        msg.edit({ components: [row] }); 
                     }
            }
          })
  },
};