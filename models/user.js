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
  showAdmin: { type: Boolean, default: false },
  ncs: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  phone: String,
  address: String,
  ctyStZip: String,
  arrl: Boolean,
  profileImage: String,
  aboutMe: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
