const { Schema, model } = require("mongoose");

const VoiceChannels = Schema({
channelID: {type: String, default: ''},
name: {type: String, default: ''},
bitrate: {type: Number, default: 0},
userLimit: {type: Number, default: 0},
parentID: {type: String, default: ''},
parentName: {type: String, default: ''},
position: {type: Number, default: 0},
type: {type: Number, default: 0},
overwrites: {type: Array, default: []},
});

module.exports = model("voiceChannels", VoiceChannels);