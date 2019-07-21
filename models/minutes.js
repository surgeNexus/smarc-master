var mongoose = require("mongoose");

var minutesSchema = mongoose.Schema({
    date: String,
    minutes: String,
});

module.exports = mongoose.model("Minutes", minutesSchema);