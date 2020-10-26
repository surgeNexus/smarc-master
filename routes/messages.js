// var express = require('express');
// var router = express.Router();
// var passport = require('passport');
// var fs = require('fs');
// var User = require('../models/user');
// var Message = require('../models/message');
// var middleware = require('../middleware');

// router.get('/', (req, res) => {
//   User.find({}, (err, foundUsers) => {
//     if (err) {
//       req.flash('error', 'Something went wrong, No users found.');
//       res.redirect('back');
//     } else {
//       res.render('messages', { users: foundUsers });
//     }
//   });
// });

// router.get('/:user_id', (req, res) => {
//   User.findById(req.params.user_id)
//     .populate('messageBox')
//     .exec((err, foundUser) => {
//       if (err) {
//         req.flash('error', 'Something went wrong. User not found.');
//         res.redirect('/messages');
//       } else {
//         User.find({}, (err, foundUsers) => {
//           if (err) {
//             req.flash('error', 'Something went wrong. User not found.');
//             res.redirect('/messages');
//           } else {
//             res.render('messages', { foundUser: foundUser, users: foundUsers });
//           }
//         });
//       }
//     });
// });

// router.put('/:user_id', (req, res) => {
    
//   Message.create(messageBody, (err, message) => {
//     if (err) {
//       req.flash('error', 'Message not sent. Please try again.');
//       res.redirect('/messages');
//     } else {
//       User.findById(req.params.id, (err, foundUser) => {
//         if (err) {
//           req.flash('error', 'Something went wrong. User not found.');
//           res.redirect('/messages');
//         } else {
//         }
//       });
//     }
//   });
// });

// module.exports = router;
