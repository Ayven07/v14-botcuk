const { Schema, model } = require("mongoose");
const schema = Schema({
    İsim: { type: String, default: '' },
    Roller: { type: Array, default: [] },
    Yazı: { type: String, default: '' },
    Secret: { type: String, default: '' },
    Date: { type: Number, default: 0 },
    Oluşturan: { type: String, default: '' },
});
module.exports = model("menus", schema);