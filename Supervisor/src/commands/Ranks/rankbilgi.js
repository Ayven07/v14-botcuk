const moment = require("moment");
require("moment-duration-format");
const settings = require("../../configs/settings.json");
const regstats = require("../../schemas/registerStats");
const Users = require("../../schemas/users")
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const cameraUser = require("../../schemas/cameraUser");
const streamUser = require("../../schemas/streamUser")
const emojis = require('../../configs/emojiName.json')
const inviterSchema = require("../../schemas/inviter");
const Discord = require("discord.js");
module.exports = {
conf: {
aliases: ["rankbilgi", "puanbilgi"],
name: "rankbilgi",
help: "rankbilgi",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
if(settings.coinSystem === false) return message.reply({embeds: [embed.setDescription(`Terfi Sistemi Aktif Değil!`)]}).sil(15)
if(!client.ranks.some((x) => message.member.roles.cache.has(x.role)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.react(message.guild.emojiGöster(emojis.no))
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const messageData = await messageUser.findOne({ guildID: settings.guildID, userID: member.id });
const voiceData = await voiceUser.findOne({ guildID: settings.guildID, userID: member.id });
const streamData = await streamUser.findOne({ guildID: settings.guildID, userID: member.id });  
const cameraData = await cameraUser.findOne({ guildID: settings.guildID, userID: member.id });  
const inviterData = await inviterSchema.findOne({ guildID: settings.guildIDd, userID: member.id });
const registerData = await regstats.findOne({ guildID: settings.guildID, userID: member.id });

const mesaj = settings.messageCoin * (messageData ? messageData.topStat : 0) / settings.messageCount
const ses = settings.voiceCoin * (await voiceMS(voiceData ? voiceData.topStat : 0)) / settings.voiceCount 
const yayin = settings.streamCoin * (await voiceMS(streamData ? streamData.topStat : 0)) / settings.streamCount 
const kamera = settings.cameraCoin * (await voiceMS(cameraData ? cameraData.topStat : 0)) / settings.cameraCount 
const kayit = settings.registerCoin * (registerData ? registerData.top : 0) / 1
const davet = settings.inviteCoin * (inviterData ? inviterData.total : 0) / 1
const tagli = settings.taggedCoin * (await TaggedsDB(member.id)) / 1
const yetkili = settings.yetkiCoin * (await StaffsDB(member.id)) / 1

var puanbilgilendirme = new Discord.EmbedBuilder()
.setDescription(`${message.guild.emojiGöster(emojis.hos)} Sayın yetkililerimiz sizlere özel olarak tasarlanmıs olan **puan sistemi** hakkında bu panelden bilgi alabilirsiniz Mesaj, Ses , Kamera , Yayın gibi aktivitelerinizin size kaç puan ve coin ekleyeceğini buradan görebilirsiniz.

\`\`\`fix
🪙                Puan Sistemi            
\`\`\`
${message.guild.emojiGöster(emojis.nokta)} \`  Mesaj Puanı:  \` **${mesaj.toFixed()} Puan** (**${messageData ? messageData.topStat : 0} Mesaj.**)
${message.guild.emojiGöster(emojis.nokta)} \`  Ses Puanı:  \` **${ses.toFixed()} Puan** (**${moment.duration(voiceData ? voiceData.topStat : 0).format("D [Gün], H [Saat], m [Dakika]")}**)
${message.guild.emojiGöster(emojis.nokta)} \`  Yayın Puanı:  \` **${yayin.toFixed()} Puan** (**${moment.duration(streamData ? streamData.topStat : 0).format("D [Gün], H [Saat], m [Dakika]")}**)
${message.guild.emojiGöster(emojis.nokta)} \`  Kamera Puanı:  \` **${kamera.toFixed()} Puan** (**${moment.duration(cameraData ? cameraData.topStat : 0).format("D [Gün], H [Saat], m [Dakika]")}**)
${message.guild.emojiGöster(emojis.nokta)} \`  Kayıt Puanı:  \` **${kayit.toFixed()} Puan** (**${registerData ? registerData.top : 0} Kayıt.**)
${message.guild.emojiGöster(emojis.nokta)} \`  Davet Puanı:  \` **${davet.toFixed()} Puan** (**${inviterData ? inviterData.total : 0} Davet.**)
${message.guild.emojiGöster(emojis.nokta)} \`  Taglı Puanı:  \` **${tagli.toFixed()} Puan** (**${(await TaggedsDB(member.id))} Taglı.**)
${message.guild.emojiGöster(emojis.nokta)} \`  Yetkili Puanı:  \` **${yetkili.toFixed()} Puan** (**${(await StaffsDB(member.id))} Yetkili.**)

\`\`\`fix
⚙              Puan Ayarları        
\`\`\`
${message.guild.emojiGöster(emojis.nokta)} \`  Mesaj Puan Ayarı: \` Mesaj sayınız **${settings.messageCoin}** ile çarpılıp **${settings.messageCount}**'e bölünür bunun sonucunda **mesaj** puanınız **${mesaj.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Ses Puan Ayarı: \` Ses süreniz **${settings.voiceCoin}** ile çarpılıp **${settings.voiceCount}**' e bölünür bunun sonucunda **ses** puanınız **${ses.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Yayın Puan Ayarı: \` Yayın süreniz **${settings.streamCoin}** ile çarpılıp **${settings.streamCount}**' e bölünür bunun sonucunda **yayın** puanınız **${yayin.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Kamera Puan Ayarı: \` Kamera açma süreniz **${settings.cameraCoin}** ile çarpılıp **${settings.cameraCount}**' e bölünür bunun sonucunda **kamera** puanınız **${kamera.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Kayıt Puan Ayarı: \` Kayıt sayınız **${settings.registerCoin}** ile çarpılıp **1** e bölünür bunun sonucunda **kayıt** puanınız **${kayit.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Davet Puan Ayarı: \` Davet ettiğiniz kişi sayısınız **${settings.inviteCoin}** ile çarpılıp **1**' e bölünür bunun sonucunda **davet** puanınız **${davet.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Taglı Puan Ayarı: \` Taglı kişi sayınız **${settings.taggedCoin}** ile çarpılıp **1**' e bölünür bunun sonucunda **taglı** puanınız **${tagli.toFixed()}**.
${message.guild.emojiGöster(emojis.nokta)} \`  Yetkili Puan Ayarı: \` Yetkili çektiğiniz kişi sayısı **${settings.yetkiCoin}** ile çarpılıp **1** e bölünür bunun sonucunda **yetkili** puanınız **${yetkili.toFixed()}**.`)
.setImage(member.user.bannerURL({ dynamic: true, size: 2048 }))
.setFooter({ text: `Çarpılan ve bölünen puan sayılarınız sunucu sahibi tarafından ayarlanmıştır.`, iconURL: message.guild.iconURL({ dynamic: true, size: 1024 }) })
.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
.setTimestamp();
message.reply({ embeds: [puanbilgilendirme] })
}
}

async function voiceMS(type) {
const dakika = type / (1000 * 60); 
return dakika;
}
async function TaggedsDB(user) {
return new Promise((resolve, reject) => {
Users.findOne({ _id: user }, async (err, res) => {
if (err) {
reject(err);
} else {
if (!res) {
resolve(0);
} else {
let count = 0;
if (res.Taggeds && res.Taggeds.length > 0) {
count = res.Taggeds.length;
} else {
count = 0; 
}
resolve(count);
}
}
});
});
}

async function StaffsDB(user) {
return new Promise((resolve, reject) => {
Users.findOne({ _id: user }, async (err, res) => {
if (err) {
reject(err);
} else {
if (!res) {
resolve(0);
} else {
let count = 0;
if (res.Staffs && res.Staffs.length > 0) {
count = res.Staffs.length;
} else {
count = 0; 
}
resolve(count);
}
}
});
});
}