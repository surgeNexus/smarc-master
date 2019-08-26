var express = require("express");
var router  = express.Router();
var passport = require("passport");
var fs = require("fs")
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comment")
var middleware = require("../middleware");

router.get("/join", function(req, res){
    res.render("info/join");
})

// router.get('/newsletter', function (req, res) {
//     var filePath = "./public/files/pdf/august.pdf";

//     fs.readFile(filePath , function (err,data){
//         res.contentType("application/pdf");
//         res.send(data);
//     });
// });

module.exports = router;