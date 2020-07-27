var mongoose = require('mongoose');

var homeSchema = mongoose.Schema({
  title: String,
  body: String,
  link1: String,
  link1name: String,
  link2: String,
  link2name: String,
  image1: String,
  image2: String,
  image3: String,
  order: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

module.exports = mongoose.model('Home', homeSchema);
