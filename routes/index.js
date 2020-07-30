var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Campground = require('../models/campground');
var Netsched = require('../models/netsched');
var middleware = require('../middleware');

//root route
router.get('/', function (req, res) {
  res.redirect('/home');
});

router.get('/smarc-admin', function (req, res) {
  res.redirect('/home/homescollection');
});

// show register form
router.get('/register', middleware.isLoggedIn, function (req, res) {
  res.render('register');
});

//handle sign up logic
router.post('/register', middleware.isLoggedIn, function (req, res) {
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    profileInfo: req.body.profileInfo,
    profileImage: req.body.profileImage
  });
  if (req.body.memberCode === '1') {
    newUser.isMember = true;
  }
  if (req.body.memberCode === '2') {
    newUser.isAdmin = true;
    newUser.isMember = true;
  }
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err.message);
      return res.render('register', { error: err.message });
    }
    passport.authenticate('local')(req, res, function () {
      req.flash('success', 'Welcome to W4OLB, ' + user.username);
      res.redirect('/radiomarket');
    });
  });
});
//show login form
router.get('/login', function (req, res) {
  res.render('login');
});

//handling login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/home/homescollection',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome Back!'
  }),
  function (req, res) {}
);

// logout route
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/radiomarket');
});

router.get('/repeaters', function (req, res) {
  res.render('repeaters');
});

module.exports = router;
