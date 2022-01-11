var mongoose = require("mongoose");

var repeaterSchema = mongoose.Schema({
    title: String,
    body: String,
    searchUrl: String
});

module.exports = mongoose.model("Repeaters", repeaterSchema);