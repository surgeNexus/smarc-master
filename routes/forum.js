var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs = require('fs');
var User = require('../models/user');
var Forum = require('../models/forum');
var Comment = require('../models/comment');
var middleware = require('../middleware');

var url = '/forum/';

// Get Forum index
router.get('/', (req, res) => {
  Forum.find({}, null, { sort: { createdAt: -1 } }, (err, forums) => {
    if (err) {
      req.flash('error', 'No items found');
      res.redirect('back');
    } else {
      res.render('members/forum', { url: url, forums: forums });
    }
  });
});

// Post new topic
router.post('/', (req, res) => {
  var name = req.body.name;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  newForum = { name: name, description: description, author: author };
  Forum.create(newForum, (err, forum) => {
    if (err) {
      req.flash('error', 'Something went wrong. Topic not Created.');
      res.redirect('back');
    } else {
      req.flash('success', 'Your topic has been posted!');
      res.redirect('back');
    }
  });
});

// Get Topic
router.get('/:topic_id', (req, res) => {
  Forum.findById(req.params.topic_id)
    .populate({
      path: 'comments',
      model: 'Comment',
      populate: {
        path: 'replies',
        model: 'Comment'
      }
    })
    .exec((err, topic) => {
      if (err) {
        req.flash('error', 'Something went wrong. Topic not found.');
        res.redirect('back');
      } else {
        res.render('members/forum/show', { url: url, topic: topic });
      }
    });
});

router.post('/:topic_id', (req, res) => {
  var text = req.body.comment;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var commentPush = { text: text, author: author };
  Comment.create(commentPush, (err, newComment) => {
    if (err) {
      req.flash('error', 'Comment not posted.');
      res.redirect('back');
    } else {
      Forum.findById(req.params.topic_id, (err, foundTopic) => {
        if (err) {
          req.flash('error', 'Comment not posted.');
          res.redirect('back');
        } else {
          foundTopic.comments.push(newComment);
          foundTopic.save();
          res.redirect('back');
        }
      });
    }
  });
});

router.post('/:topic_id/:comment_id', (req, res) => {
  var text = req.body.comment;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var commentPush = { text: text, author: author };
  Comment.create(commentPush, (err, newComment) => {
    if (err) {
      req.flash('error', 'Comment not posted.');
      res.redirect('back');
    } else {
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          req.flash('error', 'Comment not posted.');
          res.redirect('back');
        } else {
          foundComment.replies.push(newComment);
          foundComment.save();
          res.redirect('back');
        }
      });
    }
  });
});

module.exports = router;
