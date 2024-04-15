
const emojis = require('../configs/emojiName.json')
const setups = require("../schemas/setup")
const settings = require("../configs/settings.json")
module.exports = async (oldMember, newMember) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;   
if (!oldMember.roles.cache.has(ayar.boosterRoles) && newMember.roles.cache.has(ayar.boosterRoles)) {
let member = newMember
member.guild.channels.cache.get(ayar.chatChannel).send({content: `${member} *Ne güzel basıyorsun sen öyle?* ${member.guild.emojiGöster(emojis.ayicik)}`, files: ['https://images-ext-1.discordapp.net/external/k1QTD72I4LokLkGgVO_0BMVMURbLTRoNPecmctHf8F0/https/media.tenor.com/NHVt1o_oymAAAAPo/ekrem-abi-kolpa%25C3%25A7ino.mp4']})
}
};  
module.exports.conf = {
name: "guildMemberUpdate",
};