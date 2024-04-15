const Discord = require('discord.js');
const moment = require("moment")
const emojis = require('../../configs/emojiName.json')
moment.locale("tr")
module.exports = {
conf: {
aliases: ["roldenetle"],
name: "roldenetim",
help: "roldenetim @Rol/ID",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed, prefix) => { 
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator))
{
message.reply({ content:"Bu işlemi yapamazsın dostum!"}).sil(15)
message.react(message.guild.emojiGöster(emojis.no))
return;
}
const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
if (!role) return message.reply({content: `Denetleyebilmem için lütfen bir rol belirtiniz.`, ephemeral: true }).sil(15)
let unVoice = role.members.filter(member => !member.voice.channel);
let list = 1
let veri = `\`${moment(Date.now()).format("LLL")}\` Tarihinde ${message.member.user.tag} tarafından istenmiştir!\n` + role.members.map((e) => e ? `#${list++} ••❯ ID: ${e.id} - İsim: ${e.displayName} - ${e.voice.channel ? "Seste" : "Seste Değil"}` : "").join("\n")
await message.reply({
content: `\` ••❯ \` Aşağıda **${moment(Date.now()).format("LLL")}** tarihinde istenen ${role} isimli rol bilgisi ve rol denetimi belirtilmiştir. (**Dosya içerisinde genel seste olan olmayan olarak üyeleri listelenmiştir.**)
${Discord.Formatters.codeBlock("fix", "Rol: " + role.name + " | " + role.id + " | " + role.members.size + " Toplam Üye | " + unVoice.size + " Seste Olmayan Üye")}`,
files: [{attachment: Buffer.from(veri),name: `${role.name}.txt`}]})
message.channel.send({content: `Aşağıda **${role.name}** (\`${role.id}\`) isimli rolünün seste olmayan üyeleri sıralandırılmıştır.\n${unVoice.map(e => `${e}`).join("\n")}`}).catch(e => {})        
}
}