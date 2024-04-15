const Discord = require("discord.js")
const setups = require("../../schemas/setup")
const Users = require("../../schemas/users.js");
const settings = require("../../configs/settings.json")
const coin = require("../../schemas/coin");
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["yetkiver", "yetki-ver", "ytver", "yt-ver", "yt"],
name: "yetkiver",
help: "yetkiver @Rainha/ID",
category: "yetkili"
},

exclosive: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;   
if(settings.coinSystem === false) return message.reply({embeds: [embed.setDescription(`Terfi Sistemi Aktif Değil!`)]}).sil(15)
if(!ayar.roleAddRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
{
message.reply({ content:`Malesef yetkin bulunmamakta dostum.`}).sil(15)
return }
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) return message.reply({content: 'Bir Kullanıcı Belirtmelisin.'}).sil(15)
if (message.member.roles.highest.position <= member.roles.highest.position) return message.reply({embeds: [embed.setDescription("Kendinle aynı yetkide ya da daha yetkili olan birine rol veremezsin!")]}).sil(15)
let kontrol = await Users.findOne({_id: member.id})
if(kontrol && kontrol.Staff) return message.reply({content: `${member} isimli üye zaten yetkili olarak belirlenmiş.`}).sil(15)
if(ayar.staffRoles.some((x) => member.roles.cache.has(x))) return;
const roleOptions = client.ranks.map(x => {
return { label: message.guild.roles.cache.get(x.role) ? message.guild.roles.cache.get(x.role).name : 'null', value: x.role ? x.role : 'null', emoji: '1157606786627543070'};
});

const selectMenu = new Discord.StringSelectMenuBuilder()
.setCustomId('ymenu')
.setPlaceholder(`${member.user.displayName} Kullanıcısına Vermek İstediğin Rolü Seç.`)
.addOptions(roleOptions);
const row = new Discord.ActionRowBuilder().addComponents(selectMenu);
await message.react(emojis.yes).catch((e) => {})
const msj = await message.reply({embeds: [embed.setDescription(`${message.member}, ${member} Kullanıcısına Vermek İstediğiniz Rolü Aşağıdan Seçiniz.`)], components: [row]})      
const filter = (xd) => xd.user.id == message.author.id;
const collector = msj.createMessageComponentCollector({filter})
collector.on("collect", async (button) => {
if(button.customId == 'ymenu') {
await button.deferUpdate()
collector.stop()
if(button.values[0] == 'null') return;
const control = client.ranks.find(x => x.role === button.values[0]);
if(!control) return;
if(member.roles.cache.has(control.role)) {
await member.roles.remove(control.role).catch((e) => {})
await coin.updateOne({ guildID: settings.guildID, userID: member.id }, { $set: { coin: 0 } }, { upsert: true }).exec();
await msj.edit({embeds: [embed.setDescription(`${member} Kullanıcısında ${message.guild.roles.cache.get(control.role) ? message.guild.roles.cache.get(control.role) : 'Bulunamadı.'} Rolü Olduğu için Kaldırıldı.`)]})
let kontrol = await users.findOne({_id: member.id})
if(kontrol && kontrol.Staff) return await users.updateOne({_id: member.id}, { $set: { Staff: false } }, { upsert: true }).exec();
} 
else {

    await member.roles.add(control.role).catch((e) => {})

await member.roles.add(ayar.registerPerms).catch((e) => {})
await Users.updateOne({ _id: member.id }, { $set: { "Staff": true, "StaffGiveAdmin": message.author.id, Date: Date.now() } }, { upsert: true }).exec();
await Users.updateOne({ _id: message.author.id }, { $push: { "Staffs": { id: member.id, Date: Date.now() } } }, { upsert: true }).exec();
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $set: { coin: control.coin } }, { upsert: true });  
await coin.findOneAndUpdate({ guildID: settings.guildID, userID: member.id }, { $inc: { coin: 1 } }, { upsert: true });  
await msj.edit({embeds: [embed.setDescription(`${member} Kullanıcısında ${message.guild.roles.cache.get(control.role) ? message.guild.roles.cache.get(control.role) : 'Bulunamadı.'} Rolü Olmadığı için Verildi.`)]})
}
}
})
},
};