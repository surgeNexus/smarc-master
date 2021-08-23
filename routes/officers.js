var express = require('express');
var router = express.Router();
var Officers = require('../models/officers');
var middleware = require('../middleware');
var moment = require('moment');
var User = require('../models/user');

router.get('/', function (req, res) {
  Officers.find({}).sort({order: asc}).exec(function (err, foundOfficers) {
    if (err || !foundOfficers) {
      req.flash('error', 'Item not found');
      res.redirect('back');
    } else {
      res.render('info/officers', {
        foundOfficers: foundOfficers
      });
    }
  });
});

router.get('/officerscollection/new', middleware.isAdmin, function (req, res) {
  Officers.find({}, function (err, newOfficer) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('officers/new', { newOfficer: newOfficer });
    }
  });
});

router.post('/', middleware.isAdmin, function (req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  var title = req.body.title;
  var name = req.body.name;
  var callsign = req.body.callsign;
  var order = req.body.order;
  var now = moment();

  let officerPicture = req.files.officerPicture;

  officerPicture.mv(
    './public/images/' + now + req.files.officerPicture.name,
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  var pictureLoc = '/images/' + now + req.files.officerPicture.name;
  var newOfficer = {
    title: title,
    name: name,
    callsign: callsign,
    order: order,
    pictureLoc: pictureLoc
  };
  Officers.create(newOfficer, function (err) {
    if (err || !newOfficer) {
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      req.flash('Success', 'New officer created');
      res.redirect('/info/officers');
    }
  });
});

router.get('/officerscollection/:id', middleware.isAdmin, function (req, res) {
  Officers.findById(req.params.id, function (err, foundOfficer) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('officers/edit', { foundOfficer: foundOfficer });
    }
  });
});

router.put('/officerscollection/:id', middleware.isAdmin, function (req, res) {
  Officers.findById(req.params.id, function (err, foundOfficer) {
    var title = req.body.title;
    var name = req.body.name;
    var order = req.body.order;
    var callsign = req.body.callsign;
    var now = moment();
    if (err) {
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else if (req.files) {
      var officerPicture = req.files.officerPicture;
      var pictureLoc = '/images/' + now + req.files.officerPicture.name;
      officerPicture.mv(
        './public/images/' + now + req.files.officerPicture.name,
        function (err) {
          if (err) {
            console.log(err);
          } else {
            foundOfficer.name = name;
            foundOfficer.title = title;
            foundOfficer.callsign = callsign;
            foundOfficer.order = order;
            foundOfficer.pictureLoc = pictureLoc;
            foundOfficer.save();
            req.flash('Success', 'Officer has been updated');
            res.redirect('/info/officers');
          }
        }
      );
    } else {
      foundOfficer.name = name;
      foundOfficer.title = title;
      foundOfficer.callsign = callsign;
      foundOfficer.save();
      req.flash('Success', 'Officer has been updated');
      res.redirect('/info/officers/');
    }
  });
});

router.delete('/officerscollection/:id', middleware.isAdmin, function (
  req,
  res
) {
  Officers.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.redirect('/info/officers/');
    }
  });
});

module.exports = router;
