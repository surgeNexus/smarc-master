var mongoose = require("mongoose");

var netSchema = mongoose.Schema({
    name: String,
    date: String,
    callsign: String,
});

module.exports = mongoose.model("Net", netSchema);