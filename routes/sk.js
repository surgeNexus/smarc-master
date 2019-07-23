var express = require('express');
var router  = express.Router();
var Sk = require('../models/sk');
var middleware = require("../middleware");

router.get("/", function(req, res){
    Sk.find({}, function(err, foundSk){
        if(err || !foundSk){
            req.flash("error", "Item not found");
            res.redirect("back");
        } else {
            res.render("info/sk", {foundSk: foundSk});
        }
    });
});

router.get("/skcollection", middleware.isLoggedIn, function(req, res){
    Sk.find({}, function(err, foundSk){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back")
        } else {
            res.render("sk/collection", {foundSk:foundSk});
        };
    });
});

router.get("/skcollection/new", middleware.isLoggedIn, function(req, res){
    Sk.find({}, function(err, newSk){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.render("sk/new", {newSk: newSk});
        }
    })
})

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var callsign = req.body.callsign;

    let skPicture = req.files.skPicture;

    skPicture.mv("./public/images/" + req.files.skPicture.name, function(err){
        if(err){
            console.log(err);
        };
        console.log('success');
    });
    var pictureLoc = "/images/" + req.files.skPicture.name;

    var newSk = {name: name, callsign: callsign, pictureLoc: pictureLoc};
    Sk.create(newSk, function(err){
        if(err || !newSk){
            console.log(err)
            req.flash("error", "something went wrong");
            res.redirect("back");
        } else {
            req.flash("Success", "Sorry for your loss");
            res.redirect("/info/sk/skcollection");
        };
    });
});

router.get("/skcollection/:id", middleware.isLoggedIn, function(req, res){
    Sk.findById(req.params.id, function(err, foundSk){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.render("sk/edit", {foundSk: foundSk});
        };
    });
});

router.put("/skcollection/:id", middleware.isLoggedIn, function(req, res){
    Sk.findByIdAndUpdate(req.params.id, req.body, function(err){
        if(err){
            req.flash("error", "something went wrong");
            res.redirect("back");
        } else {
            res.redirect("/info/sk/skcollection");
        };
    });
});

router.delete("/skcollection/:id", middleware.isLoggedIn, function(req, res){
    Sk.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.redirect("/info/sk/skcollection");
        };
    });
});

module.exports = router;