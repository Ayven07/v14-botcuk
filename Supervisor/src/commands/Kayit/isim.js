const a = require("../../configs/settings.json")
const isimler = require("../../schemas/names");
const moment = require("moment")
moment.locale("tr")
const boosterr = require("../../schemas/booster")
const emojis = require('../../configs/emojiName.json')
const Discord = require("discord.js")
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: ["isim", "i", "nick"],
name: "isim",
help: "isim @Rainha/ID [isim] [yaş]",
category: "kayit"
},
exclosive: async (client, message, args, prefix) => { 
const ayar = await setups.findOne({guildID: a.guildID})
if(!ayar) return;  
let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!ayar.registerRoles.some(oku => message.member.roles.cache.has(oku)) && !ayar.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`Yetkin bulunmamakta.\Yetkili olmak istersen başvurabilirsin.`}).sil(15)
    return }
    if(!uye) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`\`${a.prefix}isim <@Rainha/ID> <Isim> <Yaş>\``}).sil(15)
    return }
    if(message.author.id === uye.id) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`Kendi ismini değiştiremezsin. Booster isen \`${prefix}zengin\``}).sil(15)
    return }
    if(!uye.manageable) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`Böyle birisinin ismini değiştiremiyorum.`}).sil(15)
    return }
    if(message.member.roles.highest.position <= uye.roles.highest.position) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`Senden yüksekte olan birisinin ismini değiştiremezsin.`}).sil(15)
    return }
    const data = await isimler.findOne({ guildID: a.guildID, userID: uye.user.id });
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || "";
   if(!isim & !yaş) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`\`${a.prefix}isim <@Rainha/ID> <Isim> <Yaş>\``}).sil(15)
    return }
    if(!yaş) { 
      setName = `${ayar.tagSystem == true ? (uye.user.globalName && uye.user.globalName.includes(ayar.nameTag) ? ayar.nameTag : (ayar.defaultTag ? ayar.defaultTag : (ayar.nameTag || ""))) : ''} ${isim}`;
      } else { 
      if(ayar.ageSystem == false) return; 
      setName = `${ayar.tagSystem == true ? (uye.user.globalName && uye.user.globalName.includes(ayar.nameTag) ? ayar.nameTag : (ayar.defaultTag ? ayar.defaultTag : (ayar.nameTag || ""))) : ''} ${isim} | ${yaş}`;
    } uye.setNickname(`${setName}`).catch(e => {});
    message.react(message.guild.emojiGöster(emojis.yes))

let Rainha = new Discord.EmbedBuilder()
.setDescription(`
${uye.toString()} üyenin ismi " **${setName}** " olarak değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.

${message.guild.emojiGöster(emojis.warn)} ${uye}, isimli üyenin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu.
${data ? data.names.splice(0, 5).map((x, i) => `\` ${i+1}. \` **${x.name}** (${x.rol}) (<@${x.yetkili}>) [ <t:${Math.floor(x.date / 1000)}:R> ]`).join("\n") : "Daha önce kayıt olmamış."}

${message.guild.emojiGöster(emojis.uyari)} Üyesinin önceki isimlerine \`.isimler <@Rainha/ID>\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
message.reply({ embeds: [Rainha] })
await boosterr.findOneAndUpdate({ guildID: a.guildID, userID: uye.user.id }, { $set: { names: uye.displayName } }, { upsert: true });    
await isimler.findOneAndUpdate({ guildID: a.guildID, userID: uye.user.id }, { $push: { names: { name: setName, yetkili: message.author.id,  rol: "İsim Değiştirme", date: Date.now() } } }, { upsert: true });

}
}