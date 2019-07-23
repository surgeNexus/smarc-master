var mongoose = require("mongoose");

var aboutsSchema = mongoose.Schema({
    meeting: String,
    fieldDay: String,
    test: String,
});

module.exports = mongoose.model("Abouts", aboutsSchema);