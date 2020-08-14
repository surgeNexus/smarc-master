var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  title: String,
  text: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    email: String,
    username: String
  }
});

module.exports = mongoose.model('Comment', commentSchema);
