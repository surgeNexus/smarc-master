var express = require('express');
var router = express.Router();
var Net = require('../models/netcontrol');
var User = require('../models/user');
var middleware = require('../middleware');
var moment = require('moment');
const { update } = require('../models/user');
const user = require('../models/user');

router.get('/', function (req, res) {
  Net.find({})
    .populate('ncs')
    .sort({ date: 1 })
    .exec(function (err, foundNet) {
      if (err || !foundNet) {
        req.flash('error', 'The page you have requested is not available');
        res.redirect('back');
      } else {
        User.find({}, function (err, foundUsers) {
          if (err) {
            req.flash('error', 'User not found');
            res.redirect('back');
          } else {
            var today = moment().format('YYYY-MM-DD');
            res.render('info/netscript', {
              foundNet: foundNet,
              foundUsers: foundUsers,
              today: today
            });
          }
        });
      }
    });
});

router.get('/netscriptcollection/new', middleware.isAdmin, function (req, res) {
  Net.find({}, function (err, newNet) {
    if (err || !newNet) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      User.find({}, function (err, foundUser) {
        if (err) {
          req.flash('error', 'Something went wrong');
          res.redirect('back');
        } else {
          res.render('netscript/new', { newNet: newNet, user: foundUser });
        }
      });
    }
  });
});

router.post('/', middleware.isAdmin, function (req, res) {
  var date = req.body.date;
  var ncs = req.body.ncs;

  var newNet = {
    date: date,
    ncs: ncs
  };

  Net.create(newNet, function (err) {
    if (err || !newNet) {
      console.log(err);
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      req.flash('Success', 'New NCS added');
      res.redirect('/info/netscript/');
    }
  });
});

router.get('/netscriptcollection/:id', middleware.isAdmin, function (req, res) {
  Net.findById(req.params.id)
    .populate('ncs')
    .exec(function (err, foundNet) {
      if (err) {
        req.flash('error', 'Something went wrong');
        res.redirect('back');
      } else {
        User.find({}, function (err, foundUser) {
          if (err) {
            req.flash('error', 'Something went wrong');
            res.redirect('back');
          } else {
            res.render('netscript/edit', {
              foundNet: foundNet,
              user: foundUser
            });
          }
        });
      }
    });
});

router.put('/netscriptcollection/:id', middleware.isAdmin, function (req, res) {
  Net.findByIdAndUpdate(req.params.id, req.body, function (err, updatedNet) {
    if (err) {
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      updatedNet.ncs = req.body.ncs;
      updatedNet.save();
      res.redirect('/info/netscript');
    }
  });
});

router.delete('/netscriptcollection/:id', middleware.isAdmin, function (
  req,
  res
) {
  Net.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.redirect('/info/netscript');
    }
  });
});

module.exports = router;
