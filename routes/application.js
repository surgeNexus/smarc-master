var express = require('express');
var router = express.Router();
var Application = require('../models/application');
var User = require('../models/user');
var middleware = require('../middleware');
var fs = require('fs');
var nodemailer = require('nodemailer');
var CronJob = require('cron').CronJob;
const { cachedDataVersionTag } = require('v8');

function sendEmail(emailAddress,subj, body) {
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
  subject: subj,
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
  if(!req.body.firstName.includes("http") || req.body.lastName.includes("http") || req.body.address.includes("http")
  || req.body.ctyStZip.includes("http")){
    Application.create(req.body, (err, newApplicant) => {
      if(err){
        req.flash('error', err.message);
        res.redirect('back');
      } else {
        const today = new Date();
        const date = today.toLocaleDateString();
        newApplicant.lastUpdated = date;
        newApplicant.save();
        sendEmail(req.body.email, '[SMARC] Application Received', 
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
                sendEmail(u.email, '[SMARC] New Member Application',
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
  } else {
    console.log('denied');
    req.flash("error", "Hahahaha, You've been denied. :D");
    res.redirect('back');
  }
});

router.get('/roster', middleware.isAdmin, (req, res) => {
  Application.find({}, (err, foundApplications) => {
    if(err){
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      const today = new Date();
      function yearPlus(plus){
        return today.getFullYear() + plus;
      }
      const years = [today.getFullYear(), yearPlus(1), yearPlus(2), yearPlus(3), yearPlus(4), yearPlus(5), "Honorary", "Military", "Lifetime"];
      res.render('application/roster', {
        apps: foundApplications,
        years: years
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
      function yearPlus(plus){
        return today.getFullYear() + plus;
      }
      foundApp.new = false;
      foundApp.status = req.body.status;
      foundApp.lastUpdated = date;
      if(req.body.status){
        var paidYear = req.body.duesPaidYear;
        var yearAfterPaid = paidYear + 1
        foundApp.duesPaidYear = req.body.duesPaidYear;
        sendEmail(foundApp.email, '[SMARC] ' + today.getFullYear() + ' Dues Received',
          foundApp.firstName + ',\n\n' +
          'Congratulations! Your SMARC dues are paid for the year ' + paidYear + '! \n\n' +
          'Dues will again become due on January 1, ' + yearAfterPaid + '. \n\n' +
          "This is an automated message from w4olb.org\n"
        )
        var stat = "Paid"
      } else {
        var stat = "Not Paid"
      }
      foundApp.save();
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
      const today = new Date();
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
            if(!admins.toLocaleLowerCase().includes(app.callsign.toLowerCase()) && !app.new && app.duesPaidYear < today.getFullYear()) {
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
