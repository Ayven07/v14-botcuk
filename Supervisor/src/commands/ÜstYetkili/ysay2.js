const ayar = require("../../configs/settings.json")
const moment = require("moment");
moment.locale("tr");
const emojis = require('../../configs/emojiName.json')
const Discord = require("discord.js");
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: ["ysay2","yetkilises2","sesteolmayan2"],
name: "ysay2",
help: "ysay2",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed, durum) => {
const ayars = await setups.findOne({guildID: ayar.guildID})
if(!ayars) return;  
if (!message.guild) return;
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.react(message.guild.emojiGöster(emojis.no))
let SesteOlmayanYetkili = message.guild.members.cache.filter(yetkili => !yetkili.user.bot && ayars.staffRoles.some(t => yetkili.roles.cache.has(t))).filter(yetkilises => !yetkilises.voice.channel)
var msj = await message.channel.send({content: `Seste olmayan yetkililer aşağıda sıralanmıştır.\n${SesteOlmayanYetkili.map(yetkili => `${yetkili}`).join("\n")}`}).catch(e => {})            
}
}