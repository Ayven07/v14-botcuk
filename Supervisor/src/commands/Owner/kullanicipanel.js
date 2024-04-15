const Discord = require('discord.js');
const moment = require("moment");
moment.locale("tr");
module.exports = {
conf: {
aliases: ["kpanel"],
help: "kullanicipanel",
name: "kullanicipanel",
owner: true,
category: "owner"
},
exclosive: async (client, message, args) => {
message.delete().catch(e => {})   
const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("katilma")
            .setLabel("1")
            .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
            .setCustomId("rol")
            .setLabel("2")
            .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
            .setCustomId("acilis")
            .setLabel("3")
            .setStyle(Discord.ButtonStyle.Primary)
          );
         const row2 = new Discord.ActionRowBuilder()
        .addComponents(
        new Discord.ButtonBuilder()
            .setCustomId("invite2")
            .setLabel("4")
            .setStyle(Discord.ButtonStyle.Primary),
          new Discord.ButtonBuilder()
            .setCustomId("kayit")
            .setLabel("5")
            .setStyle(Discord.ButtonStyle.Primary),
       new Discord.ButtonBuilder()
            .setCustomId("sunucu")
            .setLabel("6")
            .setStyle(Discord.ButtonStyle.Primary)
          );
  const row3 = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("isim")
            .setLabel("7")
            .setStyle(Discord.ButtonStyle.Primary),
       new Discord.ButtonBuilder()
            .setCustomId("mesaj5")
            .setLabel("8")
            .setStyle(Discord.ButtonStyle.Primary),
       new Discord.ButtonBuilder()
            .setCustomId("ses5")
            .setLabel("9")
            .setStyle(Discord.ButtonStyle.Primary),
             );
message.channel.send({content:`:tada: **Aşağıdaki menüden kendinize bir işlem seçip sunucu içi depolanan verilerinizi sorgulayabilirsiniz. Verileriniz sadece sizin görebileceğiniz şekilde gönderilir.**\n\n**\` 1 \`: Sunucuya giriş tarihinizi öğrenin.\n\` 2 \`: Üstünüzde bulunan rollerin listesini alın.\n\` 3 \`: Hesabınızın açılış tarihini öğrenin.\n\n\` 4 \`: Davet bilgilerinizi öğrenin.\n\` 5 \`: Tekrardan sesli kayıt olun.\n\` 6 \`: Geçmiş cezalarınızı görüntüleyin.\n\n\` 7 \`: Sunucudaki isim bilgilerinizi görüntüleyin.\n\` 8 \`: Sunucudaki toplam mesaj sayınızı öğrenin.\n\` 9 \`: Sunucu ses kanallarında toplam geçirdiğiniz süreyi öğrenin.**\n`, components: [row, row2, row3]})       
  
  }
};

  