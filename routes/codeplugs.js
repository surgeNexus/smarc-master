var express = require('express');
var router = express.Router();
var Codeplugs = require('../models/codeplug');
var middleware = require('../middleware');

router.get('/', function (req, res) {
  Codeplugs.find({}, function (err, foundCodeplugs) {
    if (err || !foundCodeplugs) {
      req.flash('error', 'Item not found');
      res.redirect('back');
    } else {
      res.render('codeplugs', { foundCodeplugs: foundCodeplugs });
    }
  });
});

router.get('/codeplugscollection/new', middleware.isAdmin, function (req, res) {
  Codeplugs.find({}, function (err, newSk) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('codeplugs/new', { newSk: newSk });
    }
  });
});

router.post('/', middleware.isAdmin, function (req, res) {
  var title = req.body.title;
  var date = req.body.date;

  let doc = req.files.doc;
  doc.mv('./public/files/documents/' + req.files.doc.name, function (err) {
    if (err) {
      console.log(err);
    }
  });

  var docLoc = '/files/documents/' + req.files.doc.name;
  var newDoc = { title: title, date: date, docLoc: docLoc };

  Codeplugs.create(newDoc, function (err) {
    if (err || !newDoc) {
      console.log(err);
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      req.flash('Success', 'Document upload complete');
      res.redirect('/codeplugs');
    }
  });
});

router.get('/codeplugscollection/:id', middleware.isAdmin, function (req, res) {
  Codeplugs.findById(req.params.id, function (err, foundDoc) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('codeplugs/edit', { foundDoc: foundDoc });
    }
  });
});

router.put('/codeplugscollection/:id', middleware.isAdmin, function (req, res) {
  Codeplugs.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      res.redirect('/codeplugs');
    }
  });
});

router.delete('/codeplugscollection/:id', middleware.isAdmin, function (
  req,
  res
) {
  Codeplugs.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.redirect('/codeplugs');
    }
  });
});

module.exports = router;
