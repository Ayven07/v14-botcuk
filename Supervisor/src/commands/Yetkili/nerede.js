const voice = require("../../schemas/voiceInfo");
const Discord = require("discord.js");
const emojis = require('../../configs/emojiName.json')
const moment = require("moment");
require("moment-duration-format");
const setups = require("../../schemas/setup")
const a = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["nerede", "n","sestemi"],
name: "nerede",
help: "nerede @Rainha/ID",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: a.guildID})
if(!ayar) return;  
if(!ayar.staffRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
{message.react(message.guild.emojiGöster(emojis.no))
return
}
const channel = message.guild.channels.cache.get(args[0]);
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if (channel) {
const data = await voice.find({}).sort({ date: -1 });
message.reply({embeds: [embed.setDescription(`
${channel} adlı kanaldaki üyelerin ses bilgileri:

${channel.members.map((x, index) => `${x.toString()}: \`${data.find((u) => u.userID === x.user.id) ? moment.duration(Date.now() - data.find((u) => u.userID === x.user.id).date).format("H [saat], m [dakika], s [saniyedir]") : "Bulunamadı!"} seste.\``).join("\n")}`)]});
} else if(member){
if(!member) return message.react(message.guild.emojiGöster(emojis.no))
if (!member.voice.channel) return message.channel.send({ content:`${message.guild.emojiGöster(emojis.no)} ${member.toString()} üyesi herhangi bir ses kanalında bulunmuyor!`}).sil(15)
const data = await voice.findOne({ userID: member.user.id });
message.react(message.guild.emojiGöster(emojis.yes))
let mic = member.voice.selfMute ? `Kapalı!` : `Açık!`
let kulak = member.voice.selfDeaf ? `Kapalı!` : `Açık!`
let ekran =  member.voice.streaming ? `Açık!` : `Kapalı!`
let kamera = member.voice.selfVideo ? `Açık!` : `Kapalı!`
let voiceChannel = member.voice.channel
let limit = member.voice.channel.userLimit || "0";
const datas = await voice.find({}).sort({ date: -1 });
voiceChannel.createInvite().then(invite =>
message.reply({ embeds: [embed.setDescription(`
${member.toString()} kişisi <#${member.voice.channel.id}> kanalında.\nMikrofonu: ${mic}\nKulaklığı: ${kulak}\nEkranı: ${ekran}\nKamerası: ${kamera}\n\nKanala gitmek için [tıklaman](https://discord.gg/${invite.code}) yeterli
\`\`\`\nBilgiler:\n\`\`\`
<#${member.voice.channel.id}> kanalındaki üye durumu \`${voiceChannel.members.size}/${limit}\` 

${datas.find((u) => u.userID === member.id) ? moment.duration(Date.now() - datas.find((u) => u.userID === member.id).date).format("H [saat], m [dakika], s [saniyedir]") : "0 Saniyedir"} Seste.`)
.addFields({name: `**Ses kanalında bulunan üyeler:**`, value: `\`\`\`xl\n${member.voice.channel.members.size <= 8 ? member.voice.channel.members.map(x => x.displayName).join("\n") : `${member.voice.channel.members.array().slice(0, 8).map(x => x.displayName).join("\n")} ve ${member.voice.channel.members.size - 8} kişi daha.`}\n\`\`\``, inline: true}).setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) }).setFooter({ text: `${message.guild.name} | ${moment(Date.now()).format("LLL")}`})]}));

    }
  },
};