var express = require('express');
var router  = express.Router();
var Comment = require('../models/comment');
var Campground = require('../models/campground');

router.get("/", function(req, res){
    Campground.findById('5d016b257b95ac0713fee3e2').populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Item not found");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("home", {campground: foundCampground});
        }
    });
});

module.exports = router;