var mongoose = require("mongoose");

var minutesSchema = mongoose.Schema({
    date: String,
    minutes: String,
    type: String,
    docLoc: String
});

module.exports = mongoose.model("Minutes", minutesSchema);