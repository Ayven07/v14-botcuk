const c = require("../../configs/settings.json")
const moment = require("moment");
moment.locale("tr");
const client = global.client;
const setups = require("../../schemas/setup")
const Discord = require("discord.js")
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["say"],
name: "say",
help: "say",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: c.guildID})
if(!ayar) return;  
if(!ayar.staffRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
{
message.react(message.guild.emojiGöster(emojis.no))
return
}
var takviye = rakam(message.guild.premiumSubscriptionCount)
var TotalMember = rakam(message.guild.memberCount)
var tagges = rakam(message.guild.members.cache.filter(s => ayar.serverTag.some(a => s.user.globalName && s.user.globalName.includes(a) || s.user.username.includes(a))).size)
var sesli = rakam(message.guild.members.cache.filter((x) => x.voice.channel && !x.user.bot).size)
var bot = message.guild.channels.cache.filter(channel => channel.type == Discord.ChannelType.GuildVoice).map(channel => channel.members.filter(member => member.user.bot).size).reduce((a, b) => a + b);
var yetkili = message.guild.members.cache.filter(yetkili => !yetkili.user.bot && ayar.staffRoles.some(x => yetkili.roles.cache.has(x))).size
var erkek = rakam(message.guild.members.cache.filter(uye => !uye.user.bot && ayar.manRoles.some(x => uye.roles.cache.has(x))).size)
var kiz = rakam(message.guild.members.cache.filter(uye => !uye.user.bot && ayar.womanRoles.some(x => uye.roles.cache.has(x))).size)
await message.reply({ embeds: [embed
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
.setDescription(`
\` ❯ \` Şu anda toplam **${sesli}** kişi seslide. (\`+${bot} bot\`)
\` ❯ \` Sunucuda **${TotalMember}** adet üye var (\`+${message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size} aktif\`)
${ayar.tagSystem == true ? `\` ❯ \` Toplamda ${tagges} kişi tagımızı alarak bizi desteklemiş. (\`+${yetkili} yetkili\`)\n\` ❯ \` Sunucumuzda toplam kayıtlı ${erkek} erkek üye bulunuyor.\n\` ❯ \` Sunucumuzda toplam kayıtlı ${kiz} kadın üye bulunuyor.` : `\` ❯ \` Sunucumuzda toplam kayıtlı ${erkek} erkek üye bulunuyor.\n\` ❯ \` Sunucumuzda toplam kayıtlı ${kiz} kadın üye bulunuyor.`}
\` ❯ \` Toplamda **${takviye}** adet boost basılmış. (\`${message.guild.premiumTier ? `${message.guild.premiumTier}. seviye` : `0. seviye`}\`)`)]})
},
};

function rakam(sayi) {
const guild = client.guilds.cache.get(c.guildID)
var basamakbir = sayi.toString().replace(/ /g, "     ");
var basamakiki = basamakbir.match(/([0-9])/g);
basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
if (basamakiki) {
basamakbir = basamakbir.replace(/([0-9])/g, d => {
return {
'0': `${guild.emojis.cache.find(x => x.name == emojis.sifir)}`,
'1': `${guild.emojis.cache.find(x => x.name == emojis.bir)}`,
'2': `${guild.emojis.cache.find(x => x.name == emojis.iki)}`,
'3': `${guild.emojis.cache.find(x => x.name == emojis.uc)}`,
'4': `${guild.emojis.cache.find(x => x.name == emojis.dort)}`,
'5': `${guild.emojis.cache.find(x => x.name == emojis.bes)}`,
'6': `${guild.emojis.cache.find(x => x.name == emojis.alti)}`,
'7': `${guild.emojis.cache.find(x => x.name == emojis.yedi)}`,
'8': `${guild.emojis.cache.find(x => x.name == emojis.sekiz)}`,
'9': `${guild.emojis.cache.find(x => x.name == emojis.dokuz)}`
}
[d];
})
}
return basamakbir;
}