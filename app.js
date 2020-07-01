// Dependencies
var express = require("express");
var mysql = require("mysql");
var passport = require("./config/passport");
var session = require("express-session");
var userEncrypt = require("./config/middleware/userEncrypt");

// app initialization
var app = express();

// set our view engine
app.set("view engine", "ejs");

// MIDDLEWARE -------------------
app.use(express.static("public")); // adding static assets (css, img, js files)
app.use(express.urlencoded({ extended: false })); // reads the data
app.use(express.json()); // format the data coming in as an object under a property call body

// passport stuff
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

var PORT = process.env.PORT || 3000;

// DATABASE Connection
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "authenticationV5",
});

db.connect(function (error) {
  if (error) throw error;

  console.log("MYSQL is connected");
});

// ############# ROUTES

app.get("/", function (req, res) {
  //   console.log("home route hit");
  res.render("login-and-register.ejs");
});

// registering users
app.post(
  "/register",
  userEncrypt,
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

// login is users
// registering users
app.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

app.get("/profile", function (req, res) {
  res.render("profile.ejs");
});

app.listen(PORT, function () {
  console.log("Server is lit on PORT: " + PORT);
});
