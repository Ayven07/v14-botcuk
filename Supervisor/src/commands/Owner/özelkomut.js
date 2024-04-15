const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const Discord = require("discord.js");
const db = require("../../schemas/vrcRoleCommands")
module.exports = {
conf: {
aliases: ["komut"],
name: "özelkomut",
help: "komut ekle/sil/bilgi [Komut İsmi]",
category: "ustyetkili"
},
exclosive: async (client, message, args, embed, prefix) => {
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.reply({ embeds: [embed.setDescription(`${message.member}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin!`)] }).sil(15)
let arr = ["ekle", "izin", "sil", "engelle", "ekle", "kaldır", "bilgi"]
        if (!arr.includes(args[0])) return message.reply({content: "Argümanları doğru şekilde yerleştirip tekrar deneyin\n**!komut ekle <isim> @rol**"}).sil(15)
        if (args[0] === "ekle") {
         let komutAd = args[1];
          let res = await db.findOne({ cmdName: komutAd })
            if (res) return message.reply({content: `**${komutAd}** adında bir komut zaten mevcut.`}).sil(15)

            let role = message.mentions.roles.first() || await message.guild.roles.cache.get(args[2])
            if (!role) return message.reply({content: `**${komutAd}** komutuna atamak için geçerli bir rol belirtin.\n**.komut ekle <isim> @rol**`}).sil(15)

            let buffer = new db({
                cmdName: komutAd,
                allowedRoles: [],
                role: role.id,
                blockedUsers: [],
                allowedUsers: []
            })
            return buffer.save().then(() => {
                message.reply({content: `**${komutAd}** adlı bir komut oluşturuldu. Bu komutu kullananlara **${role.name}** rolü verilecek.`})
            })
        }

        if (args[0] === "izin") {
            let newArr = ["ekle", "kaldır", "kaldir", "ver"]
            if (!newArr.includes(args[1])) return message.reply({content: "Argümanları doğru şekilde yerleştirip tekrar deneyin;\n\`!komut izin ekle/kaldır <isim> @rol\`"})
  
            let komutAd = args[2];
            let res = await db.findOne({ cmdName: komutAd })
            if (!res) return message.reply({content: `**${komutAd}** adında bir komut bulunamadı.`}).sil(15)

            let role = message.mentions.roles.first() || await message.guild.roles.cache.get(args[3])
            let user = message.mentions.members.first() || await message.guild.members.cache.get(args[3])
            if (!role && !user) return message.reply({content: `**${komutAd}** komutuna atamak için geçerli bir üye ya da rol belirtin.\n**.komut izin ekle/kaldır <isim> @rol**`}).sil(15)
            if (!user && role && role.id === res.role) return message.reply({content: `Komutta verilecek rol izni tanınan rolden farklı olmalıdır.`}).sil(15)

            if (!user && role) {
                if (args[1] === "ekle" || args[1] === "ver") {
                    if (res.allowedRoles.includes(role.id)) return message.reply({content: `${role.name} rolünün zaten **${komutAd}** komutunu kullanma izni var.`}).sil(15)
                    res.allowedRoles.push(role.id)
                    return res.save().then(() => {
                        message.reply({content: `${role.name} rolündeki üyeler artık **${komutAd}** komutunu kullanabilecek.`})
                    })
                } else {
                    if (!res.allowedRoles.includes(role.id)) return message.reply({content: `${role.name} rolünün zaten **${komutAd}** komutunu kullanma izni yok.`}).sil(15)
                    res.allowedRoles.splice(res.allowedRoles.indexOf(role.id), 1)
                    return res.save().then(() => {
                        message.reply({content: `${role.name} rolündeki üyelerin **${komutAd}** komutunu kullanma izni kaldırıldı.`})
                    })
                }
            }

            if (!role && user) {
                if (args[1] === "ekle" || args[1] === "ver") {
                    if (res.allowedRoles.includes(user.id)) return message.reply({content: `${user} kişisinin zaten **${komutAd}** komutunu kullanma izni var.`}).sil(15)
                    res.allowedUsers.push(user.id)
                    return res.save().then(() => {
                        message.reply({content: `${user} artık **${komutAd}** komutunu kullanabilecek.`})
                    })
                } else {
                    if (!res.allowedUsers.includes(user.id)) return message.reply({content: `${user} kişisinin zaten **${komutAd}** komutunu kullanma izni yok.`}).sil(15)
                    res.allowedUsers.splice(res.allowedUsers.indexOf(user.id), 1)
                    return res.save().then(() => {
                       message.reply({content: `${user} kişisinin **${args[2]}** komutunu kullanma izni kaldırıldı.`})
                    })
                }
            }

        }

        if (args[0] === "sil" || args[0] === "kaldır" || args[0] === "kaldir") {
          let komutAd = args[1];
          let res = await db.findOne({ cmdName: komutAd })
            if (!res) return message.reply({content: `**${komutAd}** adında bir komut bulunamadı.`}).sil(15)

           await db.deleteOne({cmdName: komutAd}, {upsert: true}).then(() => {
                message.reply({content: `**${komutAd}** komutu silindi.`})
            })
        }

        if (args[0] === "bilgi") {
          let komutAd = args[1];
          let res = await db.findOne({ cmdName: komutAd })
            if (!res) return message.reply({content: `**${komutAd}** adında bir komut bulunamadı.`}).sil(15)

            let Embed = new Discord.EmbedBuilder()
            Embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            Embed.setDescription(`Komut Adı: **${res.cmdName}**\nVerilecek Rol: <@&${res.role}>\n\nİzinli Roller: ${res.allowedRoles.map(x => `<@&${x}>`).join("  ")}\nİzinli Kullanıcılar: ${res.allowedUsers.map(x => `<@${x}>`).join("  ")}\nEngellenen Kullanıcılar: ${res.blockedUsers.map(x => `<@${x}>`).join("  ") || "Yok"}`)
            return message.reply({ embeds: [Embed] })
        }

        if (args[0] === "engelle") {
        let komutAd = args[1];
          let res = await db.findOne({ cmdName: komutAd })
            if (!res) return message.reply({content: `**${komutAd}** adında bir komut bulunamadı.`}).sil(15)

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[2])
            if (!member) return message.reply({content: `**${komutAd}** komutundan engellemek için bir üye belirtin.\n**.komut engelle <isim> @üye**`}).sil(15)

            if (res.blockedUsers.includes(member.user.id)) {
                await res.blockedUsers.splice(res.blockedUsers.indexOf(member.user.id), 1)
                await res.save()
                return message.reply({content: `<@${member.user.id}> üyesinin **${komutAd}** komutunu kullanım engeli kalktı.`})
            } else {
                await res.blockedUsers.push(member.user.id)
                await res.save()
                return message.reply({content: `<@${member.user.id}> üyesi **${komutAd}** komutunun kullanımından engellendi.`})
            }
        }
}
  };
  
            