var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override"),
    flash            = require("connect-flash"),
    moment           = require("moment"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    seedDB           = require("./seeds")
    roles            = require("roles")


    
//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/radiomarket"),
    indexRoutes      = require("./routes/index"),
    homeRoutes       = require("./routes/home"),
    infoRoutes       = require("./routes/info");
    

mongoose.connect("mongodb://localhost:27017/smarc");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();
//moment configuration
app.locals.moment = require('moment');
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// USER ROLES

app.use(indexRoutes);
app.use("/radiomarket", campgroundRoutes);
app.use("/radiomarket/:id/comments", commentRoutes);
app.use("/home", homeRoutes);
app.use("/info", infoRoutes);


app.listen(3000, function(){
   console.log("The SMARC Server Has Started!");
});