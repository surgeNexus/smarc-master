var mongoose = require("mongoose");

var applicationSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    email: String,
    callsign: String,
    class: String,
    birthDate: String,
    favoriteActivities: String,
    arrl: Boolean,
    status: { type: Boolean, default: false },
    lastUpdated: String,
    duesPaidYear: String,
    new: { type: Boolean, default: true }
});

module.exports = mongoose.model("Applications", applicationSchema);