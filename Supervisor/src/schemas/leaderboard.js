const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: {type: String, default: ""},
  channels: {type: String, default: ""},
  messageListID: {type: String, default: ""},
  voiceListID: {type: String, default: ""},
  registerListID: {type: String, default: ""},
  inviteListID: {type: String, default: ""},
  cameraListID: {type: String, default: ""},
  streamListID: {type: String, default: ""}
 
});

module.exports = model("leaderboard", schema);