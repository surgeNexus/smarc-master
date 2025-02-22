var express = require('express');
var router = express.Router({ mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');
var nodemailer = require('nodemailer');

// COMMENTS NEW
router.get('/new', middleware.isLoggedIn, function (req, res) {
  // find campground by id
  console.log(req.params.id);
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

// COMMENTS CREATE
router.post('/', middleware.isLoggedIn, function (req, res) {
  //lookup campground using id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect('/radiomarket');
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          req.flash('error', 'Something weng wrong');
          console.log(err);
        } else {
          //add username and id to comment
          comment.text = req.body.text;
          comment.author.id = req.user._id;
          comment.author.email = req.user.email;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.GMAILUSER,
              pass: process.env.GMAILPW
            }
          });
          var mailOptions = {
            to: campground.author.email,
            from: 'surgenexus.app@gmail.com',
            subject:
              '[SMARC RADIOMARKET] Someone has commented on your listing',
            text:
              comment.author.username.toUpperCase() +
              ' has commented on your listing, ' +
              campground.name +
              ' in the SMARC Radiomarket. \n\n' +
              'Comment: \n\n ' +
              comment.text +
              '\n\n' +
              '\n\n' +
              'To reply to this comment, please visit http://w4olb.org/radiomarket/' +
              campground._id
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            req.flash('success', 'Comment added');
            res.redirect('/radiomarket/' + campground._id);
          });
        }
      });
    }
  });
});

// comments edit route
router.get('/:comment_id/edit', middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err || !foundCampground) {
      req.flash('error', 'Item not found');
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        res.render('comments/edit', {
          campground_id: req.params.id,
          comment: foundComment
        });
      }
    });
  });
});

//  comment update
router.put('/:comment_id', middleware.isLoggedIn, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/radiomarket/' + req.params.id);
    }
  });
});

// comment destroy route
router.delete('/:comment_id', middleware.isLoggedIn, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      req.flash('error', 'Comment not found');
      res.redirect('back');
    } else {
      req.flash('success', 'Comment Deleted');
      res.redirect('/radiomarket/' + req.params.id);
    }
  });
});

module.exports = router;
