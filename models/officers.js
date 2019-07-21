var mongoose = require("mongoose");

var officersSchema = mongoose.Schema({
    title: String,
    name: String,
    callsign: String,
    pictureLoc: String
});

module.exports = mongoose.model("Officers", officersSchema);