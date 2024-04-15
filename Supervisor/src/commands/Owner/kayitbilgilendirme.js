const Discord = require("discord.js");
module.exports = {
conf: {
aliases: ["kayıtbilgilendirme"],
name: "kayitbilgilendirme",
help: "kayıtbilgilendirme",
owner: true,
category: "owner"
},

exclosive: async (client, message, args) => {
const row = new Discord.ActionRowBuilder()
		.addComponents(     
		new Discord.ButtonBuilder()
        .setCustomId("kurallar")
        .setLabel("Kuralları Oku")
        .setEmoji("1058336259967291452")
        .setStyle(Discord.ButtonStyle.Secondary),
    new Discord.ButtonBuilder()
        .setCustomId("booster")
        .setLabel("Booster Bilgi")
        .setEmoji("1036589354484764682")
        .setStyle(Discord.ButtonStyle.Danger),
    new Discord.ButtonBuilder()
        .setCustomId("tag")
        .setLabel("Tag Bilgi")
        .setEmoji("1058336305240612954")
        .setStyle(Discord.ButtonStyle.Danger),
    new Discord.ButtonBuilder()
        .setCustomId("reklam")
        .setLabel("Reklam Bilgi")
        .setEmoji("1058336359883997224")
        .setStyle(Discord.ButtonStyle.Secondary),   
        );
const Embed = new Discord.EmbedBuilder() 
message.channel.send({embeds: [Embed.setColor("#2f3136").setDescription(`👋 Türkiye'nin en kaliteli sohbet sunucusu olan **${message.guild.name}** sunucusuna hoş geldiniz! \n\nSunucumuza daha hızlı adapte olabilmek için aşağıdaki interaktif butonlardan yararlanabilirsiniz. \n\nYan tarafta bulunan Kayıt odaları sayesinde sunucumuza kayıt olabilirsiniz.`)], components: [row]})        
  
  },
};

 

 