const dolars = require("../../schemas/dolar");
let limit = new Map();
let ms = require("ms");
const emojis = require('../../configs/emojiName.json')
const setups = require("../../schemas/setup")
const settings = require("../../configs/settings.json")
module.exports = {
conf: {
aliases: ["s", "slot", "Slot"],
name: "slot",
help: "slot <Miktar>",
category: "kullanici",
},
exclosive: async (client, message, args, embed, prefix) => {
if (!message.guild) return;
const ayar = await setups.findOne({guildID: settings.guildID})
if(!ayar) return;  

let kanallar = ["dolar", "dolar-chat"]

if (!kanallar.some((x) => message.channel.name.toLowerCase().includes(x))) return message.reply({content: `${message.guild.emojiGöster(emojis.no)} dolar kanallarında kullanabilirsiniz.`}).sil(15)
let dolarData = await dolars.findOne({ guildID: settings.guildID, userID: message.author.id });
if (!dolarData || dolarData && !dolarData.hesap.length) return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Komutu kullanabilmek için Hesap oluşturmanız gerekmektedir.`}).sil(15)
if (!dolarData || dolarData && !dolarData.dolar) return await message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Komutu kullanabilmek için **${settings.guildName}** dolarına ihtiyacın var.`}).sil(15)
let data = limit.get(message.author.id) || {dailyCoinTime: 0};
let timeout = 1000*8
let gunluk = data.dailyCoinTime
if (gunluk !== null && timeout - (Date.now() - gunluk) > 0) {
let time = ms(timeout - (Date.now() - gunluk));
message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Bu komutu ${time} sonra kullanabilirsin.`}).sil(15)
} else {
limit.set(message.author.id, {dailyCoinTime: Date.now()})
setTimeout(() => {
limit.delete(message.author.id)
}, 1000*8)
let sec = args[0];
if(!sec || !Number(args[0])) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} Kaç **${settings.guildName}** doları ile oynamak istiyorsun?`}).sil(15)
if(sec >= 10001) return message.reply({ content: `${message.guild.emojiGöster(emojis.no)} ${message.author} 10.000 **${settings.guildName}** dolarından fazla bir **${settings.guildName}** doları ile oyun oynamayazsın.`}).sil(15)
const slot = [`${message.guild.emojiGöster(emojis.kalp)}`, `${message.guild.emojiGöster(emojis.kiraz)}`, `${message.guild.emojiGöster(emojis.patlican)}`];
let slotgif = message.guild.emojiGöster(emojis.slot);
let oran = Math.random();
let slot1, slot2, slot3;
function spinSlots() {
for (let i = 0; i < 100; i++) {
slot1 = slot[Math.floor(Math.random() * slot.length)];
slot2 = slot[Math.floor(Math.random() * slot.length)];
slot3 = slot[Math.floor(Math.random() * slot.length)];
if (oran <= 0.3 && slot1 === slot2 && slot1 === slot3) {
return { result: "win", slots: [slot1, slot2, slot3] };
}
if (oran >= 0.3 && slot1 !== slot2 && slot1 !== slot3) {
return { result: "lose", slots: [slot1, slot2, slot3] };
}
}
return { result: "error" };
}
let spinResult = spinSlots();
if(!dolarData.dolar) return message.reply(`Hiç **${settings.guildName}** doları yok!`) 
if(dolarData.dolar < sec) return message.reply({ content:`${message.guild.emojiGöster(emojis.no)} ${message.author} Yeterli miktar da **${settings.guildName}** doları yok! **${settings.guildName}** dolarınız: (**${res.dolar}** **${settings.guildName}** Doları)`}).sil(15)
let slotMessage = await message.reply({content: `
\`|   SLOT   |\`
  ${slotgif} ${slotgif} ${slotgif}
**\`|          |\`**
**\`|          |\`**`})
if (spinResult.result === "win") {
let carpma = sec * 2
await dolars.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { dolar: +carpma } }, { upsert: true });
setTimeout(() => {
slotMessage.edit({ content: `
\`|   SLOT   |\`
  ${slot1} ${slot2} ${slot3}
\`|          |\`
\`|          |\`

:tada: **Kazandın!**
Kazanılan Ödül: \` ${carpma} \` **${settings.guildName}** Doları`})
}, 2500)
} else if (spinResult.result === "lose") {
await dolars.findOneAndUpdate({ guildID: settings.guildID, userID: message.author.id }, { $inc: { dolar: -sec } }, { upsert: true });
setTimeout(() => {
slotMessage.edit({ content:`
\`|   SLOT   |\`
  ${slot1} ${slot2} ${slot3}
**\`|          |\`**
**\`|          |\`**

${message.guild.emojiGöster(emojis.no)} **Kaybettin!**
Kaybedilen Miktar: \` ${sec} \` **${settings.guildName}** Doları`})
}, 2500)
} else {
slotMessage.edit({ content:`Slotlar dönme işlemi başarısız oldu. Lütfen tekrar deneyin.`});
}
}
}
}