var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("radiomarket/index",{campgrounds:allCampgrounds, page: 'radiomarket'});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author:author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/radiomarket");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("radiomarket/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Item not found");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("radiomarket/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("radiomarket/edit", {campground: foundCampground});
    });
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.isLoggedIn, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/radiomarket");
        } else {
            res.redirect("/radiomarket/" + req.params.id);
        }
    });
});
// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/radiomarket");
        } else {
            res.redirect("/radiomarket");
        }
    });
});

module.exports = router;