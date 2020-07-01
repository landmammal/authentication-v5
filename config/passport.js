var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mysql = require("mysql");

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

// Handling registration
passport.use(
  "local-signup",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    function (req, email, password, done) {
      var sql = "SELECT * FROM users WHERE ?";
      db.query(sql, [{ email: email }], function (err, user) {
        if (err) {
          console.log("eror is here in sql");

          return done(err);
        }
        // reject user with duplicate emails
        if (user.length != 0) {
          console.log("eror user already in db");
          return done(null, false, { message: "email is already is use" });
        }

        //   adding new user to Db
        var sql = "INSERT INTO users SET ?";
        db.query(
          sql,
          { username: req.body.username, email: email, password: password },
          function (err, newUser) {
            if (err) {
              return done(err);
            }

            return done(null, newUser);
          }
        );
      });
    }
  )
);

// keeping our user logged in
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
