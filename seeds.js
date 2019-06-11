var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a14ca13b83f7bce82764a45d13576418&auto=format&fit=crop&w=1400&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Unfrozen Lake", 
        image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d1c8cc988efddbda8746281871c0c8bf&auto=format&fit=crop&w=1259&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. blah blah"
    },
    {
        name: "Canyon Floor", 
        image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1c80f31bb4040015d51db663252fbd30&auto=format&fit=crop&w=1353&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. blah blah"
    }
]

function seedDB(){
    Campground.remove({}, function(err){
    // if(err){
    //     console.log(err);
    // } 
    // console.log("removed campgrounds!");
    //     data.forEach(function(seed){
    //         Campground.create(seed, function(err, campground){
    //             if(err){
    //                 console.log(err);
    //             } else {
    //                 console.log("added a campground");
    //                 Comment.create(
    //                     {
    //                         text: "This place is great, but I wish there was internet",
    //                         author: "Homer"
    //                     }, function(err, comment){
    //                         if(err){
    //                             console.log(err);
    //                         } else {
    //                             campground.comments.push(comment);
    //                             campground.save();
    //                             console.log("created new comment")
    //                         }
                            
                            
    //                     })
    //             }
    //         });
    //     });
    });
}


module.exports = seedDB;