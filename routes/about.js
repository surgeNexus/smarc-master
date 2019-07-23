var express = require('express');
var router  = express.Router();
var About = require('../models/abouts');
var middleware = require("../middleware");

router.get("/", function(req, res){
    About.find({}, function(err, foundAbout){
        if(err || !foundAbout){
            req.flash("error", "Item not found");
            res.redirect("back");
        } else {
            res.render("about", {foundAbout: foundAbout});
        }
    });
});

router.get("/aboutcollection", middleware.isLoggedIn, function(req, res){
    About.find({}, function(err, foundAbout){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back")
        } else {
            res.render("about/collection", {foundAbout: foundAbout});
        };
    });
});

router.get("/aboutcollection/new", middleware.isLoggedIn, function(req, res){
    About.find({}, function(err, newAbout){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.render("about/new", {newAbout: newAbout});
        }
    })
})

router.post("/", middleware.isLoggedIn, function(req, res){
    var meeting = req.body.meeting
    var fieldDay = req.body.fieldDay;
    var test = req.body.test;
    
    var newAbout = {meeting: meeting, fieldDay: fieldDay, test: test};
    About.create(newAbout, function(err){
        if(err || !newAbout){
            console.log(err)
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            req.flash("Success", "Sorry for your loss");
            res.redirect("/about/aboutcollection");
        };
    });
});

router.get("/aboutcollection/:id", middleware.isLoggedIn, function(req, res){
    About.findById(req.params.id, function(err, foundAbout){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.render("about/edit", {foundAbout: foundAbout});
        };
    });
});

router.put("/aboutcollection/:id", middleware.isLoggedIn, function(req, res){
    About.findByIdAndUpdate(req.params.id, req.body, function(err){
        if(err){
            req.flash("error", "something went wrong");
            res.redirect("back");
        } else {
            res.redirect("/about/aboutcollection");
        };
    });
});

router.delete("/aboutcollection/:id", middleware.isLoggedIn, function(req, res){
    About.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.redirect("/about/aboutcollection");
        };
    });
});

module.exports = router;