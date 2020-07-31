var mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  isMember: { type: Boolean, default: false },
  phone: Number,
  address: String,
  ctyStZip: String,
  profileImage: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
