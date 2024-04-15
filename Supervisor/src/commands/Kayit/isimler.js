const nameData = require("../../schemas/names")
const moment = require("moment")
moment.locale("tr")
const emojis = require('../../configs/emojiName.json')
const setups = require("../../schemas/setup")
const Discord = require("discord.js");
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: [],
name: "isimler",
help: "isimler @Rainha/ID",
category: "kayit"
},
exclosive: async (client, message, args, embed, prefix) => { 
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
if(!ayar.registerRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:`Yetkin bulunmamakta.\Yetkili olmak istersen başvurabilirsin.`}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
return }
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
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
    const data = await nameData.findOne({ userID: member.user.id });
    if(!data) return message.reply({embeds: [embed.setDescription(`${member} Adlı Kullanıcı Daha Önce Kayıt Olmamış!`)]})
  let page = 1;
    let isim = data.names.sort((a, b) => b.tarih - a.tarih)
    let liste = isim.map((x, index) => `\` ${index+1}. \` **${x.name}** (${x.rol}) <@${x.yetkili}> [ <t:${Math.floor(x.date / 1000)}:R> ]`)
    const Rainha = embed
    .setAuthor({ name: `${member.user.displayName} üyesinin isim bilgileri; `, iconURL: member.user.avatarURL({dynamic: true})})
    .setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
    .setDescription(`${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}`)
    .setFooter({text: `Sayfa • ${page}`})
   var msg = await message.reply({ embeds: [Rainha], components: [row]});
 var filter = (button) => button.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })  
        collector.on("collect", async (button) => {
              
        if (liste.length > 10) {

       if(button.customId === "sonra") {
        await button.deferUpdate();

                    if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                    page += 1;
                    let isimVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${isimVeri}`).setTimestamp().setAuthor({ name: `${member.user.displayName} üyesinin isim bilgileri;`, iconURL: member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`})]});
                }
        
       if(button.customId === "önce") {
        await button.deferUpdate();

                    if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                    page -= 1;
                    let isimVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    msg.edit({ embeds: [new Discord.EmbedBuilder().setDescription(`${isimVeri}`).setTimestamp().setAuthor({ name: `${member.user.displayName} üyesinin isim bilgileri;`, iconURL: member.user.avatarURL({ dynamic: true  })}).setFooter({text: `Sayfa • ${page}`})]});
                }
       
       if(button.customId === "kapat") {
        await button.deferUpdate();
        msg.delete().catch(e => {});
       }
            }
          })
  }
};