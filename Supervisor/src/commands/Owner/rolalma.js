const Discord = require("discord.js");
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["rolpanel"],
help: "rolalma",
name: "rolalma",
owner: true,
category: "owner"
},
exclosive: async (client, message, args) => {
message.delete().catch(e => {})    
const roless = new Discord.StringSelectMenuBuilder()
    .setCustomId("games")
    .setPlaceholder(`Oyun Rolleri`)
    .setMinValues(0)
    .setMaxValues(3)
    .addOptions(
        {
            label: "CS:GO",
            value: "csgo",
            emoji: "1106325654552723587"
        }, 
        {
            label: "League Of Legends",
            value: "lol",
            emoji: "1106325579617284117"
        },
      {
            label: "Valorant",
            value: "valorant",
            emoji: "1106325609199714314"
        },
      {
            label: "Gta V",
            value: "gta5",
            emoji: "1106325692506980493"
        },
      {
            label: "PUBG",
            value: "pubg",
            emoji: "1106325340248359062"
        },
      {
            label: "Fortnite",
            value: "fortnite",
            emoji: "1106325278319444039"
        },
      {
            label: "Among Us",
            value: "amongus",
            emoji: "1106325234916790294"
        },
      {
            label: "Mobile Legends",
            value: "mobilelegends",
            emoji: "1106325157146017953"
        },
      {
            label: "Minecraft",
            value: "minecraft",     
            emoji: "1106325103945449593"
        },
        {
            label: "Rol İstemiyorum",
            value: "rolsil",
            emoji: "🗑️"
        })
    const row2 = new Discord.ActionRowBuilder()
    .addComponents(roless)   						
const rolesss = new Discord.StringSelectMenuBuilder()
    .setCustomId("iliski")
    .setPlaceholder(`İlişki Rolleri`)
    .setMinValues(0)
    .setMaxValues(1)
    .addOptions(
        {
            label: "Sevgilim Var",
            value: "couple",
            emoji: "1106326367131410582"
        }, 
        {
            label: "Sevgilim Yok",
            value: "alone",
            emoji: "1106326237183492166"
        },
        {
            label: "Sevgili Yapmıyorum",
            value: "sy",
            emoji: "1106326565480050799"
        },
        {
            label: "Rol İstemiyorum",
            value: "rolsil",
            emoji: "🗑️"
        })
    const row3 = new Discord.ActionRowBuilder()
    .addComponents(rolesss)      
const rolessss = new Discord.StringSelectMenuBuilder()
    .setCustomId("burc")
    .setPlaceholder(`Burç Rolleri`)
    .setMinValues(0)
    .setMaxValues(1)
    .addOptions(
        {
            label: "Koç",
            value: "koç",
            emoji: "1107227201734193214"
        }, 
        {
            label: "Boğa",
            value: "boğa",
            emoji: "1107227158423818310"
        },
        {
            label: "İkizler",
            value: "ikizler",
            emoji: "1107227193211371630"
        },
       {
            label: "Yengeç",
            value: "yengeç",
            emoji: "1107227310056280116"
        },
       {
            label: "Aslan",
            value: "aslan",
            emoji: "1107227127717318666"
        },
       {
            label: "Başak",
            value: "başak",
            emoji: "1107227142372216872"
        },
       {
            label: "Terazi",
            value: "terazi",
            emoji: "1107227269522526260"
        },
       {
            label: "Akrep",
            value: "akrep",
            emoji: "1107227102819921951"
        },
       {
            label: "Yay",
            value: "yay",
            emoji: "1107227285335060510"
        },
       {
            label: "Oğlak",
            value: "oğlak",
            emoji: "1107227228636450818"
        },
       {
            label: "Kova",
            value: "kova",
            emoji: "1107227211821482064"
        },
       {
            label: "Balık",
            value: "balık",
            emoji: "1107227115721609268"
        },
        {
            label: "Rol İstemiyorum",
            value: "rolsil",
            emoji: "🗑️"
        })
    const row4 = new Discord.ActionRowBuilder()
    .addComponents(rolessss)
    const rolesssss = new Discord.StringSelectMenuBuilder()
    .setCustomId("takim")
    .setPlaceholder(`Takım Rolleri`)
    .setMinValues(0)
    .setMaxValues(1)
    .addOptions(
        {
            label: "Fenerbahçe",
            value: "fb",
            emoji: "1106324063284113418"
        }, 
        {
            label: "Galatasaray",
            value: "gs",
            emoji: "1106324135463890994"
        },
        {
            label: "Beşiktaş",
            value: "bjk",
            emoji: "1106324172717699163"
        },
        {
            label: "Trabzonspor",
            value: "ts",
            emoji: "1106324209006821471"
        },
        {
            label: "Rol İstemiyorum",
            value: "rolsil",
            emoji: "🗑️"
        })
    const row5 = new Discord.ActionRowBuilder()
    .addComponents(rolesssss)         
 const rolessssss = new Discord.StringSelectMenuBuilder()
    .setCustomId("renk")
    .setPlaceholder(`Renk Rolleri`)
    .setMinValues(0)
    .setMaxValues(1)
    .addOptions(
        {
            label: "Siyah",
            value: "siyah",
            emoji: "1154021308183621702"
        }, 
        {
            label: "Mavi",
            value: "mavi",
            emoji: "1154021308183621702"
        },
        {
            label: "Beyaz",
            value: "beyaz",
            emoji: "1154021308183621702"
        },
        {
            label: "Kırmızı",
            value: "kirmizi",
            emoji: "1154021308183621702"
        },
        {
            label: "Sarı",
            value: "sari",
            emoji: "1154021308183621702"
        },
        {
            label: "Pembe",
            value: "pembe",
            emoji: "1154021308183621702"
        },
        {
            label: "Mor",
            value: "mor",
            emoji: "1154021308183621702"
        },
        {
            label: "Turuncu",
            value: "turuncu",
            emoji: "1154021308183621702"
        },
        {
            label: "Yeşil",
            value: "yesil",
            emoji: "1154021308183621702"
        },
        {
            label: "Kahverengi",
            value: "kahverengi",
            emoji: "1154021308183621702"
        },
        {
            label: "Bordo",
            value: "bordo",
            emoji: "1154021308183621702"
        },
        {
            label: "Turkuaz",
            value: "turkuaz",
            emoji: "1154021308183621702"
        },
        {
            label: "Bej",
            value: "bej",
            emoji: "1154021308183621702"
        },
        {
            label: "Lacivert",
            value: "lacivert",
            emoji: "1154021308183621702"
        },      
        {
            label: "Açık Mavi",
            value: "mavitwo",
            emoji: "1154021308183621702"
        },       
        {
            label: "Fıstık Yeşili",
            value: "yesiltwo",
            emoji: "1154021308183621702"
        },        
        {
            label: "Rol İstemiyorum",
            value: "rolsil",
            emoji: "🗑️"
        })
    const row6 = new Discord.ActionRowBuilder()
    .addComponents(rolessssss)           
    const roles = new Discord.StringSelectMenuBuilder()
    .setCustomId("etkinliks")
    .setPlaceholder(`Etkinlik Rolleri`)
    .setMinValues(0)
    .setMaxValues(2)
    .addOptions(
        {
            label: "Etkinlik Katılımcısı",
            value: "etkinlik",
            description: "Etkinliklerden haberdar olmak için tıkla!",
            emoji: "1079036679517634671"
        }, 
        {
            label: "Çekiliş Katılımcısı",
            value: "cekilis",
            description: "Çekilişlerden haberdar olmak için tıkla!",
            emoji: "1107227176861974528"
        },
        {
            label: "Rol İstemiyorum",
            value: "rolsil",
            emoji: "🗑️"
        })
    const row = new Discord.ActionRowBuilder()
    .addComponents(roles)   
message.channel.send({content: `
${message.guild.emojiGöster(emojis.member)} Merhaba **${message.guild.name}** Sunucu Üyeleri, 

${message.guild.emojiGöster(emojis.nokta)} Aşağıda bulunan butonlardan Çekiliş Katılımcısı alarak çekilişlere katılıp **Netflix, Spotify, Nitro** ve benzeri ödüllerin sahibi  olabilirsiniz.

${message.guild.emojiGöster(emojis.nokta)} Aşağıda bulunan butonlardan Etkinlik Katılımcısı alarak **konserlerimizden, oyunlarımızdan, ve etkinliklerimizden** faydalanabilirsiniz.

${message.guild.emojiGöster(emojis.uyari)} ***NOT***: Kayıtlı olarak hepiniz bu kanalı görebilmektesiniz. Bu sunucumuzda everyone here atılmayacağından dolayı kesinlikle rollerinizi almayı unutmayın! || @everyone @here ||`})       
message.channel.send({components: [row]})		
message.channel.send({components: [row2]})		
message.channel.send({components: [row3]})							
message.channel.send({components: [row4]})		
message.channel.send({components: [row5]})		
message.channel.send({components: [row6]})		
}
}