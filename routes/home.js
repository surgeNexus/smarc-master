var express = require('express');
var router  = express.Router();
var Comment = require('../models/comment');
var Home = require('../models/home');
var middleware = require("../middleware");

router.get("/", function(req, res){
    Home.find({}, function(err, foundHome){
        if(err || !foundHome){
            req.flash("error", "Item not found");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("home", {foundHome: foundHome});
        }
    });
});

router.get("/homescollection", middleware.isLoggedIn, function(req, res){
    Home.find({}, function(err, foundHomes){
        if(err){
            console.log(err);
            req.flash("error", "something went wrong");
        } else {
            res.render('home/collection', {foundHomes: foundHomes});
        };
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    Home.find({}, function(err, foundHome){
        if(err || !foundHome){
            req.flash("error", "Item not found");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("home/new", {foundHome: foundHome});
        }
    });
});

// edit route
router.get("/:id", middleware.isLoggedIn, function(req, res){
    Home.findById(req.params.id, function(err, foundHome){
        if(err){
            console.log(err);
            req.flash("error", "Item not found");
        } else {
            res.render("home/edit", {foundHome: foundHome});
        };
    });
});

router.put("/:id", function(req, res){
    // find and update the correct campground
    Home.findByIdAndUpdate(req.params.id, req.body, function(err, updatedHome){
        if(err){
            res.redirect("/home/homescollection");
            req.flash("error", "Something went wrong");
        } else {
            res.redirect("/home/homescollection");
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var title = req.body.title;
    var body = req.body.body;
    var link1name = req.body.link1name
    var link1 = req.body.link1;
    var link2name = req.body.link2name
    var link2 = req.body.link2;
    var image1 = req.body.image1;
    var image2 = req.body.image2;
    var image3 = req.body.image3;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newHome = {title:title, body:body, link1name: link1name, link1:link1, link2name: link2name, link2:link2, image1:image1, image2:image2, image3:image3, author:author};
    Home.create(newHome, function(err, newEntry){
        if(err){
            console.log(err);
        } else {
            res.redirect("/home/homescollection");
        }
    });
});

// Delete Route
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    Home.findByIdAndRemove(req.params.id, function(err, deleteEntry){
        if(err){
            console.log(err)
            console.log(req.params.id);
            res.redirect("/home/homescollection");
        } else {
            console.log(req.params.id)
            res.redirect("/home/homescollection");
        }
    })
})

module.exports = router;