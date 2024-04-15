const Discord = require("discord.js");
const s = require("../../configs/settings.json");
const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: ["sv"],
name: "guildinfo",
help: "guildinfo",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed, prefix) => {
let Rainhas = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("mains").setLabel("Ana Sayfa").setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder().setCustomId("ydetay").setLabel("Yetki Detay").setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder().setCustomId("sgiris").setLabel("Sunucu Giriş").setStyle(Discord.ButtonStyle.Secondary)
          )
        let yetkili = message.guild.members.cache.filter(yetkili => yetkili.roles.cache.has(s.registerPerm)).size

        let yoneticiler = message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.Administrator)).size
        let kişiler = message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.Administrator)).map(a => `<@&${a.id}>`).join(" | ")

        let url = message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild)).size
        let k1 = message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild)).map(a => `<@&${a.id}>`).join(" | ")

        let ryt = message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)).size
        let k2 = message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)).map(a => `<@&${a.id}>`).join(" | ")

        let kyt = message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)).size
        let k3 = message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)).map(a => `<@&${a.id}>`).join(" | ")

        let yonetici = []
        message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.Administrator)).forEach(a => message.guild.roles.cache.get(a.id).members.filter(e => !e.user.bot).map(a => yonetici.push(`<@${a.id}>`)))

        let urlsunucu = []
        message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild)).forEach(a => message.guild.roles.cache.get(a.id).members.filter(e => !e.user.bot).map(a => urlsunucu.push(`<@${a.id}>`)))

        let rolyonet = []
        message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)).forEach(a => message.guild.roles.cache.get(a.id).members.filter(e => !e.user.bot).map(a => rolyonet.push(`<@${a.id}>`)))

        let kanalyonet = []
        message.guild.roles.cache.filter(x => x.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)).forEach(a => message.guild.roles.cache.get(a.id).members.filter(e => !e.user.bot).map(a => kanalyonet.push(`<@${a.id}>`)))

        let sonbirsaat = message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < 3600000).size

        let sonbirgun = message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < 86400000).size

        let sonbirhafta = message.guild.members.cache.filter(a => (new Date().getTime() - a.joinedTimestamp) < 604800000).size
const Embed = new Discord.EmbedBuilder().setColor(message.member.displayHexColor).setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })});

                let msg = await message.channel.send({
                embeds: [Embed.setDescription(`
${message.guild.emojiGöster(emojis.uyari)} **SUNUCU - KONTROL**

${message.guild.emojiGöster(emojis.nokta)} Taç Sahip: <@${message.guild.ownerId}> (\`${message.guild.ownerId}\`) 
${message.guild.emojiGöster(emojis.nokta)} Kuruluş Tarihi: <t:${Math.floor(message.guild.createdAt / 1000)}:R>
${message.guild.emojiGöster(emojis.nokta)} Rol Sayısı: **${message.guild.roles.cache.size}** / Kanal Sayısı: **${message.guild.channels.cache.size}**
${message.guild.emojiGöster(emojis.nokta)} Yetkili Sayısı: **${yetkili}**

${message.guild.emojiGöster(emojis.uyari)} **YETKİ - KONTROL**

${message.guild.emojiGöster(emojis.uyari)} ${yoneticiler} rolde [**Yönetici**] yetkisi açık! Roller Şu Şekildedir:

${kişiler}
**────────────────────────**
${message.guild.emojiGöster(emojis.uyari)} ${url} rolde [**Url/Sunucu Yönet**] yetkisi açık! Roller Şu Şekildedir:

${k1}
**────────────────────────**
${message.guild.emojiGöster(emojis.uyari)} ${ryt} rolde [**Rol Yönet**] yetkisi açık! Roller Şu Şekildedir:

${k2}
**────────────────────────**
${message.guild.emojiGöster(emojis.uyari)} ${kyt} rolde [**Kanal Yönet**] yetkisi açık! Roller Şu Şekildedir:

${k3}
`)], components: [Rainhas]
            })
            var filter = (button) => button.user.id === message.member.id;
            let collector = await msg.createMessageComponentCollector({ filter })

            collector.on("collect", async (button) => {
                if (button.customId == "ydetay") {
                 await button.deferUpdate();
                  msg.edit({
                        embeds: [embed.setDescription(`
**${message.guild.emojiGöster(emojis.uyari)} [YÖNETİCİ] yetkisine sahip olan (${yonetici.length}) kişilerin listesi:**

${yonetici ? yonetici.map(Rainha => `${message.guild.emojiGöster(emojis.member)} ${Rainha}`).join('\n') : "Rolde bulunan kimse yok!"}
**────────────────────────**
**${message.guild.emojiGöster(emojis.uyari)} [URL/SUNUCU YÖNET] yetkisine sahip olan (${urlsunucu.length}) kişilerin listesi:**

${urlsunucu ? urlsunucu.map(Rainha => `${message.guild.emojiGöster(emojis.member)} ${Rainha}`).join('\n') : "Rolde bulunan kimse yok!"}
**────────────────────────**
**${message.guild.emojiGöster(emojis.uyari)} [ROL YÖNET] yetkisine sahip olan (${rolyonet.length}) kişilerin listesi:**

${rolyonet ? rolyonet.map(Rainha => `${message.guild.emojiGöster(emojis.member)} ${Rainha}`).join('\n') : "Rolde bulunan kimse yok!"}
**────────────────────────**
**${message.guild.emojiGöster(emojis.uyari)} [KANAL YÖNET] yetkisine sahip olan (${kanalyonet.length}) kişilerin listesi:**

${kanalyonet ? kanalyonet.map(Rainha => `${message.guild.emojiGöster(emojis.member)} ${Rainha}`).join('\n') : "Rolde bulunan kimse yok!"}
                `)],
                        ephemeral: true
                    })
                }
                if (button.customId == "sgiris") {
                  await button.deferUpdate();
                  msg.edit({
                        embeds: [embed.setDescription(`
${message.guild.emojiGöster(emojis.uyari)} **SUNUCU GİRİŞ BİLGİLERİ**

${message.guild.emojiGöster(emojis.nokta)} Sunucumuzda toplam ${message.guild.memberCount} üye bulunmakta!
${message.guild.emojiGöster(emojis.nokta)} Son **1 Saat** içerisinde sunucumuza **${sonbirsaat}** adet kullanıcı giriş yapmış.
${message.guild.emojiGöster(emojis.nokta)} Son **1 Gün** içerisinde sunucumuza **${sonbirgun}** adet kullanıcı giriş yapmış.
${message.guild.emojiGöster(emojis.nokta)} Son **1 Hafta** içerisinde sunucumuza **${sonbirhafta}** adet kullanıcı giriş yapmış.
                `)],
                        ephemeral: true
                    })
                }
              if (button.customId == "mains") {
               await button.deferUpdate();
                msg.edit({embeds: [Embed]})  
                }
            })
}
  };
  