const Discord = require("discord.js");
const c = require("../../configs/settings.json")
const setups = require("../../schemas/setup")
const moment = require("moment");
const ms = require("ms");
module.exports = {
conf: {
aliases: ["şüpheli", "supheli"],
name: "şüpheli-button",
help: "şüpheli-button",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed, prefix) => {
const ayar = await setups.findOne({guildID: c.guildID})   
if(!ayar) return;
const row = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId("suphekontrol").setLabel("Kontrol").setStyle(Discord.ButtonStyle.Danger),);
message.channel.send({content: `*Merhaba ${message.guild.name} üyeleri;\n\nSunucumuz 7 gün içinde kurulan hesapları hiçbir şekilde kabul etmemektedir. Lütfen "Cezalıdan çıkarır mısın?" ya da "Şüpheli hesap kaldırır mısın?" yazmayın.\n\nEğer hesabının kurulma süresinden en az 7 gün geçtiğini düşünüyorsan ve hala buradaysan sunucudan çıkıp tekrardan girmeyi veya aşağıdaki butona tıklayarak tekrar kayıt olabilirsin, iyi günler.*`, components: [row]});
}
}