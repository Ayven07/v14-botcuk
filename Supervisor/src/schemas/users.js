const mongoose = require("mongoose");

const schema = mongoose.model('User', new mongoose.Schema({
    _id: String,
    Tagged: { type: Boolean, default: false },
    Taggeds: { type: Object },
    Staff: { type: Boolean, default: false },
    TaggedGiveAdmin: String,
    StaffGiveAdmin: String,
    Staffs: { type: Object },  
    Date: Number,  
}));

module.exports = schema;