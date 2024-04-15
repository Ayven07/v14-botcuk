const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
const Discord = require("discord.js");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const emojis = require('../../configs/emojiName.json')
const db = require("../../schemas/inviter");
const settings = require("../../configs/settings.json")
const regstats = require("../../schemas/registerStats");
const streamUser = require("../../schemas/streamUser")
const cameraUser = require("../../schemas/cameraUser")
module.exports = {
conf: {
aliases: ["topstat","ts","top"],
name: "topstat",
help: "topstat",
category: "kullanici"
},
exclosive: async (client, message, args, embed, prefix) => {
const msj = await message.reply({embeds: [embed.setDescription(`${message.guild.name} sunucusuna ait veri sıralaması yükleniyor. Lütfen bekleyin!`)]})
const messageUsersData1 = await messageUser.find({ guildID: settings.guildID }).select('userID topStat').sort({ topStat: -1 });
const voiceUsersData1 = await voiceUser.find({ guildID: settings.guildID }).select('userID topStat').sort({ topStat: -1 });
const mesajeniyi = messageUsersData1.filter((x) => message.guild.members.cache.get(x.userID)).splice(0, 1).map((x, index) => `${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`);
const seseniyi = voiceUsersData1.filter((x) => message.guild.members.cache.get(x.userID)).splice(0, 1).map((x, index) => `${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`);
const inviteUsers1 = await db.find({ guildID: settings.guildID }).select('userID total').sort({ total: -1 });
const kayitUsers1 = await regstats.find({ guildID: settings.guildID }).select('userID top').sort({ top: -1 });
const inviteniyi = inviteUsers1.filter((x) => message.guild.members.cache.get(x.userID)).splice(0, 1).map((x, index) => `${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`);
const kayiteniyi = kayitUsers1.filter((x) => message.guild.members.cache.get(x.userID)).splice(0, 1).map((x, index) => `${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`); 
const streamUsers1 = await streamUser.find({ guildID: settings.guildID }).select('userID topStat').sort({ topStat: -1 });
const cameraUsers1 = await cameraUser.find({ guildID: settings.guildID }).select('userID topStat').sort({ topStat: -1 });
const yayineniyi = streamUsers1.splice(0, 1).map((x, index) => `${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`);
const kameraeniyi = cameraUsers1.splice(0, 1).map((x, index) => `${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}`);
///
const voiceUsersData = await voiceUser.find({ guildID: settings.guildID }).select('userID topStat').sort({ topStat: -1 });
let list = voiceUsersData
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");
const voiceUsersData3 = await voiceUser.find({ guildID: settings.guildID }).select('userID weeklyStat').sort({ weeklyStat: -1 });
let listt = voiceUsersData3
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${moment.duration(x.weeklyStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");
const messageUsersData = await messageUser.find({ guildID: settings.guildID }).select('userID topStat').sort({ topStat: -1 });
let mlist = messageUsersData
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${Number(x.topStat).toLocaleString()} Mesaj \``)
.join("\n");
const messageUsersData3 = await messageUser.find({ guildID: settings.guildID }).select('userID weeklyStat').sort({ weeklyStat: -1 });
let mlistt = messageUsersData3
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${Number(x.weeklyStat).toLocaleString()} Mesaj \``)
.join("\n");
const streamUsersData = await streamUser.find({ guildID: settings.guildID }).select('userID topStat').sort({ topStat: -1 });
let ylist = streamUsersData
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");    
const cameraUsersData = await cameraUser.find({ guildID: settings.guildID }).select('userID topStat').sort({ topStat: -1 });
let clist = cameraUsersData
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${moment.duration(x.topStat).format("D [Gün], H [Saat], m [Dakika]")} \``)
.join("\n");    
let data = await db.find({ guildID: settings.guildID }).select('userID total').sort({ total: -1 });
let dlist = data
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${x.total} Davet. \``)
.join("\n");
 let kdata = await regstats.find({ guildID: settings.guildID }).select('userID top').sort({ top: -1 });  
 let klist = kdata
.filter((x) => message.guild.members.cache.get(x.userID))
.splice(0, 20)
.map((x, index) => `\` ${index+1}. \` ${message.guild.members.cache.has(x.userID) ? message.guild.members.cache.get(x.userID) : '\` Kullanıcı Bulunamadı. \`'}: \` ${x.top} Kayıt. \``)
.join("\n");
const menu = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.StringSelectMenuBuilder()
					.setCustomId('menu1')
					.setPlaceholder(`${message.guild.name} sunucunun verilerini görüntüle`)
					.setMinValues(0)
          .setMaxValues(1)
          .addOptions([
            {
							label: 'Sunucunun En İyileri',
							description: 'En iyi istatistiğe sahip üyeler.',
							value: 'eniyi',
              emoji: '1108430016972333056',
						},	
					{
							label: 'Genel Ses Sıralaması',
							description: 'Tüm zamanların genel 20 ses sıralaması.',
							value: 'tums',
              emoji: '1108425532246327397',
						},	
           {
							label: 'Haftalık Ses Sıralaması',
							description: 'Bu haftanın 20 ses sıralaması.',
							value: 'weeks',
              emoji: '1108425532246327397',
						},
            {
							label: 'Genel Mesaj Sıralaması',
							description: 'Tüm zamanların genel 20 mesaj sıralaması.',
							value: 'tumm',
              emoji: '1108428766499315733',
						},	
            {
							label: 'Haftalık Mesaj Sıralaması',
							description: 'Bu haftanın 20 mesaj sıralaması.',
							value: 'weekm',
              emoji: '1108428766499315733',
						},	
         {
							label: 'Genel Davet Sıralaması',
							description: 'Tüm zamanların genel 20 davet sıralaması.',
							value: 'tumd',
              emoji: '1108425944575770664',
						},
            {
							label: 'Genel Kayıt Sıralaması',
							description: 'Tüm zamanların genel 20 kayıt sıralaması.',
							value: 'tumk',
              emoji: '1108430312553316452',
						},
            {
							label: 'Genel Yayın Sıralaması',
							description: 'Tüm zamanların genel 20 yayın sıralaması.',
							value: 'tumy',
              emoji: '1108425576311685180',
						},
            {
							label: 'Genel Kamera Sıralaması',
							description: 'Tüm zamanların genel 20 kamera sıralaması.',
							value: 'tumc',
              emoji: '1108428803254001706',
						},            
            {
             label: 'İşlem İptal',
             value: 'iptal',
             emoji: '1087150197282447510',
              },
          ]),
        );
     embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
     .setDescription(`${message.guild.emojiGöster(emojis.uyari)} Aşağıdaki menüden **${message.guild.name}** sunucusunun <t:${Math.floor(Date.now() / 1000)}> tarihli tüm zamanlar ve haftalık istatistik verilerini listeleyebilirsiniz.`)
   msj.edit({embeds: [embed], components: [menu]}).then(msg => {
const filter = (xd) => xd.user.id == message.author.id;
const collector = msg.createMessageComponentCollector({filter})
collector.on("collect", async (button) => {
if(button.values && button.values[0] == 'eniyi'){
 await button.deferUpdate ();
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.link)} *Aşağıda **${message.guild.name}** sunucusunun en iyileri sıralanmaktadır.*

${message.guild.emojiGöster(emojis.kupa)} \` En İyi Ses \` \n${seseniyi ? seseniyi : "Veri Bulunmuyor."}
${message.guild.emojiGöster(emojis.kupa)} \` En İyi Mesaj \` \n${mesajeniyi ? mesajeniyi : "Veri Bulunmuyor."}

${message.guild.emojiGöster(emojis.kupa)} \` En İyi Kayıt \` \n${kayiteniyi ? kayiteniyi : "Veri Bulunmuyor."}
${message.guild.emojiGöster(emojis.kupa)} \` En İyi İnvite \` \n${inviteniyi ? inviteniyi : "Veri Bulunmuyor."}

${message.guild.emojiGöster(emojis.kupa)} \` En İyi Yayın \` \n${yayineniyi ? yayineniyi : "Veri Bulunmuyor."}
${message.guild.emojiGöster(emojis.kupa)} \` En İyi Kamera \` \n${kameraeniyi ? kameraeniyi : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'tums'){
  await button.deferUpdate();  
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.link)} *Aşağıda **${message.guild.name}** sunucusunun genel ses sıralaması listelenmektedir.*

${list ? list : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

msg.edit({ embeds: [embeds], components : [menu] })
}
if(button.values && button.values[0] == 'weeks'){
 await button.deferUpdate();
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.link)} *Aşağıda **${message.guild.name}** sunucusunun haftalık ses sıralaması listelenmektedir.*
  
${listt ? listt : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
  msg.edit({ embeds: [embeds], components : [menu] })
  }
  if(button.values && button.values[0] == 'tumm'){
  await button.deferUpdate();
  
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.link)} *Aşağıda **${message.guild.name}** sunucusunun genel mesaj sıralaması listelenmektedir.*
    
${mlist ? mlist : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
 
msg.edit({ embeds: [embeds], components : [menu] })
  }
if(button.values && button.values[0] == 'weekm'){
 await button.deferUpdate();

const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.link)} *Aşağıda **${message.guild.name}** sunucusunun haftalık mesaj sıralaması listelenmektedir.*
      
${mlistt ? mlistt : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
   
msg.edit({ embeds: [embeds], components : [menu] })
  }
if(button.values && button.values[0] == 'tumd'){
  await button.deferUpdate();
const embeds2 = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.link)} *Aşağıda **${message.guild.name}** sunucusunun genel davet sıralaması listelenmektedir.*
                
${dlist ? dlist : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
msg.edit({ embeds: [embeds2], components : [menu] })
}
if(button.values && button.values[0] == 'tumk'){
  await button.deferUpdate();
const embeds2 = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.link)} *Aşağıda **${message.guild.name}** sunucusunun genel kayıt sıralaması listelenmektedir.*
                    
${klist ? klist : "Veri Bulunmuyor."}`)
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
    .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
    msg.edit({ embeds: [embeds2], components : [menu] })
    
  }
if(button.values && button.values[0] == 'tumy'){
  await button.deferUpdate();  
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.link)} *Aşağıda **${message.guild.name}** sunucusunun genel yayın sıralaması listelenmektedir.*

${ylist ? ylist : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

msg.edit({ embeds: [embeds], components : [menu] })
} 
 if(button.values && button.values[0] == 'tumc'){
  await button.deferUpdate();  
const embeds = new Discord.EmbedBuilder()
.setDescription(`
${message.guild.emojiGöster(emojis.link)} *Aşağıda **${message.guild.name}** sunucusunun genel kamera sıralaması listelenmektedir.*

${clist ? clist : "Veri Bulunmuyor."}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

msg.edit({ embeds: [embeds], components : [menu] })
}    
if(button.values && button.values[0] == 'iptal'){
await button.deferUpdate();
msg.delete().catch(e => {});
 }  
  })
     })
},
  };