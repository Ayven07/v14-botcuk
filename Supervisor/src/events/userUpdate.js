const Discord = require("discord.js");
const client = global.client;
const bannedTag = require("../schemas/bannedTag");
const settings = require("../configs/settings.json")
const regstats = require("../schemas/registerStats");
const setups = require("../schemas/setup")
module.exports = async (oldUser, newUser) => {
if (oldUser.bot || newUser.bot || (oldUser.globalName === newUser.globalName)) return;
const guild = client.guilds.cache.get(settings.guildID);
if (!guild) return;
const member = guild.members.cache.get(oldUser.id);
if (!member) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return; 
const res = await bannedTag.findOne({ guildID: settings.guildID });
if (!res) return
res.taglar.forEach((x) => {  
if (oldUser.globalName && !oldUser.globalName.includes(x) && newUser.globalName && newUser.globalName.includes(x)) {
if(!member.roles.cache.has(ayar.boosterRoles)) return;
member.roles.set(ayar.bannedTagRoles).catch(e => {});
member.setNickname('Yasaklı Tag').catch(e => {});
member.send({ content:`${guild.name} adlı sunucumuza olan erişiminiz engellendi! Sunucumuzda yasaklı olan bir simgeyi (${x}) isminizde taşımanızdan dolayıdır. Sunucuya erişim sağlamak için simgeyi (${x}) isminizden çıkartmanız gerekmektedir.\n\nSimgeyi (${x}) isminizden kaldırmanıza rağmen üstünüzde halen Yasaklı Tag rolü varsa sunucudan gir çık yapabilirsiniz veya sağ tarafta bulunan yetkililer ile iletişim kurabilirsiniz. **-Yönetim**\n\n__Sunucu Tagımız__\n**${ayar.serverTag.map(x => `${x}`).join(" ")}**`}).catch(e => {});
} else if (oldUser.globalName && oldUser.globalName.includes(x) && newUser.globalName && !newUser.globalName.includes(x)) { 
if(!member.roles.cache.has(ayar.boosterRoles)) return;
member.roles.set(ayar.unregRoles).catch(e => {});
member.setNickname(`${ayar.defaultTag} İsim | Yaş`).catch(e => {});
member.send({ content:`${guild.name} adlı sunucumuza olan erişim engeliniz kalktı. İsminizden (${x}) sembolünü kaldırarak sunucumuza erişim hakkı kazandınız. Keyifli Sohbetler**-Yönetim**`}).catch(e => {});
}
})
};
module.exports.conf = {
name: "userUpdate",
};