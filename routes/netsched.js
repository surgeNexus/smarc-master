var express = require('express');
var router = express.Router();
var Nets = require('../models/netsched');
var middleware = require('../middleware');

router.get('/', function (req, res) {
  Nets.find({}, function (err, foundNets) {
    if (err || !foundNets) {
      req.flash('error', 'Item not found');
      res.redirect('back');
    } else {
      //render show template with that campground
      res.render('netsched', { foundNets: foundNets });
    }
  });
});

router.post('/', function (req, res) {
  var newNet = {
    net: req.body.net,
    day: req.body.day,
    time: req.body.time,
    freq: req.body.freq,
    tone: req.body.tone,
    altFreq: req.body.altFreq,
    altTone: req.body.altTone,
    externalLink: req.body.externalLink,
    verified: false
  };
  Nets.create(newNet, function (err, newEntry) {
    if (err) {
      console.log(err);
      req.flash('error', err)
      res.redirect('back');
    } else {
      req.flash('Success', 'Successfully added a new net');
      res.redirect('/netsched');
    }
  });
});

router.get('/new', middleware.isAdmin, function (req, res) {
  Nets.find({}, function (err, createNet) {
    if (err || !createNet) {
      req.flash('error', 'Item not found');
      res.redirect('back');
    } else {
      //render show template with that campground
      res.render('netsched/new', { createNet: createNet });
    }
  });
});

// edit route
router.get('/:id', middleware.isAdmin, function (req, res) {
  Nets.findById(req.params.id, function (err, foundNet) {
    if (err) {
      console.log(err);
      req.flash('error', 'Item not found');
    } else {
      res.render('netsched/edit', { foundNet: foundNet });
    }
  });
});

router.put('/:id', middleware.isAdmin, function (req, res) {
  Nets.findByIdAndUpdate(req.params.id, req.body, function (err, updatedNet) {
    if (err) {
      res.redirect('/netsched');
      req.flash('error', 'Something went wrong');
    } else {
      updatedNet.verified = req.body.verified;
      updatedNet.save();
      res.redirect('/netsched');
    }
  });
});



// Delete Route

router.delete('/:id', middleware.isAdmin, function (req, res) {
  Nets.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      req.flash('success', 'Net Deleted');
      res.redirect('/netsched');
    }
  });
});

module.exports = router;
