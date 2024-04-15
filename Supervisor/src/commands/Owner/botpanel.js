const Discord = require("discord.js");
const children = require("child_process");
const settings = require("../../configs/settings.json");
const client = global.bot;
let BOTS = []
const c = require('../../../../Shield/config')
const s = require('../../../../Welcome/settings.json')
const emojis = require('../../configs/emojiName.json')
let AllTokens = [settings.token, c.mainShield, c.roleShield, c.channelShield, c.otherShield, c.othersShield, c.chatShield] 
for (let index = 0; index < s.tokens.length; index++) {
const token = s.tokens[index]
AllTokens.push(token)
}
AllTokens.forEach(async (token) => {
let botClient = new Discord.Client({rest: { rejectOnRateLimit: false }, fetchAllMembers: true, intents: Object.values(Discord.GatewayIntentBits), partials: Object.values(Discord.Partials), shard: "auto",})
await botClient.login(token).catch(err => {})
botClient.on(Discord.Events.ClientReady, async() => {
BOTS.push(botClient)
setInterval(() => {
const oynuyor = settings.botDurum
const index = Math.floor(Math.random() * (oynuyor.length));
botClient.user.setPresence({
activities: [{
name: `${oynuyor[index]}`, 
type: Discord.ActivityType.Playing
}],
status: 'dnd'
});
}, 10000);    
})
})

module.exports = {
conf: {
aliases: ["botpanel"],
name: "botpanel",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed) => {
const sonbots = [];
BOTS.forEach((bot) => {
sonbots.push({
value: bot.user.id,
description: `${bot.user.id}`,
label: `${bot.user.tag}`,
emoji: { id: "1187777778486087792" },
});
});
sonbots.push({
value: 'allres',
label: 'Tüm Botları Yeniden Başlat',
emoji: { id: "1187781700621717564" },    
})
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.StringSelectMenuBuilder()
.setCustomId("botsmenu")
.setPlaceholder("Güncellemek İstediğiniz Botu Seçin.")
.addOptions(sonbots))
const mesaj = await message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.link)} Aşağıda sıralanmakta olan botlardan ismini veya profil fotoğrafını değiştirmek istediğinz botu seçiniz.`)], components: [row] });
const filter = e => e.user.id === message.author.id;
const collector = mesaj.createMessageComponentCollector({ filter, time: 60000, errors: ["time"] });
collector.on("collect", async (menu) => {
if (menu.customId === "botsmenu") {
if (!menu.values) return menu.reply({ content: `${message.guild.emojiGöster(emojis.no)} İşlem bulunamadı.`, ephemeral: true });
if (menu.values[0] == "allres") {
menu.reply({ content: `${message.guild.emojiGöster(emojis.yes)} Başarıyla Bot(lar) Yeniden Başlatılıyor.`, ephemeral: true });
children.exec(`pm2 restart all`);
return; }
const botclient = BOTS.find((bot) => bot.user.id === menu.values[0]);
if (!botclient) return menu.reply({ content: `${message.guild.emojiGöster(emojis.no)} İşlem bulunamadı.`, ephemeral: true });
const newrow = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder().setCustomId("updateavatar").setLabel("Avatarı Güncelle").setStyle(Discord.ButtonStyle.Success),
new Discord.ButtonBuilder().setCustomId("updatename").setLabel("İsmi Güncelle").setStyle(Discord.ButtonStyle.Danger),
);
if (mesaj) mesaj.delete().catch(() => { });
let activities = '';
if (botclient.presence && botclient.presence.activities && botclient.presence.activities.length > 0 && ["dnd", "idle", "online"].includes(botclient?.presence?.status)) {
if (botclient.presence.activities.find((act) => act.name == 'Custom Status' && act.type == 4)) {
var act = botclient.presence.activities.find((act) => act.name == 'Custom Status' && act.type == 4);
activities = act.state
}
}
await message.channel.send({ embeds: [new Discord.EmbedBuilder().setAuthor({name: botclient.user.username, iconURL: botclient.user.avatarURL({dynamic: true})}).setThumbnail(botclient.user.avatarURL({dynamic: true})).setFooter({text: message.guild.name, iconURL: message.guild.iconURL({dynamic: true})})
.setDescription(`
**${botclient.user.username}** İsimli Botun Bilgilerini Güncelleyin.`)
.addFields({ name: `**Avatar Linki;**`,  value: `[Tıkla](${botclient.user.avatarURL({dynamic: true, size: 4096})})`, inline: true }, { name: `**Botun İsmi;**`,  value: `${botclient.user.username}`, inline: true })
.addFields({ name: `**Bilgilendirme;**`,  value: `${message.guild.emojiGöster(emojis.hos)} Bu Botlar **Rainha** Tarafından **${message.guild.name}** Sunucusuna Özel Olarak Yapılmıştır.\n\n Sizde Kaliteli Botlar İstiyorsanız ${message.guild.members.cache.get('852757286375129128') ? '<@!852757286375129128>' : '**Rainhacim**'}'a Veya ${message.guild.members.cache.get('908464652688711680') ? '<@!908464652688711680>' : '**@rainha.**'}'e Ulaşabilirsiniz.`})], components: [newrow] }).then(async (msj) => {
const filter = e => e.user.id === message.member.id;
const col = msj.createMessageComponentCollector({ filter, time: 60000, errors: ["time"] });
col.on("collect", async (button) => {
const botclient = BOTS.find((bot) => bot.user.id === menu.values[0]);
if (!botclient) return menu.reply({ content: `${message.guild.emojiGöster(emojis.no)} İşlem bulunamadı.`, ephemeral: true });
if (button.customId === "updateavatar") {
if (msj) msj.edit({ embeds: [embed.setDescription(`>>> ${botclient.user} isimli botun yeni profil resmini yükleyin veya bağlantısını girin. İşleminizi **60 saniye** içinde tamamlamazsanız otomatik olarak iptal edilecektir. İşlemi iptal etmek için **iptal** yazabilirsin.`)], components: [] });
const avatarfilter = e => e.author.id === message.member.id;
const coll = msj.channel.createMessageCollector({ filter: avatarfilter, time: 60000, max: 1, errors: ["time"] });
coll.on("collect", async (msg) => {
if (["iptal", "i"].some((cevap) => msg.content === cevap)) {
if (msj) msj.delete().catch(() => { });
await button.reply({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} Profil değiştirme işlemi iptal edildi.`)], ephemeral: true });
return; }
const bekle = await message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} Profil resmi değiştirme işlemi başladı. Bu işlem uzun sürebilir, lütfen sabırla bekleyin.`)]});
const avatar = msg.content || msg.attachments.first().url;
if (!avatar) {
if (msj) msj.delete().catch(() => { });
button.reply({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} Profil resmi belirtmediğiniz için işlem iptal edildi.`)], ephemeral: true });
return; }
botclient.user.setAvatar(avatar).then(() => {
if (bekle) bekle.delete().catch(() => { });
if (msj) msj.delete().catch(() => { });
message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${botclient.user} isimli botun profil resmi başarıyla güncellendi.`).setThumbnail(botclient.user.avatarURL())] })}).catch(() => {
if (bekle) bekle.delete().catch(() => { });
if (msj) msj.delete().catch(() => { });
message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} Profil resmi güncellenemedi, çünkü biraz beklemem gerekiyor.`)] })
});
});
coll.on("end", () => {
if (msj) msj.delete().catch(() => { });
});
} else if (button.customId === "updatename") {
if (msj) msj.edit({ embeds: [embed.setDescription(`>>> ${botclient.user} isimli botun yeni ismini girin. İşleminizi **60 saniye** içinde tamamlamazsanız otomatik olarak iptal edilecektir. İşlemi iptal etmek için **iptal** yazabilirsin.`)], components: [] });
const isimfilter = e => e.author.id === message.member.id;
const coll = msj.channel.createMessageCollector({ filter: isimfilter, time: 60000, max: 1, errors: ["time"] });
coll.on("collect", async (msg) => {
if (["iptal", "i"].some((cevap) => msg.content === cevap)) {
if (msg) msg.delete().catch(() => { });
await button.reply({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} İsim değiştirme işlemi iptal edildi.`)], ephemeral: true });
return; }
const eskinick = botclient.user.username;
const bekle = await message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} İsim değiştirme işlemi başladı. Bu işlem uzun sürebilir, lütfen sabırla bekleyin.`)]});
const isim = msg.content;
if (!isim) {
if (msj) msj.delete().catch(() => { });
button.reply({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} İsim belirtmediğiniz için işlem iptal edildi.`)], ephemeral: true });
return;
}
botclient.user.setUsername(isim).then(() => {
if (bekle) bekle.delete().catch(() => { });
if (msj) msj.delete().catch(() => { });
message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${botclient.user} isimli botun ismi başarıyla güncellendi.`).addFields({ name: "İsim", value: `**${eskinick}** > **${botclient.user.username}**`, inline: false })] })}).catch(() => {
if (bekle) bekle.delete().catch(() => { });
if (msj) msj.delete().catch(() => { });
message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} İsim güncellenemedi, çünkü biraz beklemem gerekiyor.`)] })
});
});
coll.on("end", () => {
if (msj) msj.delete().catch(() => { });
});
}
});
});
} 
});
collector.on("end", async () => {
if (mesaj) mesaj.delete().catch(() => { });
});
  }
}