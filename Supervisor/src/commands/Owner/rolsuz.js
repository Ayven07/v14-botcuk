const settings = require("../../configs/settings.json");
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: ["rolsuz","rolsüz"],
name: "rolsuz ver",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed) => {
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;    
let Rainha = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== settings.guildID).size == 0)
if(args[0] == "ver") {
Rainha.forEach(r => {
r.roles.add(ayars.unregRoles).catch(e => {})
})
message.channel.send({ embeds: [embed.setDescription("Sunucuda rolü olmayan \`"+ Rainha.size +"\` kişiye kayıtsız rolü verildi!")] });
} else if(!args[0]) {
message.channel.send({ embeds: [embed.setDescription("Sunucumuzda rolü olmayan \`"+ Rainha.size +"\` kişi var. Bu kişilere kayıtsız rolü vermek için \`.rolsüz ver\` komutunu uygulayın!")] });   
}
},
};
 