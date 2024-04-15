const moment = require("moment");
moment.locale("tr");
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
const emojis = require('../../configs/emojiName.json')
const Discord = require("discord.js");
module.exports = {
conf: {
aliases: ["banlist","yargılist","banliste"],
name: "banliste",
help: "banliste",
category: "ustyetkili"
}, 
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers) &&  !ayar.banHammer.some(x => message.member.roles.cache.has(x))) { message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).sil(15)
    message.react(message.guild.emojiGöster(emojis.no))
    return }
    const ban = await message.guild.bans.fetch();
    if (!ban) { message.channel.send({ content: "Banlı üye bulunmamaktır."}).sil(15)
    message.react(message.guild.emojiGöster(emojis.no))
    return }
    message.guild.bans.fetch().then(banned => {
    let list = 1
    let veri = `${moment(Date.now()).format("LLL")} Tarihinde ${message.member.user.username} tarafından istenmiştir!\n${banned.map(user => `#${list++} ••❯ Kullanıcı Adı: ${user.user.username} | ID: ${user.user.id} | Ban Sebebi: ${user.reason ? user.reason : "Belirtilmedi!"}`).join('\n')}`
    message.channel.send({
    content: `\`••❯\` Aşağıda **${moment(Date.now()).format("LLL")}** tarihinden itibaren istenen ${message.guild.name} sunucusunun ban listesi belirtilmiştir.`,
    files: [{
    attachment: Buffer.from(veri),
    name: `banlist.txt`
     }]})
    })
  },
};