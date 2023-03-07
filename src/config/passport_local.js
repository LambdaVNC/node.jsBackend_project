const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/user_model.js");
const passport = require("passport");
const bcrypt = require("bcrypt");

// passport.use(new LocalStrategy(function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));



module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const _bulunanUser = await User.User.findOne({ email: email });

          if (!_bulunanUser) {
            return done(null, false, { message: "user not found" });
          }
          if (_bulunanUser && _bulunanUser.verifyEmail == false) {
            return done(null, false, { message: "Please verify email" });
          }

          const passwordControl = await bcrypt.compare(
            password,
            _bulunanUser.password
          );

          if (!passwordControl) {
            return done(null, false, { message: "user password not correct" });
          } else {
            return done(null, _bulunanUser);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  //   cookie'ye user.id yi kayıt ediyor hatırlama olayları için
  passport.serializeUser(function (user, done) {
    done(null, user.id);
    console.log("session a kaydedildi bu kisi" + user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.User.findById(id, function (err, user) {
      const newUser = {
        _id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        createdAt : user.createdAt,
        avatar: user.avatar
      };
      done(err, newUser);
    });
  });

  // passport.deserializeUser(function(user, done) {
  //   process.nextTick(function() {
  //     return done(null, user);
  //   });
  // });
};
