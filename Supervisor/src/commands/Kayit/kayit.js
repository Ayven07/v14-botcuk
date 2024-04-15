const toplams = require("../../schemas/toplams");
const settings = require("../../configs/settings.json")
const isimler = require("../../schemas/names");
const regstats = require("../../schemas/registerStats");
const moment = require("moment")
moment.locale("tr")
const coin = require("../../schemas/coin")
const emojis = require('../../configs/emojiName.json')
const setups = require("../../schemas/setup")
const Discord = require("discord.js");
const boosterr = require("../../schemas/booster")
module.exports = {
conf: {
aliases: ["erkek", "Erkek", "e", "ERKEK", "Man", "man", "kadın", "Kadın", "k", "kadin", "Kadin", "Woman", "kız", "Kız"],
name: "kayit",
help: "kayit @Rainha/ID [İsim] [Yaş]",
category: "kayit"  
},
exclosive: async (client, message, args, embed, prefix) => { 
const ayars = await setups.findOne({guildID: settings.guildID})
if(!ayars) return;  
let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!ayars.registerRoles.some(oku => message.member.roles.cache.has(oku)) && !ayars.ownerRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`Yetkin bulunmamakta dostum.\Yetkili olmak istersen başvurabilirsin.`}).sil(15)
    return }
    if(!uye) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`\`${prefix}e <@Rainha/ID> <Isim> <Yaş>\``}).sil(15) 
    return }
    if(message.author.id === uye.id) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`Kendini kayıt edemezsin.`}).sil(15)
    return }

    if(!uye.manageable) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`Böyle birisini kayıt edemiyorum.`}).sil(15)
    return }

    if(message.member.roles.highest.position <= uye.roles.highest.position) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`Senden yüksekte olan birisini kayıt edemezsin.`}).sil(15)
    return }
    const data = await isimler.findOne({ guildID: settings.guildID, userID: uye.user.id });
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || "";
    if(!isim & !yaş) 
    {
    message.react(message.guild.emojiGöster(emojis.no))
    message.reply({ content:`\`${prefix}e <@Rainha/ID> <Isim> <Yaş>\``}).sil(15)
    return }

     const tags = ayars.serverTag.join(" - ")
 const tagModedata = await regstats.findOne({ guildID: settings.guildID })
    if (tagModedata && tagModedata.tagMode === true) {
    if(!ayars.serverTag.some(s => uye.user.globalName && uye.user.globalName.includes(s) || uye.roles.cache.has(ayars.vipRoles) || uye.roles.cache.has(ayars.boosterRoles))) return message.reply({ embeds: [embed.setDescription(`${uye.toString()} isimli üyenin kullanıcı adında tagımız (\` ${tags} \`) ve <@&${ayars.boosterRoles}> <@&${ayars.vipRoles}> Rolleri olmadığı için isim değiştirmekden başka kayıt işlemi yapamazsınız.`)] }).sil(15)
    }
    if(!yaş) { 
    setName = `${ayars.tagSystem == true ? (uye.user.globalName && uye.user.globalName.includes(ayars.nameTag) ? ayars.nameTag : (ayars.defaultTag ? ayars.defaultTag : (ayars.nameTag || ""))) : ''} ${isim}`;
    } else { 
    if(ayars.ageSystem == false) return; 
    setName = `${ayars.tagSystem == true ? (uye.user.globalName && uye.user.globalName.includes(ayars.nameTag) ? ayars.nameTag : (ayars.defaultTag ? ayars.defaultTag : (ayars.nameTag || ""))) : ''} ${isim} | ${yaş}`;
  } uye.setNickname(`${setName}`).catch(e => {});
  await boosterr.findOneAndUpdate({ guildID: uye.guild.id, userID: uye.id }, { $set: { names: setName, cinsiyet: "Erkek" } }, { upsert: true });
  if(!ayars.manRoles.some(e => uye.roles.cache.has(e)) && !ayars.womanRoles.some(k => uye.roles.cache.has(k)) && !ayars.jailRoles.some(x => uye.roles.cache.has(x)) && !ayars.reklamRoles.some(x => uye.roles.cache.has(x)) && !ayars.bannedTagRoles.some(b => uye.roles.cache.has(b)) && !ayars.fakeAccRoles.some(x => uye.roles.cache.has(x))) {
    const row = new Discord.ActionRowBuilder().addComponents(
						new Discord.ButtonBuilder()
							.setCustomId("erkek")
							.setLabel("Erkek")	
              .setEmoji("1139681289092468850")
              .setStyle(Discord.ButtonStyle.Secondary),
						new Discord.ButtonBuilder()
							.setCustomId("kadin")
							.setLabel("Kadın")
							.setEmoji("1139681291986550875")
              .setStyle(Discord.ButtonStyle.Secondary),            
            );   
message.react(message.guild.emojiGöster(emojis.yes))
let Rainha = new Discord.EmbedBuilder()
.setDescription(`
${uye.toString()} kişisinin ismi " **${setName}** " olarak değiştirildi.`)       
.setAuthor({ name: uye.displayName, iconURL: uye.user.avatarURL({ dynamic: true })})
var msg = await message.reply({embeds: [Rainha], components: [row]})    
const filter = (button) => button.user.id === message.author.id;
let collector = await msg.createMessageComponentCollector({ filter, time: 60000 })  
collector.on("collect", async (button) => {                
if(button.customId === "erkek") {
await button.deferUpdate();
row.components[0].setDisabled(true)
row.components[1].setDisabled(true)
msg.edit({embeds: [Rainha.setDescription(`
${uye.toString()} kişisinin ismi " **${setName}** " olarak değiştirildi.\n\n**ERKEK** olarak kayıt edildi!`)       
.setAuthor({ name: uye.displayName, iconURL: uye.user.avatarURL({ dynamic: true })})], components: [row]});          
await uye.roles.add(ayars.manRoles).catch(e => {});
await uye.roles.remove(ayars.unregRoles).catch(e => {});    
let sex = message.guild.channels.cache.filter(c => ayars.publicParents.some(a => a == c.parentId) && c.type === Discord.ChannelType.GuildVoice);
const ch = sex.random() 
if(uye.voice.channel) await uye.voice.setChannel(ch).catch(e => {}) && uye.send({content: `Hey! Teyit odasında kayıt olduktan sonra zaman geçiremezsin, otomatik olarak sohbet odalarından **${ch.name}** kanalına seni taşıdım.`}).catch(e => {});
await toplams.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $push: { toplams: uye.user.id } }, { upsert: true });
await regstats.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, erkek: 1, erkek24: 1, erkek7: 1, erkek14: 1, }, }, { upsert: true });
await isimler.findOneAndUpdate({ guildID: settings.guildID, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: ayars.manRoles.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });    
await boosterr.findOneAndUpdate({ guildID: settings.guildID, userID: uye.user.id }, { $set: { names: uye.displayName, cinsiyet: "Erkek" } }, { upsert: true });    
message.guild.channels.cache.get(ayars.chatChannel).send({ content:`${uye} Aramıza Hoş Geldin! Sunucumuz Seninle Birlikte **${message.guild.memberCount}** Üye Oldu!`}).sil(15)
if(settings.coinSystem === true && !client.ranks.some((x) => message.member.roles.cache.has(x.role))) {
await coin.findOneAndUpdate({ guildID: uye.guild.id, userID: message.author.id }, { $inc: { coin: settings.registerCoin } }, { upsert: true });
message.member.görevGüncelle(settings.guildIDd, "kayıt", 1);
}
const klog = await client.kanalBul("kayit-log") 
const data = await isimler.findOne({ guildID: settings.guildID, userID: uye.user.id });
const datas = await regstats.findOne({ guildID: settings.guildID, userID: message.member.id });
klog.send({embeds: [embed.setTitle("Bir Kullanıcı Kayıt Edildi").setDescription(`
${message.author} Tarafından ${uye.toString()} kullanıcısı **Erkek** olarak kayıt edildi.
 
Kullanıcı: \`${uye.user.globalName ? uye.user.globalName : uye.user.tag}\` - \`${uye.id}\`
Yetkili: \`${message.member.globalName ? message.member.globalName : message.member.user.tag}\` - \`${message.author.id}\`
Kayıt türü: \`Erkek\`
Yetkili kayıt sayısı: \`${datas ? datas.top : 0}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
Kullanıcı isim geçmişi: ${data ? data.names.splice(0, 2).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>) [<t:${Math.floor(x.date /  1000)}:R>]`).join("\n") : "Daha önce kayıt olmamış."}`)
.setAuthor({name: uye.displayName, iconURL: uye.avatarURL({dynamic: true})})
.setThumbnail(uye.avatarURL({format: "png"}))
.setFooter({text: `${uye.displayName} Sunucumuza ${message.member.displayName} Tarafından Kayıt Edildi.`, iconURL: message.author.displayAvatarURL({dynamic: true})})]})         
}
if(button.customId === "kadin") {
await button.deferUpdate();
row.components[0].setDisabled(true)
row.components[1].setDisabled(true)
msg.edit({embeds: [Rainha.setDescription(`
${uye.toString()} kişisinin ismi " **${setName}** " olarak değiştirildi.\n\n**KADIN** olarak kayıt edildi!`)       
.setAuthor({ name: uye.displayName, iconURL: uye.user.avatarURL({ dynamic: true })})], components: [row]});          
await uye.roles.add(ayars.womanRoles).catch(e => {});
await uye.roles.remove(ayars.unregRoles).catch(e => {});
let sex = message.guild.channels.cache.filter(c => ayars.publicParents.some(a => a == c.parentId) && c.type === Discord.ChannelType.GuildVoice);
const ch = sex.random() 
if(uye.voice.channel) await uye.voice.setChannel(ch).catch(e => {}) && uye.send({content: `Hey! Teyit odasında kayıt olduktan sonra zaman geçiremezsin, otomatik olarak sohbet odalarından **${ch.name}** kanalına seni taşıdım.`}).catch(e => {});
await toplams.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $push: { toplams: uye.user.id } }, { upsert: true });
await regstats.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, kız: 1, kız24: 1, kız7: 1, kız14: 1, }, }, { upsert: true });
await isimler.findOneAndUpdate({ guildID: settings.guildID, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id,  rol: ayars.womanRoles.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
await boosterr.findOneAndUpdate({ guildID: settings.guildID, userID: uye.user.id }, { $set: { names: uye.displayName, cinsiyet: "Kadin" } }, { upsert: true });    
message.guild.channels.cache.get(ayars.chatChannel).send({ content:`${uye} Aramıza Hoş Geldin! Sunucumuz Seninle Birlikte **${message.guild.memberCount}** Üye Oldu!`}).sil(15)
if(settings.coinSystem === true && !client.ranks.some((x) => message.member.roles.cache.has(x.role))) {
await coin.findOneAndUpdate({ guildID: uye.guild.id, userID: message.author.id }, { $inc: { coin: settings.registerCoin } }, { upsert: true });
message.member.görevGüncelle(settings.guildID, "kayıt", 1);
}
const klog = await client.kanalBul("kayit-log") 
const data = await isimler.findOne({ guildID: settings.guildID, userID: uye.user.id });
const datas = await regstats.findOne({ guildID: settings.guildID, userID: message.member.id });
klog.send({embeds: [embed.setTitle("Bir Kullanıcı Kayıt Edildi").setDescription(`
${message.author} Tarafından ${uye.toString()} kullanıcısı **Kız** olarak kayıt edildi.
 
Kullanıcı: \`${uye.user.globalName ? uye.user.globalName : uye.user.tag}\` - \`${uye.id}\`
Yetkili: \`${message.member.globalName ? message.member.globalName : message.member.user.tag}\` - \`${message.author.id}\`
Kayıt türü: \`Kız\`
Yetkili kayıt sayısı: \`${datas ? datas.top : 0}\`
Tarih: <t:${Math.floor(Date.now() / 1000)}:R>
Kullanıcı isim geçmişi: ${data ? data.names.splice(0, 2).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>) [<t:${Math.floor(x.date /  1000)}:R>]`).join("\n") : "Daha önce kayıt olmamış."}`)
.setAuthor({name: uye.displayName, iconURL: uye.avatarURL({dynamic: true})})
.setThumbnail(uye.avatarURL({dynamic: true}))
.setFooter({text: `${uye.displayName} Sunucumuza ${message.member.displayName} Tarafından Kayıt Edildi.`, iconURL: message.author.displayAvatarURL({dynamic: true})})]})               
}
        })                     
collector.on("end", async() => {
row.components[0].setDisabled(true)
row.components[1].setDisabled(true)
msg.edit({components: [row]})
if(!ayars.manRoles.some(e => uye.roles.cache.has(e)) && !ayars.womanRoles.some(k => uye.roles.cache.has(k))) {
uye.setNickname(`${ayars.defaultTag} ${ayars.unregName}`)
}
})
  }                  
 }   
}