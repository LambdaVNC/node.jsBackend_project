const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../model/user_model.js");
const passport = require("passport");
require("../config/passport_local.js")(passport);

const showLoginForm = (req, res, next) => {
  res.render("login", { layout: "./layout/auth_layout.ejs" });
};

const showForgetPassword = (revalidationResultq, res, next) => {
  res.render("forget_password", { layout: "./layout/auth_layout.ejs" });
};

const showRegisterForm = (req, res, next) => {
  res.render("register", { layout: "./layout/auth_layout.ejs" });
};

const login = (req, res, next) => {
  const errorsArray = validationResult(req);
  req.flash("email", req.body.email);
  req.flash("password", req.body.password);
  if (!errorsArray.isEmpty()) {
    req.flash("validation_errors", errorsArray.array());
    res.redirect("/login");
  } else {
    passport.authenticate("local", {
      successRedirect: "/management",
      failureRedirect: "/login",
      failureFlash: true,
      failureMessage: true,
    });
  }
};

const register = async (req, res, next) => {
  const errorsArray = validationResult(req);
  if (!errorsArray.isEmpty()) {
    req.flash("validation_errors", errorsArray.array());
    req.flash("name", req.body.name);
    req.flash("surname", req.body.surname);
    req.flash("email", req.body.email);
    res.redirect("/register");
  } else {
    // ilk olarak kullanıcı email i daha önceden kayıt olmuş mu konrolü sağlanır.
    try {
      const _user = await User.User.findOne({ email: req.body.email });
      if (_user) {
        req.flash("validation_errors", [{ msg: "this email is in use" }]);
        req.flash("name", req.body.name);
        req.flash("surname", req.body.surname);
        req.flash("email", req.body.email);
        res.redirect("/register");
      } else {
        const newUser = new User.User({
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: req.body.password,
        });

        await newUser.save();

        console.log("USER SUCCSESSFULLY SAVED!");
        req.flash("success_message", [{ msg: "You can login" }]);
        res.redirect("/login");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const resetPassword = (req, res, next) => {
  console.log(req.body);
  res.render("forget_password", { layout: "./layout/auth_layout.ejs" });
};

const logout = (req, res, next) => {
  req.logout();
  req.session.destroy((error) => {
    res.clearCookie('connect.sid');
    res.render('login', {layout : "./layout/auth_layout.ejs", success_message : [{msg : "Logout successful"}]})
  })
};

module.exports = {
  showForgetPassword,
  showLoginForm,
  showRegisterForm,
  register,
  login,
  logout,
  resetPassword,
};
