const Discord = require("discord.js");
const inviterSchema = require("../../schemas/inviter");
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
const inviteMemberSchema = require("../../schemas/inviteMember");
module.exports = {
conf: {
aliases: ["invites", "invite"],
name: "invites",
help: "invite @Rainha/ID",
category: "kullanici"
},
exclosive: async (client, message, args) => {
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
const inviterData = await inviterSchema.findOne({ guildID: settings.guildID, userID: member.user.id });
const total = inviterData ? inviterData.total : 0;
const regular = inviterData ? inviterData.regular : 0;
const bonus = inviterData ? inviterData.bonus : 0;
const leave = inviterData ? inviterData.leave : 0;
const fake = inviterData ? inviterData.fake : 0;
const invMember = await inviteMemberSchema.find({ guildID: settings.guildID, inviter: member.user.id });
const daily = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
const weekly = invMember ? message.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;    
const embed = new Discord.EmbedBuilder()
.setAuthor({ name: member.user.username, iconURL:  member.user.avatarURL({ dynamic: true }) })
.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
.setDescription(`
${message.guild.emojiGöster(emojis.star)} Toplam **${total}** davet. **${regular} gerçek | ${bonus} bonus | ${leave} ayrılmış | ${fake} fake **
      
${message.guild.emojiGöster(emojis.yldz)} Günlük: **${daily}** | Haftalık: **${weekly}**`);
message.react(message.guild.emojiGöster(emojis.yes))
message.channel.send({ embeds: [embed]}).catch(e => {});
},
};
