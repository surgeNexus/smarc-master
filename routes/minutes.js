var express = require('express');
var router = express.Router();
var Minutes = require('../models/minutes');
var middleware = require('../middleware');

router.get('/', function (req, res) {
  Minutes.find({})
    .sort({ date: -1 })
    .exec(function (err, foundMinutes) {
      if (err || !foundMinutes) {
        req.flash('error', 'Item not found');
        res.redirect('back');
      } else {
        var url = '/minutes' + req.url;
        res.render('minutes', { foundMinutes: foundMinutes, url: url });
      }
    });
});

router.post('/', middleware.isAdmin, function (req, res) {
  var date = req.body.date;
  var type = req.body.type;
  var now = Date.now();
  if (req.files) {
    let doc = req.files.doc;
    doc.mv('./public/files/documents/' + now + req.files.doc.name, function (
      err
    ) {
      if (err) {
        console.log(err);
      }
    });
    var docLoc = '/files/documents/' + now + req.files.doc.name;
    var newDoc = {
      date: date,
      docLoc: docLoc,
      type: type
    };
  } else {
    var newDoc = {
      date: date,
      type: type
    };
  }
  Minutes.create(newDoc, function (err) {
    if (err || !newDoc) {
      console.log(err);
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      req.flash('Success', 'Document upload complete');
      res.redirect('/minutes');
    }
  });
});

router.put('/:id', middleware.isAdmin, function (req, res) {
  if (req.files) {
    var now = Date.now();
    let doc = req.files.doc;
    doc.mv('./public/files/documents/' + now + req.files.doc.name, function (
      err
    ) {
      if (err) {
        console.log(err);
      }
    });
    var docLoc = '/files/documents/' + now + req.files.doc.name;
  }
  Minutes.findByIdAndUpdate(req.params.id, req.body, function (err, updatedMinutes) {
    if (err) {
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      updatedMinutes.docLoc = docLoc;
      updatedMinutes.save();
      res.redirect('/minutes');
    }
  });
});

router.delete('/:id', middleware.isAdmin, function (
  req,
  res
) {
  Minutes.findByIdAndRemove(req.params.id, function (err, removedCodeplug) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      fs.unlink('./public' + removedCodeplug.docLoc, err => {
        if (err) {
          req.flash('error', 'File not deleted; entry removed.');
          res.redirect('back');
        }
      });
      res.redirect('/codeplugs');
    }
  });
});

module.exports = router;
