const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../model/user_model.js");
const passport = require("passport");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("../config/passport_local.js")(passport);

const showLoginForm = (req, res, next) => {
  res.render("login", { layout: "./layout/auth_layout.ejs", title: "Login" });
};

const showForgetPassword = (revalidationResultq, res, next) => {
  res.render("forget_password", { layout: "./layout/auth_layout.ejs", title: "Forget Password" });
};

const showRegisterForm = (req, res, next) => {
  res.render("register", { layout: "./layout/auth_layout.ejs", title: "Register" });
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
    },);
  }
};

const logout = (req, res, next) => {
  req.logout();
  req.session.destroy((error) => {
    res.clearCookie("connect.sid");
    res.render("login", {
      layout: "./layout/auth_layout.ejs"
      , title: "Logout",
      
      success_message: [{ msg: "Logout successful" }],
    });
  });
};
const verifyEmail = (req, res, next) => {
  const token = req.query.id;
  if (token) {
    try {
      jwt.verify(
        token,
        process.env.CONFIRM_MAIL_JWT_SECRET,
        async (e, decode) => {
          if (e) {
            req.flash("error", "The link is mistake or changed");
            res.redirect("/register");
          } else {
            const idValueInToken = decode.id;
            const changeResult = await User.User.findByIdAndUpdate(
              idValueInToken,
              { verifyEmail: true }
            );
            if (changeResult) {
              req.flash("success_message", [{ msg: "Verify is done!" }]);
              res.redirect("/login");
            } else {
              req.flash("error", "Undefined User! Please register again");
              res.redirect("/login");
            }
          }
        }
      );
    } catch (err) {}
  } else {
    req.flash("error", "Token is missing or invalid");
    res.redirect("/login");
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

      if (_user && _user.verifyEmail == true) {
        req.flash("validation_errors", [{ msg: "this email is in use" }]);
        req.flash("name", req.body.name);
        req.flash("surname", req.body.surname);
        req.flash("email", req.body.email);
        res.redirect("/register");
      } else if ((_user && _user.verifyEmail == false) || _user == null) {
        const newUser = new User.User({
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 10),
        });

        await newUser.save();
        console.log("USER SUCCSESSFULLY SAVED!");

        // JWT PROCESSES

        const jwtInfo = {
          id: newUser.id,
          mail: newUser.email,
        };

        const jwtToken = jwt.sign(
          jwtInfo,
          process.env.CONFIRM_MAIL_JWT_SECRET,
          { expiresIn: "1d" }
        );

        // MAİL PROCESSES

        const url = process.env.WEBSITE_URL + "verify?id=" + jwtToken;

        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_PASSWORD,
          },
        });

        await transporter.sendMail(
          {
            from: "Nodejs Project < info@lambda.com",
            to: newUser.email,
            subject: "Please verify your email",
            text: `Hello! Welcome to the club.
                   You are trying to register as ${newUser.name} one last step left, click link --> ${url}`,
          },
          (error, info) => {
            if (error) {
              console.log("have mistake : " + error);
            }
            console.log("MAİL SEND");
            console.log(info);
            transporter.close();
          }
        );

        req.flash("success_message", [{ msg: "Please check your email" }]);
        res.redirect("/login");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const resetPassword = async (req, res, next) => {
  const errorsArray = validationResult(req);
  if (!errorsArray.isEmpty()) {
    req.flash("validation_errors", errorsArray.array());
    res.redirect("/forget-password");
  } else {
    try {
      const _user = await User.User.findOne({
        email: req.body.email,
        verifyEmail: true,
      });

      if (_user) {
        // burası email i onaylı kullanıcının sifresinin degisecegi yer
        // JWT PROCESSES

        const jwtInfo = {
          id: _user.id,
          email: _user.email,
        };
        const secret =
          process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.password;
        const jwtToken = jwt.sign(jwtInfo, secret, { expiresIn: "1d" });

        // MAİL PROCESSES

        const url =
          process.env.WEBSITE_URL +
          "reset-password/" +
          _user.id +
          "/" +
          jwtToken;

        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_PASSWORD,
          },
        });

        await transporter.sendMail(
          {
            from: "Nodejs Project < info@lambda.com",
            to: _user.email,
            subject: "Please update your password",
            text: `Hello! Maybe you forgot your password.
                No problem, ${_user.name}. Just click link --> ${url}`,
          },
          (error, info) => {
            if (error) {
              console.log("have mistake : " + error);
            }
            console.log("MAİL SEND");
            console.log(info);
            transporter.close();
          }
        );

        req.flash("success_message", [{ msg: "Please check your email" }]);
        res.redirect("/login");
      } else {
        req.flash("validation_errors", [
          { msg: "this email is inactive or the user is passive" },
        ]);
        req.flash("email", req.body.email);
        res.redirect("/forget-password");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const resetPasswordForm = async (req, res, next) => {
  console.log("reset password form");

  const queryId = req.params.id;
  const queryToken = req.params.token;

  if (queryId && queryToken) {
    const _user = await User.User.findOne({ _id: queryId });

    const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.password;

    try {
      jwt.verify(queryToken, secret, async (e, decoded) => {
        if (e) {
          req.flash("validation_errors", [
            { msg: "The link is incorrect or expired" },
          ]);
          res.redirect("/forget-password");
        } else {
          res.render("new_password", {
            id: queryId,
            token: queryToken,
            layout: "./layout/auth_layout.ejs",
          }); 
        }
      });
    } catch (err) {
      console.log("have mistake : " + err);
    }
  } else {
    req.flash("error", "The link is invalid. Link don't have token!");
    res.redirect("/forget-password");
  }
};

const saveNewPassword = async (req, res, next) => {
  const errorsArray = validationResult(req);
  if (!errorsArray.isEmpty()) {
    console.log(("hatalar calisti"));
    req.flash("validation_errors", errorsArray.array());
    req.flash("password", req.body.passwor*d);
    req.flash("repassword", req.body.repassword);
    res.redirect("/reset-password/" + req.body.id + "/" + req.body.token)
  } else {
    const _user = await User.User.findOne({ _id: req.body.id, verifyEmail : true });
    
    const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.password;
    
    try {
      jwt.verify(req.body.token, secret, async (e, decoded) => {
        if (e) {
          req.flash("validation_errors", [
            { msg: "The link is incorrect or expired" },
          ]);
          res.redirect("/forget-password");
        } else {
          const newPass = await bcrypt.hash(req.body.password, 10);
          const sonuc = await User.User.findOneAndUpdate(req.body.id, {
            password: newPass,
          });
          if (sonuc) {
            req.flash("success_message", [
              { msg: "Your password succsessfully updated" },
            ]);
            res.redirect("/login");
          } else {
                req.flash("error", "Password not updated, new pass have mistake");
                res.redirect(`/reset-password/${req.body.id}/${req.body.token}`);
              }

          res.render("new_password", {
            id: linkId,
            token: linkToken,
             title: "New Password",
            layout: "./layout/auth_layout.ejs",
          }); 
        }
      });
    } catch (err) {
      console.log("have mistake : " + err);
    }
    
    
  }
};

module.exports = {
  showForgetPassword,
  showLoginForm,
  showRegisterForm,
  register,
  login,
  logout,
  resetPassword,
  verifyEmail,
  resetPasswordForm,
  saveNewPassword,
};
