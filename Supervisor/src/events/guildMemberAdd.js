const client = global.client;
const Discord = require("discord.js");
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const regstats = require("../schemas/registerStats");
const setups = require("../schemas/setup")
const settings = require("../configs/settings.json")
const penals = require("../schemas/penals");
const moment = require("moment");
const coin = require("../schemas/coin")
const nameData = require("../schemas/names")
const booster = require("../schemas/booster")
const emojis = require('../configs/emojiName.json')
const forceBans = require("../schemas/forceBans");
const leaveLimit = require('../schemas/leaveLimit')
const memberss = new Map();
module.exports = async (member) => {
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;
memberss.set(settings.guildID, {
user: member.id
})
const lDB = await leaveLimit.findOne({guildID: settings.guildID, userID: member.user.id})
const data = await forceBans.findOne({ guildID: settings.guildID, userID: member.user.id });
if (data) return member.guild.members.ban(member.user.id, { reason: "Sunucudan kalıcı olarak yasaklandı!" }).catch(() => {});
if(member.user.bot) return;
const kayitchannel = member.guild.channels.cache.get(ayars.welcomeChannel);
if(lDB && lDB.db >= 3) {
if(kayitchannel) kayitchannel.send({embeds: [new Discord.EmbedBuilder().setDescription(`>>> ${member}, Üyesi Sürekli **Çıkış-Giriş** Yaptığı İçin Yasaklandı.`).setAuthor({name: member.user.globalName, iconURL: member.user.avatarURL({})}).setFooter({text: `Kullanıcı: ${member.user.username}`, iconURL: member.user.avatarURL({})})]})
await member.ban({reason: "Sürekli Çıkış/Giriş Yapmak."})
await leaveLimit.deleteOne({guildID: settings.guildID, userID: member.user.id})
return; } else {
if(!lDB) new leaveLimit({guildID: settings.guildID, userID: member.user.id, db: 1}).save();
if(lDB) await leaveLimit.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $inc: { db: 1} }, { upsert: true })
}
const embed = new Discord.EmbedBuilder().setColor("Random").setThumbnail(member.guild.iconURL({dynamic:true})).setFooter({ text: `${ayars && ayars.botFooter ? ayars.botFooter : `${message.guild.name}`}`, iconURL: member.user.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || member.displayAvatarURL({dynamic: true })}).setColor(member.displayHexColor).setAuthor({ name: member.displayName, iconURL: member.user.avatar == null && "https://media.discordapp.net/attachments/1121836955001430017/1122866615072063508/Picsart_23-06-26_15-30-29-413.png" || member.user.avatarURL({ dynamic: true })});
const tags = ayars.serverTag.join(" - ")  
await member.setNickname(`${ayars.defaultTag} ${ayars.unregName}`).catch(e => {});
await member.roles.add(ayars.unregRoles).catch(e => {});  
if (ayars.serverTag.some(s => member.user.globalName && member.user.globalName.includes(s)) && ayars.tagSystem == true) {
await member.roles.add(ayars.tagRoles).catch(e => {});
await member.roles.add(ayars.unregRoles).catch(e => {});
const channel = await client.kanalBul("taglı-log")
channel.send({ content:`${member} adlı kişi sunucumuza taglı şekilde katıldı, isminde ${tags} tagı bulunuyor.`})
} 
let memberGün = moment(member.user.createdAt).format("DD");
let memberTarih = moment(member.user.createdAt).format("YYYY HH:mm");
let memberAylar = moment(member.user.createdAt).format("MM").replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık");
let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
var üyesayısı = member.guild.memberCount.toString().replace(/ /g, "    ")
var üs = üyesayısı.match(/([0-9])/g)
üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()
if(üs) {
üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
return {
'0': `${member.guild.emojiGöster(emojis.sifir)}`,
'1': `${member.guild.emojiGöster(emojis.bir)}`,
'2': `${member.guild.emojiGöster(emojis.iki)}`,
'3': `${member.guild.emojiGöster(emojis.uc)}`,
'4': `${member.guild.emojiGöster(emojis.dort)}`,
'5': `${member.guild.emojiGöster(emojis.bes)}`,
'6': `${member.guild.emojiGöster(emojis.alti)}`,
'7': `${member.guild.emojiGöster(emojis.yedi)}`,
'8': `${member.guild.emojiGöster(emojis.sekiz)}`,
'9': `${member.guild.emojiGöster(emojis.dokuz)}`}[d];
})
}     

const channel = member.guild.channels.cache.get(ayars.inviteChannel);
if (!channel) return;
if (guvenilirlik) {
if(ayars.fakeAccRoles) member.roles.set(ayars.fakeAccRoles).catch(e => {});
}
const otokayit = await booster.findOne({guildID: settings.guildID, userID: member.user.id})  
let datas = await regstats.findOne({ guildID: settings.guildID})
if(otokayit && datas && datas.tagMode == false && ayars.otoRegister == true) { 
await member.setNickname(otokayit.names).catch(e => {})
if(otokayit.cinsiyet == "Erkek") {
await member.roles.set(ayars.manRoles).catch(e => {}) 
kayitchannel.send({content: `${member.guild.emojiGöster(emojis.member)} ${member} Kullanıcısı Daha Önceden Sunucumuzda **${otokayit.names}** İsmiyle Ve **Erkek** Olarak Kayıtlı Olduğu İçin Otomatik Olarak Kayıt Edildi.`}).catch(e => {})  
} else if(otokayit.cinsiyet == "Kadin") {
await member.roles.set(ayars.womanRoles).catch(e => {}) 
kayitchannel.send({content: `${member.guild.emojiGöster(emojis.member)} ${member} Kullanıcısı Daha Önceden Sunucumuzda **${otokayit.names}** İsmiyle Ve **Kız** Olarak Kayıtlı Olduğu İçin Otomatik Olarak Kayıt Edildi.`}).catch(e => {})
} 
return; } 
const registerRooms = await member.guild.channels.cache.filter(c => ayars.registerParents.some(a => a == c.parentId) && c.type === Discord.ChannelType.GuildVoice);
const kurallar = member.guild.channels.cache.get(ayars.rulesChannel);
if (member.user.bot) return;
const cachedInvites = client.invites.get(settings.guildID)
if(ayars.welcomeMessageEmbed == false)  {
if(!cachedInvites) {
channel.send({ content:`${member.guild.emojiGöster(emojis.join)} ${member} <t:${Math.floor(Date.now() / 1000)}:R> **sunucuya katıldı.** [**Davet Eden Bulunamadı.**]`})
kayitchannel.send({ content:`
>>> ${member.guild.emojiGöster(emojis.konfeti)} ${member}, **${member.guild.name}** Sunucumuza hoşgeldin. Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı.

Hesabın __${memberGün} ${memberAylar} ${memberTarih}__ tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) oluşturulmuş.
${registerRooms.random()} kanalına geçerek <@&${ayars.registerPerms}> görevlilerine teyit verip kayıt olabilirsiniz.

Sunucumuza kayıt olduğunuzda ${kurallar} kanalına göz atmayı unutmayınız.
Kayıt olduğunuzda kuralları okuduğunuzu varsayarak ceza işlemerinizi bunu göz önünde bulundurarak yapacağız.`});
return }

const newInvites = await member.guild.invites.fetch();
const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);
newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
client.invites.set(settings.guildID, cachedInvites);
if (!usedInvite) {
const url = await member.guild.fetchVanityData();
var ourl = rakam(url.uses)
channel.send({ content:`${member.guild.emojiGöster(emojis.join)} ${member} **Adlı Kullanıcı <t:${Math.floor(Date.now() / 1000)}:R> Sunucuya Katıldı. \n\` Davet Eden: \` Özel URL [Toplam Kullanım: ${ourl}]**`})
kayitchannel.send({ content:`
>>> ${member.guild.emojiGöster(emojis.konfeti)} ${member}, **${member.guild.name}** Sunucumuza hoşgeldin. Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı.

Hesabın __${memberGün} ${memberAylar} ${memberTarih}__ tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) oluşturulmuş.
${registerRooms.random()} kanalına geçerek <@&${ayars.registerPerms}> görevlilerine teyit verip kayıt olabilirsiniz.

Sunucumuza kayıt olduğunuzda ${kurallar} kanalına göz atmayı unutmayınız.
Kayıt olduğunuzda kuralları okuduğunuzu varsayarak ceza işlemerinizi bunu göz önünde bulundurarak yapacağız.`});
return }
await inviteMemberSchema.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { inviter: usedInvite.inviter.id } }, { upsert: true });
if (Date.now() - member.user.createdTimestamp <= 1000 * 60 * 60 * 24 * 7) {
await inviterSchema.findOneAndUpdate({ guildID: settings.guildID, userID: usedInvite.inviter.id }, { $inc: { fake: 1 } }, { upsert: true });
const inviterData = await inviterSchema.findOne({ guildID: settings.guildID, userID: usedInvite.inviter.id });
const total = inviterData ? inviterData.total : 0;
var ksayi = rakam(total)
channel.send({ content:`${member.guild.emojiGöster(emojis.join)} ${member} **Adlı Kullanıcı <t:${Math.floor(Date.now() / 1000)}:R> Sunucuya Katıldı. \n\` Davet Eden: \` ${usedInvite.inviter.tag} [Toplam Daveti: ${ksayi}]**`})
kayitchannel.send({ content:`${member} isimli üye sunucuya katıldı fakat hesabı (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) açıldığı için şüpheli olarak işaretlendi.`});
member.roles.set(ayars.fakeAccRoles).catch(e => {});
member.setNickname("Şüpheli Hesap").catch(e => {});  
} else {
await inviterSchema.findOneAndUpdate({ guildID: settings.guildID, userID: usedInvite.inviter.id }, { $inc: { total: 1, regular: 1 } }, { upsert: true });
const inviterData = await inviterSchema.findOne({ guildID: settings.guildID, userID: usedInvite.inviter.id });
const total = inviterData ? inviterData.total : 0;
var ksayii = rakam(total)
kayitchannel.send({ content:`
>>> ${member.guild.emojiGöster(emojis.konfeti)} ${member} **${member.guild.name}** Sunucumuza hoşgeldin. Seninle beraber sunucumuz **${member.guild.memberCount}** üye sayısına ulaştı.

Hesabın __${memberGün} ${memberAylar}, ${memberTarih}__ tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) oluşturulmuş.
${registerRooms.random()} kanalına geçerek <@&${ayars.registerPerms}> görevlilerine teyit verip kayıt olabilirsiniz.

Sunucumuza kayıt olduğunuzda ${kurallar} kanalına göz atmayı unutmayınız.
Kayıt olduğunuzda kuralları okuduğunuzu varsayarak ceza işlemerinizi bunu göz önünde bulundurarak yapacağız.`});
channel.send({ content:`${member.guild.emojiGöster(emojis.join)} ${member} **Adlı Kullanıcı <t:${Math.floor(Date.now() / 1000)}:R> Sunucuya Katıldı. \n\` Davet Eden: \` ${usedInvite.inviter.tag} [Toplam Daveti: ${ksayii}]**`})
const inviterMember = member.guild.members.cache.get(usedInvite.inviter.id);
if(settings.coinSystem === true && inviterMember && !client.ranks.some((x) => inviterMember.roles.cache.has(x.role))) {
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: usedInvite.inviter.id }, { $inc: { coin: settings.inviteCoin } }, { upsert: true });  
if (inviterMember) await inviterMember.görevGüncelle(settings.guildID, "invite", 1);                            
}
}
} else {
const row = new Discord.ActionRowBuilder().addComponents(
new Discord.ButtonBuilder()
.setCustomId("memberisim")
.setLabel("İsim Verileri")	
.setEmoji("1176116618733043764")
.setStyle(Discord.ButtonStyle.Success),
new Discord.ButtonBuilder()
.setCustomId("membersicil")
.setLabel("Sicil Verileri")
.setEmoji("1176116618733043764")
.setStyle(Discord.ButtonStyle.Danger),            
);   
if(!cachedInvites) {
channel.send({ content:`${member.guild.emojiGöster(emojis.join)} ${member} <t:${Math.floor(Date.now() / 1000)}:R> **sunucuya katıldı.** [**Davet Eden Bulunamadı.**]`})
kayitchannel.send({content: `<@&${ayars.registerPerms}>`, embeds: [embed.setDescription(`
:tada: ${member}, **${member.guild.name}** Sunucumuza hoşgeldin.
Seninle beraber sunucumuz **${üyesayısı}** üye sayısına ulaştı.

Hesabın __${memberGün} ${memberAylar} ${memberTarih}__ tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) oluşturulmuş.

${registerRooms.random()} kanalına geçerek <@&${ayars.registerPerms}> görevlilerine teyit verip kayıt olabilirsiniz.

Sunucumuza kayıt olduğunuzda ${kurallar} kanalına göz atmayı unutmayınız.
Kayıt olduğunuzda kuralları okuduğunuzu varsayarak ceza işlemerinizi bunu göz önünde bulundurarak yapacağız.`)], components: [row]});
return }

const newInvites = await member.guild.invites.fetch();
const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);
newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
client.invites.set(settings.guildID, cachedInvites);
if (!usedInvite) {
const url = await member.guild.fetchVanityData();
var ourl = rakam(url.uses)
channel.send({ content:`${member.guild.emojiGöster(emojis.join)} ${member} **Adlı Kullanıcı <t:${Math.floor(Date.now() / 1000)}:R> Sunucuya Katıldı. \n\` Davet Eden: \` Özel URL [Toplam Kullanım: ${ourl}]**`})
kayitchannel.send({content: `<@&${ayars.registerPerms}>`, embeds: [embed.setDescription(`
:tada: ${member}, **${member.guild.name}** Sunucumuza hoşgeldin.
Seninle beraber sunucumuz **${üyesayısı}** üye sayısına ulaştı.

Hesabın __${memberGün} ${memberAylar} ${memberTarih}__ tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) oluşturulmuş.

${registerRooms.random()} kanalına geçerek <@&${ayars.registerPerms}> görevlilerine teyit verip kayıt olabilirsiniz.

Davet Eden: **Özel URL** [Toplam Kullanım: ${ourl}]

Sunucumuza kayıt olduğunuzda ${kurallar} kanalına göz atmayı unutmayınız.
Kayıt olduğunuzda kuralları okuduğunuzu varsayarak ceza işlemerinizi bunu göz önünde bulundurarak yapacağız.`)], components: [row]});
return }
await inviteMemberSchema.findOneAndUpdate({ guildID: settings.guildID, userID: member.user.id }, { $set: { inviter: usedInvite.inviter.id } }, { upsert: true });
if (Date.now() - member.user.createdTimestamp <= 1000 * 60 * 60 * 24 * 7) {
await inviterSchema.findOneAndUpdate({ guildID: settings.guildID, userID: usedInvite.inviter.id }, { $inc: { fake: 1 } }, { upsert: true });
const inviterData = await inviterSchema.findOne({ guildID: settings.guildID, userID: usedInvite.inviter.id });
const total = inviterData ? inviterData.total : 0;
var ksayi = rakam(total)
channel.send({ content:`${member.guild.emojiGöster(emojis.join)} ${member} **Adlı Kullanıcı <t:${Math.floor(Date.now() / 1000)}:R> Sunucuya Katıldı. \n\` Davet Eden: \` ${usedInvite.inviter.username} [Toplam Daveti: ${ksayi}]**`})
kayitchannel.send({ content:`${member} isimli üye sunucuya katıldı fakat hesabı (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) açıldığı için şüpheli olarak işaretlendi.`});
member.roles.set(ayars.fakeAccRoles).catch(e => {});
member.setNickname("Şüpheli Hesap").catch(e => {});  
} else {
await inviterSchema.findOneAndUpdate({ guildID: settings.guildID, userID: usedInvite.inviter.id }, { $inc: { total: 1, regular: 1 } }, { upsert: true });
const inviterData = await inviterSchema.findOne({ guildID: settings.guildID, userID: usedInvite.inviter.id });
const total = inviterData ? inviterData.total : 0;
var ksayii = rakam(total)
kayitchannel.send({content: `<@&${ayars.registerPerms}>`, embeds: [embed.setDescription(`
:tada: ${member}, **${member.guild.name}** Sunucumuza hoşgeldin.
Seninle beraber sunucumuz **${üyesayısı}** üye sayısına ulaştı.

Hesabın __${memberGün} ${memberAylar} ${memberTarih}__ tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) oluşturulmuş.

${registerRooms.random()} kanalına geçerek <@&${ayars.registerPerms}> görevlilerine teyit verip kayıt olabilirsiniz.

Davet Eden: ${usedInvite.inviter} [Toplam Daveti: ${ksayii}]

Sunucumuza kayıt olduğunuzda ${kurallar} kanalına göz atmayı unutmayınız.
Kayıt olduğunuzda kuralları okuduğunuzu varsayarak ceza işlemerinizi bunu göz önünde bulundurarak yapacağız.`)], components: [row]});
channel.send({ content:`${member.guild.emojiGöster(emojis.join)} ${member} **Adlı Kullanıcı <t:${Math.floor(Date.now() / 1000)}:R> Sunucuya Katıldı. \n\` Davet Eden: \` ${usedInvite.inviter.username} [Toplam Daveti: ${ksayii}]**`})
const inviterMember = member.guild.members.cache.get(usedInvite.inviter.id);
if(settings.coinSystem === true && !client.ranks.some((x) => inviterMember && inviterMember.roles.cache.has(x.role))) {
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: usedInvite.inviter.id }, { $inc: { coin: settings.inviteCoin } }, { upsert: true });  
if (inviterMember) await inviterMember.görevGüncelle(settings.guildID, "invite", 1);                            
}
} 
} 
};
module.exports.conf = {
name: "guildMemberAdd",
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

client.on(Discord.Events.InteractionCreate, async(interaction) => {
if(interaction.customId == 'memberisim') {
const ayar = await setups.findOne({guildID: settings.guildID})   
if(!ayar) return;
if(!ayar.staffRoles.some((x) => interaction.member.roles.cache.has(x)) && !interaction.member.roles.cache.has(ayar.registerPerms) && !interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;
let data = memberss.get(settings.guildID)  
if(!data) return;
const guild = client.guilds.cache.get(settings.guildID)
if(!guild) return;
const member = guild.members.cache.get(data.user)
if(!member) return;
const nameDb = await nameData.findOne({guildID: guild.id, userID: member.id})
if(!nameDb) return;
if(nameDb.names.length < 0) return;
interaction.reply({embeds: [new Discord.EmbedBuilder().setDescription(`${emojis.warn} ${member}, Kullanıcısının İsim Geçmişi;\n\n${nameDb.names.map((x, index) => `\` ${index+1}. ${x.name} \` (${x.rol}) <@${x.yetkili}> [ <t:${Math.floor(x.date / 1000)}:R> ]`).join('\n')}`)], ephemeral: true}).catch((err) => {})
}
const ayar = await setups.findOne({guildID: settings.guildID})   
if(!ayar) return;
if(!ayar.staffRoles.some((x) => interaction.member.roles.cache.has(x)) && !interaction.member.roles.cache.has(ayar.registerPerms) && !interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;
if(interaction.customId == 'membersicil') {
let data = memberss.get(settings.guildID)  
if(!data) return;
const guild = client.guilds.cache.get(settings.guildID)
const member = guild.members.cache.get(data.user)
if(!member) return; 
let dataDB = await penals.find({ guildID: settings.guildID, userID: member.user.id, }).sort({ date: -1 });
if (dataDB.length === 0) return interaction.reply({ content:`${interaction.guild.emojis.cache.find(x => x.name == emojis.yes)} ${member} üyesinin sicili temiz!`, ephemeral: true}).catch((err) => {})
interaction.reply({embeds: [new Discord.EmbedBuilder().setDescription(`${emojis.warn} ${member}, Kullanıcısının Sicil Geçmişi;\n\n${dataDB.map((x, index) => `\`${index+1}\` (\`${x.type}\`) <t:${Math.floor(x.date / 1000)}> tarihinde <@${x.staff}> tarafından \`${x.reason}\` sebebiyle cezalandırıldı.`).join('\n')}`)], ephemeral: true}).catch((err) => {})
}
})

