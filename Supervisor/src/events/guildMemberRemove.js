const client = global.client;
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const settings = require("../configs/settings.json");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const streamUser = require("../schemas/streamUser")
const cameraUser = require("../schemas/cameraUser")
const setups = require("../schemas/setup")
const emojis = require('../configs/emojiName.json')
const coin = require("../schemas/coin")
const regstats = require("../schemas/registerStats");
const messageUserChannel = require("../schemas/messageUserChannel");
const voiceUserParent = require("../schemas/voiceUserParent");
const voiceUserChannel = require("../schemas/voiceUserChannel");
module.exports = async (member) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;      
const channel = member.guild.channels.cache.get(ayar.inviteChannel);
if (!channel) return;
if (member.user.bot) return;
const deleteOps = [
messageUser.deleteMany({ guildID: settings.guildID, userID: member.user.id }),
voiceUser.deleteMany({ guildID: settings.guildID, userID: member.user.id }),
streamUser.deleteMany({ guildID: settings.guildID, userID: member.user.id }),
cameraUser.deleteMany({ guildID: settings.guildID, userID: member.user.id }),
inviterSchema.deleteMany({ guildID: settings.guildID, userID: member.user.id }),
regstats.deleteMany({ guildID: settings.guildID, userID: member.user.id }),
messageUserChannel.deleteMany({ guildID: settings.guildID, userID: member.user.id }),
voiceUserParent.deleteMany({ guildID: settings.guildID, userID: member.user.id }),
voiceUserChannel.deleteMany({ guildID: settings.guildID, userID: member.user.id })
];
await Promise.all(deleteOps);
const inviteMemberData = await inviteMemberSchema.findOne({ guildID: settings.guildID, userID: member.user.id });
if (!inviteMemberData) {
channel.send({ content: `${member.guild.emojiGöster(emojis.leave)} \`${member.guild.members.cache.get(member.id) ? member : member.user.tag}\` **Adlı Kullanıcı <t:${Math.floor(Date.now() / 1000)}:R> Sunucumuzdan Ayrıldı. \n\` Davet Eden: \` kim tarafından davet edildiğini bulamadım.**`});
} else {
const inviter = await client.users.fetch(inviteMemberData.inviter);
await inviterSchema.findOneAndUpdate({ guildID: settings.guildID, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
const inviterData = await inviterSchema.findOne({ guildID: settings.guildID, userID: inviter.id, });
const total = inviterData ? inviterData.total : 0;
var ksayi = rakam(total)
channel.send({ content:`${member.guild.emojiGöster(emojis.leave)} \`${member.guild.members.cache.get(member.id) ? member : member.user.tag}\` **Adlı Kullanıcı <t:${Math.floor(Date.now() / 1000)}:R> Sunucumuzdan Ayrıldı. \n\` Davet Eden: \` ${inviter.tag} [Toplam Daveti: ${ksayi}**]`});
const inviterMember = member.guild.members.cache.get(inviter.id);
if(settings.coinSystem === true && !client.ranks.some((x) => inviterMember && inviterMember.roles.cache.has(x.role))) {
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: inviter.id }, { $inc: { coin: -settings.inviteCoin } }, { upsert: true });
if (inviterMember) await inviterMember.görevGüncelle(settings.guildID, "invite", -1);
}
}
};
module.exports.conf = {
name: "guildMemberRemove",
};

function rakam(sayi) {
const guild = client.guilds.cache.get(settings.guildID)
var basamakbir = sayi.toString().replace(/ /g, "     ");
var basamakiki = basamakbir.match(/([0-9])/g);
basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
if (basamakiki) {
basamakbir = basamakbir.replace(/([0-9])/g, d => {
return {
'0': `${guild.emojis.cache.find(x => x.name == emojis.sifir)}`,
'1': `${guild.emojis.cache.find(x => x.name == emojis.bir)}`,
'2': `${guild.emojis.cache.find(x => x.name == emojis.iki)}`,
'3': `${guild.emojis.cache.find(x => x.name == emojis.uc)}`,
'4': `${guild.emojis.cache.find(x => x.name == emojis.dort)}`,
'5': `${guild.emojis.cache.find(x => x.name == emojis.bes)}`,
'6': `${guild.emojis.cache.find(x => x.name == emojis.alti)}`,
'7': `${guild.emojis.cache.find(x => x.name == emojis.yedi)}`,
'8': `${guild.emojis.cache.find(x => x.name == emojis.sekiz)}`,
'9': `${guild.emojis.cache.find(x => x.name == emojis.dokuz)}`
}
[d];
})
}
return basamakbir;
}