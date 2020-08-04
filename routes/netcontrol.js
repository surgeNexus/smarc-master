var express = require('express');
var router = express.Router();
var Net = require('../models/netcontrol');
var middleware = require('../middleware');

router.get('/', function (req, res) {
  Net.find({}, function (err, foundNet) {
    if (err || !foundNet) {
      req.flash('error', 'The page you have requested is not available');
      res.redirect('back');
    } else {
      res.render('info/netscript', { foundNet: foundNet });
    }
  });
});

router.get('/netscriptcollection/new', middleware.isAdmin, function (req, res) {
  Net.find({}, function (err, newNet) {
    if (err || !newNet) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('netscript/new', { newNet: newNet });
    }
  });
});

router.post('/', middleware.isAdmin, function (req, res) {
  var name = req.body.name;
  var callsign = req.body.callsign;
  var date = req.body.date;

  var newNet = { name: name, callsign: callsign, date: date };
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
  Net.findById(req.params.id, function (err, foundNet) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('netscript/edit', { foundNet: foundNet });
    }
  });
});

router.put('/netscriptcollection/:id', middleware.isAdmin, function (req, res) {
  Net.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
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
