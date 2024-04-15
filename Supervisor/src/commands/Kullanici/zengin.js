const setups = require("../../schemas/setup")
let zaman = new Map();
const settings = require("../../configs/settings.json");
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["zengin","booster", "b"],
name: "zengin",
help: "zengin [İsim]",
category: "kullanici"
},
exclosive: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
if(!message.member.roles.cache.has(ayar.boosterRoles)) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Bu Komutu Kullanabilmek İçin Booster Rolüne Sahip Olmalısın!"}).sil(15)
return }
if (zaman.get(message.author.id) >= 1) return message.reply({content: "<@"+message.member+"> Bu komutu 15 dakika'da bir kullanabilirsin."}).sil(15)
let uye = message.guild.members.cache.get(message.author.id);
let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
let yazilacakIsim;
if(!isim) 
{
message.react(message.guild.emojiGöster(emojis.no))
message.reply({ content:"Geçerli bir isim belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
return } 
const engel = ["!", "'", "?", "$", "#", "%", ",", "."];  
if(engel.some(char => isim.toLowerCase().includes(char))) return message.reply({content: 'İsmine Özel Karakter Koyamazsın.'}).sil(15)
if(isim.length >= 18) return message.reply({content: 'İsmin 18 Karakterden Uzun Olamaz.'}).sil(15)
yazilacakIsim = `${ayar.tagSystem == true ? uye.user.globalName && uye.user.globalName.includes(ayar.nameTag) ? ayar.nameTag : (ayar.defaultTag ? ayar.defaultTag : (ayar.nameTag || "")) : ''} ${isim}`;
uye.setNickname(`${yazilacakIsim}`).catch(e => {});
message.react(message.guild.emojiGöster(emojis.yes))
message.reply({ content:`Başarıyla ismini **${yazilacakIsim}** olarak değiştirdim!`}).sil(15)
zaman.set(message.author.id, (zaman.get(message.author.id) || 1));
setTimeout(() => {
zaman.delete(message.author.id)
}, 1000 * 60 * 15 * 1)
},
};
  
  