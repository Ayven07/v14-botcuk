const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
let conf = require('../../config.js');
const panels = require("../../schemas/panel")
const settings = require('../../../Supervisor/src/configs/settings.json');
module.exports = {
name: "setup",
aliases: ["setup", "guardsetup"],
execute: async (client, message, args, embed) => {      
if(!settings.owners.some(Rainha => message.author.id == Rainha)) return;
let data = await panels.findOne({ guildID: settings.guildID })
if(!data) new panels({guildID: conf.guildID, urlShield: false, guildShield: false, roleShield: false, channelShield: false, botShield: false, emojiShield: false, stickerShield: false, bankickShield: false, swearShield: false, advertShield: false}).save();  
const rows = new StringSelectMenuBuilder()
.setCustomId(`guardsetups`)
.setPlaceholder(`${message.guild.name} Guard Seçenekleri Seçiniz.`)
.addOptions(
        {
            label: `URL Guard`,
            value: `url`,
            emoji: `${data.urlShield ? `1170654425740754945`: `1170654425740754945`}`
        }, 
        {
            label: `Guild Guard`,
            value: `guild`,
            emoji: `${data.guildShield ? `1170654425740754945`: `1170654425740754945`}`
        },
        {
            label: `Bot Guard`,
            value: `bot`,
            emoji: `${data.botShield ? `1170654425740754945`: `1170654425740754945`}`
        },
        {
            label: `Rol Guard`,
            value: `role`,
            emoji: `${data.roleShield ? `1170654425740754945`: `1170654425740754945`}`
        },
        {
            label: `Channel Guard`,
            value: `channel`,
            emoji: `${data.channelShield ? `1170654425740754945`: `1170654425740754945`}`
        },
        {
            label: `Emoji Guard`,
            value: `emoji`,
            emoji: `${data.emojiShield ? `1170654425740754945`: `1170654425740754945`}`
        },
        {
            label: `Sticker Guard`,
            value: `sticker`,
            emoji: `${data.stickerShield ? `1170654425740754945`: `1170654425740754945`}`
        },
        {
            label: `Ban & Kick Guard`,
            value: `bankick`,
            emoji: `${data.bankickShield ?`1170654425740754945`: `1170654425740754945`}`
        },
        {
            label: `Küfür Guard`,
            value: `swear`,
            emoji: `${data.swearShield ? `1170654425740754945`: `1170654425740754945`}`
        },
        {
            label: `Link Guard`,
            value: `advert`,
            emoji: `${data.advertShield ? `1170654425740754945`: `1170654425740754945`}`
        },
        {
            label: `İptal`,
            value: `exit`,
            emoji: `1121810741226381332`
        })
const row = new ActionRowBuilder()
.addComponents(rows)     
var msj = await message.reply({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\`
`)], components: [row]})
const filter = (xd) => xd.user.id == message.author.id;
const collector = msj.createMessageComponentCollector({filter})
collector.on("collect", async (interaction) => {
if (interaction.customId === "guardsetups") {    
if(interaction.values[0] === "url") {
interaction.deferUpdate()
if(data.urlShield == false) { 
data.urlShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\`
`)], components: [row]})
} else {
data.urlShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\`
`)], components: [row]})
}  
}
if(interaction.values && interaction.values[0] === "guild") {
interaction.deferUpdate()
if(data.guildShield == false) { 
data.guildShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\`
`)], components: [row]})
} else {
data.guildShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\`
`)], components: [row]})
}  
}
if(interaction.values && interaction.values[0] === "bot") {
interaction.deferUpdate()
if(data.botShield == false) { 
data.botShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
} else {
data.botShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
}  
}
if(interaction.values && interaction.values[0] === "role") {
interaction.deferUpdate()
if(data.roleShield == false) { 
data.roleShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
} else {
data.roleShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,
\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
}  
}
if(interaction.values && interaction.values[0] === "channel") {
interaction.deferUpdate()
if(data.channelShield == false) { 
data.channelShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,
\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
} else {
data.channelShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
}  
}
if(interaction.values && interaction.values[0] === "emoji") {
interaction.deferUpdate()
if(data.emojiShield == false) { 
data.emojiShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
} else {
data.emojiShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
}  
}
if(interaction.values && interaction.values[0] === "sticker") {
interaction.deferUpdate()
if(data.stickerShield == false) { 
data.stickerShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
} else {
data.stickerShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,
\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
}  
}
if(interaction.values && interaction.values[0] === "bankick") {
interaction.deferUpdate()
if(data.bankickShield == false) { 
data.bankickShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,
\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
} else {
data.bankickShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
}  
}
if(interaction.values && interaction.values[0] === "swear") {
interaction.deferUpdate()
if(data.swearShield == false) { 
data.swearShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: :star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
} else {
data.swearShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "advert") {
interaction.deferUpdate()
if(data.advertShield == false) { 
data.advertShield = true;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;
>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
} else {
data.advertShield = false;
data.save();
msj.edit({embeds: [embed.setDescription(`
:star: Merhaba ${message.member} Guard Yönetim ve Kontrol paneline Hoşgeldin,

\` > \`    *Aşağıda bulunan butonlardan korumaları açıp/kapatabilirsin.*
\` > \`    *Sunucu güvenliğini ayarlayabilirsin.*
\` > \`    *Self korulamarı yönetebilirsin.*
\` > \`    *URL Spammer ile url'ni koruyabilirsin.*

\`\`\`css
# Sunucu Koruma Paneli Durumu;

>  Url Guard:           ${data.urlShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Guild Guard:         ${data.guildShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Bot Guard:           ${data.botShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Rol Guard:           ${data.roleShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Channel Guard:       ${data.channelShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Emoji Guard:         ${data.emojiShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Sticker Guard:       ${data.stickerShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Ban & Kick Guard:    ${data.bankickShield ? `✅ Aktif`: "❌ Deaktif"} 
>  Küfür Guard:         ${data.swearShield ? `✅ Aktif`: "❌ Deaktif"}   
>  Link Guard:          ${data.advertShield ? `✅ Aktif`: "❌ Deaktif"} 
\`\`\``).setThumbnail(message.guild.iconURL({dynamic:true})).setThumbnail(message.guild.iconURL({dynamic:true}))], components: [row]})
}
}
if(interaction.values && interaction.values[0] === "exit") {
msj.delete().catch(e => {})  
}  
}
})
}
}
