var mongoose = require('mongoose');

var codeplugSchema = mongoose.Schema({
  title: String,
  model: String,
  rt: { type: Boolean, default: false },
  firmware: String,
  date: String,
  docLoc: String,
  coverage: String
});

module.exports = mongoose.model('Codeplug', codeplugSchema);
