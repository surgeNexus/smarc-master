var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var Events = require('../models/operatingEvents');
var fs = require('fs');
var CronJob = require('cron').CronJob;
const { networkInterfaces } = require('os');


router.get('/', (req, res) => {
    Events.find({}, (err, foundEvents) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            res.render('operatingEvents', {
                operatingEvents: foundEvents
            });
        }
    });
});

router.post('/', middleware.isAdmin, (req, res) => {
    var now = new Date();
    now.setDate(now.getDate());
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
      date: req.body.date,
      docLoc: docLoc,
      controlDate: now
    };
    Events.create(newDoc, (err, foundImages) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            res.redirect('back');
        }
    });
});

router.delete('/:id', middleware.isAdmin, (req, res) => {
    Events.findByIdAndRemove(req.params.id, function (err, removedCodeplug) {
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
          res.redirect('/operatingevents');
        }
    });
});

var job = new CronJob('* * * * * *', function() {
  var now = new Date(); 
  now.setDate(now.getDate() + 32);
  Events.find({}, (err, foundEvents) => {
    if(err){
      console.log(err);
    } else if(foundEvents.controlDate) {
      console.log("Date older than 30 days found");
    }
  });
}, null, true, 'America/New_York');
job.start();

module.exports = router;
