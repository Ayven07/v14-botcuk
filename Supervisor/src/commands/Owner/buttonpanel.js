const Discord = require('discord.js');
const moment = require("moment");
moment.locale("tr");
module.exports = {
conf: {
aliases: ["buttonpanel","panel"],
help: "buttonpanel",
name: "buttonpanel",
owner: true,
category: "owner"
},
exclosive: async (client, message, args) => {
message.delete().catch(e => {})   
const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("levelss")
            .setEmoji("1️⃣")
            .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
            .setCustomId("aylikss")
            .setEmoji("2️⃣")
            .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
            .setCustomId("basvuru")
            .setEmoji("3️⃣")
            .setStyle(Discord.ButtonStyle.Secondary)
          );
         const row2 = new Discord.ActionRowBuilder()
        .addComponents(
        new Discord.ButtonBuilder()
            .setCustomId("böneri")
            .setEmoji("4️⃣")
            .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
            .setCustomId("bsorun")
           .setEmoji("5️⃣")
            .setStyle(Discord.ButtonStyle.Secondary),
       new Discord.ButtonBuilder()
            .setCustomId("boosters")
           .setEmoji("6️⃣")
            .setStyle(Discord.ButtonStyle.Secondary)
          );
  const row3 = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("levels")
            .setEmoji("7️⃣")
            .setStyle(Discord.ButtonStyle.Secondary),
       new Discord.ButtonBuilder()
            .setCustomId("ayliks")
            .setEmoji("8️⃣")
            .setStyle(Discord.ButtonStyle.Secondary),
       new Discord.ButtonBuilder()
            .setCustomId("yardimss")
            .setEmoji("9️⃣")
            .setStyle(Discord.ButtonStyle.Secondary),
             );
message.channel.send({content:`
**:reminder_ribbon: ${message.guild.name}** Sunucunun Kısayolları;**

\` 1. \` Level Bilgileri
\` 2. \` Aylık Bilgileri
\` 3. \` Yetkili Başvurusu
\` 4. \` Öneri Talebi
\` 5. \` Şikayet Talebi
\` 6. \` Adımı Değiştir (Sadece Booster)
\` 7. \` Level Rolünü Aç/Kapat 
\` 8. \` Aylık , Yıllık Üye Rollerini Aç/Kapat
\` 9. \` Bot Yardım Komutu

:star: **Level Sistemi;**
Sunucuda olan aktifliğinize göre çalışan bu sistem sizin mesaj , ses , yayın gibi faliyetlerinize göre rol vermeyi amaçlar sunucuda toplam **10** adet level rolü bulunmaktadır bu roller sırasıyla sizlere verilir birinci olanlara ise çeşitli ödüllendirilmeler yapılır. Eğer üstünüzde bu rollerin olmasını istermiyorsanız aşağıdaki \` 7. \` numaralı butondan kapatıp açabilirsiniz. 

🎖️ **Üyelik Süresi;**
Sunucumuza giriş tarihinizden itibaren hesaplanılan süre zarfında sizlere çeşitli **Aylık , Yıllık** rolleri verilir. Bu rolleri üzerinizde taşımak istermiyorsanız \` 8. \` numaralı butondan açıp kapatabilirsiniz.

🪙 **Coin Sistemi; **

**Sunucumuzda aktif olan coin sistemi sizler için eğlence amaçlı yapılmıştır. Coininiz ile marketimizden her hangi bir şey satın alabilirsiniz.
`, components: [row, row2, row3]})       
  
  }
};
