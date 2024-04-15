const { Schema, model } = require("mongoose");

const Panel = Schema({
guildID: {type: String, default: ''},
urlShield: Boolean,
guildShield: Boolean,
roleShield: Boolean,
channelShield: Boolean,
botShield: Boolean,
emojiShield: Boolean,
stickerShield: Boolean,
bankickShield: Boolean,
swearShield: Boolean,
advertShield: Boolean
});

module.exports = model("panel", Panel);