const { Schema, model } = require("mongoose");

const schema = Schema({
guildID: { type: String, default: ""},
userID: { type: String, default: ""}, 
monthlySystem: { type: Boolean, default: true },
levelSystem: { type: Boolean, default: true },
})
module.exports = model("memberSetup", schema);