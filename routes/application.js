var express = require('express');
var router = express.Router();
var Application = require('../models/application');
var User = require('../models/user');
var middleware = require('../middleware');
var fs = require('fs');
var nodemailer = require('nodemailer');

function sendEmail(emailAddress, type, info) {
var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'surgenexus.app@gmail.com',
    pass: process.env.GMAILPW
  }
});
if(type === "applicant"){
  var mailOptions = {
    to: emailAddress,
    from: process.env.GMAILUSER,
    subject: '[SMARC] Application Received',
    text:
      '' + info.firstName + ',\n\n' + '\n\n' +
      'The Smoky Mountain Amateur Radio Club has received your membership applicaiton and the admins have been notified.\n\n' +
      'Please ensure that you have paid Dues via one of the available methods.\n\n' +
      'If you have questions or need help, please reach out to webmaster@w4olb.org\n\n' +
      '\n\n' +
      "73 de W4OLB\n"
  };
} else if(type === "admin"){
  var mailOptions = {
    to: emailAddress,
    from: process.env.GMAILUSER,
    subject: '[SMARC] Application Received',
    text:
      'SMARC Admin,\n\n' +
      '\n\n' +
      'An application has been received for ' + info.firstName + " " + info.lastName + ', ' + info.callsign +  '.\n\n' +
      'you can reach them by email at ' + info.email + ' or by phone at ' + info.phone + "\n\n" +
      '\n\n' +
      "This is an automated message from w4olb.org\n"
  };
}
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
      sendEmail(req.body.email, "applicant", newApplicant);
      User.find({}, (err, foundUsers) => {
        if(err){
          console.log(err);
        } else {
          foundUsers.forEach((u) => {
            if(u.isAdmin){
              sendEmail(u.email, "admin", newApplicant);
            }
          });
        }
      });
      if(req.body.smarcOnline){
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

router.get('/roster', (req, res) => {
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

router.put('/roster/:id', (req, res) => {
  Application.findById(req.params.id, (err, foundApp) => {
    if(err){
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      const today = new Date();
      const date = today.toLocaleDateString();
      foundApp.new = false;
      foundApp.status = req.body.status;
      foundApp.lastUpdated = date;
      foundApp.save();
      if(req.body.status){
        var stat = "Paid"
      } else {
        var stat = "Not Paid"
      }
      req.flash('success', foundApp.callsign.toUpperCase() + " has been marked " + stat + "!")
      res.redirect('back');
    }
  });
});

module.exports = router;
