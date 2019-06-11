var express = require("express");
var router  = express.Router();
var passport = require("passport");
var fs = require("fs")
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comment")
var middleware = require("../middleware");

router.get("/officers", function(req, res){
    res.render("info/officers")
})

router.get('/newsletter', function (req, res) {
    var filePath = "./public/files/pdf/august.pdf";

    fs.readFile(filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

router.get("/sk", function(req, res){
    //find the campground with provided ID
    Campground.findById('5d002be72de55450b7e4283d').populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Item not found");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("info/sk", {campground: foundCampground});
        }
    });
});

router.get("/netscript", function(req, res){
    res.render("info/netscript");
});


// To change ID, create "campground", copy id from url of show page, insert after findbyid

router.get("/minutes", function(req, res){
    //find the campground with provided ID
    Campground.findById('5d0024bde6bffe4f7599bfed').populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Item not found");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("info/minutes", {campground: foundCampground});
        }
    });
});

module.exports = router;
