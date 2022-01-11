var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var Image = require('../models/imageStore');
var fs = require('fs');


router.get('/', (req, res) => {
    Image.find({}, (err, foundImages) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            res.render('imageStore', {
                images: foundImages
            });
        }
    });
});

router.post('/', middleware.isAdmin, (req, res) => {
    var now = Date.now();
    let doc = req.files.image;
    doc.mv('./public/files/documents/' + now + req.files.image.name, function (
      err
    ) {
      if (err) {
        console.log(err);
      }
    });
    var docLoc = '/files/documents/' + now + req.files.image.name;
    var newDoc = {
      image: docLoc,
    };
    Image.create(newDoc, (err, foundImages) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            res.redirect('back');
        }
    });
});

router.delete('/:id', middleware.isAdmin, (req, res) => {
    Image.findByIdAndRemove(req.params.id, function (err, removedCodeplug) {
        if (err) {
          req.flash('error', 'Something went wrong');
          res.redirect('back');
        } else {
          fs.unlink('./public' + removedCodeplug.image, err => {
            if (err) {
              req.flash('error', 'File not deleted; entry removed.');
              res.redirect('back');
            }
          });
          res.redirect('/imagestore');
        }
    });
});


module.exports = router;
