var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var moment = require('moment');
var middleware = require('../middleware');
const fs = require('fs');
const { update } = require('../models/comment');

//INDEX - show all campgrounds
router.get('/', function (req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('radiomarket/index', {
        campgrounds: allCampgrounds,
        page: 'radiomarket'
      });
    }
  });
});

//CREATE - add new campground to DB
router.post('/', middleware.isMember, function (req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email
  };
  var now = moment();
  if (req.files) {
    let image = req.files.image;

    image.mv('./public/images/' + now + req.files.image.name, function (err) {
      if (err) {
        console.log(err);
      }
    });
    var pictureLoc = '/images/' + now + req.files.image.name;
    var newCampground = {
      name: name,
      price: price,
      image: pictureLoc,
      description: desc,
      author: author
    };
  } else {
    var newCampground = {
      name: name,
      price: price,
      description: desc,
      author: author
    };
  }
  // Create a new campground and save to DB
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      res.redirect('/radiomarket');
    }
  });
});

//NEW - show form to create new campground
router.get('/new', middleware.isMember, function (req, res) {
  res.render('radiomarket/new');
});

// SHOW - shows more info about one campground
router.get('/:id', function (req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function (err, foundCampground) {
      if (err || !foundCampground) {
        req.flash('error', 'Item not found');
        res.redirect('back');
      } else {
        //render show template with that campground
        res.render('radiomarket/show', { campground: foundCampground });
      }
    });
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (
  req,
  res
) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render('radiomarket/edit', { campground: foundCampground });
  });
});

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
  // find and update the correct campground
  if(req.files){
    var now = moment();
    let image = req.files.image;
    image.mv('./public/images/' + now + req.files.image.name, function (err) {
      if (err) {
        console.log(err);
      }
    });
    var pictureLoc = '/images/' + now + req.files.image.name;
    var updateCampground = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: pictureLoc
    }
  } else {
    var updateCampground = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    }
  }
  Campground.findByIdAndUpdate(req.params.id, updateCampground, function (err, updatedCampground) {
    if (err) {
      req.flash('error', err.message);
      res.redirect('/radiomarket');
    } else {
      req.flash('success', "Your listing has been updated!");
      res.redirect('/radiomarket/' + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err, removedListing) {
    if (err) {
      res.redirect('/radiomarket');
    } else {
      fs.unlink('./public' + removedListing.image, (err) => {
        if (err) {
          req.flash('error', 'File note deleted; codeplug removed.');
        }
      });
      res.redirect('/radiomarket');
    }
  });
});

module.exports = router;
