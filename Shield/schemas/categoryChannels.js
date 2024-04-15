const { Schema, model } = require("mongoose");

const CategoryChannels = Schema({
channelID: {type: String, default: ''},
name: {type: String, default: ''},
position: {type: Number, default: 0},
overwrites: {type: Array, default: []},
type: {type: Number, default: 0},
});

module.exports = model("categoryChannels", CategoryChannels);