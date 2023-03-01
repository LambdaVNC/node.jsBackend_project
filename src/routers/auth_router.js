const router = require("express").Router();
const authController = require("../controllers/auth_controller");
const validatorMiddleware = require("../middlewares/validation_middleware");
const authMiddleware = require("../middlewares/auth_middleware");
const passport = require("passport");

router.get("/login", authMiddleware.loggedOut, authController.showLoginForm);

router.get(
  "/register",
  authMiddleware.loggedOut,
  authController.showRegisterForm
);

router.post(
  "/register",authMiddleware.loggedOut , 
  validatorMiddleware.validateNewUser(),
  authController.register
);

router.post(
  "/login",
  authMiddleware.loggedOut,
  validatorMiddleware.validateLogin(),
  passport.authenticate("local", {
    successRedirect: "/management",
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: true,
  }),
  authController.login
);

router.get("/logout",authMiddleware.loggedIn , authController.logout);

router.get(
  "/forget-password",
  authMiddleware.loggedOut,
  authController.showForgetPassword
);

router.post("/forget-password", authMiddleware.loggedOut ,  authController.resetPassword);

module.exports = router;
