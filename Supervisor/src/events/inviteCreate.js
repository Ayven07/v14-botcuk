const client = global.client;
const Discord = require("discord.js")
module.exports = async (invite) => {
const invites = await invite.guild.invites.fetch();
const codeUses = new Map();
invites.each(inv => codeUses.set(inv.code, inv.uses));
client.invites.set(invite.guild.id, codeUses);
};
module.exports.conf = {
name: "inviteCreate",
};