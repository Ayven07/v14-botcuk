const moment = require("moment")
const ms = require("ms")
const Discord = require("discord.js")
moment.locale("tr")
const commandDBS = require("../schemas/vrcRoleCommands")
const emojis = require('../configs/emojiName.json')
const a = require('../configs/settings.json');
module.exports = async (message) => {
const data = {};
this.commands = new Discord.Collection();
this.aliases = new Discord.Collection();    
let prefikslerim = a.prefix;
let canım = false;
for (const içindeki of prefikslerim) {
if (message.content.startsWith(içindeki)) canım = içindeki;
}
if (!canım) return;
const args = message.content.slice(canım.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();
if (message.guild && !message.member)
await message.guild.fetchMember(message.author);
const client = global.client
let embed = new Discord.EmbedBuilder()
const cmd = this.commands.get(command) || this.commands.get(this.aliases.get(command));
if (!cmd) {
let res = await commandDBS.findOne({
cmdName: message.content.split(" ")[0].slice(canım.length)
})
if (!res) return
if (res.allowedRoles.some(x => message.member.roles.cache.has(x)) == false && !res.allowedUsers.includes(message.author.id) && !a.owners.includes(message.author.id) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) return;
if (res.blockedUsers.includes(message.author.id)) return;
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if (!member) {
message.reply({embeds: [embed .setDescription("Bir üye etiketle ve tekrardan dene!", message.author, message.channel)]}).sil(15)
}
let role = message.guild.roles.cache.get(res.role)
if (!role) return;
if(!member) return;
if(!member.roles.cache.has(role.id)){
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {});
await member.roles.add(role.id).catch(e => {});
await message.reply({embeds: [embed .setDescription(`${member.user} üyesine <@&${role.id}> rolü verildi.`, message.author, message.channel)]}).catch(e => {});
let Embed = new Discord.EmbedBuilder().setTimestamp();
const log = await client.kanalBul("rol-log");
if (log) log.send({ embeds: [Embed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.author} adlı kullanıcı ${member} adlı kullanıcıya ${role} rolünü verdi`)] }).catch(e => {});
} else {
await message.react(message.guild.emojiGöster(emojis.yes)).catch(e => {});
await member.roles.remove(role.id).catch(e => {});
await message.reply({embeds: [embed.setDescription(`${member.user} üyesinin <@&${role.id}> rolü alındı.`, message.author, message.channel)]})   
let Eembed = new Discord.EmbedBuilder().setTimestamp();
const log = await client.kanalBul("rol-log");
if (log) log.send({ embeds: [Eembed.setDescription(`${message.guild.emojiGöster(emojis.yes)} ${message.author} adlı kullanıcı ${member} adlı kullanıcıdan ${role} rolünü aldı`)] }).catch(e => {});
}
return
}
}
module.exports.conf = {
name: "messageCreate",
};