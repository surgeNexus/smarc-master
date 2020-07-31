var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs = require('fs');
var User = require('../models/user');
var middleware = require('../middleware');

//  members page
router.get('/', middleware.isLoggedIn, function (req, res) {
  User.findById(req.user.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isMember === true) {
        User.find({}, null, {sort: {lastName: -1}}, function (err, foundUsers) {
          res.render('members/index', { members: foundUsers });
        });
      } else {
        req.flash(
          'error',
          'You must be a verified SMARC Member to access that page'
        );
        res.redirect('/home');
      }
    }
  });
});

// Member Info Edit Page
router.get('/:id', middleware.isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      res.render('members/edit', { user: foundUser });
    }
  });
});

router.put('/:id', middleware.isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      foundUser.username = req.body.callsign;
      foundUser.firstName = req.body.firstName;
      foundUser.lastName = req.body.lastName;
      foundUser.phone = req.body.phone;
      foundUser.email = req.body.email;
      foundUser.address = req.body.address;
      foundUser.ctyStZip = req.body.ctyStZip;
      foundUser.save();
      res.redirect('/members');
    }
  });
});

module.exports = router;
