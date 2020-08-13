var mongoose = require('mongoose');

var imagesSchema = mongoose.Schema({
  image: String
});

module.exports = mongoose.model('Image', imagesSchema);
