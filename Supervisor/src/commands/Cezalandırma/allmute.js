const moment = require("moment");
moment.locale("tr");
const emojis = require('../../configs/emojiName.json')
const Discord = require("discord.js")
module.exports = {
conf: {
aliases: ["allmute"],
name: "allmute",
help: "allmute",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed) => {
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.MoveMembers)) return;
let channel = message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
if (!channel) return message.channel.send({ content:"Bir kanal ID girmeli ya da bir sesli kanalda bulunmalısın!"}).sil(15)
channel.members.filter((x) => !x.permissions.has(Discord.PermissionsBitField.Flags.Administrator)).forEach((x, index) => {
client.wait(index * 1000);
x.voice.setMute(true).catch(e => {});
});
message.reply({ content:`${message.guild.emojiGöster(emojis.ses)} ${channel} kanalındaki tüm üyeler susturuldu!`})
},
};
