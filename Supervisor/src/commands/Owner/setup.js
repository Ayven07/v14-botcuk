const Discord = require("discord.js");
const settings = require("../../configs/settings.json");
const emojis = require('../../configs/emojiName.json')
const setups = require("../../schemas/setup");
const { set } = require("mongoose");
module.exports = {
conf: {
aliases: ["kur"],
name: "setup",
help: "setup yardım/sıfırla",
category: "owner"    
},
exclosive: async (client, message, args, embed) => {
    const ayar = await setups.findOne({ guildID: settings.guildID });
    if (message.member.id !== message.guild.ownerId && !settings.owners.includes(message.member.id)) return;

    if (args[0] === "yardım" || args[0] === "yardim") {
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setPlaceholder("Bir işlem seçiniz!")
                    .setCustomId("kurulum")
                    .addOptions([
                        { value: "guild", description: "Guild ayarlarını buradan bakarak yapabilirsiniz.", label: "Guild Ayarları", emoji: "1139683150713327638" },
                        { value: "rol", description: "Rol ayarlarını buradan bakarak yapabilirsiniz.", label: "Rol Ayaları", emoji: "1139683150713327638" },
                        { value: "kanal", description: "Kanal ayarlarını buradan bakarak yapabilirsiniz.", label: "Kanal Ayarları", emoji: "1139683150713327638" },
                        { value: "roleselect", description: "Role Select ayarlarını buradan bakarak yapabilirsiniz.", label: "Role Select Ayarları", emoji: "1139683150713327638" },
                        { value: "level", description: "Level ayarlarını buradan bakarak yapabilirsiniz.", label: "Level Ayarları", emoji: "1139683150713327638" },
                        { value: "kapat", label: "Kapat", emoji: "1137686658779709522" },
                    ])
            );
        var msg = await message.channel.send({ embeds: [embed.setFooter("NOT: Tüm Kurulumları Yaptıktan Sonra Botu " + settings.prefix + "reload Komutuyla Yeniden Başlatın.").setDescription(`${message.guild.emojiGöster(emojis.uyari)} ${message.member}, Merhaba **${message.guild.name}** Sunucusunun Kurulum Yardım Menüsüne Hoşgeldin! Nasıl Kurulum Yapabilceğinin Örneğini Anlatıyorum! Menüler İle Nasıl Yapabiliceğini Görebilirsin.`)], components: [row] });
        
        var filter = (interaction) => interaction.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on("collect", async (interaction) => {
            if (interaction.values[0] === "guild") {
                await interaction.deferUpdate();
                let messages = `
\`\`\`GUİLD SETTİNGS\`\`\`
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur serverTag: <Sunucu Tagı / Listede Olan Tagı Girerseniz Bot Kaldırır>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur nameTag: <Taglı Kullanıcıların İsmine Eklenicek Tag>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur defaultTag: <Tagsız Kullanıcıların Tagı>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur unregisterName: <Kayıtsızlara Verilecek Olan İsim>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur botFooter: <Botun Komutlarının Aşağısında Yazıcağı Text>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur voiceChannel: <Botun Bağlanacağı Ses Kanalı>`;
                if (msg) msg.edit({ embeds: [embed.setDescription(messages)] }).catch(e => { });
            }
            if (interaction.values[0] === "rol") {
                await interaction.deferUpdate();
                let messages = `
\`\`\`ROLE SETTİNGS\`\`\`
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur manRoles: <Erkek Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur womanRoles: <Kız Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur unregisterRoles: <Kayıtsız Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur staffRoles: <Yetkili Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur staffStartRoles: <Başlangıç Yetkili Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur registerRoles: <Kayıt Yapabilcek Yetkili Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur registerPerms: <Hoşgeldin Mesajında Etiketlenicek Yetkili Rolü>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur katildiPerms: <Toplantı'ya Katılan Yetkililere Verilecek Katıldı Rolü>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur katilmadiPerms: <Toplantı'ya Katılmayan Yetkililere Verilecek Katılmadı Rolü>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur mazeretPerms: <Mazeret Rolü>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur tagRoles: <Tag Alan Kullanıcılara Verilicek Olan Rolü>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur ownerRoles: <Sunucu Owner Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur boosterRoles: <Sunucu Booster Rolü>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur warnHammer: <Sunucu Üyelerini Uyarabilcek Yetkili Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur banHammer: <Kullanıcıları Banlayabilcek Yetkili Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur jailHammer: <Kullanıcıları Karantinaya Atabilcek Yetkili Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur muteHammer: <Kullanıcıları Susturabilcek Yetkili Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur jailRoles: <Jail'e Atılan Kullanıcılara Verilecek Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur reklamRoles: <Reklamcı Olarak Karantinaya Atılan Kullanıcılara Verilecek Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur muteRoles: <Text Kanallarında Susturulan Kullanıcılara Verilecek Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur vmuteRoles: <Ses Kanallarında Susturulan Kullanıcılara Verilecek Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur fakeAccRoles: <Hesabı Yeni Açılan Kullanıcılara Verilecek Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur bannedTagRoles: <Yasaklı Tag Bulunan Kullanıcılara Verilecek Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur warnOneRoles: <Kullanıcılara 1. Uyarıda Verilecek Rol>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur warnTwoRoles: <Kullanıcılara 2. Uyarıda Verilecek Rol>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur warnThreeRoles: <Kullanıcılara 3. Uyarıda Verilecek Rol>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur roleAddRoles: <Komutla Rol Verebilcek Yetkili Rol(leri)>
${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur vipRoles: <Sunucuda Bulunan Vip Rolü>`;
                if (msg) msg.edit({ embeds: [embed.setDescription(messages)] }).catch(e => { });
            }

            if (button.values[0] == "kanal") {
                await button.deferUpdate();
                let messages = `
            \`\`\`CHANNEL & CATEGORY SETTİNGS\`\`\`
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur chatChannel: <Sunucunun Chat Kanalı>
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur welcomeChannel: <Hoşgeldin Mesajlarının Atılcağı Kanal>
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur inviteChannel: <İnvite Mesajlarının Atılacağı Kanal>
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur rulesChannel: <Sunucunun Kurallar Kanal>
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur publicParents: <Sunucunun Public Kategorisi>
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur registerParents: <Sunucunun Kayıt Kategorisi>
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur solvingParents: <Sunucunun Sorun Çözme Kategorisi>
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur privateParents: <Sunucunun Secret Kategorisi>
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur aloneParents: <Sunucunun Alone Kategorisi>
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur funParents: <Sunucunun Eğlence Kategorsi>`;
                if (msg) msg.edit({ embeds: [embed.setDescription(messages)] }).catch(e => { });
            }
            
            if (button.values[0] == "roleselect") {
                await button.deferUpdate();
                let messages = `
            \`\`\`ROL SELECT\`\`\`
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur blackRoles: (Siyah Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur blueRoles: (Mavi Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur whiteRoles: (Beyaz Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur redRoles: (Kırmızı Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur yellowRoles: (Sarı Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur pinkRoles: (Pembe Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur purpleRoles: (Mor Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur orangeRoles: (Turuncu Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur greenRoles: (Yeşil Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur brownRoles: (Kahverengi Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur burgundyRoles: (Bordo Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur turquoiseRoles: (Turkuaz Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur beigeRoles: (Bej Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur navyblueRoles: (Lacivert Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur lightblueRoles: (Açık Mavi Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur pistachiogreenRoles: (Fıstık Yeşili Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur cekilisRoles: (Çekiliş Katılımcısı Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur etkinlikRoles: (Etkinlik Katılımcısı Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur coupleRoles: (Sevgilim Var Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur aloneRoles: (Sevgilim Yok Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur syRoles: (Sevgili Yapmıyorum Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur minecraftRoles (Minecraft Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur fortniteRoles: (Fortnite Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur mlbbRoles: (Mobile Legends Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur csgoRoles: (Csgo Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur pubgRoles: (Pubg Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur amongusRoles: (AmongUs Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur lolRoles: (League Of Legends Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur gtavRoles: (Gta V Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur valorantRoles: (Valorant Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur fbRoles: (Fenerbahçe Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur gsRoles: (Galatasaray Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur bjkRoles: (Beşiktaş Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur tsRoles: (Trabzonspor Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur akrepRoles: (Akrep Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur yengecRoles: (Yengeç Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur ikizlerRoles: (İkizler Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur yayRoles: (Yay Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur aslanRoles: (Aslan Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur teraziRoles: (Terazi Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur basakRoles: (Başak Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur kovaRoles: (Kova Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur balikRoles: (Balık Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur oglakRoles: (Oğlak Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur bogaRoles: (Boğa Rolü) 
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur kocRoles: (Koç Rolü)`;
                if (msg) msg.edit({ embeds: [embed.setDescription(messages)] }).catch(e => { });
            }
            if (button.values[0] == "level") {
                await button.deferUpdate();
                let messagess;
                messagess = `
            \`\`\`LEVEL ROLE SETTİNGS\`\`\`
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur chatBronzeRoles: (Chat Bronze Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur chatSilverRoles: (Chat Silver Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur chatGoldRoles: (Chat Gold Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur chatDiamondRoles: (Chat Diamond Bronze Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur chatEmeraldRoles: (Chat Emerald Bronze Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur voiceBronzeRoles: (Voice Bronze Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur voiceSilverRoles: (Voice Silver Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur voiceGoldRoles: (Voice Gold Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur voiceDiamondRoles: (Voice Diamond Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur voiceEmeraldRoles: (Voice Emerald Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur oneMonthRoles: (1 Aylık Üye Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur threeMonthRoles: (3 Aylık Üye Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur sixMonthRoles: (6 Aylık Üye Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur nineMonthRoles: (9 Aylık Üye Rolü)
            ${message.guild.emojiGöster(emojis.info)} ${settings.prefix}kur oneYearRoles: (1 Yıllık Üye Rolü)`;
                if (msg) msg.edit({ embeds: [embed.setDescription(messagess)] }).catch(e => { });
            }
            if (button.values[0] === "kapat") {
                msg.delete().catch(e => {});
            }
            })
            } else if (!args[0]) {
                const rows = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setPlaceholder("Bir işlem seçiniz!")
                            .setCustomId("kurulum")
                            .setOptions([
                                { value: "guild", description: "Guild ayarlar durumunu buradan görebilirsin.", label: "Guild Ayarları", emoji: { id: "1139683150713327638" } },
                                { value: "rol", description: "Rol ayarlar durumunu buradan görebilirsin.", label: "Rol Ayaları", emoji: { id: "1139683150713327638" } },
                                { value: "kanal", description: "Kanal ayarlar durumunu buradan görebilirsin.", label: "Kanal Ayarları", emoji: { id: "1139683150713327638" } },
                                { value: "roleselect", description: "Role Select ayarlar durumunu burdan görebilirsin.", label: "Role Select Ayarları", emoji: { id: "1139683150713327638" } },
                                { value: "level", description: "Level ayarlar durumunu burdan görebilirsin.", label: "Level Ayarları", emoji: { id: "1139683150713327638" } },
                                { value: "kapat", label: "Kapat", emoji: { id: "1137686658779709522" } },
                            ])
                    )
                var msj = await message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojis.uyari)} ${message.member}, Merhaba **${message.guild.name}** Sunucusunun Kurulmuş Olan Ayarlarını Aşağıdaki Menüye Tıklayarak Görebilirsiniz.`).setFooter({ text: `Nasıl Kurulum Yapacağınızı Öğrenmek İçin (${settings.prefix}setup yardım)` })], components: [rows] })
                var filter = (button) => button.user.id === message.author.id;
                let collector = await msj.createMessageComponentCollector({ filter, time: 60000 })
                collector.on("collect", async (button) => {
                    if (button.values[0] === "guild") {
                        await button.deferUpdate();
                        let messages
                        messages = `\`\`\`GUİLD SETTİNGS\`\`\`
            ${message.guild.emojiGöster(emojis.info)} serverTag: ${ayar && ayar.serverTag.length > 0 ? `${ayar.serverTag.map((r) => `${r}`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} nameTag: ${ayar && ayar.nameTag.length > 0 ? ayar.nameTag : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} defaultTag: ${ayar && ayar.defaultTag.length > 0 ? ayar.defaultTag : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} unregisterName: ${ayar && ayar.unregName.length > 0 ? `${ayar.defaultTag ? ayar.defaultTag : "•"} ${ayar.unregName}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} botFooter: ${ayar && ayar.botFooter.length > 0 ? `${ayar.botFooter}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} voiceChannel: ${ayar && ayar.voiceChannel.length > 0 ? `<#${ayar.voiceChannel}>` : `${message.guild.emojiGöster(emojis.no)}`}`
                        if (msj) msj.edit({ embeds: [embed.setDescription(messages)] }).catch(e => { })
                    }
                    if (button.values[0] === "rol") {
                        await button.deferUpdate();
                        let messages
                        messages = `\`\`\`ROLE SETTİNGS\`\`\`
            ${message.guild.emojiGöster(emojis.info)} manRoles: ${ayar && ayar.manRoles.length > 0 ? `${ayar.manRoles.map((r) => `<@&${r}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} womanRoles: ${ayar && ayar.womanRoles.length > 0 ? `${ayar.womanRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} unregisterRoles: ${ayar && ayar.unregRoles.length > 0 ? `${ayar.unregRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} staffRoles: ${ayar && ayar.staffRoles.length > 0 ? `${ayar.staffRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} staffStartRoles: ${ayar && ayar.staffStartRoles.length > 0 ? `${ayar.staffStartRoles.map((x) => `<@&${x}>`).join(",")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} registerRoles: ${ayar && ayar.registerRoles.length > 0 ? `${ayar.registerRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} registerPerms: ${ayar && ayar.registerPerms.length > 0 ? `<@&${ayar.registerPerms}>` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} katildiPerms: ${ayar && ayar.katildiPerms.length > 0 ? `<@&${ayar.katildiPerms}>` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} katilmadiPerms: ${ayar && ayar.katilmadiPerms.length > 0 ? `<@&${ayar.katilmadiPerms}>` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} mazeretPerms: ${ayar && ayar.mazeretPerms.length > 0 ? `<@&${ayar.mazeretPerms}>` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} tagRoles: ${ayar && ayar.tagRoles.length > 0 ? `<@&${ayar.tagRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} ownerRoles: ${ayar && ayar.ownerRoles.length > 0 ? `${ayar.ownerRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} boosterRoles: ${ayar && ayar.boosterRoles.length > 0 ? `<@&${ayar.boosterRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} warnHammer: ${ayar && ayar.warnHammer.length > 0 ? `${ayar.warnHammer.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} banHammer: ${ayar && ayar.banHammer.length > 0 ? `${ayar.banHammer.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} jailHammer: ${ayar && ayar.jailHammer.length > 0 ? `${ayar.jailHammer.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} muteHammer: ${ayar && ayar.muteHammer.length > 0 ? `${ayar.muteHammer.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} jailRoles: ${ayar && ayar.jailRoles.length > 0 ? `${ayar.jailRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} reklamRoles: ${ayar && ayar.reklamRoles.length > 0 ? `${ayar.reklamRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} muteRoles: ${ayar && ayar.muteRoles.length > 0 ? `${ayar.muteRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} vmuteRoles: ${ayar && ayar.vmuteRoles.length > 0 ? `${ayar.vmuteRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} fakeAccRoles: ${ayar && ayar.fakeAccRoles.length > 0 ? `${ayar.fakeAccRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} bannedTagRoles: ${ayar && ayar.bannedTagRoles.length > 0 ? `${ayar.bannedTagRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} warnOneRoles: ${ayar && ayar.warnOneRoles.length ? `<@&${ayar.warnOneRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} warnTwoRoles: ${ayar && ayar.warnTwoRoles.length ? `<@&${ayar.warnTwoRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} warnThreeRoles: ${ayar && ayar.warnThreeRoles.length ? `<@&${ayar.warnThreeRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} roleAddRoles: ${ayar && ayar.roleAddRoles.length > 0 ? `${ayar.roleAddRoles.map((x) => `<@&${x}>`).join(", ")}` : `${message.guild.emojiGöster(emojis.no)}`}
            ${message.guild.emojiGöster(emojis.info)} vipRoles: ${ayar && ayar.vipRoles.length ? `<@&${ayar.vipRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}`;
                        if (msj) msj.edit({ embeds: [embed.setDescription(messages)] }).catch(e => { })
                    }
            
if (button.values[0] === "kanal") {
    await button.deferUpdate();
    let messages   
    messages = `\`\`\`CHANNEL & CATEGORY SETTİNGS\`\`\`
${message.guild.emojiGöster(emojis.info)} chatChannel: ${ayar && ayar.chatChannel.length > 0 ? `<#${ayar.chatChannel}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} welcomeChannel: ${ayar && ayar.welcomeChannel.length > 0 ? `<#${ayar.welcomeChannel}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} inviteChannel: ${ayar && ayar.inviteChannel.length > 0 ? `<#${ayar.inviteChannel}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} rulesChannel: ${ayar && ayar.rulesChannel.length > 0 ? `<#${ayar.rulesChannel}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} publicParents: ${ayar && ayar.publicParents.length > 0 ? `<#${ayar.publicParents}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} registerParents: ${ayar && ayar.registerParents.length > 0 ? `<#${ayar.registerParents}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} solvingParents: ${ayar && ayar.solvingParents.length > 0 ? `<#${ayar.solvingParents}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} privateParents: ${ayar && ayar.privateParents.length > 0 ? `<#${ayar.privateParents}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} aloneParents: ${ayar && ayar.aloneParents.length > 0 ? `<#${ayar.aloneParents}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} funParents: ${ayar && ayar.funParents.length > 0 ? `<#${ayar.funParents}>` : `${message.guild.emojiGöster(emojis.no)}`}`
    if (msj) msj.edit({ embeds: [embed.setDescription(messages)] }).catch(e => {})
}

if (button.values[0] === "roleselect") {
    await button.deferUpdate();
    let messages   
    messages = `\`\`\`ROLE SELECT\`\`\`
${message.guild.emojiGöster(emojis.info)} blackRoles: ${ayar && ayar.blackRoles.length ? `<@&${ayar.blackRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} blueRoles: ${ayar && ayar.blueRoles.length ? `<@&${ayar.blueRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} whiteRoles: ${ayar && ayar.whiteRoles.length ? `<@&${ayar.whiteRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} redRoles: ${ayar && ayar.redRoles.length ? `<@&${ayar.redRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} yellowRoles: ${ayar && ayar.yellowRoles.length ? `<@&${ayar.yellowRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} pinkRoles: ${ayar && ayar.pinkRoles.length ? `<@&${ayar.pinkRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} purpleRoles: ${ayar && ayar.purpleRoles.length ? `<@&${ayar.purpleRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} orangeRoles: ${ayar && ayar.orangeRoles.length ? `<@&${ayar.orangeRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} greenRoles: ${ayar && ayar.greenRoles.length ? `<@&${ayar.greenRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} brownRoles: ${ayar && ayar.brownRoles.length ? `<@&${ayar.brownRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} burgundyRoles: ${ayar && ayar.burgundyRoles.length ? `<@&${ayar.burgundyRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} turquoiseRoles: ${ayar && ayar.turquoiseRoles.length ? `<@&${ayar.turquoiseRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} beigeRoles: ${ayar && ayar.beigeRoles.length ? `<@&${ayar.beigeRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} navyblueRoles: ${ayar && ayar.navyblueRoles.length ? `<@&${ayar.navyblueRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} lightblueRoles: ${ayar && ayar.lightblueRoles.length ? `<@&${ayar.lightblueRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} pistachiogreenRoles: ${ayar && ayar.pistachiogreenRoles.length ? `<@&${ayar.pistachiogreenRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} cekilisRoles: ${ayar && ayar.cekilisRoles.length ? `<@&${ayar.cekilisRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} etkinlikRoles: ${ayar && ayar.etkinlikRoles.length ? `<@&${ayar.etkinlikRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} coupleRoles: ${ayar && ayar.coupleRoles.length ? `<@&${ayar.coupleRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} aloneRoles: ${ayar && ayar.aloneRoles.length ? `<@&${ayar.aloneRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} syRoles: ${ayar && ayar.syRoles.length ? `<@&${ayar.syRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} minecraftRoles: ${ayar && ayar.minecraftRoles.length > 0 ? `<@&${ayar.minecraftRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} fortniteRoles: ${ayar && ayar.fortniteRoles.length > 0 ? `<@&${ayar.fortniteRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} mlbbRoles: ${ayar && ayar.mlbbRoles.length > 0 ? `<@&${ayar.mlbbRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} csRoles: ${ayar && ayar.csRoles.length > 0 ? `<@&${ayar.csRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} pubgRoles: ${ayar && ayar.pubgRoles.length > 0 ? `<@&${ayar.pubgRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} amongusRoles: ${ayar && ayar.amongusRoles.length > 0 ? `<@&${ayar.amongusRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} lolRoles: ${ayar && ayar.lolRoles.length > 0 ? `<@&${ayar.lolRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} gtavRoles: ${ayar && ayar.gtavRoles.length > 0 ? `<@&${ayar.gtavRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} valorantRoles: ${ayar && ayar.valorantRoles.length > 0 ? `<@&${ayar.valorantRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} fbRoles: ${ayar && ayar.fbRoles.length > 0 ? `<@&${ayar.fbRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} gsRoles: ${ayar && ayar.gsRoles.length > 0 ? `<@&${ayar.gsRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} bjkRoles: ${ayar && ayar.bjkRoles.length > 0 ? `<@&${ayar.bjkRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} tsRoles: ${ayar && ayar.tsRoles.length > 0 ? `<@&${ayar.tsRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} akrepRoles: ${ayar && ayar.akrepRoles.length > 0 ? `<@&${ayar.akrepRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} yengecRoles: ${ayar && ayar.yengecRoles.length > 0 ? `<@&${ayar.yengecRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} ikizlerRoles: ${ayar && ayar.ikizlerRoles.length > 0 ? `<@&${ayar.ikizlerRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} yayRoles: ${ayar && ayar.yayRoles.length > 0 ? `<@&${ayar.yayRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} aslanRoles: ${ayar && ayar.aslanRoles.length > 0 ? `<@&${ayar.aslanRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} teraziRoles: ${ayar && ayar.teraziRoles.length > 0 ? `<@&${ayar.teraziRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} basakRoles: ${ayar && ayar.basakRoles.length > 0 ? `<@&${ayar.basakRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} kovaRoles: ${ayar && ayar.kovaRoles.length > 0 ? `<@&${ayar.kovaRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} balikRoles: ${ayar && ayar.balikRoles.length > 0 ? `<@&${ayar.balikRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} oglakRoles: ${ayar && ayar.oglakRoles.length > 0 ? `<@&${ayar.oglakRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} bogaRoles: ${ayar && ayar.bogaRoles.length > 0 ? `<@&${ayar.bogaRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} kocRoles: ${ayar && ayar.kocRoles.length > 0 ? `<@&${ayar.kocRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}`
    if (msj) msj.edit({ embeds: [embed.setDescription(messages)] }).catch(e => {})
}

if (button.values[0] === "level") {
    await button.deferUpdate();
    let messagess  
    messagess = `
\`\`\`LEVEL SETTİNGS\`\`\`
${message.guild.emojiGöster(emojis.info)} chatBronzeRoles: ${ayar && ayar.chatBronzeRoles.length > 0 ? `<@&${ayar.chatBronzeRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} chatSilverRoles: ${ayar && ayar.chatSilverRoles.length > 0 ? `<@&${ayar.chatSilverRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} chatGoldRoles: ${ayar && ayar.chatGoldRoles.length > 0 ? `<@&${ayar.chatGoldRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} chatDiamondRoles: ${ayar && ayar.chatDiamondRoles.length > 0 ? `<@&${ayar.chatDiamondRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} chatEmeraldRoles: ${ayar && ayar.chatEmeraldRoles.length > 0 ? `<@&${ayar.chatEmeraldRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} voiceBronzeRoles: ${ayar && ayar.voiceBronzeRoles.length > 0 ? `<@&${ayar.voiceBronzeRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} voiceSilverRoles: ${ayar && ayar.voiceSilverRoles.length > 0 ? `<@&${ayar.voiceSilverRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} voiceGoldRoles: ${ayar && ayar.voiceGoldRoles.length > 0 ? `<@&${ayar.voiceGoldRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} voiceDiamondRoles: ${ayar && ayar.voiceDiamondRoles.length > 0 ? `<@&${ayar.voiceDiamondRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} voiceEmeraldRoles: ${ayar && ayar.voiceEmeraldRoles.length > 0 ? `<@&${ayar.voiceEmeraldRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} oneMonthRoles: ${ayar && ayar.oneMonthRoles.length > 0 ? `<@&${ayar.oneMonthRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} threeMonthRoles: ${ayar && ayar.threeMonthRoles.length > 0 ? `<@&${ayar.threeMonthRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} sixMonthRoles: ${ayar && ayar.sixMonthRoles.length > 0 ? `<@&${ayar.sixMonthRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} nineMonthRoles: ${ayar && ayar.nineMonthRoles.length > 0 ? `<@&${ayar.nineMonthRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}
${message.guild.emojiGöster(emojis.info)} oneYearRoles: ${ayar && ayar.oneYearRoles.length > 0 ? `<@&${ayar.oneYearRoles}>` : `${message.guild.emojiGöster(emojis.no)}`}`
    if (msj) msj.edit({ embeds: [embed.setDescription(messagess)] }).catch(e => {})
}

if (button.values[0] === "kapat") {
    msj.delete().catch(e => {})  
}
 
})  
if (args[1] && ["serverTag"].includes(args[1])) {
    const tag = args[2];
    if (!tag) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir tag belirt.\nTag Kaldırmak İstiyorsanız Listede Olan Kaldırmak İstediğiniz Tagı Giriniz Bot Kaldırıcaktır.` }).sil(15);
    if (!ayar.serverTag.includes(args[2])) {
        await setups.updateOne({ guildID: settings.guildID }, { $push: { serverTag: tag } }, { upsert: true });
        message.react(message.guild.emojiGöster(emojis.yes));
    } else {
        await setups.updateOne({ guildID: settings.guildID }, { $pull: { serverTag: args[2] } }, { upsert: true });
        message.react(message.guild.emojiGöster(emojis.yes));
    }
} else if (args[1] && ["nameTag"].includes(args[1])) {
    const tag = args[2];
    if (!tag) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir tag belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { nameTag: tag } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[1] && ["defaultTag"].includes(args[1])) {
    const tag = args[2];
    if (!tag) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir tag belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { defaultTag: tag } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[1] && ["unregisterName"].includes(args[1])) {
    const names = args.slice(2).join(" ");
    if (!names) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir text belirt.` }).sil(15);
    if (names.length >= 30) return;
    await setups.updateOne({ guildID: settings.guildID }, { $set: { unregName: names } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[1] && ["botFooter"].includes(args[1])) {
    const footer = args.slice(2).join(" ");
    if (!footer) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir text belirt.` }).sil(15);
    if (message.content.length >= 50) return;
    await setups.updateOne({ guildID: settings.guildID }, { $set: { botFooter: footer } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[1] && ["voiceChannel"].includes(args[1])) {
    kur("voiceChannel", "Botun Bağlanacağı Ses Kanalı", "vchannel");
} else if (args[1] && ["manRoles"].includes(args[1])) {
    kur("manRoles", "Erkek Rol(leri)", "role");
} else if (args[1] && ["womanRoles"].includes(args[1])) {
    kur("womanRoles", "Kız Rol(leri)", "role");
} else if (args[1] && ["unregisterRoles"].includes(args[1])) {
    kur("unregRoles", "Kayıtsız Rol(leri)", "role");
} else if (args[1] && ["staffRoles"].includes(args[1])) {
    kur("staffRoles", "Yetkili Rol(leri)", "role");
} else if (args[1] && ["staffStartRoles"].includes(args[1])) {
    kur("staffStartRoles", "Başlangıç Yetkili Rol(leri)", "role");
} else if (args[1] && ["registerRoles"].includes(args[1])) {
    kur("registerRoles", "Kayıt Yetkili Rol(leri)", "role");
} else if (args[1] && ["registerPerms"].includes(args[1])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { registerPerms: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[1] && ["katildiPerms"].includes(args[1])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { katildiPerms: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[1] && ["katilmadiPerms"].includes(args[1])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { katilmadiPerms: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[1] && ["mazeretPerms"].includes(args[1])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { mazeretPerms: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[1] && ["tagRoles"].includes(args[1])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { tagRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[1] && ["ownerRoles"].includes(args[1])) {
    kur("ownerRoles", "Kurucu Rol(leri)", "role");
} else if (args[1] && ["boosterRoles"].includes(args[1])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { boosterRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[1] && ["warnHammer"].includes(args[1])) {
    kur("warnHammer", "Kullanıcıları Uyarabilcek Yetkili Rol(leri)", "role");
} else if (args[1] && ["banHammer"].includes(args[1])) {
    kur("banHammer", "Kullanıcıları Banlayabilcek Yetkili Rol(leri)", "role");
} else if (args[1] && ["jailHammer"].includes(args[1])) {
    kur("jailHammer", "Kullanıcıları Karantina'ya Atabilcek Yetkili Rol(leri)", "role");
} else if (args[1] && ["muteHammer"].includes(args[1])) {
    kur("muteHammer", "Kullanıcıları Muteleyebilcek Yetkili Rol(leri)", "role");
} else if (args[1] && ["jailRoles"].includes(args[1])) {
    kur("jailRoles", "Karantina Rol(leri)", "role");
} else if (args[1] && ["reklamRoles"].includes(args[1])) {
    kur("reklamRoles", "Reklamcı Rol(leri)", "role");
} else if (args[1] && ["muteRoles"].includes(args[1])) {
    kur("muteRoles", "Chat Mute Rol(leri)", "role");
} else if (args[1] && ["vmuteRoles"].includes(args[1])) {
    kur("vmuteRoles", "Voice Mute Rol(leri)", "role");
} else if (args[1] && ["fakeAccRoles"].includes(args[1])) {
    kur("fakeAccRoles", "Yeni Hesap Rol(leri)", "role");
} else if (args[1] && ["bannedTagRoles"].includes(args[1])) {
    kur("bannedTagRoles", "Yasaklı Tag Rol(leri)", "role");
} else if (args[1] && ["warnOneRoles"].includes(args[1])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { warnOneRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
}

if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
await setups.updateOne({ guildID: settings.guildID }, { $set: { warnOneRoles: rol.id } }, { upsert: true });
message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["warnTwoRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { warnTwoRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["warnThreeRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { warnThreeRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["roleAddRoles"].includes(args[0])) {
    kur("roleAddRoles", "Rol Ekleyebilcek Yetkili Rol(leri)", "role");
} else if (args[0] && ["vipRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { vipRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["chatChannel"].includes(args[0])) {
    kur("chatChannel", "Sohbet Kanalı", "channel");
} else if (args[0] && ["welcomeChannel"].includes(args[0])) {
    kur("welcomeChannel", "Kayıt Kanalı", "channel");
} else if (args[0] && ["inviteChannel"].includes(args[0])) {
    kur("inviteChannel", "İnvite Kanalı", "channel");
} else if (args[0] && ["rulesChannel"].includes(args[0])) {
    kur("rulesChannel", "Kurallar Kanalı", "channel");
} else if (args[0] && ["publicParents"].includes(args[0])) {
    kur("publicParents", "Public Kategorisi", "category");
} else if (args[0] && ["registerParents"].includes(args[0])) {
    kur("registerParents", "Kayıt Kategorisi", "category");
} else if (args[0] && ["solvingParents"].includes(args[0])) {
    kur("solvingParents", "Sorun Çözme Kategorisi", "category");
} else if (args[0] && ["privateParents"].includes(args[0])) {
    kur("privateParents", "Secret Kategorisi", "category");
} else if (args[0] && ["aloneParents"].includes(args[0])) {
    kur("aloneParents", "Alone Kategorisi", "category");
} else if (args[0] && ["funParents"].includes(args[0])) {
    kur("funParents", "Eğlence Kategorisi", "category");
} else if (args[0] && ["chatBronzeRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { chatBronzeRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["chatSilverRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { chatSilverRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["chatGoldRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { chatGoldRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["chatDiamondRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { chatDiamondRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["chatEmeraldRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { chatEmeraldRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["voiceBronzeRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceBronzeRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["voiceSilverRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceSilverRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["voiceGoldRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceGoldRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
} else if (args[0] && ["voiceDiamondRoles"].includes(args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.` }).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceDiamondRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));

    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceDiamondRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["voiceEmeraldRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { voiceEmeraldRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["oneMonthRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { oneMonthRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["threeMonthRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { threeMonthRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["sixMonthRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { sixMonthRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["nineMonthRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { nineMonthRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["oneYearRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { oneYearRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["blackRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { blackRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["blueRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { blueRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["whiteRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { whiteRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["redRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { redRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["yellowRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { yellowRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["pinkRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { pinkRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["purpleRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { purpleRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["orangeRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { orangeRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["greenRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { greenRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["brownRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { brownRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["burgundyRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { burgundyRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["turquoiseRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { turquoiseRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["beigeRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { beigeRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["navyblueRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { navyblueRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["lightblueRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { lightblueRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["pistachiogreenRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { pistachiogreenRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["cekilisRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { cekilisRoles : rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["etkinlikRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { etkinlikRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["coupleRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { coupleRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["aloneRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { aloneRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["syRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { syRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["minecraftRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { minecraftRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["fortniteRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { fortniteRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["mlbbRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { mlbbRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["csRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { csRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["pubgRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { pubgRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["amongusRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { amongusRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { amongusRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["lolRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { lolRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["gtavRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { gtavRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["valorantRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { valorantRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["fbRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { fbRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["gsRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { gsRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["bjkRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { bjkRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["tsRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { tsRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["akrepRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { akrepRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["yengecRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { yengecRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["ikizlerRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { ikizlerRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["yayRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { yayRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["aslanRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { aslanRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["teraziRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { teraziRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["basakRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { basakRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["kovaRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { kovaRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["balikRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { balikRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["oglakRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { oglakRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["bogaRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { bogaRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["kocRoles"].some((x) => x === args[0])) {
    let rol = message.mentions.roles.first();
    if (!rol) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} ${message.member} Lütfen bir rol belirt.`}).sil(15);
    await setups.updateOne({ guildID: settings.guildID }, { $set: { kocRoles: rol.id } }, { upsert: true });
    message.react(message.guild.emojiGöster(emojis.yes));
    } else if(args[0] && ["sifirla", "sıfırla", "clear"].some((x) => x === args[0])) {
    if(!settings.owners.includes(message.member.id)) return;
    await setups.deleteMany({guildID: settings.guildID});
    message.react(message.guild.emojiGöster(emojis.yes));
    }  
    
    async function kur(modal, desc, type) {
        console.log("İşlem başladı: type =", type);
    
        const channelrow = new Discord.ActionRowBuilder().addComponents(new Discord.ChannelSelectMenuBuilder().setCustomId("channel_select").addChannelTypes(Discord.ChannelType.GuildText, Discord.ChannelType.AnnouncementThread, Discord.ChannelType.GuildForum, Discord.ChannelType.GuildAnnouncement).setMinValues(1).setMaxValues(1));
        const vchannelrow = new Discord.ActionRowBuilder().addComponents(new Discord.ChannelSelectMenuBuilder().setCustomId("vchannel_select").addChannelTypes(Discord.ChannelType.GuildVoice).setMinValues(1).setMaxValues(1));
        const categoryrow = new Discord.ActionRowBuilder().addComponents(new Discord.ChannelSelectMenuBuilder().setCustomId("category_select").addChannelTypes(Discord.ChannelType.GuildCategory).setMinValues(1).setMaxValues(1));
        const rolerow = new Discord.ActionRowBuilder().addComponents(new Discord.RoleSelectMenuBuilder().setCustomId("role_select").setMinValues(1).setMaxValues(20));
    
        try {
            if (type == "channel") {
                console.log("Channel işlemi başladı");
                let db = await setups.findOne({ guildID: settings.guildID });
                let msg = await message.reply({ content: `**${desc}** ayarlamak için aşağıdaki menüyü kullanın.`, components: [channelrow] });
                var filter = (interaction) => interaction.user.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 120000 });
    
                collector.on("collect", async (interaction) => {
                    console.log("Collector 'collect' eventi başladı");
                    channelrow.components[0].setDisabled(true);
                    msg.edit({ components: [channelrow] });
                    if (interaction.customId === "channel_select") {
                        interaction.deferUpdate();
                        db[modal] = interaction.values[0];
                        await db.save();
                        message.react(message.guild.emojiGöster(emojis.yes));
                        msg.edit({ content: `Sunucu **${desc}** başarıyla ${message.guild.channels.cache.get(interaction.values[0])} olarak ayarlandı.` });
                    }
                });
    
                collector.on("end", async () => {
                    console.log("Collector 'end' eventi başladı");
                    channelrow.components[0].setDisabled(true);
                    msg.edit({ components: [channelrow] });
                });
            } else if (type == "vchannel") {
                console.log("Vchannel işlemi başladı");
                let db = await setups.findOne({ guildID: settings.guildID });
                let msg = await message.reply({ content: `**${desc}** ayarlamak için aşağıdaki menüyü kullanın.`, components: [vchannelrow] });
                var filter = (interaction) => interaction.user.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 120000 });
    
                collector.on("collect", async (interaction) => {
                    console.log("Collector 'collect' eventi başladı");
                    vchannelrow.components[0].setDisabled(true);
                    msg.edit({ components: [vchannelrow] });
                    if (interaction.customId === "vchannel_select") {
                        interaction.deferUpdate();
                        db[modal] = interaction.values[0];
                        await db.save();
                        message.react(message.guild.emojiGöster(emojis.yes));
                        msg.edit({ content: `**${desc}** başarıyla ${message.guild.channels.cache.get(interaction.values[0])} olarak ayarlandı.` });
                    }
                });
    
                collector.on("end", async () => {
                    console.log("Collector 'end' eventi başladı");
                    vchannelrow.components[0].setDisabled(true);
                    msg.edit({ components: [vchannelrow] });
                });
            } else if (type == "category") {
                console.log("Category işlemi başladı");
                let db = await setups.findOne({ guildID: settings.guildID });
                let msg = await message.reply({ content: `**${desc}** ayarlamak için aşağıdaki menüyü kullanın.`, components: [categoryrow] });
                var filter = (interaction) => interaction.user.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 120000 });
    
                collector.on("collect", async (interaction) => {
                    console.log("Collector 'collect' eventi başladı");
                    categoryrow.components[0].setDisabled(true);
                    msg.edit({ components: [categoryrow] });
                    if (interaction.customId === "category_select") {
                        interaction.deferUpdate();
                        db[modal] = interaction.values[0];
                        await db.save();
                        message.react(message.guild.emojiGöster(emojis.yes));
                        msg.edit({ content: `Sunucu **${desc}** başarıyla ${message.guild.channels.cache.get(interaction.values[0])} olarak ayarlandı.` });
                    }
                });
    
                collector.on("end", async () => {
                    console.log("Collector 'end' eventi başladı");
                    categoryrow.components[0].setDisabled(true);
                    msg.edit({ components: [categoryrow] });
                });
            } else if (type == "role") {
                console.log("Role işlemi başladı");
                let db = await setups.findOne({ guildID: settings.guildID });
                let msg = await message.reply({ content: `**${desc}** ayarlamak için aşağıdaki menüyü kullanın.`, components: [rolerow] });
                var filter = (interaction) => interaction.user.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 600000 });
    
                collector.on("collect", async (interaction) => {
                    console.log("Collector 'collect' eventi başladı");
                    rolerow.components[0].setDisabled(true);
                    msg.edit({ components: [rolerow] });
                    if (interaction.customId === "role_select") {
                        interaction.deferUpdate();
                        db[modal] = interaction.values.map((id) => id);
                        await db.save();
                        message.react(message.guild.emojiGöster(emojis.yes));
                        msg.edit({ content: `Sunucu **${desc}** başarıyla ${interaction.values.map((id) => interaction.guild.roles.cache.get(id).toString()).join(", ")} olarak ayarlandı.` });
                    }
                });
    
                collector.on("end", async () => {
                    console.log("Collector 'end' eventi başladı");
                    rolerow.components[0].setDisabled(true);
                    msg.edit({ components: [rolerow] });
                });
            }
        } catch (error) {
            console.error("Hata oluştu:", error);
        }
}  			
}
}