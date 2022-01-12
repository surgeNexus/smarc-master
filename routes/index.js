var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Campground = require('../models/campground');
var Netsched = require('../models/netsched');
var middleware = require('../middleware');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var moment = require('moment');
const user = require('../models/user');
var Comment = require('../models/comment');
var Home = require('../models/home');
var Net = require('../models/netcontrol');

//root route
router.get('/', function (req, res) {
  Home.find({})
    .sort({ order: 1 })
    .exec(function (err, foundHome) {
      if (err || !foundHome) {
        req.flash('error', 'Item not found');
        res.redirect('back');
      } else {
        Net.find({})
          .populate('ncs')
          .exec(function (err, foundNets) {
            if (err) {
              req.flash('error', 'NCS not found');
              res.redirect('back');
            } else {
              var today = moment().format('YYYY-MM-DD');
              var weekFrom = moment().add(7, 'd').format('YYYY-MM-DD');
              //render show template with that campground
              res.render('home', {
                foundHome: foundHome,
                nets: foundNets,
                today: today,
                weekFrom: weekFrom
              });
            }
          });
      }
    });
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
  if (!req.files && req.body.password === req.body.password2) {
    var newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      ctyStZip: req.body.ctyStZip,
      arrl: req.body.arrl,
      acceptTOS: req.body.tos,
      TOSDate: Date.now(),
    });
    User.register(newUser, req.body.password, function (err, user) {
      if (err) {
        console.log(err.message);
        return res.render('register', { error: err.message });
      }
      passport.authenticate('local')(req, res, function () {
        req.flash(
          'success',
          'Welcome to W4OLB, ' +
            user.firstName +
            '! Please allow up to 48 hours for your membership verification to complete.'
        );
        res.redirect('/radiomarket');
      });
    });
  } else if (req.body.password === req.body.password2) {
    var now = moment();
    let doc = req.files.profileImage;
    doc.mv(
      './public/files/memberimages/' + now + req.files.profileImage.name,
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    var docLoc = '/files/memberimages/' + now + req.files.profileImage.name;
    var newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      ctyStZip: req.body.ctyStZip,
      arrl: req.body.arrl,
      profileImage: docLoc,
      acceptTOS: req.body.tos,
      TOSDate: Date.now()
    });
    User.register(newUser, req.body.password, function (err, user) {
      if (err) {
        console.log(err.message);
        return res.render('register', { error: err.message });
      }
      passport.authenticate('local')(req, res, function () {
        req.flash(
          'success',
          'Welcome to W4OLB, ' +
            user.firstName +
            '! Please allow up to 48 hours for your membership verification to complete.'
        );
        res.redirect('/radiomarket');
      });
    });
  } else {
    req.flash('error', 'Your passwords do not match');
    res.redirect('back');
  }
});
// req.flash('error', 'Your passwords do not match');
// res.redirect('back');

// update user info
router.put('/register/:_id', middleware.isLoggedIn, function (req, res) {
  User.findById(req.params._id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      foundUser.email = req.body.email;
      foundUser.isAdmin = req.body.admin;
      foundUser.isMember = req.body.member;
      foundUser.arrl = req.body.arrl;
      foundUser.ncs = req.body.ncs;
      foundUser.aboutMe = req.body.about;
      foundUser.save();
      res.redirect('back');
    }
  });
});

router.put('/tos/:user_id', middleware.owner, (req, res) => {
  User.findById(req.params.user_id, (err, foundUser) => {
    if(err) {
      req.flash('error', 'User not found');
    } else {
      foundUser.acceptTOS = req.body.tos;
      foundUser.TOSDate = Date.now();
      foundUser.save()
      req.flash('success', foundUser.username.toUpperCase() + "'s account has been updated!");
      res.redirect('back');
    }
  });
});

router.put('/register/:id/admin', middleware.isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      foundUser.showAdmin = req.body.showAdmin;
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
  res.redirect('/');
});

router.get('/history', function (req, res) {
  res.render('info/history');
});

// User Admin Page
router.get('/admin', middleware.isAdmin, function (req, res) {
  User.find({}, null, { sort: { isMember: 1 } }, function (err, foundUsers) {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.render('members/admin', { users: foundUsers });
    }
  });
});

// User Redirect
router.get('/userredirect', function (req, res) {
  User.findById(req.user.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser.isMember === true) {
        res.redirect('/members');
      } else if (foundUser.isMember === false) {
        req.flash(
          'success',
          'Please allow up to 48 hours for your membership to be approved. You can now post and comment in the Radiomarket'
        );
        res.redirect('/radiomarket');
      } else {
        req.flash(
          'error',
          'You must be a verified SMARC member to access that page'
        );
        res.redirect('/');
      }
    }
  });
});

// Password Reset
router.get('/forgot', function (req, res) {
  res.render('forgot/forgot');
});

router.post('/forgot', function (req, res, next) {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 600000; // 10 mins

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'surgenexus.app@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.GMAILUSER,
          subject: 'SMARC Member Password Reset',
          text:
            'You are receiving this because a password reset has been requested for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://w4olb.org/reset/' +
            token +
            '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log('mail sent');
          req.flash(
            'success',
            'An e-mail has been sent to ' +
              user.email +
              ' with further instructions.'
          );
          done(err, 'done');
        });
      }
    ],
    function (err) {
      if (err) return next(err);
      res.redirect('/');
    }
  );
});

router.get('/reset/:token', function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function (err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('forgot/reset', { token: req.params.token });
    }
  );
});

router.post('/reset/:token', function (req, res) {
  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function (err, user) {
            if (!user) {
              req.flash(
                'error',
                'Password reset token is invalid or has expired.'
              );
              return res.redirect('back');
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function (err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {
                  req.logIn(user, function (err) {
                    done(err, user);
                  });
                });
              });
            } else {
              req.flash('error', 'Passwords do not match.');
              return res.redirect('back');
            }
          }
        );
      },
      function (user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAILUSER,
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.GMAILUSER,
          subject: 'Your SMARC password has been changed',
          text:
            'Hello,\n\n' +
            'This is a confirmation that the password for your account ' +
            user.username +
            ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ],
    function (err) {
      res.redirect('/');
    }
  );
});

// Callsign Redirect
router.get('/me/:_username', function (req, res) {
  user.findOne({ username: req.params._username }, function (err, user) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else if (user === null) {
      req.flash('error', 'Callsign not found');
      res.redirect('back');
    } else {
      console.log(user.id);
      res.redirect('/members/' + user.id);
    }
  });
});

module.exports = router;
