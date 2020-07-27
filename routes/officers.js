var express = require('express');
var router = express.Router();
var Officers = require('../models/officers');
var middleware = require('../middleware');

router.get('/', function (req, res) {
  Officers.find({}, function (err, foundOfficers) {
    if (err || !foundOfficers) {
      req.flash('error', 'Item not found');
      res.redirect('back');
    } else {
      res.render('info/officers', { foundOfficers: foundOfficers });
    }
  });
});

router.get('/officerscollection', middleware.isLoggedIn, function (req, res) {
  Officers.find({}, function (err, foundOfficers) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('officers/collection', { foundOfficers: foundOfficers });
    }
  });
});

router.get('/officerscollection/new', middleware.isLoggedIn, function (
  req,
  res
) {
  Officers.find({}, function (err, newOfficer) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('officers/new', { newOfficer: newOfficer });
    }
  });
});

router.post('/', middleware.isLoggedIn, function (req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  var title = req.body.title;
  var name = req.body.name;
  var callsign = req.body.callsign;

  let officerPicture = req.files.officerPicture;

  officerPicture.mv(
    './public/images/' + req.files.officerPicture.name,
    function (err) {
      if (err) {
        console.log(err);
      }
      console.log('success');
    }
  );
  var pictureLoc = '/images/' + req.files.officerPicture.name;
  var newOfficer = {
    title: title,
    name: name,
    callsign: callsign,
    pictureLoc: pictureLoc
  };
  Officers.create(newOfficer, function (err) {
    if (err || !newOfficer) {
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      req.flash('Success', 'New officer created');
      res.redirect('/info/officers/officerscollection');
    }
  });
});

router.get('/officerscollection/:id', middleware.isLoggedIn, function (
  req,
  res
) {
  Officers.findById(req.params.id, function (err, foundOfficer) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('officers/edit', { foundOfficer: foundOfficer });
    }
  });
});

router.put('/officerscollection/:id', middleware.isLoggedIn, function (
  req,
  res
) {
  Officers.findOneAndUpdate(req.params.id, function (err, foundOfficer) {
    var title = req.body.title;
    var name = req.body.name;
    var callsign = req.body.callsign;
    if (err) {
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else if (req.files) {
      let pictureLoc = '/images/' + req.files.officerPicture.name;
      image.mv('./public/images/' + req.files.officerPicture.name, function (
        err
      ) {
        if (err) {
          console.log(err);
          req.flash('error', 'Something went wrong');
          res.redirect('back');
        } else {
          foundOfficer.name = name;
          foundOfficer.title = title;
          foundOfficer.callsign = callsign;
          foundOfficer.pictureLoc = pictureLoc;
          foundOfficer.save();
          req.flash('Success', 'Officer has been updated');
          res.redirect('/info/officers/officerscollection');
        }
      });
    } else {
      foundOfficer.name = name;
      foundOfficer.title = title;
      foundOfficer.callsign = callsign;
      foundOfficer.save();
      req.flash('Success', 'Officer has been updated');
      res.redirect('/info/officers/officerscollection');
    }
  });
});

router.delete('/officerscollection/:id', middleware.isLoggedIn, function (
  req,
  res
) {
  Officers.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.redirect('/info/officers/officerscollection');
    }
  });
});

module.exports = router;
