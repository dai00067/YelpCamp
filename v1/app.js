var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    LocalStrategy = require("passport-local"),
    passport = require("passport"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

var commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index"),
    campgroundRoutes = require("./routes/campgrounds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); // seed the database

//passport configuration
app.use(require("express-session")({
    secret: "Once again Zoe is a cute girl",
    resave: false,
    saveUnitialized: false
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

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has started!");
});

//landing page
app.get("/", function(req, res){
   res.render("landing");
});





// ===========================
// ROUTES:
// INDEX    /campgrounds         GET
// NEW      /campgrounds/new     GET
// CREATE   /campgrounds         POST
// SHOW     /campgrounds/:id     GET

// NEW      /campgrounds/:id/comments/new    GET
// CREATE   /campgrounds/:id/comments        POST