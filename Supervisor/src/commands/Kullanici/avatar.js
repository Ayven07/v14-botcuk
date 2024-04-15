module.exports = {
conf: {
aliases: ["avatar","av"],
name: "avatar",
help: "avatar @Rainha/ID",
category: "kullanici"
},
exclosive: async (client, message, args, embed, prefix) => {
if (!message.guild) return;
let üye = args[0] ? (message?.mentions?.members.first() || message.guild.members.cache.find((m) => m.user.username.toLocaleLowerCase() == args[0].toLocaleLowerCase()) || message.guild.members.cache.get(args[0])) : message.member;
if (!üye && args[0]) {
return message.reply({content:`>>> Yanlış ID/kullanıcı adı veya sunucuda olmayan birisini belirttiniz. Lütfen bilgileri kontrol edip tekrar deneyiniz.`}).then((msg) => setTimeout(() => msg.delete().catch(() => { }), 15000));
};
await message.reply({ embeds: [embed.setAuthor({name: `${üye.user.globalName || üye.user.username}`, iconURL: üye.displayAvatarURL({dynamic: true})}).setImage(üye.displayAvatarURL({dynamic:true, size:4096}))]})
},
};