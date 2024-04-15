const client = global.client;
const Discord = require("discord.js");
const setups = require("../schemas/setup")
const emojis = require('../configs/emojiName.json')
const moment = require("moment");
let streamData = new Map()
let cameraData = new Map()
const settings = require("../configs/settings.json")
module.exports = async (oldState, newState) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;   
if(!oldState.member && !newState.member)return;
if(!oldState.channel && !newState.channel) return;
const embed = new Discord.EmbedBuilder().setFooter({ text: `${ayar.botFooter ? ayar.botFooter : `${oldState.guild.name}`}`}).setColor(oldState.member.displayHexColor)
const channel = await client.kanalBul("voice-log");
if (!channel) return;
if (!oldState.channel && newState.channel) return channel.send({ embeds: [embed.setDescription(`
${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ${newState.channel} adlı sesli kanala girdi!

**Kanala Girdiği Anda:**
Mikrofonu: **${newState.member.voice.mute ? `Kapalı`: `Açık`}**
Kulaklığı: **${newState.member.voice.deaf ? `Kapalı`: `Açık`}**

Girdiği Kanal: \`#${newState.channel?.name}\` \`(${newState.channel?.id})\`
Kullanıcı: \`${newState.member.user.globalName ? newState.member.user.globalName : newState.member.user.tag}\` \`(${newState.member.id})\`
Eylem Gerçekleşme: <t:${Math.floor(Date.now() / 1000)}:R>`)
                                                                          
.addFields([{name: `**Girdiği Kanalda Bulunan Üyeler (${newState.channel.members.size})**`, value: `
${newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => `\`${x.displayName}\` [\`${x.user.globalName ? x.user.globalName : x.user.tag}\`]`).join("\n") : "Üye Yoktur"}`}])]}).catch(e => {})
  
if (oldState.channel && !newState.channel) return channel.send({ embeds: [embed.setDescription(`
${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ${oldState.channel} adlı sesli kanaldan ayrıldı!

**Kanalda Çıktığı Anda:**
Mikrofonu: **${oldState.member.voice.mute ? `Kapalı`: `Açık`}**
Kulaklığı: **${oldState.member.voice.deaf ? `Kapalı`: `Açık`}**

Çıktığı Kanal: \`#${oldState.channel?.name}\` \`(${oldState.channel?.id})\`
Kullanıcı: \`${newState.member.user.globalName ? newState.member.user.globalName : newState.member.user.tag}\` \`(${newState.member.id})\`
Eylem Gerçekleşme: <t:${Math.floor(Date.now() / 1000)}:R>`)
                                                                          
.addFields([{name:`**Çıktığı Kanalda Bulunan Üyeler (${oldState.channel.members.size})**`, value:`
${oldState.channel.members ? oldState.channel.members.array().slice(0, 15).map((x) => `\`${x.displayName}\` [\`${x.user.globalName ? x.user.globalName : x.user.tag}\`]`).join("\n") : "Üye Yoktur"}`}])]}).catch(e => {}) 
  
if (oldState.channel.id && newState.channel.id && oldState.channel.id != newState.channel.id) return channel.send({ embeds: [embed.setDescription(`
${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ses kanalını değiştirdi! ${oldState.channel} => ${newState.channel}

**Kanal Değiştirdiği Anda:**
Mikrofonu: **${oldState.member.voice.mute ? `Kapalı`: `Açık`}**
Kulaklığı: **${oldState.member.voice.deaf ? `Kapalı`: `Açık`}**

Eski Kanal: \`#${oldState.channel?.name}\` \`(${oldState.channel?.id})\`
Yeni Kanal: \`#${newState.channel?.name}\` \`(${newState.channel?.id})\`
Kullanıcı: \`${newState.member.user.globalName ? newState.member.user.globalName : newState.member.user.tag}\` \`(${newState.member.id})\`
Eylem Gerçekleşme: <t:${Math.floor(Date.now() / 1000)}:R>`)
.addFields(
{ name: `**Eski Kanalda Bulunan Üyeler (${oldState.channel.members.size})**`,  value: `
${oldState.channel.members ? oldState.channel.members.array().slice(0, 15).map((x) => `\`${x.displayName}\` [\`${x.user.globalName ? x.user.globalName : x.user.tag}\`]`).join("\n") : "Üye Yoktur"}`, inline: true },
{ name: `**Yeni Kanalda Bulunan Üyeler (${newState.channel.members.size})**`,  value: `
${newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => `\`${x.displayName}\` [\`${x.user.globalName ? x.user.globalName : x.user.tag}\`]`).join("\n") : "Üye Yoktur"}`, inline: true })
]}).catch(e => {})  
  
if (oldState.channel.id && oldState.selfMute && !newState.selfMute) return channel.send({ embeds: [embed.setDescription(`${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda kendi susturmasını kaldırdı!`)]}).catch(e => {});
if (oldState.channel.id && !oldState.selfMute && newState.selfMute) return channel.send({ embeds: [embed.setDescription(`${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda kendini susturdu!`)]}).catch(e => {});
if (oldState.channel.id && oldState.selfDeaf && !newState.selfDeaf) return channel.send({ embeds: [embed.setDescription(`${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda kendi sağırlaştırmasını kaldırdı!`)]}).catch(e => {});
if (oldState.channel.id && !oldState.selfDeaf && newState.selfDeaf) return channel.send({ embeds: [embed.setDescription(`${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda kendini sağırlaştırdı!`)]}).catch(e => {});
if (oldState.channel.id && !oldState.streaming && newState.channel.id && newState.streaming) {
streamData.set(newState.member.id, {
channelId: newState.channel.id,
Start: Date.now(),
})
channel.send({ embeds: [embed.setDescription(`
${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda yayın açtı!

**Kanalda Yayın Açtığı Anda:**
Mikrofonu: **${oldState.member.voice.mute ? `Kapalı`: `Açık`}**
Kulaklığı: **${oldState.member.voice.deaf ? `Kapalı`: `Açık`}**

Yayın Açtığı Kanal: \`#${oldState.channel?.name}\` \`(${oldState.channel?.id})\`
Kullanıcı: \`${newState.member.user.globalName ? newState.member.user.globalName : newState.member.user.tag}\` \`(${newState.member.id})\`
Eylem Gerçekleşme: <t:${Math.floor(Date.now() / 1000)}:R>`)
                                                                          
.addFields([{name:`**Yayın Açtığı Kanalda Bulunan Üyeler (${newState.channel.members.size})**`, value:`
${newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => `\`${x.displayName}\` [\`${x.user.globalName ? x.user.globalName : x.user.tag}\`]`).join("\n") : "Üye Yoktur"}`}])]}).catch(e => {}) 
}  
if (oldState.channel.id && oldState.streaming && newState.channel.id && !newState.streaming) {
let data = streamData.get(newState.member.id)
if(data) {
let yayınSüresi = moment.duration(Date.now() - data.Start).format('Y [yıl,] M [ay,] d [gün,] h [saat,] m [dakika] s [saniye]')  
channel.send({ embeds: [embed.setDescription(`
${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda yayını kapattı!

**Kanalda Yayın Kapattığı Anda:**
Mikrofonu: **${oldState.member.voice.mute ? `Kapalı`: `Açık`}**
Kulaklığı: **${oldState.member.voice.deaf ? `Kapalı`: `Açık`}**

Yayın Kapattığı Kanal: \`#${oldState.channel?.name}\` \`(${oldState.channel?.id})\`
Kullanıcı: \`${newState.member.user.globalName ? newState.member.user.globalName : newState.member.user.tag}\` \`(${newState.member.id})\`
Yayın Süresi: \`${yayınSüresi}\`
Eylem Gerçekleşme: <t:${Math.floor(Date.now() / 1000)}:R>`)
                                                                          
.addFields([{name:`**Yayın Kapattığı Kanalda Bulunan Üyeler (${newState.channel.members.size})**`, value:`
${newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => `\`${x.displayName}\` [\`${x.user.globalName ? x.user.globalName : x.user.tag}\`]`).join("\n") : "Üye Yoktur"}`}])]}).catch(e => {}) 
}
} 
if (oldState.channel.id && !oldState.selfVideo && newState.channel.id && newState.selfVideo) {
cameraData.set(newState.member.id, {
channelId: newState.channel.id,
Start: Date.now(),
})
channel.send({ embeds: [embed.setDescription(`
${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda kamerasını açtı!

**Kanalda Kamera Açtığı Anda:**
Mikrofonu: **${oldState.member.voice.mute ? `Kapalı`: `Açık`}**
Kulaklığı: **${oldState.member.voice.deaf ? `Kapalı`: `Açık`}**

Kamera Açtığı Kanal: \`#${oldState.channel?.name}\` \`(${oldState.channel?.id})\`
Kullanıcı: \`${newState.member.user.globalName ? newState.member.user.globalName : newState.member.user.tag}\` \`(${newState.member.id})\`
Eylem Gerçekleşme: <t:${Math.floor(Date.now() / 1000)}:R>`)
                                                                          
.addFields([{name:`**Kamera Açtığı Kanalda Bulunan Üyeler (${oldState.channel.members.size})**`, value:`
${newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => `\`${x.displayName}\` [\`${x.user.globalName ? x.user.globalName : x.user.tag}\`]`).join("\n") : "Üye Yoktur"}`}])]}).catch(e => {}) 
} 
if (oldState.channel.id && oldState.selfVideo && newState.channel.id && !newState.selfVideo) {
let data = cameraData.get(newState.member.id)
if(data) {
let kameraSüresi = moment.duration(Date.now() - data.Start).format('Y [yıl,] M [ay,] d [gün,] h [saat,] m [dakika] s [saniye]')   
channel.send({ embeds: [embed.setDescription(`                                                                                                                                                 
${oldState.guild.emojis.cache.find(x => x.name == emojis.ses)} ${newState.member} üyesi ${newState.channel} adlı sesli kanalda kamerasını kapattı!

**Kanalda Kamera Kapattığı Anda:**
Mikrofonu: **${oldState.member.voice.mute ? `Kapalı`: `Açık`}**
Kulaklığı: **${oldState.member.voice.deaf ? `Kapalı`: `Açık`}**

Kamera Kapattığı Kanal: \`#${oldState.channel?.name}\` \`(${oldState.channel?.id})\`
Kullanıcı: \`${newState.member.user.globalName ? newState.member.user.globalName : newState.member.user.tag}\` \`(${newState.member.id})\`
Kamera Süresi: \`${kameraSüresi}\`
Eylem Gerçekleşme: <t:${Math.floor(Date.now() / 1000)}:R>`)
                                                                          
.addFields([{name:`**Kamera Kapattığı Kanalda Bulunan Üyeler (${oldState.channel.members.size})**`, value:`
${newState.channel.members ? newState.channel.members.array().slice(0, 15).map((x) => `\`${x.displayName}\` [\`${x.user.globalName ? x.user.globalName : x.user.tag}\`]`).join("\n") : "Üye Yoktur"}`}])]}).catch(e => {}) 
}
}

};
module.exports.conf = {
name: "voiceStateUpdate",
};