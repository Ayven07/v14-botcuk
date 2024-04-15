const { Schema, model } = require("mongoose");
const schema = new Schema({
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    db: { type: Number, default: 0, min: 0 },
});

module.exports = model("leaveLimit", schema);