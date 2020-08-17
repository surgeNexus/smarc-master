var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs = require('fs');
var User = require('../models/user');
var middleware = require('../middleware');
const moment = require('moment');
const user = require('../models/user');

//  members page
router.get('/', middleware.isMember, function (req, res) {
  User.findById(req.user.id, function (err, foundUser) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      User.find({}, null, { sort: { lastName: 1 } }, function (
        err,
        foundUsers
      ) {
        if (err) {
          req.flash('error', 'Something went wrong');
        } else {
          var url = '/members' + req.url;
          res.render('members/index', {
            members: foundUsers,
            url: url
          });
        }
      });
    }
  });
});

// Get Member's Profile
router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      res.render('members/show', { user: foundUser });
    }
  });
});

// Member Info Edit Page
router.get('/:id/edit', middleware.checkProfileOwnership, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      res.render('members/edit', { user: foundUser });
    }
  });
});

router.put('/:id', middleware.checkProfileOwnership, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (!req.files) {
        foundUser.username = req.body.callsign.toLowerCase();
        foundUser.firstName = req.body.firstName;
        foundUser.lastName = req.body.lastName;
        foundUser.phone = req.body.phone;
        foundUser.email = req.body.email;
        foundUser.address = req.body.address;
        foundUser.ctyStZip = req.body.ctyStZip;
        foundUser.arrl = req.body.arrl;
        foundUser.aboutMe = req.body.about;
        foundUser.save();
        res.redirect('/members');
      } else {
        var now = moment();
        let doc = req.files.doc;
        doc.mv(
          './public/files/memberimages/' + now + req.files.doc.name,
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );

        var docLoc = '/files/memberimages/' + now + req.files.doc.name;
        foundUser.profileImage = docLoc;
        foundUser.username = req.body.callsign;
        foundUser.firstName = req.body.firstName;
        foundUser.lastName = req.body.lastName;
        foundUser.phone = req.body.phone;
        foundUser.email = req.body.email;
        foundUser.address = req.body.address;
        foundUser.ctyStZip = req.body.ctyStZip;
        foundUser.arrl = req.body.arrl;
        foundUser.aboutMe = req.body.about;
        foundUser.save();
        res.redirect('/members');
      }
    }
  });
});

router.delete('/:id/remove', function (req, res) {
  User.findByIdAndDelete(req.params.id, function (err, user) {
    if (err) {
      req.flash('error', 'User not removed');
    } else {
      req.flash('success', 'This member has been removed');
      res.redirect('/home');
    }
  });
});

module.exports = router;
