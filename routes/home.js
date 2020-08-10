var express = require('express');
var router = express.Router();
var moment = require('moment');
var Comment = require('../models/comment');
var Home = require('../models/home');
var Net = require('../models/netcontrol');
var middleware = require('../middleware');

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

router.get('/new', middleware.isAdmin, function (req, res) {
  Home.find({}, function (err, foundHome) {
    if (err || !foundHome) {
      req.flash('error', 'Item not found');
      res.redirect('back');
    } else {
      //render show template with that campground
      res.render('home/new', { foundHome: foundHome });
    }
  });
});

// edit route
router.get('/:id', middleware.isAdmin, function (req, res) {
  Home.findById(req.params.id, function (err, foundHome) {
    if (err) {
      console.log(err);
      req.flash('error', 'Item not found');
    } else {
      res.render('home/edit', { foundHome: foundHome });
    }
  });
});

router.put('/:id', middleware.isAdmin, function (req, res) {
  // find and update the correct campground
  Home.findByIdAndUpdate(req.params.id, req.body, function (err, updatedHome) {
    if (err) {
      res.redirect('/home');
      req.flash('error', 'Something went wrong');
    } else {
      updatedHome.order = req.body.order;
      updatedHome.save();
      res.redirect('/home');
    }
  });
});

router.post('/', middleware.isAdmin, function (req, res) {
  var title = req.body.title;
  var body = req.body.body;
  var link1name = req.body.link1name;
  var link1 = req.body.link1;
  var link2name = req.body.link2name;
  var link2 = req.body.link2;
  var image1 = req.body.image1;
  var image2 = req.body.image2;
  var image3 = req.body.image3;
  var order = req.body.order;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newHome = {
    title: title,
    body: body,
    link1name: link1name,
    link1: link1,
    link2name: link2name,
    link2: link2,
    image1: image1,
    image2: image2,
    image3: image3,
    author: author,
    order: order
  };
  Home.create(newHome, function (err, newEntry) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/home');
    }
  });
});

// Delete Route
router.delete('/:id', middleware.isAdmin, function (req, res) {
  Home.findByIdAndRemove(req.params.id, function (err, deleteEntry) {
    if (err) {
      console.log(err);
      console.log(req.params.id);
      res.redirect('/home');
    } else {
      console.log(req.params.id);
      res.redirect('/home');
    }
  });
});

module.exports = router;
