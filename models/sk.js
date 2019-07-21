var mongoose = require("mongoose");

var skSchema = mongoose.Schema({
    name: String,
    callsign: String,
    picture: String,
    author: String,
});

module.exports = mongoose.model("Sk", skSchema);