const Discord = require('discord.js');
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json");
module.exports = {
conf: {
aliases: ["emoji","addemoji"],
name: "emojiekle",
help: "emojiekle [Emoji]",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed) => {
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;    
if(!message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageEmojisAndStickers) && !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator) && !ayars.ownerRoles.some(x => message.member.roles.cache.has(x)) && !ayars.roleAddRoles.some(s => message.member.roles.cache.has(s))) return message.reply({ content: `${message.author} bu komutu kullanabilmek için **Emojileri Yönet** Yetkisine sahip olmalısın.` }).sil(15)
if(!args.length) return message.reply({ embeds: [embed.setDescription(`Bir Emoji Belirt.`)] }).sil(15);
if(args.length > 10) return message.reply({ embeds: [embed.setDescription(`**Tek Seferde \` 10 \` Adet Emoji Ekliyebilirsin!**`)] }).sil(15);
for(let raw of args){
let parsed = parseEmoji(raw);
if(parsed.id){
let ext = parsed.animated ? ".gif" : ".png";
let url = `https://cdn.discordapp.com/emojis/${parsed.id}${ext}`;
var emoji = await message.guild.emojis.create({name:parsed.name,attachment:url}).catch(err => {return message.reply({content:`**Bir Hata Oluştu!** ${err}`})})
if(args.length == 1) {
message.reply({ embeds: [embed.setThumbnail(emoji.url).setColor("Random").setDescription(`${emoji} *Emoji Sunucuya Eklendi!*`)] })
}
if(args.length > 1) {
message.channel.send({ embeds: [embed.setThumbnail(emoji.url).setColor("Random").setDescription(`${emoji} *Emoji Sunucuya Eklendi!*`)] })
}  
}
}
}
}
function parseEmoji(text) {
if (text.includes('%')) text = decodeURIComponent(text);
if (!text.includes(':')) return { animated: false, name: text, id: undefined };
const match = text.match(/<?(?:(a):)?(\w{1,32}):(\d{17,19})?>?/);
return match && { animated: Boolean(match[1]), name: match[2], id: match[3] };
}
