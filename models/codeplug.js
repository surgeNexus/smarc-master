var mongoose = require('mongoose');

var codeplugSchema = mongoose.Schema({
  title: String,
  date: String,
  docLoc: String
});

module.exports = mongoose.model('Codeplug', codeplugSchema);
