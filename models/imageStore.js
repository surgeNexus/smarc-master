var mongoose = require('mongoose');

var imageStoreSchema = mongoose.Schema({
  image: String
});

module.exports = mongoose.model('ImageStore', imageStoreSchema);
