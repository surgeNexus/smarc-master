var mongoose = require("mongoose");

var netschedSchema = mongoose.Schema({
    net: String,
    day: String,
    time: String,
    freq: String,
    tone: String,
    altFreq: String,
    altTone: String,
    externalLink: String,
});

module.exports = mongoose.model("Netsched", netschedSchema);