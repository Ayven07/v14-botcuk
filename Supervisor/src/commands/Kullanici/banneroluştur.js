module.exports = {
conf: {
aliases: ["bannerolustur", "banneroluştur", "arkaplan-oluştur","banneroluştur", "arkap-oluştur", "bannercreate", "banner-olustur", "banner-oluştur", "create-banner", "banner-create"],
name: "banneroluştur",
help: "banner-oluştur [Text]",
category: "kullanici"
},
exclosive: async (client, message, args, embed, prefix) => {
let yazi = args.slice(0).join(' ');
if(!yazi) return message.reply({embeds: [embed.setDescription(`Lütfen Bir Yazı Belirt!`)]}).sil(15)
const bannerurl = `https://flamingtext.com/net-fu/proxy_form.cgi?imageoutput=true&script=uprise-logo&text=${yazi}`.replace(' ', '+')
embed.setDescription(`[Oluşturulan Arkaplan İçin TIKLA](${bannerurl})`).setImage(bannerurl)
message.channel.send({embeds: [embed]});   
}
}