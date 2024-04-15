const Discord = require('discord.js');
const conf = require('../../config.js')
const whitelist = require("../../schemas/whitelist")
const emojis = require('../../../Supervisor/src/configs/emojiName.json')
const settings = require('../../../Supervisor/src/configs/settings.json')
module.exports = {
name: "whitelist",
aliases: ["wl","güvenli"],
execute:async (client, message, args, embed) => {
if(!settings.owners.some(Rainha => message.author.id == Rainha))return;
var veri = await whitelist.findOne({
      guildID: settings.guildID
    }) || {
    "full": [],
    "guild": [],
    "rol": [],
    "kanal": [],
    "bankick": [],
    "emoji": [],
    "bot": [],
    "sticker": [],
    "swear": [],
    "advert": []
    };
if(!args[0]) {
message.reply({embeds: [embed
.setAuthor({ name: 'Sunucu Beyaz Liste Paneli'})
.setDescription(`
Aşağı da \`${message.guild.name}\` Sunucusunun Beyaz Listede ki Üyeleri Ve Rolleri Listelenmektedir.
Bu Listeyi Sadece **Taç Sahibi** Ve ${settings.owners && settings.owners.length > 0 ? `${settings.owners.map((x) => `<@${x}>`).join(" | ")}` : `Bulunamadı.`} Güncelleyebilir.

\`\`\`diff
                  Beyaz Liste (Güvenli ID)                          
\`\`\`
**FULL Yetkisine Sahip Kişiler;**
${veri.full.length > 0 ? veri.full.map((element, index) => {const x = index + 1; const userOrRole = message.guild.members.cache.get(element) ? message.guild.members.cache.get(element) : message.guild.roles.cache.get(element); return `\` ${x} \` ${userOrRole}`;}).join("\n") : "Herhangi bir üye veya rol eklenmemiş."}
**GUİLD Yetkisine Sahip Kişiler;**
${veri.guild.length > 0 ? veri.guild.map((element, index) => {const x = index + 1; const userOrRole = message.guild.members.cache.get(element) ? message.guild.members.cache.get(element) : message.guild.roles.cache.get(element); return `\` ${x} \` ${userOrRole}`;}).join("\n") : "Herhangi bir üye veya rol eklenmemiş."}
**ROL Yetkisine Sahip Kişiler;**
${veri.rol.length > 0 ? veri.rol.map((element, index) => {const x = index + 1; const userOrRole = message.guild.members.cache.get(element) ? message.guild.members.cache.get(element) : message.guild.roles.cache.get(element); return `\` ${x} \` ${userOrRole}`;}).join("\n") : "Herhangi bir üye veya rol eklenmemiş."}
**KANAL Yetkisine Sahip Kişiler;**
${veri.kanal.length > 0 ? veri.kanal.map((element, index) => {const x = index + 1; const userOrRole = message.guild.members.cache.get(element) ? message.guild.members.cache.get(element) : message.guild.roles.cache.get(element); return `\` ${x} \` ${userOrRole}`;}).join("\n") : "Herhangi bir üye veya rol eklenmemiş."}
**BAN & KİCK Yetkisine Sahip Kişiler;**
${veri.bankick.length > 0 ? veri.bankick.map((element, index) => {const x = index + 1; const userOrRole = message.guild.members.cache.get(element) ? message.guild.members.cache.get(element) : message.guild.roles.cache.get(element); return `\` ${x} \` ${userOrRole}`;}).join("\n") : "Herhangi bir üye veya rol eklenmemiş."}
**EMOJİ Yetkisine Sahip Kişiler;**
${veri.emoji.length > 0 ? veri.emoji.map((element, index) => {const x = index + 1; const userOrRole = message.guild.members.cache.get(element) ? message.guild.members.cache.get(element) : message.guild.roles.cache.get(element); return `\` ${x} \` ${userOrRole}`;}).join("\n") : "Herhangi bir üye veya rol eklenmemiş."}
**BOT Yetkisine Sahip Kişiler;**
${veri.bot.length > 0 ? veri.bot.map((element, index) => {const x = index + 1; const userOrRole = message.guild.members.cache.get(element) ? message.guild.members.cache.get(element) : message.guild.roles.cache.get(element); return `\` ${x} \` ${userOrRole}`;}).join("\n") : "Herhangi bir üye veya rol eklenmemiş."}
**STİCKER Yetkisine Sahip Kişiler;**
${veri.sticker.length > 0 ? veri.sticker.map((element, index) => {const x = index + 1; const userOrRole = message.guild.members.cache.get(element) ? message.guild.members.cache.get(element) : message.guild.roles.cache.get(element); return `\` ${x} \` ${userOrRole}`;}).join("\n") : "Herhangi bir üye veya rol eklenmemiş."}
**KÜFÜR Yetkisine Sahip Kişiler;**
${veri.swear.length > 0 ? veri.swear.map((element, index) => {const x = index + 1; const userOrRole = message.guild.members.cache.get(element) ? message.guild.members.cache.get(element) : message.guild.roles.cache.get(element); return `\` ${x} \` ${userOrRole}`;}).join("\n") : "Herhangi bir üye veya rol eklenmemiş."}
**LİNK Yetkisine Sahip Kişiler;**
${veri.advert.length > 0 ? veri.advert.map((element, index) => {const x = index + 1; const userOrRole = message.guild.members.cache.get(element) ? message.guild.members.cache.get(element) : message.guild.roles.cache.get(element); return `\` ${x} \` ${userOrRole}`;}).join("\n") : "Herhangi bir üye veya rol eklenmemiş."}`).setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})}).setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})]})
}
let safe;
let rol = message.guild.roles.cache.get(args[0]);
let uye = message.guild.members.cache.get(args[0]);
if (rol) safe = rol;
if (uye) safe = uye;  
if(!Number(args[0])) return;  
if(!message.guild.members.cache.get(args[0]) && !message.guild.roles.cache.get(args[0])) return;  
const row = new Discord.ActionRowBuilder()
  .addComponents(
      new Discord.StringSelectMenuBuilder()
          .setCustomId("Whitelist Kategori Bilgilendirme")
          .setPlaceholder('Whitelist kategorilerini görüntülemek için tıkla!')
          .setMinValues(0)
          .setMaxValues(1)
          .addOptions([
              {
                  label: "Full",
                  description: "Full kategorisine eklemek için tıklayınız.",
                  value: 'full',
                  emoji: '1121505934905192520',
              },
            {
                  label: "Guild",
                  description: "Guild kategorisine eklemek için tıklayınız.",
                  value: 'guild',
                  emoji: '1121505934905192520',
              },
            {
                  label: "Rol",
                  description: "Rol kategorisine eklemek için tıklayınız.",
                  value: 'rol',
                  emoji: '1121505934905192520',
              },
            {
                  label: "Kanal",
                  description: "Kanal kategorisine eklemek için tıklayınız.",
                  value: 'kanal',
                  emoji: '1121505934905192520',
              },
            {
                  label: "Ban & Kick",
                  description: "Ban & Kick kategorisine eklemek için tıklayınız.",
                  value: 'bankick',
                  emoji: '1121505934905192520',
              },
            {
                  label: "Emoji",
                  description: "Emoji kategorisine eklemek için tıklayınız.",
                  value: 'emoji',
                  emoji: '1121505934905192520',
              },
            {
                  label: "Bot",
                  description: "Bot kategorisine eklemek için tıklayınız.",
                  value: 'bot',
                  emoji: '1121505934905192520',
              },
            {
                  label: "Sticker",
                  description: "Sticker kategorisine eklemek için tıklayınız.",
                  value: 'sticker',
                  emoji: '1121505934905192520',
              },          
            {
                  label: "Küfür",
                  description: "Küfür kategorisine eklemek için tıklayınız.",
                  value: 'swear',
                  emoji: '1121505934905192520',
              },          
            {
                  label: "Link",
                  description: "Link kategorisine eklemek için tıklayınız.",
                  value: 'advert',
                  emoji: '1121505934905192520',
              },                     
            {
                  label: "İptal",
                  description: "İptal etmek için tıklayınız.",
                  value: 'exit',
                  emoji: '1121504742317756559',                  
              },          
          ]),
  );  
var msj = await message.reply({embeds: [embed
.setAuthor({ name: 'Sunucu Whitelist Paneli'})
.setDescription(`
\`\`\`fix
❯ Sunucu Koruma Bilgilendirmesi
\`\`\`
${message.guild.emojiGöster(emojis.yes)} Güvenlik sistemi \`${message.guild.name}\` isimli sunucunun tüm ayarlarının korumasını sağlar, bu panelden bu işlemleri yaparken limite tabi tutulması gereken kişiler bu komut yardımıyla listeye eklenir ve güvenlik sistemi belli limit karşılığı işlem yapmalarına izin verir fakat bu limit aşıldığında cezalandırma işlemini yapmaktadır.

\`\`\`fix
❯ Güvenli Listeye Kullanıcı Nasıl Eklenir & Kaldırılır?
\`\`\`
${message.guild.emojiGöster(emojis.yes)} !wl/güvenli @Kullanıcı ID komutu kullanınız daha sonra aşağıdaki menüden güvenlik derecesini seçiniz ve ekleme işlemini bitiriniz.Kaldırmak için ise aynı komutu kullanıp güvenlik durumunu seçmeniz yeterli olucakdır.

\`\`\`fix
❯ Güvenli Katagori Bilgilendirmesi
\`\`\`
${message.guild.emojiGöster(emojis.star)} \`FULL:\` **Herşey serbesttir** lütfen düşünerek ekleyiniz.(⚠️ **Tehlike: Çok Yüksek**)
${message.guild.emojiGöster(emojis.star)} \`Guild:\` Genel **sunucu işlemleri** ile sınırlıdır.(⚠️ **Tehlike: Çok Yüksek**)
${message.guild.emojiGöster(emojis.star)} \`Rol:\` Rol **silme , açma , düzenleme** işlemleri.(⚠️ **Tehlike: Yüksek**)
${message.guild.emojiGöster(emojis.star)} \`Kanal:\` Kanal **açma , silme , düzenleme** işlemleri.(⚠️ **Tehlike: Yüksek**)
${message.guild.emojiGöster(emojis.star)} \`Ban & Kick:\` Üyeleri **banlama , kickleme** ile sınırlıdır.(⚠️ **Tehlike: Yüksek**)
${message.guild.emojiGöster(emojis.star)} \`Emoji:\`Emoji **silme , yükleme , isim değişme** ile sınırlıdır.(⚠️ **Tehlike: Düşük**)
${message.guild.emojiGöster(emojis.star)} \`Bot:\` Sunucuya bot **ekleme , atma** ile sınırlıdır. (⚠️ Tehlike: **Çok Yüksek**)
${message.guild.emojiGöster(emojis.star)} \`Sticker:\` Sticker **ekleme , silme , isim değiştirme** ile sınırlıdır.(⚠️ Tehlike: **Düşük**)
${message.guild.emojiGöster(emojis.star)} \`Küfür:\` Küfür **etme** ile sınırlıdır.(⚠️ Tehlike: **Düşük**)
${message.guild.emojiGöster(emojis.star)} \`Link:\` Link **discord website linkleri Vb** ile sınırlıdır.(⚠️ Tehlike: **Düşük**)
`)
.setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL({dynamic: true})})], components: [row]})
var filter = (menu) => menu.user.id === message.author.id;
const collector = msj.createMessageComponentCollector({ filter, time: 30000 })
collector.on("collect", async (interaction) => {
if(interaction.values[0] === "full") {
interaction.deferUpdate()
collector.stop();
if (veri.full.includes(args[0])) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { full: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Full** Kategorisinden Kaldırıldı.`)], components: [row]})  
} else {
await whitelist.updateOne({ guildID: settings.guildID }, { $push: { full: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Full** Kategorisine Eklendi.`)], components: [row]})  
}
}
if(interaction.values[0] === "guild") {
interaction.deferUpdate()
collector.stop();
if (veri.guild.includes(args[0])) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { guild: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Guild** Kategorisinden Kaldırıldı.`)], components: [row]})  
} else {
await whitelist.updateOne({ guildID: settings.guildID }, { $push: { guild: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Guild** Kategorisine Eklendi.`)], components: [row]})  
}
}
if(interaction.values[0] === "rol") {
interaction.deferUpdate()
collector.stop();
if (veri.rol.includes(args[0])) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { rol: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Rol** Kategorisinden Kaldırıldı.`)], components: [row]})  
} else {
await whitelist.updateOne({ guildID: settings.guildID }, { $push: { rol: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Rol** Kategorisine Eklendi.`)], components: [row]})  
}
}
if(interaction.values[0] === "kanal") {
interaction.deferUpdate()
collector.stop();
if (veri.kanal.includes(args[0])) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { kanal: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Kanal** Kategorisinden Kaldırıldı.`)], components: [row]})  
} else {
await whitelist.updateOne({ guildID: settings.guildID }, { $push: { kanal: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Kanal** Kategorisine Eklendi.`)], components: [row]})  
}
}
if(interaction.values[0] === "bankick") {
interaction.deferUpdate()
collector.stop();
if (veri.bankick.includes(args[0])) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { bankick: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Ban & Kick** Kategorisinden Kaldırıldı.`)], components: [row]})  
} else {
await whitelist.updateOne({ guildID: settings.guildID }, { $push: { bankick: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Ban & Kick** Kategorisine Eklendi.`)], components: [row]})  
}
}
if(interaction.values[0] === "emoji") {
interaction.deferUpdate()
collector.stop();
if (veri.emoji.includes(args[0])) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { emoji: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Emoji** Kategorisinden Kaldırıldı.`)], components: [row]})  
} else {
await whitelist.updateOne({ guildID: settings.guildID }, { $push: { emoji: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Emoji** Kategorisine Eklendi.`)], components: [row]})  
}
}
if(interaction.values[0] === "bot") {
interaction.deferUpdate()
collector.stop();
if (veri.bot.includes(args[0])) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { bot: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Bot** Kategorisinden Kaldırıldı.`)], components: [row]})  
} else {
await whitelist.updateOne({ guildID: settings.guildID }, { $push: { bot: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Bot** Kategorisine Eklendi.`)], components: [row]})  
}
}
if(interaction.values[0] === "sticker") {
interaction.deferUpdate()
collector.stop();
if (veri.sticker.includes(args[0])) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { sticker: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Sticker** Kategorisinden Kaldırıldı.`)], components: [row]})  
} else {
await whitelist.updateOne({ guildID: settings.guildID }, { $push: { sticker: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Sticker** Kategorisine Eklendi.`)], components: [row]})  
}
}
if(interaction.values[0] === "swear") {
interaction.deferUpdate()
collector.stop();
if (veri.swear.includes(args[0])) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { swear: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Küfür** Kategorisinden Kaldırıldı.`)], components: [row]})  
} else {
await whitelist.updateOne({ guildID: settings.guildID }, { $push: { swear: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Küfür** Kategorisine Eklendi.`)], components: [row]})  
}
}
if(interaction.values[0] === "advert") {
interaction.deferUpdate()
collector.stop();
if (veri.advert.includes(args[0])) {
await whitelist.updateOne({ guildID: settings.guildID }, { $pull: { advert: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Link** Kategorisinden Kaldırıldı.`)], components: [row]})  
} else {
await whitelist.updateOne({ guildID: settings.guildID }, { $push: { advert: args[0] } }, { upsert: true });
interaction.message.edit({embeds: [embed.setDescription(`${safe ? `(${safe})` : ""} Başarıyla **Link** Kategorisine Eklendi.`)], components: [row]})  
}
}
if(interaction.values[0] === "exit") {
interaction.message.delete().catch(e => {})  
}  
})    
}
}