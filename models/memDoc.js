var mongoose = require("mongoose");

var document2Schema = mongoose.Schema({
    title: String,
    date: String,
    docLoc: String,
});

module.exports = mongoose.model("Document2", document2Schema);