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
  "/register",
  authMiddleware.loggedOut,
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

router.get("/logout", authMiddleware.loggedIn, authController.logout);

router.get("/verify", authController.verifyEmail);

router.get(
  "/forget-password",
  authMiddleware.loggedOut,
  authController.showForgetPassword
);

router.post("/forget-password",authMiddleware.loggedOut,validatorMiddleware.validateEmail(),authController.resetPassword
);

router.get('/reset-password/:id/:token',authController.resetPasswordForm)
router.get('/reset-password',authController.resetPasswordForm)
router.post('/reset-password',validatorMiddleware.validateNewPassword(),authController.saveNewPassword)

module.exports = router;
