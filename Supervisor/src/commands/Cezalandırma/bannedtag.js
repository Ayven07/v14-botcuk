const bannedTag = require("../../schemas/bannedTag");
const Discord = require("discord.js");
const moment = require("moment");
const setups = require("../../schemas/setup")
const emojis = require('../../configs/emojiName.json')
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["yasaklı-tag", "bannedtag","ytag"],
name: "yasaklıtag",
help: "yasaklıtag [ekle/sil] [tag] / [say/liste]",
category: "ustyetkili"
},
exclosive: async (client, message, args, perm, prefix) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  
if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.react(message.guild.emojiGöster(emojis.no))
if (!args[0]) { message.reply({ content:`\`${prefix}yasaklı-tag <ekle/kaldır/liste/kontrol>\``}).sil(15)
return }
        const data = await bannedTag.findOne({ guildID: settings.guildID });

            if (args[0] == "ekle") {
                if (!args[1]) return message.reply({ content:"Yasaklıya atmak istediğin tagı belirtmelisin."}).sil(15)
                if (!data) {
                    let arr = []
                    arr.push(args[1])
                    const newData = new bannedTag({ guildID: settings.guildID, taglar: arr })
                    newData.save().catch(e => console.log(e))
                    let üyeler = message.guild.members.cache.filter(x => {
                        return x.user.globalName && x.user.globalName.includes(args[1]) || x.user.username.includes(args[1])
                    })
                    await message.reply({ content:"**" + args[1] + "** tagında " + üyeler.size + " kişi bulundu hepsine yasaklı tag permi veriyorum."})
                   await bannedTag.findOneAndUpdate({ guildID: settings.guildID }, { $push: { tags: args[1] } }, { upsert: true });
                    üyeler.map(x => {
                        if (x.roles.cache.has(ayar.bannedTagRoles)) return
                        setTimeout(() => {
                            x.setNickname('Yasaklı Tag');
                            x.roles.cache.has(ayar.boosterRoles) ? x.roles.set([ayar.boosterRoles, ayar.bannedTagRoles[0]]) : x.roles.set(ayar.bannedTagRoles)
                        }, 1000)
                    })
                } else {
                    let taglar = data.taglar
                    if (taglar.includes(args[1])) return message.reply({ content:"Yasaklıya atmak istediğin tag veritabanında zaten yasaklı."}).sil(15)
                    data.taglar.push(args[1])
                    data.save().catch(e => console.log(e))
                   await bannedTag.findOneAndUpdate({ guildID: settings.guildID }, { $push: { tags: args[1] } }, { upsert: true });
                    let üyeler = message.guild.members.cache.filter(x => {
                        return x.user.globalName && x.user.globalName.includes(args[1]) || x.user.username.includes(args[1])
                    }) 
                    await message.reply({ content:"**" + args[1] + "** tagında " + üyeler.size + " kişi bulundu hepsine yasaklı tag permi veriyorum."})
                    üyeler.map(x => {
                        if (x.roles.cache.has(ayar.bannedTagRoles)) return
                        setTimeout(() => {
                            x.setNickname('Yasaklı Tag');
                            x.roles.cache.has(ayar.boosterRoles) ? x.roles.set([ayar.boosterRoles, ayar.bannedTagRoles[0]]) : x.roles.set(ayar.bannedTagRoles)
                        }, 1000)
                       x.send({ content:`${message.guild.name} adlı sunucumuza olan erişiminiz engellendi! Sunucumuzda yasaklı olan bir simgeyi (`+ args[1] +`) isminizde taşımanızdan dolayıdır. Sunucuya erişim sağlamak için simgeyi (`+ args[1] +`) isminizden çıkartmanız gerekmektedir.\n\nSimgeyi (`+ args[1] +`) isminizden kaldırmanıza rağmen üstünüzde halen Yasaklı Tag rolü varsa sunucudan gir çık yapabilirsiniz veya sağ tarafta bulunan yetkililer ile iletişim kurabilirsiniz. **-Yönetim**\n\n__Sunucu Taglarımız__\n**${ayar.serverTag}**`}).catch(err => message.guild.channels.cache.get(ayar.chatChannel).send({ content:`${x} ${message.guild.name} adlı sunucumuza olan erişiminiz engellendi! Sunucumuzda yasaklı olan bir simgeyi (` + args[1] + `) isminizde taşımanızdan dolayıdır. Sunucuya erişim sağlamak için simgeyi (` + args[1] + `) isminizden çıkartmanız gerekmektedir.\n\nSimgeyi (` + args[1] + `) isminizden kaldırmanıza rağmen üstünüzde halen Yasaklı Tag rolü varsa sunucudan gir çık yapabilirsiniz veya sağ tarafta bulunan yetkililer ile iletişim kurabilirsiniz. **-Yönetim**\n\n__Sunucu Tagımız__\n**${ayar.serverTag}**`}).sil(15))
                    })

                }
            }

            if (args[0] == "liste" && !args[1]) {
                if (!data || data && !data.taglar.length) return await message.reply({ content:"Sunucuda yasaklanmış tag bulunmamakta."})
                let num = 1
                let arrs = data.taglar.map(x => `\`${num++}.\` ${x} - (${client.users.cache.filter(s => data.taglar.some(Rainha => s.globalName && s.globalName.includes(Rainha)) || s.user.username.includes(Rainha)).size} üye)`)
                await message.reply({ content: arrs.join("\n") })
            }

            if (args[0] == "liste" && args[1] == "üye") {
                if (!args[2]) await message.reply({ content:"Üyelerini listelemek istediğin yasaklı tagı belirtmelisin."}).sil(15)
                if (!data || data && !data.taglar.length) return await message.reply({ content:"Veritabanında listelenecek yasaklı tag bulunmuyor."}).sil(15)
                if (!data.taglar.includes(args[2])) return await message.reply({ content:"**" + data.taglar.join(",") + "** tag(ları) sunucuda yasaklanmış durumdadır. Belirttiğin tag veritabanında bulunmuyor."}).sil(15)
                let üyeler = message.guild.members.cache.filter(x => {
                    return x.user.globalName && x.user.globalName.includes(args[2])|| x.user.username.includes(args[2])
                }).map(x => "<@" + x.id + "> - (`" + x.id + "`)")
                let üyelerk = message.guild.members.cache.filter(x => {
                    return x.user.globalName && x.user.globalName.includes(args[2]) || x.user.username.includes(args[2])
                }).map(x => "" + x.user.globalName ? x.user.globalName : x.user.tag + " - (`" + x.id + "`)")
                let text = üyeler.join("\n")
                let texto = üyelerk.join("\n")
                const MAX_CHARS = 3 + 2 + text.length + 3;
                if (MAX_CHARS > 2000) {
                    message.channel.send({ content:"Sunucuda çok fazla yasaklı (" + args[2] + ") taga ait kişi var bu yüzden txt olarak göndermek zorundayım.", files: [{ attachment: Buffer.from(texto), name: "yasakli-tagdakiler.txt" }] });
                } else {
                    message.channel.send({ content: text })
                }
            }

            if (args[0] == "kaldır" || args[0] == "sil") {
                if (!data || data && !data.taglar.length) return await message.reply({ content:"Veritabanında kaldırılılacak yasaklı tag bulunmuyor."}).sil(15)
                if (!data.taglar.includes(args[1])) return await message.reply({ content:"Belirttiğin tag yasaklı tag listesinde bulunmuyor"}).sil(15)
                let üyeler = message.guild.members.cache.filter(x => {
                    return x.user.globalName && x.user.globalName.includes(args[1]) || x.user.username.includes(args[1])
                })
                await message.reply({ content:"**" + args[1] + "** tagında " + üyeler.size + " kişi bulundu hepsineden yasaklı tag permini alıp sistemden tagı kaldırıyorum."})
                data.taglar = data.taglar.filter((x) => !x.includes(args[1]));
                data.save().catch(e => console.log(e))
                üyeler.map(x => {
                    setTimeout(async () => {
                    x.setNickname(`${ayar.defaultTag} İsim | Yaş`);
                    x.roles.cache.has(ayar.boosterRolu) ? x.roles.set([ayar.boosterRolu, ayar.unregRoles[0]]) : x.roles.set(ayar.unregRoles)
                    }, 1000);
                    x.send({ content:`${message.guild.name}  adlı sunucumuza olan erişim engeliniz kalktı. İsminizden (`+ args[1] +`) sembolünü kaldırarak sunucumuza erişim hakkı kazandınız. Keyifli Sohbetler**-Yönetim**`}).catch(err =>  message.guild.channels.cache.get(ayar.chatChannel).send({ content:`${x} ${message.guild.name} adlı sunucumuza olan erişim engeliniz kalktı. İsminizden (`+ args[1] +`) sembolünü kaldırarak sunucumuza erişim hakkı kazandınız. Keyifli Sohbetler**-Yönetim**`}).sil(15))
                  })
            }

            if (args[0] == "kontrol") {
                if (!data || data && !data.taglar.length) return await message.reply({ content:"Veritabanında kontrol edilecek yasaklı tag bulunmuyor."}).sil(15)
                data.taglar.forEach(x => {
                    let üye = message.guild.members.cache.filter(mems => {
                        return mems.user.globalName && mems.user.globalName.includes(x) || mems.user.username.includes(x) && !mems.roles.cache.has(ayar.bannedTagRoles)
                    }).map(x => x.id)
                    message.channel.send({ content:`${x} tagı bulunup <@&${ayar.bannedTagRoles}> rolü olmayan ${üye.length} kişiye rolü veriyorum.`})
                    for (let i = 0; i < üye.length;i++) {
                        setTimeout(() => {
                            message.guild.members.cache.get(üye[i]).roles.cache.has(ayar.boosterRoles) ? message.guild.members.cache.get(üye[i]).roles.set([ayar.boosterRoles, ayar.bannedTagRoles[0]]) : message.guild.members.cache.get(üye[i]).roles.set(ayar.bannedTagRoles)
                        }, (i + 1) * 1000)
                    }
                })
            }
        
    }
}