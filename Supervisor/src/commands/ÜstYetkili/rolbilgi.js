const Discord = require("discord.js");
const moment = require("moment")
moment.locale("tr")
module.exports = {
conf: {
aliases: ["rolbilgi","role"],
name: "rolbilgi",
help: "rolbilgi @Rol/ID",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed) => {
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: `${message.author}, Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`}).sil(15)
let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
if (!role) return message.reply({ content:"Belirtmiş olduğun rolü bulamadım ! Düzgün bir rol etiketle veya ID belirtip tekrar dene."}).sil(15)
let offlinemembers = role.members.filter(x => !x.presence)
let sestemembers = role.members.filter(x => (x.presence && x.presence !== "offline") && x.voice.channel)
let sesteolmayanaktif = role.members.filter(x => (x.presence && x.presence !== "offline") && !x.voice.channel)
let offlineamaseste = role.members.filter(x => !x.presence && x.voice.channel)
let text = `
─────────────────────
Rol Adı: ${role.name} (${role.id})
Rol Rengi: ${role.hexColor} (${role.color})
Rol Pozisyon: ${role.rawPosition}
Rol Üye Sayısı:  ${role.members.size} 
─────────────────────
Üyeler (Çevrim-Dışı) (${offlinemembers.size} üye)
─────────────────────
${offlinemembers.size > 0 ? offlinemembers.map(x => {
return `${x.user.tag} [${x.displayName ? x.displayName : x.user.tag}] (${x.id})`
}).join("\n") : `Çevrim-dışı üye bulunamadı.`}
─────────────────────
Üyeler (Aktif - Seste Olmayan) (${sesteolmayanaktif.size} üye)
─────────────────────
${sesteolmayanaktif.size > 0 ? sesteolmayanaktif.map(x => {
return `${x.user.tag} [${x.displayName ? x.displayName : x.user.tag}] (${x.id})`
}).join("\n") : `Seste olmayan aktif bir üye bulunamadı.`}
─────────────────────
Üyeler (Seste Olanlar) (${sestemembers.size} üye)
─────────────────────
${sestemembers.size > 0 ? sestemembers.map(x => {
return `${x.user.tag} [${x.displayName ? x.displayName : x.usern.tag}] (🔊 ${x.voice.channel.name})`
}).join("\n") : `Seste olan üye bulunamadı.`}
─────────────────────
Üyeler (Çevrim-Dışı - Seste Olanlar) (${offlineamaseste.size} üye)
─────────────────────
${offlineamaseste.size > 0 ? offlineamaseste.map(x => {
return `${x.user.tag} [${x.displayName ? x.displayName : x.user.tag}] (🔊 ${x.voice.channel.name})`
}).join("\n") : `Çevrim-dışı ama seste bulunan üye bulunamadı.`}
─────────────────────`  
let list = 1
await message.reply({ content: `\` ••❯ \` Aşağıda **${moment(Date.now()).format("LLL")}** tarihinde istenen ${role} isimli rol bilgisi ve rol denetimi belirtilmiştir. (**Dosya içerisinde bilgileri listelenmiştir.**)`,files: [{attachment: Buffer.from(text),name: `${role.name}.txt`}]})
}            
}