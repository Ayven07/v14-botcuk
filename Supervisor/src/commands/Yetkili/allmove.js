module.exports = {
conf: {
aliases: ["toplutaşı","allmove"],
name: "toplutaşı",
help: "toplutaşı [Taşıyacağınız Kanal]",
category: "yetkili"
},
exclosive: async (client, message, args, embed) => {
if (!message.guild) return;    
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;
let kanal = message.guild.channels.cache.get(args[0]);
if(!message.member.voice.channelId) return;
if (kanal && kanal.type == Discord.ChannelType.GuildVoice) {
message.member.voice.channel.members.map((a) => {
a.voice.setChannel(kanal.id);	
});
message.channel.send({ content: `**${message.member.voice.channel.members.size}** adet üyeyi başarılı bir şekilde ${kanal} kanalına taşıdınız!`})
}
},
};