var express = require('express');
var router  = express.Router();
var Docs = require('../models/document');
var middleware = require("../middleware");

router.get("/", function(req, res){
    Docs.find({}, function(err, foundDocs){
        if(err || !foundDocs){
            req.flash("error", "Item not found");
            res.redirect("back");
        } else {
            res.render("documents", {foundDocs: foundDocs});
        }
    });
});

router.get("/docscollection", middleware.isLoggedIn, function(req, res){
    Docs.find({}, function(err, foundDocs){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back")
        } else {
            res.render("documents/collection", {foundDocs: foundDocs});
        };
    });
});

router.get("/docscollection/new", middleware.isLoggedIn, function(req, res){
    Docs.find({}, function(err, newSk){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.render("documents/new", {newSk: newSk});
        }
    })
})

router.post("/", middleware.isLoggedIn, function(req, res){
    var title = req.body.title;
    var date = req.body.date;

    let doc = req.files.doc
    doc.mv("./public/files/documents/" + req.files.doc.name, function(err){
        if(err){
            console.log(err);
        };
    });

    var docLoc = "/files/documents/" + req.files.doc.name;

    var newDoc = {title: title, date: date, docLoc: docLoc};
    Docs.create(newDoc, function(err){
        if(err || !newDoc){
            console.log(err)
            req.flash("error", "something went wrong");
            res.redirect("back");
        } else {
            req.flash("Success", "Document upload complete");
            res.redirect("/documents/docscollection");
        };
    });
});

router.get("/docscollection/:id", middleware.isLoggedIn, function(req, res){
    Docs.findById(req.params.id, function(err, foundDoc){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.render("documents/edit", {foundDoc: foundDoc});
        };
    });
});

router.put("/docscollection/:id", middleware.isLoggedIn, function(req, res){
    Docs.findByIdAndUpdate(req.params.id, req.body, function(err){
        if(err){
            req.flash("error", "something went wrong");
            res.redirect("back");
        } else {
            res.redirect("/documents/docscollection");
        };
    });
});

router.delete("/docscollection/:id", middleware.isLoggedIn, function(req, res){
    Docs.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            res.redirect("/documents/docscollection");
        };
    });
});

module.exports = router;