var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs = require('fs');
var User = require('../models/user');
var Campground = require('../models/campground');
var Docs2 = require('../models/memDoc');
var middleware = require('../middleware');

router.get('/join', function (req, res) {
  res.render('info/join');
});

// router.get('/newsletter', function (req, res) {
//     var filePath = "./public/files/pdf/august.pdf";

//     fs.readFile(filePath , function (err,data){
//         res.contentType("application/pdf");
//         res.send(data);
//     });
// });

router.get('/email', function (req, res) {
  res.render('info/email');
});

router.get('/docs', function (req, res) {
  Docs2.find({}, function (err, foundDocs) {
    if (err || !foundDocs) {
      req.flash('error', 'Item not found');
      res.redirect('back');
    } else {
      res.render('info/docs', { foundDocs: foundDocs });
    }
  });
});

router.get('/docs/new', middleware.isAdmin, function (req, res) {
  Docs2.find({}, function (err, newSk) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('info/docs/new', { newSk: newSk });
    }
  });
});

router.post('/docs', middleware.isAdmin, function (req, res) {
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

  Docs2.create(newDoc, function (err) {
    if (err || !newDoc) {
      console.log(err);
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      req.flash('Success', 'Document upload complete');
      res.redirect('/info/docs');
    }
  });
});

router.get('/docs/:id', middleware.isAdmin, function (req, res) {
  Docs2.findById(req.params.id, function (err, foundDoc) {
    if (err) {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('info/docs/edit', { foundDoc: foundDoc });
    }
  });
});

router.put('/docs/:id', middleware.isAdmin, function (req, res) {
  Docs2.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash('error', 'something went wrong');
      res.redirect('back');
    } else {
      res.redirect('/info/docs');
    }
  });
});

router.delete('/docs/:id', middleware.isAdmin, function (req, res) {
  Docs2.findByIdAndRemove(req.params.id, function (err, removedDoc) {
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
      res.redirect('/info/docs');
    }
  });
});

module.exports = router;
