const penals = require("../../schemas/penals");
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
const moment = require("moment");
moment.locale("tr");
module.exports = {
conf: {
aliases: [],
name: "unbanall",
help: "unbanall",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed) => {
message.guild.bans.fetch().then(banned => {
let list = 1
let veri = `${moment(Date.now()).format("LLL")} Tarihinde ${message.member.user.tag} tarafından istenmiştir!\n${banned.map(user => `#${list++} ••❯ Kullanıcı Adı: ${user.user.tag} | ID: ${user.user.id} | Ban Sebebi: ${user.reason ? user.reason : "Belirtilmedi!"}`).join('\n')}`
message.channel.send({content: `\`••❯\` Aşağıda **${moment(Date.now()).format("LLL")}** tarihinden itibaren istenen ${message.guild.name} sunucusunun ban listesi belirtilmiştir.`,files: [{attachment: Buffer.from(veri),name: `banlist.txt`}]})})
message.react(message.guild.emojiGöster(emojis.yes))
const yarrak = await message.guild.bans.fetch();
for(const sex of [...yarrak.values()]){
const log = embed
.setAuthor({name: `${sex.user.globalName ? sex.user.globalName : sex.user.tag}`, iconURL: sex.user.avatarURL({dynamic: true})})
.setThumbnail(sex.user.avatarURL({dynamic: true}))
.setTitle("Sunucudaki Üyelerin Yasağı Kaldırıldı!")
.setDescription(`
Banı Kaldırılan Üye: \`${sex.user.globalName ? sex.user.globalName : sex.user.tag} - ${sex.user.id}\`
Banı Kaldıran Yetkili: \`${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag}\` - \`${message.author.id}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>`)
const banLog = await client.kanalBul("ban-log"); 
banLog.send({ embeds: [log]})
await message.guild.members.unban(sex.user.id, `${message.member.user.globalName ? message.member.user.globalName : message.member.user.tag} tarafından kaldırıldı!`).catch(() => {});
const data = await penals.findOne({ userID: sex.user.id, guildID: settings.guildID, type: "BAN", active: true });
if (data) {
data.active = false;
await data.save();
}
}
}}