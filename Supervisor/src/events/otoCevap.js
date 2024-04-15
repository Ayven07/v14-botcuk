const Discord = require("discord.js")
const setups = require("../schemas/setup")
const a = require("../configs/settings.json")
module.exports = async (message) => {
if(!message.guild) return;
const ayar = await setups.findOne({guildID: a.guildID})
if(!ayar) return;  
if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === ".tag") {
if(ayar.tagSystem == false) return;
const tags = ayar.serverTag.join(" - ")
message.reply({ content: `${tags}`}).catch(e => {});
}
if (message.content.toLowerCase() == "selamin aleyküm" || message.content.toLowerCase() == "selamin aleykum" || message.content.toLowerCase() == "selamın aleyküm" || message.content.toLowerCase() == "selamın aleykum" || message.content.toLowerCase() == "selam" || message.content.toLowerCase() == "selamun aleykum" || message.content.toLowerCase() == "sea" || message.content.toLowerCase() == "selamün aleykum" || message.content.toLowerCase() == "selamün aleyküm" || message.content.toLowerCase() == "sa" || message.content.toLowerCase == "s.a") {
if(message.author.bot) return;
message.reply({ content: `${message.member}, *Aleyküm Selam Hoşgeldin.*`}).catch(e => {});
}
};
module.exports.conf = {
name: "messageCreate",
};