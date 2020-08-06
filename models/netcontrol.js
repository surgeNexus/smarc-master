var mongoose = require('mongoose');

var netSchema = mongoose.Schema({
  date: String,
  ncs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Net', netSchema);
