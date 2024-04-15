const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: String,
  topStat: { type: Number, default: 0 },
  dailyStat: { type: Number, default: 0 },
  weeklyStat: { type: Number, default: 0 },
  twoWeeklyStat: { type: Number, default: 0 },
  threeWeeklyStat: { type: Number, default: 0 },
  monthStat: { type: Number, default: 0 },
});

module.exports = model("voiceGuild", schema);