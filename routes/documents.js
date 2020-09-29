var express = require('express');
var router = express.Router();
var fs = require('fs');
var Docs = require('../models/document');
var middleware = require('../middleware');

router.get('/', function (req, res) {
  Docs.find({}, function (err, foundDocs) {
    if (err || !foundDocs) {
      req.flash('error', 'Item not found');
      res.redirect('back');
    } else {
      res.render('documents', { foundDocs: foundDocs });
    }
  });
});

router.get('/docscollection/new', middleware.isAdmin, function (req, res) {
  Docs.find({}, function (err, newSk) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('documents/new', { newSk: newSk });
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

  Docs.create(newDoc, function (err) {
    if (err || !newDoc) {
      console.log(err);
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      req.flash('Success', 'Document upload complete');
      res.redirect('/documents');
    }
  });
});

router.get('/docscollection/:id', middleware.isAdmin, function (req, res) {
  Docs.findById(req.params.id, function (err, foundDoc) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('documents/edit', { foundDoc: foundDoc });
    }
  });
});

router.put('/docscollection/:id', middleware.isAdmin, function (req, res) {
  Docs.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      res.redirect('/documents');
    }
  });
});

router.delete('/docscollection/:id', middleware.isAdmin, function (req, res) {
  Docs.findByIdAndRemove(req.params.id, function (err, removedDoc) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      fs.unlink('./public' + removedDoc.docLoc, err => {
        if (err) {
          req.flash('error', 'File note deleted, but image removed.');
          res.redirect('back');
        }
      });
      res.redirect('/documents');
    }
  });
});

module.exports = router;
