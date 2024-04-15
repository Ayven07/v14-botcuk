const emojis = require('../../configs/emojiName.json')
module.exports = {
conf: {
aliases: [],
name: "yaz",
owner: true,
help: "yaz [Text]",
category: "owner"
},
exclosive: async (client, message, args) => {
if(!args[0]) return message.react(message.guild.emojiGöster(emojis.no))
message.delete().catch(e => {})
message.channel.send({ content: args.join(' ')});
},
};

 