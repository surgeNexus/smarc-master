var express = require('express');
var router = express.Router();
var Application = require('../models/application');
var User = require('../models/user');
var middleware = require('../middleware');
var fs = require('fs');
var nodemailer = require('nodemailer');
var CronJob = require('cron').CronJob;
const { cachedDataVersionTag } = require('v8');

function sendEmail(emailAddress, body) {
var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'surgenexus.app@gmail.com',
    pass: process.env.GMAILPW
  }
});
var mailOptions = {
  to: emailAddress,
  from: process.env.GMAILUSER,
  subject: '[SMARC] Application Received',
  text: body
};
smtpTransport.sendMail(mailOptions, function (err) {
  done(err, 'done');
});
}


router.get('/', function (req, res) {
  res.render('application')
});

router.post('/', function (req, res) {
  Application.create(req.body, (err, newApplicant) => {
    if(err){
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      const today = new Date();
      const date = today.toLocaleDateString();
      newApplicant.lastUpdated = date;
      newApplicant.save();
      sendEmail(req.body.email, 
        newApplicant.firstName + ',\n\n' + '\n\n' +
        'The Smoky Mountain Amateur Radio Club has received your membership applicaiton and the admins have been notified.\n\n' +
        'Please ensure that you have paid Dues via one of the available methods.\n\n' +
        'If you have questions or need help, please reach out to webmaster@w4olb.org\n\n' +
        '\n\n' +
        "73 de W4OLB\n"
      );
      User.find({}, (err, foundUsers) => {
        if(err){
          console.log(err);
        } else {
          foundUsers.forEach((u) => {
            if(u.isAdmin){
              sendEmail(u.email, 
                u.firstName + ',\n\n' +
                'An application has been received for ' + newApplicant.firstName + " " + newApplicant.lastName + ', ' + newApplicant.callsign +  '.\n' +
                'you can reach them by email at ' + newApplicant.email + ' or by phone at ' + newApplicant.phone + "\n\n" +
                "This is an automated message from w4olb.org\n"
              );
            }
          });
        }
      });
      if(req.body.smarcOnline === true){
        req.flash('success', "Your application has been submitted. \n\n Please allow time for your membership fee to be processed and your online account to be activated.")
        res.render('application/appRegister', {
          info: newApplicant
        });
      } else {
        req.flash('success', "Thanks! Your applicaiton has been submitted!")
        res.redirect('/');
      }
    }
  });
});

router.get('/roster', middleware.isAdmin, (req, res) => {
  Application.find({}, (err, foundApplications) => {
    if(err){
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      res.render('application/roster', {
        apps: foundApplications
      });
    }
  });
});

router.put('/roster/:id', middleware.isAdmin, (req, res) => {
  Application.findById(req.params.id, (err, foundApp) => {
    if(err){
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      const today = new Date();
      const date = today.toLocaleDateString();
      const nextYear = today.getFullYear() + 1;
      foundApp.new = false;
      foundApp.status = req.body.status;
      foundApp.lastUpdated = date;
      foundApp.save();
      if(req.body.status){
        sendEmail(foundApp.email,
          foundApp.firstName + ',\n\n' +
          'Congratulations! Your SMARC dues are paid for the year ' + today.getFullYear() + '! \n\n' +
          'Dues will again become due on January 1, ' + nextYear + '. \n\n' +
          "This is an automated message from w4olb.org\n"
        )
        var stat = "Paid"
      } else {
        var stat = "Not Paid"
      }
      req.flash('success', foundApp.callsign.toUpperCase() + " has been marked " + stat + "!")
      res.redirect('back');
    }
  });
});

router.delete('/roster/:id', middleware.isAdmin, (req, res) => {
  Application.findByIdAndRemove(req.params.id, (err, foundApp) => {
    if(err){
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      req.flash('success', foundApp.callsign.toUpperCase() + "'s application has been removed.")
      res.redirect('back');
    }
  });
});

var job = new CronJob('0 6 1 1 *', function() {
  Application.find({}, (err, foundApps) => {
    if(err){
      console.log(err);
    } else {
      var admins = "";
      User.find({}, (err, foundUsers) => {
        if(err){
          console.log(err);
        } else {
          foundUsers.forEach((u) => {
            if(u.isAdmin) {
              admins = admins + u.username + ", "
            }
          });
          foundApps.forEach((app) => {
            if(!admins.toLocaleLowerCase().includes(app.callsign.toLowerCase()) && !app.new) {
              app.status = false;
              app.save();
            };
          });
        }
      });
    }
  });
}, null, true, 'America/New_York');
job.start();

module.exports = router;
