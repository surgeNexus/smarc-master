var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Image = require('../models/images');
var middleware = require('../middleware');
var moment = require('moment');

router.get('/', function (req, res) {
  Event.find({})
    .sort({ date: -1 })
    .populate('eventImages')
    .exec(function (err, events) {
      if (err || !events) {
        req.flash('error', 'Item not found');
        res.redirect('back');
      } else {
        res.render('events', { events: events });
      }
    });
});

router.post('/', function (req, res) {
  var newEvent = {
    title: req.body.title,
    date: req.body.date
  };
  Event.create(newEvent, function (err, newEvent) {
    if (err) {
      req.flash('error', 'Event not created. Something went wrong.');
      res.redirect('back');
    } else {
      res.redirect('back');
    }
  });
});

router.put('/:id', middleware.isAdmin, function (req, res) {
  Event.findById(req.params.id, function (err, foundEvent) {
    if (err) {
      req.flash('error', 'Event not found. Something went wrong.');
      res.redirect('back');
    } else {
      Image.create(req.files, function (err, image) {
        if (err) {
          req.flash('error', 'Event not created. Something went wrong.');
          res.redirect('back');
        } else {
          var now = moment().utc();
          let pic = req.files.pic;
          pic.mv(
            './public/images/events/' + now + req.files.pic.name,
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
          var picLocation = '/images/events/' + now + req.files.pic.name;
          image.image = picLocation;
          image.save();
          foundEvent.eventImages.push(image);
          foundEvent.save();
          res.redirect('back');
        }
      });
    }
  });
});

router.delete('/:id', middleware.isAdmin, function (req, res) {
  Event.findByIdAndDelete(req.params.id, function (err, event) {
    if (err) {
      req.flash('success', 'Event has been removed');
      res.redirect('back');
    } else {
      res.redirect('back');
    }
  });
});

router.delete('/:id/:image_id', middleware.isAdmin, function (req, res) {
  Image.findByIdAndDelete(req.params.image_id, function (err, image) {
    if (err) {
      req.flash('error', 'Image not removed. Something went wrong.');
      res.redirect('back');
    } else {
      req.flash('success', 'Image Deleted');
      res.redirect('back');
    }
  });
});

module.exports = router;
