var express = require('express');
var router = express.Router();
var Minutes = require('../models/minutes');
var middleware = require('../middleware');

router.get('/', function (req, res) {
  Minutes.find({}, function (err, foundMinutes) {
    if (err || !foundMinutes) {
      req.flash('error', 'Item not found');
      res.redirect('back');
    } else {
      res.render('info/minutes', { foundMinutes: foundMinutes });
    }
  });
});

router.get('/minutescollection/new', middleware.isAdmin, function (req, res) {
  Minutes.find({}, function (err, newMinutes) {
    if (err || !newMinutes) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('minutes/new', { newMinutes: newMinutes });
    }
  });
});

router.post('/', middleware.isAdmin, function (req, res) {
  var date = req.body.date;
  var minutes = req.body.minutes;

  var newMinutes = { date: date, minutes: minutes };
  Minutes.create(newMinutes, function (err) {
    if (err || !newMinutes) {
      console.log(err);
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      req.flash('Success', 'Sorry for your loss');
      res.redirect('/info/minutes/');
    }
  });
});

router.get('/minutescollection/:id', middleware.isAdmin, function (req, res) {
  Minutes.findById(req.params.id, function (err, foundMinutes) {
    if (err || !foundMinutes) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('minutes/edit', { foundMinutes: foundMinutes });
    }
  });
});

router.put('/minutescollection/:id', middleware.isAdmin, function (req, res) {
  Minutes.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      res.redirect('/info/minutes');
    }
  });
});

router.delete('/minutescollection/:id', middleware.isAdmin, function (
  req,
  res
) {
  Minutes.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.redirect('/info/minutes');
    }
  });
});

module.exports = router;
