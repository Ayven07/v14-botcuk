module.exports = {
conf: {
aliases: ["link","url"],
name: "link",
help: "link",
category: "kullanici"
},
exclosive: async (client, message, args, embed, prefix) => {
if(!message.guild.vanityURLCode) return message.reply({ content:">>> Sunucuda bir özel url yok."}).sil(15)
const url = await message.guild.fetchVanityData();
message.reply({ content: `>>> discord.gg/${message.guild.vanityURLCode}\n\nToplam kullanım: **${url.uses}**`})
},
};
