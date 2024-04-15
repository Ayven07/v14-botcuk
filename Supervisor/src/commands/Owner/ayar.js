const Discord = require('discord.js');
const settings = require("../../configs/settings.json");
const emojis = require('../../configs/emojiName.json')
const setups = require('../../schemas/setup')
const moment = require("moment");
moment.locale("tr");
module.exports = {
conf: {
aliases: ["ayar","ayars"],
help: "ayar",
name: "ayar",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})   
if(!ayar) return;

const rows = new Discord.StringSelectMenuBuilder()
.setCustomId(`serversetups`)
.setPlaceholder(`${message.guild.name} Kurulum.`)
.addOptions(
        {
            label: `Hoşgeldin Mesajı Embed`,
            value: `wembed`,
            emoji: `${ayar.welcomeMessageEmbed == false ? message.guild.emojiGöster(emojis.no).id : message.guild.emojiGöster(emojis.yes).id}`
        }, 
        {
            label: `Tag Sistemi`,
            value: `tagsystem`,
            emoji: `${ayar.tagSystem == false ? message.guild.emojiGöster(emojis.no).id : message.guild.emojiGöster(emojis.yes).id}`
        },
        {
            label: `Yaş Sistemi`,
            value: `ageSystem`,
            emoji: `${ayar.ageSystem == false ? message.guild.emojiGöster(emojis.no).id : message.guild.emojiGöster(emojis.yes).id}`
        },
        {
            label: `Oto Kayıt`,
            value: `autoregister`,
            emoji: `${ayar.otoRegister == false ? message.guild.emojiGöster(emojis.no).id : message.guild.emojiGöster(emojis.yes).id}`
        },
        {
            label: `İptal`,
            value: `iptal`,
            emoji: `${message.guild.emojiGöster(emojis.no).id}`
        })
const row = new Discord.ActionRowBuilder()
.addComponents(rows)     
message.reply({embeds: [embed.setDescription(`
**${message.guild.name}** sunucusu ayarlarını bu panelden kontrol edebilirsiniz.Özellikler aşağıda bilgilendirilmiştir.
${message.guild.emojiGöster(emojis.nokta)} **Hoşgeldin Mesajı Embed:** Aktif ettiğinizde hoşgeldin mesajının altında 2 adet buton çıkar bu butonlara basıldığında sunucuya gelen üyenin isimler ve sicil geçmişi gösterilir kolaylık sağlanır.
${message.guild.emojiGöster(emojis.nokta)} **Tag Sİstemi:** Aktif olursa kullanıcın başına tag eklenir ve taglı rolü verilir kapalıysa bu işlemler yapılmaz.
${message.guild.emojiGöster(emojis.nokta)} **Yaş Sistemi:**  Aktif olursa belirlediğiniz yaş sınırı aktif olur o yaşın altındaki üyeler kayıt olmaz.
${message.guild.emojiGöster(emojis.nokta)} **Otomatik Kayıt Sistemi:** Aktif olur ise sunucuda daha önce kayıt olmuş İsim | Yaş bilgisi ve cinsiyeti ile otomatik kayıt olur ve sunucuya giriş sağlar.
`)
.setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
  }
}
