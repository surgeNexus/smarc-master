var express = require('express');
var router = express.Router();
var Repeaters = require('../models/repeaters');
var middleware = require('../middleware');

router.get('/find/:searchUrl', (req, res) => {
    Repeaters.findOne({searchUrl: req.params.searchUrl}, (err, foundRepeater) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            res.redirect('/repeaters/' + foundRepeater.id);
        }
    })
})

router.get('/', function (req, res) {
    Repeaters.find({}, (err, foundRepeaters) => {
        if(err){
            req.flash('error', 'something went wrong');
            res.redirect('back');
        } else {
            res.render('repeaters', {
                repeaters: foundRepeaters
            });
        }
    })
});

router.get('/:id', (req, res) => {
    Repeaters.findById(req.params.id, (err, foundRepeater) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back'); 
        } else {
            res.render('repeaters/show', {
                repeater: foundRepeater
            });
        }
    })
})

router.post('/', (req, res) => {
    var newRepeater  = {
        title: req.body.title,
        body: req.body.body,
        searchUrl: req.body.searchUrl
    }
    Repeaters.create(newRepeater, (err, repeater) => {
        if(err){
            req.flash('error', 'something went wrong');
            res.redirect('back');
        } else {
            res.redirect('/repeaters/' + repeater.id);
        }
    })
})

router.put('/:id', (req, res) => {
    Repeaters.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back'); 
        } else {
            res.redirect('back');
        }
    })
})

router.delete('/:id', (req, res) => {
    Repeaters.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            req.flash('error', err.message);
            res.redirect('back'); 
        } else {
            res.redirect('/repeaters');
        }
    })
})

module.exports = router;


