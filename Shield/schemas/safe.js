const { Schema, model } = require("mongoose");

const Safe = Schema({
guildID: {type: String, default: ''},
Permissions: {type: Array, default: []}
});

module.exports = model("safe", Safe);