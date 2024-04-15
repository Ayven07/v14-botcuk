const client = global.client;
const children = require("child_process");
const Discord = require("discord.js");
const settings = require("../../configs/settings.json");
const setups = require("../../schemas/setup")
module.exports = {
conf: {
aliases: [],
name: "pm2",
owner: true,
category: "owner"
},
exclosive: async (client, message, args, embed) => {
const ayar = await setups.findOne({guildID: settings.guildID})
if(!args) return message.reply({content: ".pm2 <restart/stop/start/list> (Proc ID)" })
const ls = children.exec(`pm2 ${args.join(' ')}`);
ls.stdout.on('data', async function (content) {
if (content.length > 1900) {
const chunks = splitMessage(content, 1900);
for (const chunk of chunks) {
await message.channel.send({content: `\`\`\`\n${chunk}\n\`\`\`` });
}
} else {
await message.channel.send({content: `\`\`\`\n${content}\n\`\`\`` });
}  
})
function clean(string) {
if (typeof text === "string") {
return string.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
} else {
return string;
}
}
function splitMessage(content, limit) {
const chunks = [];
while (content.length) {
if (content.length <= limit) {
chunks.push(content);
break;
}
let chunk = content.slice(0, limit);
const lastSpaceIndex = chunk.lastIndexOf(' ');
if (lastSpaceIndex !== -1) {
chunk = chunk.slice(0, lastSpaceIndex);
}
chunks.push(chunk);
content = content.slice(chunk.length);
}
return chunks;
}
},
};