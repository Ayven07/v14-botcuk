const moment = require("moment");
const penals = require("../../schemas/penals")
moment.locale("tr");
const Discord = require("discord.js")
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["cezasorgu","sorgu"],
name: "cezasorgu",
help: "cezasorgu @Rainha/ID",
category: "cezalandirma"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !ayar.staffRoles.some(x => message.member.roles.cache.has(x))) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 15000)); 
return } 
if (isNaN(args[0])) return message.reply({ content:"Ceza ID'si bir sayı olmalıdır!"}).sil(15)
const data = await penals.findOne({ guildID: settings.guildID, id: args[0] });
if (!data) return message.reply({ content:`${args[0]} ID'li bir ceza bulunamadı!`}).sil(15)
message.reply({ embeds: [embed.setDescription(`${data.id} (\`${data.type}\`) <@${data.userID}> üyesi <t:${Math.floor(data.date / 1000)}> tarihinde <@${data.staff}> tarafından \`${data.reason}\` sebebiyle cezalandırıldı.`)] });
},
};