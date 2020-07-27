var express = require('express');
var router = express.Router();
var Nets = require('../models/netsched');
var middleware = require('../middleware');

router.get('/', function (req, res) {
  Nets.find({})
    .sort({ day: 1, time: 1 })
    .exec(function (err, foundNets) {
      if (err || !foundNets) {
        req.flash('error', 'Item not found');
        res.redirect('back');
      } else {
        //render show template with that campground
        res.render('netsched', { foundNets: foundNets });
      }
    });
});

router.get('/netschedcollection', middleware.isLoggedIn, function (req, res) {
  Nets.find({}, function (err, foundNets) {
    if (err) {
      console.log(err);
      req.flash('error', 'something went wrong');
    } else {
      res.render('netsched/collection', { foundNets: foundNets });
    }
  });
});

router.get('/new', middleware.isLoggedIn, function (req, res) {
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
router.get('/:id', middleware.isLoggedIn, function (req, res) {
  Nets.findById(req.params.id, function (err, foundNet) {
    if (err) {
      console.log(err);
      req.flash('error', 'Item not found');
    } else {
      res.render('netsched/edit', { foundNet: foundNet });
    }
  });
});

router.put('/:id', function (req, res) {
  Nets.findByIdAndUpdate(req.params.id, req.body, function (err, updatedNet) {
    if (err) {
      res.redirect('/netsched/netschedcollection');
      req.flash('error', 'Something went wrong');
    } else {
      res.redirect('/netsched/netschedcollection');
    }
  });
});

router.post('/', middleware.isLoggedIn, function (req, res) {
  var net = req.body.net;
  var day = req.body.day;
  var time = req.body.time;
  var freq = req.body.freq;
  var tone = req.body.tone;
  var altFreq = req.body.altFreq;
  var altTone = req.body.altTone;
  var externalLink = req.body.externalLink;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newNet = {
    net: net,
    day: day,
    time: time,
    freq,
    freq,
    tone: tone,
    altFreq: altFreq,
    altTone: altTone,
    externalLink: externalLink,
    author: author
  };
  Nets.create(newNet, function (err, newEntry) {
    if (err) {
      console.log(err);
    } else {
      req.flash('Success', 'Successfully added a new net');
      res.redirect('/netsched/netschedcollection');
    }
  });
});

// Delete Route

router.delete('/:id', middleware.isLoggedIn, function (req, res) {
  Nets.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      req.flash('success', 'Net Deleted');
      res.redirect('/netsched/netschedcollection' + req.param.id);
    }
  });
});

module.exports = router;
