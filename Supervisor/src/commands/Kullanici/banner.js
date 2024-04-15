const axios = require('axios');
module.exports = {
conf: {
aliases: ["banner"],
name: "banner",
help: "banner @Rainha/ID",
category: "kullanici"
},
exclosive: async (client, message, args, embed, prefix) => {
let üye = args[0] ? (message?.mentions?.members.first() || message.guild.members.cache.find((m) => m.user.username.toLocaleLowerCase() == args[0].toLocaleLowerCase()) || message.guild.members.cache.get(args[0])) : message.member;
if (!üye && args[0]) {
return message.reply({content:`>>> Yanlış ID/kullanıcı adı veya sunucuda olmayan birisini belirttiniz. Lütfen bilgileri kontrol edip tekrar deneyiniz.`}).then((msg) => setTimeout(() => msg.delete().catch(() => { }), 15000));
};
async function bannerXd(user, client) {
const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
if(!response.data.banner) return `https://media.discordapp.net/attachments/938786568175513660/972982817359274024/Banner_bulunmamakta.png`
if(response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=4096`
else return(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=4096`)
}
let banner = await bannerXd(üye.id, client)
await message.reply({embeds: [embed.setAuthor({name: `${üye.user.globalName || üye.user.username}`, iconURL: üye.displayAvatarURL({dynamic: true})}).setImage(`${banner}`)] }) 
},
};