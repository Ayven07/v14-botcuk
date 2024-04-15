const settings = require('../../configs/settings.json');
const emojis = require('../../configs/emojiName.json')
const Discord = require("discord.js");
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: [],
name: "kurulum",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed) => {
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setCustomId("rolk")
.setLabel("Rol Kurulum")
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("kanalk")
.setLabel("Kanal Kurulum")
.setStyle(Discord.ButtonStyle.Secondary),
new Discord.ButtonBuilder()
.setCustomId("emojik")
.setLabel("Emoji Kurulum")
.setStyle(Discord.ButtonStyle.Secondary),
);
let msg = await message.channel.send({ content: `Lütfen **60 saniye** içerisinde hangi kurulum yapacağınızı aşağıdaki butonlara tıklayarak cevaplayınız.`, components: [row]})
var filter = (button) => button.user.id === message.author.id;
const collector = msg.createMessageComponentCollector({ filter, time: 60000 })
collector.on("collect", async interaction => {
if (interaction.customId === "rolk") {
interaction.reply({ content: `Menü için gerekli Rollerin kurulumu başarıyla tamamlanmıştır.\n**Not:** Renk rollerini booster ve taglı rollerinin üstüne taşıyınız.`, ephemeral: true })          
await interaction.guild.roles.create({
            name: "━━━━Renk Rolleri━━━━",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          })
 
const blackRoles = await interaction.guild.roles.create({
            name: "Siyah",
            color: "#0f0f0f",
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          })
await setups.updateOne({ guildID: settings.guildID }, { $set: { blackRoles: blackRoles.id } }, { upsert: true })    
const blueRoles = await interaction.guild.roles.create({
            name: "Mavi",
            color: "#2e8ff0",
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          })
await setups.updateOne({ guildID: settings.guildID }, { $set: { blueRoles: blueRoles.id } }, { upsert: true })            
const whiteRoles = await interaction.guild.roles.create({
            name: "Beyaz",
            color: "#ffffff",
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { whiteRoles: whiteRoles.id } }, { upsert: true })            
const redRoles = await interaction.guild.roles.create({
            name: "Kırmızı",
            color: "#ff0000",
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { redRoles: redRoles.id } }, { upsert: true })            
const yellowRoles = await interaction.guild.roles.create({
            name: "Sarı",
            color: "#a3ff00",
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { yellowRoles: yellowRoles.id } }, { upsert: true })            
const pinkRoles = await interaction.guild.roles.create({
            name: "Pembe",
            color: "#ff0cfc",
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { pinkRoles: pinkRoles.id } }, { upsert: true })            
const purpleRoles = await interaction.guild.roles.create({
            name: "Mor",
            color: "#7c00f8",
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { purpleRoles: purpleRoles.id } }, { upsert: true })            
const orangeRoles = await interaction.guild.roles.create({
            name: "Turuncu",
            color: "#ff7c00",
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { orangeRoles: orangeRoles.id } }, { upsert: true })    
const greenRoles = await interaction.guild.roles.create({
  name: "Yeşil",
  color: "#119f14",
  permissions: "0",
  reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { greenRoles: greenRoles.id } }, { upsert: true })    
const brownRoles = await interaction.guild.roles.create({
  name: "Kahverengi",
  color: "#703307",
  permissions: "0",
  reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { brownRoles: brownRoles.id } }, { upsert: true })    
const burgundyRoles = await interaction.guild.roles.create({
  name: "Bordo",
  color: "#670303",
  permissions: "0",
  reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { burgundyRoles: burgundyRoles.id } }, { upsert: true }) 
const turquoiseRoles = await interaction.guild.roles.create({
  name: "Turkuaz",
  color: "#00ffdb",
  permissions: "0",
  reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { turquoiseRoles: turquoiseRoles.id } }, { upsert: true }) 
const beigeRoles = await interaction.guild.roles.create({
  name: "Bej",
  color: "#fdffe0",
  permissions: "0",
  reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { beigeRoles: beigeRoles.id } }, { upsert: true }) 
const navyblueRoles = await interaction.guild.roles.create({
  name: "Lacivert",
  color: "#02002c",
  permissions: "0",
  reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { navyblueRoles: navyblueRoles.id } }, { upsert: true })
const lightblueRoles = await interaction.guild.roles.create({
  name: "Açık Mavi",
  color: "#92cbf0",
  permissions: "0",
  reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { lightblueRoles: lightblueRoles.id } }, { upsert: true })
const pistachiogreenRoles = await interaction.guild.roles.create({
  name: "Fıstık Yeşili",
  color: "#009e7d",
  permissions: "0",
  reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { pistachiogreenRoles: pistachiogreenRoles.id } }, { upsert: true })          
await interaction.guild.roles.create({
            name: "━━━━Etkinlik Rolleri━━━━",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
const etkinlikRoles = await interaction.guild.roles.create({
            name: "🎉 Etkinlik Katılımcısı",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { etkinlikRoles: etkinlikRoles.id } }, { upsert: true })            
const cekilisRoles = await interaction.guild.roles.create({
            name: "🎁 Çekiliş Katılımcısı",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { cekilisRoles: cekilisRoles.id } }, { upsert: true })            
     await interaction.guild.roles.create({
            name: "━━━━İlişki Rolleri━━━━",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
const coupleRoles =  await interaction.guild.roles.create({
            name: "Sevgilim Var",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          })
await setups.updateOne({ guildID: settings.guildID }, { $set: { coupleRoles: coupleRoles.id } }, { upsert: true })            
const aloneRoles = await interaction.guild.roles.create({
            name: "Sevgilim Yok",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { aloneRoles: aloneRoles.id } }, { upsert: true })            
const syRoles = await interaction.guild.roles.create({
            name: "Sevgili Yapmıyorum",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { syRoles: syRoles.id } }, { upsert: true })            
     await interaction.guild.roles.create({
            name: "━━━━Oyun Rolleri━━━━",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
const minecraftRoles = await interaction.guild.roles.create({
            name: "Minecraft",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { minecraftRoles: minecraftRoles.id } }, { upsert: true })            
const fortniteRoles = await interaction.guild.roles.create({
            name: "Fortnite",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { fortniteRoles: fortniteRoles.id } }, { upsert: true })            
const mlbbRoles = await interaction.guild.roles.create({
            name: "Mobile Legends",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { mlbbRoles: mlbbRoles.id } }, { upsert: true })            
const csRoles = await interaction.guild.roles.create({
            name: "Counter Strike",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { csRoles: csRoles.id } }, { upsert: true })            
const pubgRoles = await interaction.guild.roles.create({
            name: "Pubg",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { pubgRoles: pubgRoles.id } }, { upsert: true })            
const amongusRoles = await interaction.guild.roles.create({
            name: "Among Us",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { amongusRoles: amongusRoles.id } }, { upsert: true })           
const lolRoles = await interaction.guild.roles.create({
            name: "League Of Legends",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { lolRoles: lolRoles.id } }, { upsert: true })            
const gtavRoles = await interaction.guild.roles.create({
            name: "Gta V",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { gtavRoles: gtavRoles.id } }, { upsert: true })            
const valorantRoles = await interaction.guild.roles.create({
            name: "Valorant",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { valorantRoles: valorantRoles.id } }, { upsert: true })            
     await interaction.guild.roles.create({
            name: "━━━━Takım Rolleri━━━━",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
const bjkRoles = await interaction.guild.roles.create({
            name: "Beşiktaş",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { bjkRoles: bjkRoles.id } }, { upsert: true })            
const gsRoles = await interaction.guild.roles.create({
            name: "Galatasaray",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { gsRoles: gsRoles.id } }, { upsert: true })            
const fbRoles = await interaction.guild.roles.create({
            name: "Fenerbahçe",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { fbRoles: fbRoles.id } }, { upsert: true })            
const tsRoles = await interaction.guild.roles.create({
            name: "Trabzonspor",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });  
await setups.updateOne({ guildID: settings.guildID }, { $set: { tsRoles: tsRoles.id } }, { upsert: true })            
await interaction.guild.roles.create({
            name: "━━━━Burç Rolleri━━━━",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
const akrepRoles = await interaction.guild.roles.create({
            name: "♏ Akrep",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { akrepRoles: akrepRoles.id } }, { upsert: true })            
const yengecRoles = await interaction.guild.roles.create({
            name: "♋ Yengeç",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { yengecRoles: yengecRoles.id } }, { upsert: true })            
const ikizlerRoles = await interaction.guild.roles.create({
            name: "♊ İkizler",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { ikizlerRoles: ikizlerRoles.id } }, { upsert: true })            
const yayRoles = await interaction.guild.roles.create({
            name: "♐ Yay",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { yayRoles: yayRoles.id } }, { upsert: true })            
const aslanRoles = await interaction.guild.roles.create({
            name: "♌ Aslan",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { aslanRoles: aslanRoles.id } }, { upsert: true })            
const teraziRoles = await interaction.guild.roles.create({
            name: "♎ Terazi",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { teraziRoles: teraziRoles.id } }, { upsert: true })            
const basakRoles = await interaction.guild.roles.create({
            name: "♍ Başak",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { basakRoles: basakRoles.id } }, { upsert: true })            
const kovaRoles = await interaction.guild.roles.create({
            name: "♒ Kova",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { kovaRoles: kovaRoles.id } }, { upsert: true })            
const balikRoles = await interaction.guild.roles.create({
            name: "♓ Balık",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { balikRoles: balikRoles.id } }, { upsert: true })            
const oglakRoles = await interaction.guild.roles.create({
            name: "♑ Oğlak",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { oglakRoles: oglakRoles.id } }, { upsert: true })            
const bogaRoles = await interaction.guild.roles.create({
            name: "♉ Boğa",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { bogaRoles: bogaRoles.id } }, { upsert: true })            
const kocRoles = await interaction.guild.roles.create({
            name: "♈ Koç",
            color: randomColor(),
            permissions: "0",
            reason: "Rol Seçim Menüsü için Lazımki kurduk sanane aq."
          });      
await setups.updateOne({ guildID: settings.guildID }, { $set: { kocRoles: kocRoles.id } }, { upsert: true })            
          await interaction.guild.roles.create({
            name: "━━━━Level Rolleri━━━━",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
const chatBronzeRoles = await interaction.guild.roles.create({
            name: "Chat Bronz",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { chatBronzeRoles: chatBronzeRoles.id } }, { upsert: true })            
const chatSilverRoles = await interaction.guild.roles.create({
            name: "Chat Silver",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { chatSilverRoles: chatSilverRoles.id } }, { upsert: true })                      
const chatGoldRoles = await interaction.guild.roles.create({
            name: "Chat Gold",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { chatGoldRoles: chatGoldRoles.id } }, { upsert: true })          
const chatDiamondRoles = await interaction.guild.roles.create({
            name: "Chat Diamond",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { chatDiamondRoles: chatDiamondRoles.id } }, { upsert: true })          
const chatEmeraldRoles = await interaction.guild.roles.create({
            name: "Chat Emerald",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { chatEmeraldRoles: chatEmeraldRoles.id } }, { upsert: true })          
const voiceBronzeRoles = await interaction.guild.roles.create({
            name: "Voice Bronz",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceBronzeRoles: voiceBronzeRoles.id } }, { upsert: true })          
const voiceSilverRoles = await interaction.guild.roles.create({
            name: "Voice Silver",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceSilverRoles: voiceSilverRoles.id } }, { upsert: true })                    
const voiceGoldRoles = await interaction.guild.roles.create({
            name: "Voice Gold",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceGoldRoles: voiceGoldRoles.id } }, { upsert: true })          
const voiceDiamondRoles = await interaction.guild.roles.create({
            name: "Voice Diamond",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceDiamondRoles: voiceDiamondRoles.id } }, { upsert: true })          
const voiceEmeraldRoles = await interaction.guild.roles.create({
            name: "Voice Emerald",
            color: randomColor(),
            permissions: "0",
            reason: "Level Sistemi için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceEmeraldRoles: voiceEmeraldRoles.id } }, { upsert: true })          
await interaction.guild.roles.create({
            name: "━━━━Aylık Perm Rolleri━━━━",
            color: randomColor(),
            permissions: "0",
            reason: "Aylık perm için Lazımki kurduk sanane aq."
          });
const oneMonthRoles = await interaction.guild.roles.create({
            name: "🥇 1 Aylık Üye",
            color: randomColor(),
            permissions: "0",
            reason: "Aylık perm için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { oneMonthRoles: oneMonthRoles.id } }, { upsert: true })            
const threeMonthRoles = await interaction.guild.roles.create({
            name: "🥉 3 Aylık Üye",
            color: randomColor(),
            permissions: "0",
            reason: "Aylık perm için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { threeMonthRoles: threeMonthRoles.id } }, { upsert: true })            
const sixMonthRoles = await interaction.guild.roles.create({
            name: "🏅 6 Aylık Üye",
            color: randomColor(),
            permissions: "0",
            reason: "Aylık perm için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { sixMonthRoles: sixMonthRoles.id } }, { upsert: true })            
const nineMonthRoles = await interaction.guild.roles.create({
            name: "🎖️ 9 Aylık Üye",
            color: randomColor(),
            permissions: "0",
            reason: "Aylık perm için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { nineMonthRoles: nineMonthRoles.id } }, { upsert: true })            
const oneYearRoles = await interaction.guild.roles.create({
            name: "🏆 1 Senelik Üye",
            color: randomColor(),
            permissions: "0",
            reason: "Aylık perm için Lazımki kurduk sanane aq."
          });
await setups.updateOne({ guildID: settings.guildID }, { $set: { oneYearRoles: oneYearRoles.id } }, { upsert: true })            
await interaction.guild.roles.create({
name: "━━━━Perm Rolleri━━━━",
color: randomColor(),
permissions: "0",
reason: "Bot için Lazımki kurduk sanane aq."
});          
const katildiPerms = await interaction.guild.roles.create({
name: "✔️ Katıldı",
color: randomColor(),
permissions: "0",
 reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { katildiPerms: katildiPerms.id } }, { upsert: true })     
const katilmadiPerms = await interaction.guild.roles.create({
  name: "❌ Katılmadı",
  color: randomColor(),
  permissions: "0",
  reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { katilmadiPerms: katilmadiPerms.id } }, { upsert: true })     
const mazeretPerms = await interaction.guild.roles.create({
  name: "✔️ Mazeretli",
  color: randomColor(),
  permissions: "0",
  reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { mazeretPerms: mazeretPerms.id } }, { upsert: true })     
const warnOneRoles = await interaction.guild.roles.create({
  name: "❌ Uyarı 1",
  color: randomColor(),
  permissions: "0",
  reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { warnOneRoles: warnOneRoles.id } }, { upsert: true })     
const warnTwoRoles = await interaction.guild.roles.create({
  name: "❌ Uyarı 2",
  color: randomColor(),
  permissions: "0",
  reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { warnTwoRoles: warnTwoRoles.id } }, { upsert: true })     
const warnThreeRoles = await interaction.guild.roles.create({
  name: "❌ Uyarı 3",
  color: randomColor(),
  permissions: "0",
  reason: "Aylık perm için Lazımki kurduk sanane aq."
});
await setups.updateOne({ guildID: settings.guildID }, { $set: { warnThreeRoles: warnThreeRoles.id } }, { upsert: true })               
}
   if (interaction.customId === "kanalk") {
   interaction.reply({ content: `Log Kanallarının kurulumu başarıyla tamamlanmıştır.`, ephemeral: true })
   const parent = await interaction.guild.channels.create({name: 'SUNUCU LOGLARI', type: Discord.ChannelType.GuildCategory, permissionOverwrites: [{id: settings.guildID,deny: [Discord.PermissionsBitField.Flags.ViewChannel],}]});
   await interaction.guild.channels.create({name: 'message-log',  type: Discord.ChannelType.GuildText, parent: parent.id});
   await interaction.guild.channels.create({name: 'voice-log',  type: Discord.ChannelType.GuildText, parent: parent.id});
   await interaction.guild.channels.create({name: 'taglı-log',  type: Discord.ChannelType.GuildText, parent: parent.id});
   await interaction.guild.channels.create({name: 'rol-log',  type: Discord.ChannelType.GuildText, parent: parent.id});
   await interaction.guild.channels.create({name: 'mute-log', type: Discord.ChannelType.GuildText, parent: parent.id });
   await interaction.guild.channels.create({name: 'vmute-log', type: Discord.ChannelType.GuildText, parent: parent.id });
   await interaction.guild.channels.create({name: 'jail-log', type: Discord.ChannelType.GuildText, parent: parent.id });
   await interaction.guild.channels.create({name: 'warn-log', type: Discord.ChannelType.GuildText, parent: parent.id });
   await interaction.guild.channels.create({name: 'yasaklitag-log', type: Discord.ChannelType.GuildText, parent: parent.id });
   await interaction.guild.channels.create({name: 'ban-log', type: Discord.ChannelType.GuildText, parent: parent.id });
   await interaction.guild.channels.create({name: 'cezapuan-log', type: Discord.ChannelType.GuildText, parent: parent.id });
   await interaction.guild.channels.create({name: 'guard-log', type: Discord.ChannelType.GuildText, parent: parent.id });
   await interaction.guild.channels.create({name: 'basvuru-log',  type: Discord.ChannelType.GuildText, parent: parent.id });     
   await interaction.guild.channels.create({name: 'level-up',  type: Discord.ChannelType.GuildText, parent: parent.id });                  
   await interaction.guild.channels.create({name: 'kayit-log',  type: Discord.ChannelType.GuildText, parent: parent.id });          
   await interaction.guild.channels.create({name: 'mazeret-log',  type: Discord.ChannelType.GuildText, parent: parent.id });
   await interaction.guild.channels.create({name: 'öneri-log',  type: Discord.ChannelType.GuildText, parent: parent.id });          
   await interaction.guild.channels.create({name: 'sikayet-log',  type: Discord.ChannelType.GuildText, parent: parent.id });       
   if(settings.coinSystem == true) {
   await interaction.guild.channels.create({name: 'gorev-log',  type: Discord.ChannelType.GuildText, parent: parent.id }); 
   await interaction.guild.channels.create({name: 'rank-log',  type: Discord.ChannelType.GuildText, parent: parent.id });       
   await interaction.guild.channels.create({name: 'yetki-log',  type: Discord.ChannelType.GuildText, parent: parent.id });     
   }   
   }
   if (interaction.customId === "emojik") {
    const emojiNames = {
    hos: emojis.hos,
    ses: emojis.ses,
    uye: emojis.uye,
    link: emojis.link,
    star: emojis.star,
    member: emojis.member,
    nokta: emojis.nokta,
    stat: emojis.stat,
    yes: emojis.yes,
    no: emojis.no,
    on: emojis.on,
    off: emojis.off,
    sifir: emojis.sifir,
    bir: emojis.bir,
    iki: emojis.iki,
    uc: emojis.uc,
    dort: emojis.dort,
    bes: emojis.bes,
    alti: emojis.alti,
    yedi: emojis.yedi,
    sekiz: emojis.sekiz,
    dokuz: emojis.dokuz,
    uyari: emojis.uyari,
    ayicik: emojis.ayicik,
    yldz: emojis.yldz,
    duyuru: emojis.duyuru,
    join: emojis.join,
    leave: emojis.leave,
    konfeti: emojis.konfeti,
    hos: emojis.hos,
    info: emojis.info,
    kupa: emojis.kupa,
    icon2: emojis.icon2,
    ban: emojis.ban,
    mute: emojis.mute,
    vmute: emojis.vmute,
    unmute: emojis.unmute,
    unvmute: emojis.unvmute,
    jail: emojis.jail,
    slot: emojis.slot,
    kalp: emojis.kalp,
    patlican: emojis.patlican,
    kiraz: emojis.kiraz,
    fillStart: emojis.fillStart,
    fill: emojis.fill,
    fillEnd: emojis.fillEnd,
    empty: emojis.empty,
    emptyEnd: emojis.emptyEnd,
    warn: emojis.warn,
    }
    const emojiList = {
      [emojiNames.hos]: "https://cdn.discordapp.com/emojis/1164611022204698664.gif?size=80&quality=lossless",
      [emojiNames.ses]: "https://cdn.discordapp.com/emojis/1005022754212413470.png?size=80&quality=lossless",
      [emojiNames.uye]: "https://cdn.discordapp.com/emojis/1005022733702279209.png?size=80&quality=lossless",
      [emojiNames.link]: "https://cdn.discordapp.com/emojis/1001500513969393745.png?size=80&quality=lossless",
      [emojiNames.star]: "https://cdn.discordapp.com/emojis/1005020611648700508.png?size=80&quality=lossless",
      [emojiNames.member]: "https://cdn.discordapp.com/emojis/1001500535570055232.png?size=80&quality=lossless",
      [emojiNames.nokta]: "https://cdn.discordapp.com/emojis/1137750033589080228.png?size=80&quality=lossless",
      [emojiNames.stat]: "https://cdn.discordapp.com/emojis/1004288849180106812.png?size=80&quality=lossless",
      [emojiNames.yes]: "https://cdn.discordapp.com/emojis/1087150020287017072.png?size=80&quality=lossless",
      [emojiNames.no]: "https://cdn.discordapp.com/emojis/1087150197282447510.png?size=80&quality=lossless",
      [emojiNames.on]: "https://cdn.discordapp.com/emojis/1122568224064680087.png?size=80&quality=lossless",
      [emojiNames.off]: "https://cdn.discordapp.com/emojis/1122568222361796761.png?size=80&quality=lossless",
      [emojiNames.sifir]: "https://cdn.discordapp.com/emojis/1172599748704866359.gif?size=80&quality=lossless",
      [emojiNames.bir]: "https://cdn.discordapp.com/emojis/1172599755629662289.gif?size=80&quality=lossless",
      [emojiNames.iki]: "https://cdn.discordapp.com/emojis/1172599760776069181.gif?size=80&quality=lossless",
      [emojiNames.uc]: "https://cdn.discordapp.com/emojis/1172599764911669391.gif?size=80&quality=lossless",
      [emojiNames.dort]: "https://cdn.discordapp.com/emojis/1172599770074861668.gif?size=80&quality=lossless",
      [emojiNames.bes]: "https://cdn.discordapp.com/emojis/1172599774541774890.gif?size=80&quality=lossless",
      [emojiNames.alti]: "https://cdn.discordapp.com/emojis/1172599780917121064.gif?size=80&quality=lossless",
      [emojiNames.yedi]: "https://cdn.discordapp.com/emojis/1172599785556017176.gif?size=80&quality=lossless",
      [emojiNames.sekiz]: "https://cdn.discordapp.com/emojis/1172599791612592160.gif?size=80&quality=lossless",
      [emojiNames.dokuz]: "https://cdn.discordapp.com/emojis/1172599797241348097.gif?size=80&quality=lossless",
      [emojiNames.uyari]: "https://cdn.discordapp.com/emojis/1004287194833354762.png?size=80&quality=lossless",
      [emojiNames.ayicik]: "https://cdn.discordapp.com/emojis/1036589358725210113.png?size=80&quality=lossless",
      [emojiNames.yldz]: "https://cdn.discordapp.com/emojis/998269882665799790.gif?size=80&quality=lossless",
      [emojiNames.duyuru]: "https://cdn.discordapp.com/emojis/1001500702461395034.png?size=80&quality=lossless",
      [emojiNames.join]: "https://cdn.discordapp.com/emojis/1036676377199521792.png?size=80&quality=lossless",
      [emojiNames.leave]: "https://cdn.discordapp.com/emojis/1036676408736497766.png?size=80&quality=lossless",
      [emojiNames.konfeti]: "https://cdn.discordapp.com/emojis/1141806054611619861.png?size=80&quality=lossless",
      [emojiNames.hos]: "https://cdn.discordapp.com/emojis/1164611022204698664.gif?size=80&quality=lossless",
      [emojiNames.info]: "https://cdn.discordapp.com/emojis/1124458542825488504.png?size=80&quality=lossless",
      [emojiNames.kupa]: "https://cdn.discordapp.com/emojis/1121817532563722340.gif?size=80&quality=lossless",
      [emojiNames.icon2]: "https://cdn.discordapp.com/emojis/1129521457215590480.png?size=80&quality=lossless",
      [emojiNames.ban]: "https://cdn.discordapp.com/emojis/1138727471072690237.gif?size=80&quality=lossless",
      [emojiNames.mute]: "https://cdn.discordapp.com/emojis/1138727288851140629.png?size=80&quality=lossless",
      [emojiNames.unmute]: "https://cdn.discordapp.com/emojis/1138727468522541096.png?size=80&quality=lossless",
      [emojiNames.vmute]: "https://cdn.discordapp.com/emojis/1138727256055889970.png?size=80&quality=lossless",
      [emojiNames.unvmute]: "https://cdn.discordapp.com/emojis/1138727332408987698.png?size=80&quality=lossless",
      [emojiNames.jail]: "https://cdn.discordapp.com/emojis/1138727469982171178.png?ssize=80&quality=lossless",
      [emojiNames.slot]: "https://cdn.discordapp.com/emojis/1150431624698286130.gif?size=80&quality=lossless",
      [emojiNames.kalp]: "https://cdn.discordapp.com/emojis/1150431631719551016.png?size=80&quality=lossless",
      [emojiNames.patlican]: "https://cdn.discordapp.com/emojis/1150431628464750632.png?size=80&quality=lossless",
      [emojiNames.kiraz]: "https://cdn.discordapp.com/emojis/1150431635209191465.png?size=80&quality=lossless",
      [emojiNames.fillStart]: "https://cdn.discordapp.com/emojis/1176112755657429102.png?size=80&quality=lossless",
      [emojiNames.emptyEnd]: "https://cdn.discordapp.com/emojis/1176112882358943754.png?size=80&quality=lossless",
      [emojiNames.fillEnd]: "https://cdn.discordapp.com/emojis/1176112790621143161.png?size=80&quality=lossless",
      [emojiNames.fill]: "https://cdn.discordapp.com/emojis/1176112774833766410.png?size=80&quality=lossless",
      [emojiNames.empty]: "https://cdn.discordapp.com/emojis/1176112827266781184.png?size=80&quality=lossless",
      [emojiNames.warn]: "https://cdn.discordapp.com/emojis/1178345150506860624.png?size=80&quality=lossless",
};
for (const [emojiName, emojiLink] of Object.entries(emojiList)) {
setTimeout(async() => { 
if(emojiName == emojis.empty || emojiName == emojis.fill || emojiName == emojis.emptyEnd || emojiName == emojis.fillStart || emojiName == emojis.fillEnd && settings.coinSystem == false) return;
const emojiler = await interaction.guild.emojis.create({ attachment: emojiLink, name: emojiName }).then((emojiler) => {
interaction.channel.send({content: `Başarıyla ${interaction.guild.emojiGöster(emojiler) ? interaction.guild.emojiGöster(emojiler).name : client.emojis.cache.find(e => e.name === emojiler.name)} emojisi oluşturuldu.`})}).catch((err) => console.log(err))
}, 3000)
}      
interaction.reply({ content: `Emoji kurulumu başarıyla tamamlanmıştır.`, ephemeral: true })
}
}) 
},
};

function randomColor() {
const letters = '0123456789ABCDEF';
let color = '#';
for (let i = 0; i < 6; i++) {
color += letters[Math.floor(Math.random() * 16)];
}
return color;
}