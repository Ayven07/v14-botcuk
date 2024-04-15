const { Schema, model } = require("mongoose");

const Roles = Schema({
guildID: {type: String, default: ''},
roleID: {type: String, default: ''},
name: {type: String, default: ''},
color: {type: String, default: ''},
hoist: {type: Boolean, default: false},
position: {type: Number, default: 0},
permissions: {type: String, default: ''},
mentionable: {type: Boolean, default: false},
time: {type: Number, default: 0},
members: {type: Array, default: []},
channelOverwrites: {type: Array, default: []},
});

module.exports = model("role", Roles);
