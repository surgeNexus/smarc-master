var mongoose = require("mongoose");

var documentSchema = mongoose.Schema({
    title: String,
    date: String,
    docLoc: String,
});

module.exports = mongoose.model("Document", documentSchema);