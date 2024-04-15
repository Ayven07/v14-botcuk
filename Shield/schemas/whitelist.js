const { Schema, model } = require("mongoose");

const SafeMember = Schema({
    guildID: {type: String, default: ''},
    full: {type: Array, default: []},
    guild: {type: Array, default: []},
    rol: {type: Array, default: []},
    kanal: {type: Array, default: []},
    bankick: {type: Array, default: []},
    emoji: {type: Array, default: []},
    bot: {type: Array, default: []},
    sticker: {type: Array, default: []},
    web: {type: Array, default: []},
    offline: {type: Array, default: []},
    swear: {type: Array, default: []},
    advert: {type: Array, default: []}
    });

module.exports = model("SafeMember", SafeMember);