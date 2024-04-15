const a = require("../../configs/settings.json");
const db = require("../../schemas/vrcRoleCommands");
const emojis = require('../../configs/emojiName.json')
const Discord = require("discord.js")
module.exports = {
conf: {
aliases: ["yardım", "help", "y", "help","yardim"],
name: "yardım",
},
exclosive: async (client, message, args, embed, prefix) => {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.StringSelectMenuBuilder()
      .setCustomId('helps')
      .setPlaceholder('Bot komutlarını görüntülemek için tıklayınız!')
      .addOptions([
          {
              label: "Kullanıcı",
              description: 'Kullanıcı komutlarını görüntülemek için tıklayınız.',
              value: 'kullanici',
              emoji: '1170672406327722145',
          },
        {
              label: 'Eğlence',
              description: 'Eğlence komutlarını görüntülemek için tıklayınız.',
              value: 'eglence',
              emoji: '1170672406327722145',
          },
        {
              label: 'Özel Komutlar',
              description: 'Özel Komutları görüntülemek için tıklayınız.',
              value: 'ozelk',
              emoji: '1170672406327722145',
          },
        {
              label: 'Cezalandırma',
              description: 'Cezalandırma komutlarını görüntülemek için tıklayınız.',
              value: 'cezalandirma',
              emoji: '1170672406327722145',
          },
        {
              label: 'Yetkili',
              description: 'Yetkiki komutlarını görüntülemek için tıklayınız.',
              value: 'yetkili',
              emoji: '1170672406327722145',
          },
        {
              label: 'Üst Yetkili',
              description: 'Üst Yetkili komutlarını görüntülemek için tıklayınız.',
              value: 'ustyetkili',
              emoji: '1170672406327722145',
          },
        {
              label: 'Owner',
              description: 'Owner komutlarını görüntülemek için tıklayınız.',
              value: 'owner',
              emoji: '1170672406327722145',
          },
        {
              label: 'İptal',
              description: 'İptal komutlarını görüntülemek için tıklayınız.',
              value: 'iptal',
              emoji: '1137686658779709522',
          },
      ]),
  );    
let res = await db.find({})
var msg = await message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setColor("Random").setDescription(`${message.guild.emojiGöster(emojis.uyari)} **Merhaba ${message.member}, Aşağıdaki Menüden ${message.guild.name} Sunucusunun Bot Komutlarını Görebilirsin.\nToplamda \` ${client.commands.size} \` Komut Bulunmaktadır.**`)], components: [row]})
var filter = (i) => i.user.id === message.author.id;
const collector = msg.createMessageComponentCollector({ filter })
       
collector.on("collect", async (i) => {
if(i.values[0] === "kullanici") {
i.deferUpdate()             
msg.edit({embeds: [embed.setDescription(`${client.commands.filter((x) => x.conf.help && x.conf.category == "kullanici").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${message.guild.emojiGöster(emojis.nokta)} *${prefix}${x.conf.help}*`).splice(0, 300).join("\n")}`)]})           
    }
if(i.values[0] === "eglence") {
i.deferUpdate()             
msg.edit({embeds: [embed.setDescription(`${client.commands.filter((x) => x.conf.help && x.conf.category == "eglence").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${message.guild.emojiGöster(emojis.nokta)} *${prefix}${x.conf.help}*`).splice(0, 300).join("\n")}`)]})           
    }
if(i.values[0] === "ozelk") {
i.deferUpdate()             
msg.edit({embeds: [embed.setDescription(`${res.length > 0 ? res.map(x => `${message.guild.emojiGöster(emojis.nokta)} *${a.prefix}${x.cmdName} @Rainha/ID*`).join("\n") : "Özel Komut Bulunmamakta."}`)]})           
    }
if(i.values[0] === "cezalandirma") {
i.deferUpdate()             
msg.edit({embeds: [embed.setDescription(`${client.commands.filter((x) => x.conf.help && x.conf.category == "cezalandirma").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${message.guild.emojiGöster(emojis.nokta)} *${prefix}${x.conf.help}*`).splice(0, 300).join("\n")}`)]})           
    }
if(i.values[0] === "yetkili") {
i.deferUpdate()             
msg.edit({embeds: [embed.setDescription(`${client.commands.filter((x) => x.conf.help && x.conf.category == "yetkili").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${message.guild.emojiGöster(emojis.nokta)} *${prefix}${x.conf.help}*`).splice(0, 300).join("\n")}`)]})           
    }
if(i.values[0] === "ustyetkili") {
i.deferUpdate()             
msg.edit({embeds: [embed.setDescription(`${client.commands.filter((x) => x.conf.help && x.conf.category == "ustyetkili").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${message.guild.emojiGöster(emojis.nokta)} *${prefix}${x.conf.help}*`).splice(0, 300).join("\n")}`)]})           
    }
if(i.values[0] === "owner") {
i.deferUpdate()             
msg.edit({embeds: [embed.setDescription(`${client.commands.filter((x) => x.conf.help && x.conf.category == "owner").sort((a, b) => b.conf.help - a.conf.help).map((x) => `${message.guild.emojiGöster(emojis.nokta)} *${prefix}${x.conf.help}*`).splice(0, 300).join("\n")}`)]})           
    }
if(i.values[0] === "iptal") {
msg.delete().catch(e => {})
}                                                                      
   })
  } 
}