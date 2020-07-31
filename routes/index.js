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
router.get('/register', function (req, res) {
  res.render('register');
});

//handle sign up logic
router.post('/register', function (req, res) {
  if (req.body.password === req.body.password2) {
    var newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      ctyStZip: req.body.ctyStZip
    });
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
  } else {
    req.flash('error', 'Your passwords do not match');
    res.redirect('back');
  }
});

// update user info
router.put('/register/:_id', middleware.isLoggedIn, function (req, res) {
  User.findById(req.params._id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      foundUser.isAdmin = req.body.admin;
      foundUser.isMember = req.body.member;
      foundUser.save();
      res.redirect('back');
    }
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
    successRedirect: '/userredirect',
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
  res.redirect('/home');
});

router.get('/repeaters', function (req, res) {
  res.render('repeaters');
});

// User Admin Page
router.get('/admin', middleware.isLoggedIn, function (req, res) {
  if (req.user.isAdmin === true) {
    User.find({}, null, {sort: {username: 1}}, function (err, foundUsers) {
        if (err) {
          console.log(err);
          res.redirect('back');
        } else {
          res.render('members/admin', { users: foundUsers });
        }
      });
  } else {
    req.flash('error', 'Administrators only');
    res.redirect('/members');
  }
});

router.get('/userredirect', function (req, res) {
  User.findById(req.user.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isMember === true) {
        res.redirect('/members');
      } else {
        req.flash(
          'error',
          'You must be a verified SMARC member to access that page'
        );
        res.redirect('/home');
      }
    }
  });
});

module.exports = router;
