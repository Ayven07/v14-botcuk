const Discord = require("discord.js");
const client = global.client;
let sended = false;
const emojis = require('../configs/emojiName.json')
const bannedCmd = require("../schemas/bannedcmd")
const settings = require("../configs/settings.json")
const setups = require("../schemas/setup")
setInterval(() => {
client.cooldown.forEach((x, index) => {
if (Date.now() - x.lastUsage > x.cooldown) client.cooldown.delete(index);
});
}, 8000);
module.exports = async (message) => {
const ayar = await setups.findOne({guildID: settings.guildID})
let prefix = settings.prefix.find((x) => message.content.toLowerCase().startsWith(x));
if (message.author.bot || !message.guild || !prefix || ayar && ayar.unregRoles.some(x => message.member.roles.cache.has(x)) || ayar && ayar.jailRoles.some(x => message.member.roles.cache.has(x)) || ayar && ayar.bannedTagRoles.some(x => message.member.roles.cache.has(x))) return;
let args = message.content.substring(prefix.length).trim().split(" ");
let commandName = args[0].toLowerCase();
const embed = new Discord.EmbedBuilder().setColor("Random").setFooter({ text: `${ayar && ayar.botFooter ? ayar.botFooter : `${message.guild.name}`}`, iconURL: message.member.user.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || message.author.displayAvatarURL({dynamic: true })}).setColor(message.member.displayHexColor).setAuthor({ name: message.member.displayName, iconURL: message.member.user.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || message.author.avatarURL({ dynamic: true })});
args = args.splice(1);
let cmd = client.commands.has(commandName) ? client.commands.get(commandName) : client.commands.get(client.aliases.get(commandName));
if (cmd) {
if (cmd.conf.owner && !settings.owners.includes(message.author.id) && !ayar.ownerRoles.some(x => message.member.roles.cache.has(x))) return; 
let kanallar = [ayar && ayar.chatChannel]
if(kanallar.includes(message.channel.id) && !["snipe", "sil", "temizle", "kilit"].some(x => commandName == x) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} bot komutları chat kanallarında kullanamazsın.`}).sil(15)
var veri = await bannedCmd.findOne({guildID: settings.guildID}) || {"kullanici": []};                                             
if (veri.kullanici.includes(message.member.id)) return message.reply({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.no)} ${message.member} Komut kullanımınız yasaklanmış.`)]}).sil(15)
const cooldown = cmd.conf.cooldown || 10000
const cd = client.cooldown.get(message.author.id);
if (cd && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
const diff = Date.now() - cd.lastUsage;
if (diff < cooldown)
if (!sended) {
sended = true;
return message.channel.send({ content:`${message.author}, Bu komutu tekrar kullanabilmek için **${Number(((cooldown - diff) / 1000).toFixed(2))}** saniye daha beklemelisin!`}).sil(10)
}
} else client.cooldown.set(message.author.id, { cooldown, lastUsage: Date.now() });
cmd.exclosive(client, message, args, embed, prefix);
} 
};
module.exports.conf = {
name: "messageCreate",
};