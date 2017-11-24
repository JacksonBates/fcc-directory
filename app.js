const express             = require('express'),
      mongoose              = require('mongoose'),
      passport              = require('passport'),
      bodyParser            = require('body-parser'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      User                  = require('./models/user'),
      fs                    = require('fs'),
      path                  = require('path'),
      indexRoute            = require('./routes/index'),
      routes                = require('./routes/index'),
      app                   = express();

app.set("view engine", "ejs");
app.set("views", __dirname + '/views')
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// app.use(require("express-session")({
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: false
// }));

app.use(bodyParser.urlencoded({extended:true}))
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// RESTful ROUTES
// index route
// app.use("/", indexRoute);
// app.use("/members", membersRoute);


// app.get("/members", (req,res) => {
//   res.render("index", {req: req, members: members})
// })

app.get("/dashboard", isLoggedIn, (req,res) => {
  res.render("dashboard", {req:req})
})


// AUTH ROUTES

app.get("/register", (req,res)=> {
  res.render("register", {req:req});
})

//handling user sign up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      console.log(user)
        if(err){
            console.log(err);
            return res.render('register', {req:req});
        };

        passport.authenticate("local")(req, res, function(){
           res.redirect("/dashboard");
        });
    });
});

// LOGIN ROUTES 

// render login form.

app.get("/login", (req,res)=> {
  res.render("login", {req:req})
})

// Login Logic

app.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login"
}), (req,res)=> {})


app.get("/logout", (req,res) => {
  req.logout();
  res.redirect("/")
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login")
}

module.exports = app;
