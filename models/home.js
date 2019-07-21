var mongoose = require("mongoose");

var homeSchema = mongoose.Schema({
    title: String,
    body: String,
    link1: String,
    link2: String,
    image1: String,
    image2: String,
    image3: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Home", homeSchema);