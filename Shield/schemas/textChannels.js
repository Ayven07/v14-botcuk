const { Schema, model } = require("mongoose");

const TextChannels = Schema({
channelID: {type: String, default: ''},
name: {type: String, default: ''},
nsfw: {type: Boolean, default: false},
parentID: {type: String, default: ''},
parentName: {type: String, default: ''},
position: {type: Number, default: 0},
rateLimit: {type: Number, default: 0},
type: {type: Number, default: 0},
overwrites: {type: Array, default: []},
});

module.exports = model("TextChannels", TextChannels);