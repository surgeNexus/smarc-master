var mongoose = require("mongoose");

var operatingEventsSchema = mongoose.Schema({
    docLoc: String,
    date: String,
    controlDate: String
});

module.exports = mongoose.model("OperatingEvents", operatingEventsSchema);