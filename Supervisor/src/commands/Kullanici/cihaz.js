module.exports = {
conf: {
aliases: ["cihaz"],
name: "cihaz",
help: "cihaz @Rainha/ID",
category: "kullanici"      
},
exclosive: async (client, message, args, embed, prefix) => {
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
if (member.presence == null) return message.reply({ embeds: [embed.setDescription(`*${member} Offline Olduğu İçin Kontrol Edilemiyor!*`)] }).sil(15);
let dev = Object.keys(member.presence.clientStatus)

let cihaz = {desktop: "(💻) Bilgisayar",mobile: "(📱) Mobil",

web: "(🌐) Web Tarayıcı"}

let durum = {online: "(🟢) Çevrimiçi",dnd: "(🔴) Rahatsız Etme",idle: 

"(🟡) Boşta",offline:"(⚪) Çevrimdışı"}

message.reply({ embeds: [embed.setDescription(`*${member} Kullanıcısının Aktif Cihazları!\nDurum: \`${durum[member.presence.status]}\`\nCihazlar: ${dev.map(x => `\`${cihaz[x]}\``).join("\n")}*`)]});
}
}