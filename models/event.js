var mongoose = require('mongoose');

var eventsSchema = mongoose.Schema({
  title: String,
  date: String,
  adminOnly: Boolean,
  eventImages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image'
    }
  ]
});

module.exports = mongoose.model('Event', eventsSchema);
