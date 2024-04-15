const moment = require("moment");
require("moment-duration-format");
const client = global.client;
const Users = require("../../schemas/users")
const tasks = require("../../schemas/tasks.js");
const messageUserChannel = require("../../schemas/messageUserChannel");
const settings = require("../../configs/settings.json");
const voiceUserParent = require("../../schemas/voiceUserParent");
const voiceUser = require("../../schemas/voiceUser");
const emojis = require('../../configs/emojiName.json')
const coin = require("../../schemas/coin");
const a = require("../../configs/settings.json")
const Discord = require("discord.js");
const setups = require('../../schemas/setup')
module.exports = {
conf: {
aliases: ["ystat", "yetkim"],
name: "yetkim",
help: "ystat @Rainha/ID",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;  
if(settings.coinSystem === false) return message.reply({embeds: [embed.setDescription(`Terfi Sistemi Aktif Değil!`)]}).sil(15)
if(!client.ranks.some((x) => message.member.roles.cache.has(x.role)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ayars.staffRoles.some((x) => message.member.roles.cache.has(x))) return message.react(message.guild.emojiGöster(emojis.no))
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
if(!client.ranks.some((x) => member.roles.cache.has(x.role))) return message.react(message.guild.emojiGöster(emojis.no))
const msj = await message.reply({embeds: [embed.setDescription(`${message.guild.name} sunucusunda ${member} kullanıcısına ait veriler yükleniyor. Lütfen bekleyin!`)]})
const voiceData = await voiceUser.findOne({ guildID: a.guildID, userID: member.id });
const coinData = await coin.findOne({ guildID: a.guildID, userID: member.id });
const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];
const udb = await Users.findOne({ _id: member.id })

const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;

    const category = async (parentsArray) => {
        const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.user.id });
        const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
        let voiceStat = 0;
        for (var i = 0; i <= voiceUserParentData.length; i++) {
          voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
        }
        return moment.duration(voiceStat).format("H [saat], m [dakika]");
      };
      let currentRank = client.ranks.filter(x => (coinData ? coinData.coin : 0) >= x.coin);
      currentRank = currentRank[currentRank.length-1];

      const coinStatus = message.member.hasRole(conf.staffs, false) && client.ranks.length > 0 ?
      `${currentRank ?`
      ${currentRank !== client.ranks[client.ranks.length-1] ? `Şu an ${Array.isArray(currentRank.role) ? currentRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${currentRank.role}>`} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin-coinData.coin}\` puan daha kazanmanız gerekiyor!` : "Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz. :)"}` : ` 
      Şuan ${message.member.roles.highest} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin - (coinData ? coinData.coin : 0)}\`  Puan daha kazanmanız gerekiyor!`}` : ""
      
    var PuanDetaylari = new ButtonBuilder()
    .setLabel("Yetki Puan")
    .setCustomId("puan_detaylari")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("907014785386840075")

    var GenelPuanDetaylari = new ButtonBuilder()
    .setLabel("Ceza Puan")
    .setCustomId("ceza_puan_detaylari")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("943107807312482304")

    var Iptal = new ButtonBuilder()
    .setLabel("İptal")
    .setCustomId("iptal_button")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("920412153712889877")

    const row = new ActionRowBuilder()
    .addComponents([PuanDetaylari, GenelPuanDetaylari, Iptal])

embed.setDescription(`${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri aşağıda belirtilmiştir.`)
.addFields(
{ name: "__**Toplam Ses**__",  value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },
{ name: "__**Toplam Mesaj**__",  value: `\`\`\`fix\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\``, inline: true },
{ name:"__**Toplam Kayıt**__",  value: `\`\`\`fix\n${toplamData ? `${toplamData.toplams.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
)
.addFields(
{ name: "__**Toplam Davet**__", value: `\`\`\`fix\n${inviterData ? `${total} regular`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
{ name: "__**Toplam Taglı**__", value: `\`\`\`fix\n${taggedData ? `${taggedData.taggeds.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
{ name: "__**Toplam Yetkili**__", value: `\`\`\`fix\n${yetkiData ? `${yetkiData.yetkis.length} kişi` : "Veri bulunmuyor."}\n\`\`\``, inline: true }
)
embed.addFields({ name: `${mesaj2} **Sesli Sohbet İstatistiği**`, value: `
${rainha_Yes} Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
${rainha_Yes} Public Odalar: \`${await category(conf.publicParents)}\`
${rainha_Yes} Secret Odalar: \`${await category(conf.privateParents)}\`
${rainha_Yes} Alone Odalar: \`${await category(conf.aloneParents)}\`
${rainha_Yes} Yönetim Yetkili Odaları: \`${await category(conf.funParents)}\`
${rainha_Yes} Kayıt Odaları: \`${await category(conf.registerParents)}\`
`, inline: false },
{ name:`${mesaj2} **Mesaj İstatistiği**`,value: `
${rainha_Yes} Toplam: \`${messageData ? messageData.topStat : 0}\`
${rainha_Yes} Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
${rainha_Yes} Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
`, inline: false })

   

    let msg = await message.channel.send({ embeds: [embed], components: [row] });

    var filter = (button) => button.user.id === message.author.id;
    let collector = await msg.createMessageComponentCollector({ filter, time: 99999999 })

    collector.on("collect", async (button) => {
      if(button.customId === "puan_detaylari") {
        await button.deferUpdate();

const puan = new EmbedBuilder()
.setDescription(`${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda puanlama tablosu aşağıda belirtilmiştir.`) 

.addFields({ name:`${mesaj2} **Puan Detayları:**`, value:`
${rainha_Yes} Kayıt: (\`Puan Etkisi: +${toplamData ? toplamData.toplams.length*5.5 : 0}\`)
${rainha_Yes} Taglı: (\`Puan Etkisi: +${taggedData ? taggedData.taggeds.length*25 : 0}\`)
${rainha_Yes} Davet: (\`Puan Etkisi: +${total*15}\`)
${rainha_Yes} Yetkili: (\`Puan Etkisi: +${yetkiData ? yetkiData.yetkis.length*30 : 0}\`)
${rainha_Yes} Toplam Ses: (\`Puan Etkisi: +${moment.duration(voiceData ? voiceData.topStat : 0).format("h")*240}\`)
${rainha_Yes} Toplam Mesaj: (\`Puan Etkisi: +${messageData ? messageData.topStat*2 : 0}\`)
${rainha_Yes} Toplam Aldığın Cezalar : ${cezapuanData ? cezapuanData.cezapuan.length : 0} (\`Toplam ${cezaData ? cezaData.ceza.length : 0}\`)
`, inline: false },
{ name:`${mesaj2} **Net Puanlama Bilgisi**`, value:`
${rainha_Yes} Kayıt işlemi yaparak, \`+5.5\` puan kazanırsın.
${rainha_Yes} Taglı üye belirleyerek, \`+25\` puan kazanırsınız.
${rainha_Yes} İnsanları davet ederek, \`+15\` puan kazanırsın.
${rainha_Yes} İnsanları yetkili yaparak, \`+30\` puan kazanırsın.
${rainha_Yes} Seste kalarak, ortalama olarak \`+4\` puan kazanırsınız.
${rainha_Yes} Yazı yazarak, ortalama olarak, \`+2\` puan kazanırsınız.
`, inline: false },
{ name:`${mesaj2} **Puan Durumu:**`, value:`
Puanınız: \`${coinData ? Math.floor(coinData.coin) : 0}\`, Gereken Puan: \`${maxValue.coin}\`
${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`
`, inline: false },
{ name:`${mesaj2} **Yetki Durumu:**`, value:`
${coinStatus}
`, inline: false })

msg.edit({
  embeds : [puan],
  components : [row]
})
      
      }

  if(button.customId === "ceza_puan_detaylari") {
    await button.deferUpdate();
    const ceza = new EmbedBuilder()
    .setDescription(`
    ${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden itibaren \`${message.guild.name}\` sunucusunda genel puanlama tablosu aşağıda belirtilmiştir.
`) 
.addFields({ name:`${mesaj2} **Ceza Kullanımı**`, value: `\`\`\`fix
( Ban: ${cezaData ? cezaData.BanAmount : 0} - Mute: ${cezaData ? cezaData.MuteAmount : 0} - Ses Mute: ${cezaData ? cezaData.VoiceMuteAmount : 0} - Jail: ${cezaData ? cezaData.JailAmount : 0} )\`\`\`
`, inline: false },
{ name:`${mesaj2} **Ceza Puan Detayları:**`, value: `
${rainha_Yes} (\` Ban işlemi \`) yerseniz, \`-100\` puan kaybedersiniz.
${rainha_Yes} (\` Underworld \`) işlemi yerseniz, \`-75\` puan kaybedersiniz.
${rainha_Yes} (\` Karantina/Jail \`) işlemi yerseniz, \`-50\` puan kaybedersiniz.
${rainha_Yes} (\` Ses/Yazı \`) Mute işlemi yerseniz, \`-20\` puan kaybedersiniz.
`, inline: false },
{ name:`${mesaj2} **Ceza Puan Detayları:**`, value:`
${rainha_Yes} (\` Ban işlemi \`) yerseniz, \`-100\` puan kaybedersiniz.
${rainha_Yes} (\` Underworld \`) işlemi yerseniz, \`-75\` puan kaybedersiniz.
${rainha_Yes} (\` Karantina/Jail \`) işlemi yerseniz, \`-50\` puan kaybedersiniz.
${rainha_Yes} (\` Ses/Yazı \`) Mute işlemi yerseniz, \`-20\` puan kaybedersiniz.
\`\`\`fix
Toplam Aldığın Cezalar : ${cezapuanData ? cezapuanData.cezapuan.length : 0} (Toplam ${cezaData ? cezaData.ceza.length : 0})
\`\`\`
`, inline: false },
{ name:`${mesaj2} **Puan Durumu:**`, value: `
Puanınız: \`${coinData ? Math.floor(coinData.coin) : 0}\`, Gereken Puan: \`${maxValue.coin}\`
${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`
`, inline: false },
{ name:`${mesaj2} **Yetki Durumu:**`, value:`
${coinStatus}
`, inline: false })

msg.edit({
  embeds: [ceza],
  components : [row]
})  
    }

      if(button.customId === "iptal_button") {
        await button.deferUpdate();
        const iptal = new EmbedBuilder()
        .setDescription(`
${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri aşağıda belirtilmiştir.
`)

.addFields(
  { name: "__**Toplam Ses**__",  value: `\`\`\`fix\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``, inline: true },
  { name: "__**Toplam Mesaj**__",  value: `\`\`\`fix\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\``, inline: true },
  { name:"__**Toplam Kayıt**__",  value: `\`\`\`fix\n${toplamData ? `${toplamData.toplams.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
  )
  .addFields(
  { name: "__**Toplam Davet**__", value: `\`\`\`fix\n${inviterData ? `${total} regular`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
  { name: "__**Toplam Taglı**__", value: `\`\`\`fix\n${taggedData ? `${taggedData.taggeds.length} kişi`: "Veri bulunmuyor."}\n\`\`\``, inline: true },
  { name: "__**Toplam Yetkili**__", value: `\`\`\`fix\n${yetkiData ? `${yetkiData.yetkis.length} kişi` : "Veri bulunmuyor."}\n\`\`\``, inline: true }
  )
  
.addFields({ name:`${mesaj2} **Sesli Sohbet İstatistiği**`, value:`
${rainha_Yes} Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
${rainha_Yes} Public Odalar: \`${await category(conf.publicParents)}\`
${rainha_Yes} Secret Odalar: \`${await category(conf.privateParents)}\`
${rainha_Yes} Alone Odalar: \`${await category(conf.aloneParents)}\`
${rainha_Yes} Yönetim Yetkili Odaları: \`${await category(conf.funParents)}\`
${rainha_Yes} Kayıt Odaları: \`${await category(conf.registerParents)}\`
`, inline: false },
{ name:`${mesaj2} **Mesaj İstatistiği**`, value:`
${rainha_Yes} Toplam: \`${messageData ? messageData.topStat : 0}\`
${rainha_Yes} Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
${rainha_Yes} Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
`, inline: false });

   row.components[0].setDisabled(true) 
   row.components[1].setDisabled(true) 
   row.components[2].setDisabled(true)
   
    msg.edit({
      embeds: [iptal],
      components : [row]
    })
        
        }

  })
  }
};