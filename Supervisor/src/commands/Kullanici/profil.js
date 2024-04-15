const { EmbedBuilder, time, channelMention } = require("discord.js");
const emojis = require('../../configs/emojiName.json')
let zaman = new Map();
module.exports = {
conf: {
aliases: ["p","profil"],
name: "profil",
help: "profil",
category: "kullanici"
},
exclosive: async (client, message, args) => {
var member = args[0] ? (message?.mentions?.members.first() || message.guild.members.cache.find((m) => m.user.username.toLocaleLowerCase() == args[0].toLocaleLowerCase()) || message.guild.members.cache.get(args[0])) : message.member;
if (!member && args[0]) {
return message.reply({content:`>>> Yanlış ID/kullanıcı adı veya sunucuda olmayan birisini belirttiniz. Lütfen bilgileri kontrol edip tekrar deneyiniz.`}).then((msg) => setTimeout(() => msg.delete().catch(() => { }), 15000));
};
await member.fetch()
if (member.user.bot) return message.reply({content: `>>> Bu komutu botlar üstünde kullanmanın sebebini tam olarak anlamış değilim. :smiley:`}).then((msg) => setTimeout(() => msg.delete().catch(() => { }), 15000));
if (zaman.get(message.author.id) >= 1) return message.reply({content: "<@"+message.member+"> Bu komutu 15 dakika'da bir kullanabilirsin."}).sil(15)
let guildOwner = message.guild.members.cache.get(message.guild.ownerId);
let joinDate = member.joinedAt;
let guildMembers = member.guild.members.cache;
var memberBefore = Array.from(guildMembers.values())
.filter(m => !m.user.bot && (m.joinedAt < joinDate))
.sort((a, b) => b.joinedAt - a.joinedAt)
.find(() => true);
var memberAfter = Array.from(guildMembers.values())
.filter(m => !m.user.bot && (m.joinedAt > joinDate))
.sort((a, b) => a.joinedAt - b.joinedAt)
.find(() => true);
var rolleri = member.roles.cache.filter((r) => r.name != "@everyone").sort((a, b) => b.position - a.position).map((r) => `${r}`).join(", ");
var userCustom = null;
var userCustomEmoji;
var createdEmoji = false;
if (member.presence && member.presence.activities && member.presence.activities.length > 0 && ["dnd", "idle", "online"].includes(member?.presence?.status)) {
if (member.presence.activities.find((act) => act.name == 'Custom Status' && act.type == 4)) {
var act = member.presence.activities.find((act) => act.name == 'Custom Status' && act.type == 4);
if (act.emoji && !act.emoji.id && act.emoji.name) {
userCustomEmoji = `${act.emoji.name}`;
} else if (act.emoji && act.emoji.id) {
let ext = act.emoji.animated ? ".gif" : ".png";
let url = `https://cdn.discordapp.com/emojis/${act.emoji.id}${ext}`;
await message.guild.emojis.create({ name: `DS_${member.id}`, attachment: url, reason: "Bot Profile | 'profil' komutu kullanıldı, otomatik işlem." });
createdEmoji = true;
userCustomEmoji = message.guild.emojis.cache.find((e) => e.name == `DS_${member.id}`);
}
if (act.emoji && !act.state) {
userCustom = `${userCustomEmoji}`;
} else if (act.emoji && act.state) {
userCustom = `${userCustomEmoji} ${act.state}`;
} else if (!act.emoji && act.state) {
userCustom = `${act.state}`;
}
}
};

var memberPresences = [];
var editedMemberPresences = [];
if (member.presence && member.presence.activities && member.presence.activities.length > 0 && (member.presence.activities.filter((act) => act.type !== 4 && act.name !== 'Custom Status').length > 0)) {
member.presence.activities.filter((act) => act.type !== 4 && act.name !== 'Custom Status').forEach((act) => {
let priority = 1;
if (act.type == 2) priority = -1;
if (act.type == 1 && act.name == 'YouTube Music') priority = -1; else if (act.type == 1 && (act.name == 'Visual Studio Code' || act.name == 'Visual Studio')) priority = 1; else if (act.type == 1 && act.name == 'League of Legends') priority = 2; else if (act.type == 1) priority = 3;
memberPresences.push({
priority: priority,
name: act.name,
type: act.type,
details: act.details,
state: act.state,
applicationId: act.applicationId,
timestamps: act.timestamps,
party: act.party,
assets: act.assets,
flags: act.flags,
emoji: act.emoji,
buttons: act.buttons,
createdTimestamp: act.createdTimestamp
});
});
};

memberPresences.sort((a, b) => a.priority - b.priority).forEach((act) => {
if (act.name == 'Spotify' || act.name == 'YouTube Music') editedMemberPresences.push(`**${act.name}** üzerinden **${act.name == 'YouTube Music' ? act.state.split(' - ')[0] : act.state.replace("; ", ", ").replace("; ", ", ").replace("; ", ", ").replace("; ", ", ").replace("; ", ", ")}** adlı sanatçının ${act.name == 'Spotify' && act.assets && act.assets.largeText && act.assets.largeText !== act.details ? ` **${act.assets.largeText}** isimli albümünden ` : " "}**${act.details}** isimli şarkısını dinliyor.`);
else if (act.name == 'Visual Studio' || act.name == 'Visual Studio Code') editedMemberPresences.push(`**${act.name}** programında ${act.state ? `**${act.state.split(": ")[1].split("[SSH")[0]}** projesi üzerinde ` : ""}**${act.details.split(" ")[1]}** dosyasını düzenliyor.`);
else if (act.name == 'League of Legends') {
if (act.state == 'Lobide' || act.state == 'In Lobby') editedMemberPresences.push(`**${act.name}** oynuyor ve şuan **lobide**.`);
else if (act.state == 'Sırada' || act.state == 'In Queue') editedMemberPresences.push(`**${act.name}** oynuyor ve şuan **sıra bekliyor**.`);
else if (act.state == 'Şampiyon Seçiminde' || act.state == 'In Champion Select') editedMemberPresences.push(`**${act.name}** oynuyor ve şuan **şampiyon seçiminde**.`);
else if (act.state == 'Oyunda' || act.state == 'In Game') editedMemberPresences.push(`**${act.name}** oynuyor ve şuan **maçta**, **${act.assets.largeText}** oynuyor..`);
else editedMemberPresences.push(`**${act.name}** oynuyor.`);
} else editedMemberPresences.push(`**${act.name}** oynuyor.`);
})
var memberProfileEmbed = new EmbedBuilder()
.setAuthor({ name: `${member.user.discriminator ? member.user.tag : `@${member.user.username}`} | Profil`, iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }) })
.setDescription(`${message.guild.emojiGöster(emojis.uyari)} __**Hesap Bilgileri**__
${message.guild.emojiGöster(emojis.nokta)} **Kullanıcı Adı**: ${member.user.discriminator ? member.user.tag : `@${member.user.username}`}
${message.guild.emojiGöster(emojis.nokta)} **Görünen Ad**: ${member.user.globalName || member.user.username}
${message.guild.emojiGöster(emojis.nokta)} **ID**: ${member.user.id}
${message.guild.emojiGöster(emojis.nokta)} **Kuruluş Tarihi**: ${time(member.user.createdAt)} (${time(member.user.createdAt, "R")})

${message.guild.emojiGöster(emojis.uyari)} __**Kullanıcı Bilgisi**__
${message.guild.emojiGöster(emojis.nokta)} **Takma Adı**: ${member.nickname || "Bulunmuyor"}
${message.guild.emojiGöster(emojis.nokta)} **Sunucuya Giriş**: ${time(member.joinedAt)} (${time(member.joinedAt, "R")})
${message.guild.emojiGöster(emojis.nokta)} **Sunucuya Giriş Sıralaması**: ${Array.from(guildMembers.values()).sort((a, b) => a.joinedAt - b.joinedAt).indexOf(member) + 1}/${message.guild.memberCount} (${memberBefore ? memberBefore.user.username : "Bulunmadı"} > ${member.user.username} > ${memberAfter ? memberAfter.user.username : "Bulunamadı"})
${message.guild.emojiGöster(emojis.nokta)} **Kullanıcının Rolleri (${member.roles.cache.size - 1})**: ${rolleri}

${message.guild.emojiGöster(emojis.uyari)} __**Durum Bilgisi**__
${message.guild.emojiGöster(emojis.nokta)} **Durum**: ${member?.presence?.status.replace("dnd", `:red_circle: Rahatsız Etmeyin`).replace("online", `:green_circle: Çevrimiçi`).replace("idle", `:yellow_circle: Boşta`) || `:white_circle: Çevrimdışı`}
${["dnd", "idle", "online"].includes(member?.presence?.status) ? `${message.guild.emojiGöster(emojis.nokta)} **Custom Status**: ${userCustom || "Bulunmuyor"}\n` : ""}${["dnd", "idle", "online"].includes(member?.presence?.status) ? `${message.guild.emojiGöster(emojis.nokta)} **Giriş Yaptığı Cihazlar (${Object.keys(member.presence.clientStatus).length})**: ${Object.keys(member.presence.clientStatus).map((platform) => `${platform.replace("mobile", "📱").replace("web", "🌐").replace("desktop", "💻")}`).join(" ")}\n` : ""}
${["dnd", "idle", "online"].includes(member?.presence?.status) ? `${message.guild.emojiGöster(emojis.uyari)} **__Aktiviteler__ (${member.presence.activities.filter((act) => act.name !== 'Custom Status' && act.type !== 4).length})**: ${member.presence.activities.filter((act) => act.name !== 'Custom Status' && act.type !== 4).length > 0 ? `\n${editedMemberPresences.map((actString) => `${message.guild.emojiGöster(emojis.nokta)} ${actString}`).join("\n")}` : "Kullanıcı hiçbir aktivite yapmıyor."}` : ""}`)
.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
.setImage(member.user.bannerURL({ dynamic: true, size: 2048 }))
.setColor("Blurple")
.setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true, size: 1024 }) })
.setTimestamp()
message.reply({ embeds: [memberProfileEmbed] }).then((msg) => setTimeout(() => {
if (createdEmoji) message.guild.emojis.cache.filter((e) => e.name.startsWith("DS_")).forEach((e) => e.delete({ reason: "Bot Profile | 'profil' komutu kullanıldı, otomatik işlem." }).catch(() => { }));
}, 15000))
zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
setTimeout(() => {
zaman.delete(message.author.id)
}, 1000 * 60 * 15 * 1)
},
};