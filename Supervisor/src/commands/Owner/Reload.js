module.exports = {
conf: {
aliases: ['reload', 'reboot', 'restart'],
name: "reload",
owner: true,
category: "owner"
},
exclosive: async (client, message, args) => {
if (!args[0]) {
await message.reply({ content: `__**Bot**__ yeniden başlatılıyor!`})
process.exit(0)
}    
},
};