const { Schema, model } = require("mongoose");

const schema = Schema({
	guildID: { type: String, default: "" },
	userID: { type: String, default: "" },
	names: { type: String, default: "" },
    cinsiyet: { type: String, default: ""}
	});

module.exports = model("booster", schema);