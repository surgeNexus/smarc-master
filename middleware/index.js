var Campground = require('../models/campground');
var Comment = require('../models/comment');
var User = require('../models/user');

// ALL MIDDLEWARE GOES HERE

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err || !foundCampground) {
        req.flash('error', 'Item not found');
        res.redirect('back');
      } else {
        User.findById(req.user._id,(err, foundUser) => {
          if(err){
            console.log(err)
            res.redirect('back');
          } if (
          foundCampground.author.id.equals(req.user._id) ||
          foundUser.isAdmin
        ) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
        })
        
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err || !foundComment) {
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        User.findById(req.user._id,(err, foundUser) => {
          if(err){
            console.log(err)
            res.redirect('back');
          } else if (
            foundComment.author.id.equals(req.user._id) ||
            foundUser.isAdmin
          ) {
            next();
          } else {
            req.flash('error', "You don't have permission to do that");
            res.redirect('back');
          }
        });
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.checkProfileOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    User.findById(req.params.id, function (err, foundUser) {
      if (err || !foundUser) {
        req.flash('error', 'User not found');
        res.redirect('/');
      } else {
        // does user own the comment?
        if (foundUser._id.equals(req.user.id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.isAdmin = function (req, res, next) {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      if (err || !foundUser) {
        req.flash('error', 'User not found');
        res.redirect('/');
      } else {
        if (foundUser.isAdmin) {
          next();
        } else if (foundUser.isMember) {
          req.flash('error', "You don't have permission to do that");
          res.redirect('/member');
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('/');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
  }
};

middlewareObj.isMember = function (req, res, next) {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      if (err || !foundUser) {
        req.flash('error', 'User not found');
        res.redirect('/');
      } else {
        if (foundUser.isMember) {
          next();
        } else {
          req.flash('error', 'You must be a verified member to do that');
          res.redirect('/');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
  }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please Log In First!');
  res.redirect('/login');
};

module.exports = middlewareObj;
