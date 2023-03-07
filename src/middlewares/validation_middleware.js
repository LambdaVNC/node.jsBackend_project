const { body } = require("express-validator");

const validateNewUser = () => {
  return [
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("name must be min 3 characters")
      .isLength({ max: 15 })
      .withMessage("name must be max 15 characters"),
    body("surname")
      .trim()
      .isLength({ min: 3 })
      .withMessage("surname must be min 3 characters")
      .isLength({ max: 15 })
      .withMessage("surname must be max 15 characters"),
    body("email").trim().isEmail().withMessage("Enter a valid email!"),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("password must be min 3 characters")
      .isLength({ max: 15 })
      .withMessage("password must be max 15 characters"),
    body("repassword")
      .trim()
      .custom((value , { req }) => {
        if (value !== req.body.password) {
          throw new Error("Repassword not same with password!");
        }
        return true;
      }),
  ];
};

const validateLogin = () => {
  return [
    body("email").trim().isEmail().withMessage("Enter a valid email!"),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("password must be min 3 characters")
      .isLength({ max: 15 })
      .withMessage("password must be max 15 characters"),
  ];
};

const validateNewPassword = () => {
  return [
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Your new Password must be min 3 characters")
      .isLength({ max: 30 })
      .withMessage("Unbelievebal! Your new password is must be max 30 characters"),
    body("repassword")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Your new password is must be min 3 characters")
      .isLength({ max: 30 })
      .withMessage(
        "Unbelievebal!! Your new password is must be max 30 characters"
      ).custom((value , { req }) => {
        if(value !== req.body.password){
          throw new Error("Repassword not same with password!")
        }
        return true;
      })
  ];
};

const validateEmail = () => {
  return [body("email").trim().isEmail().withMessage("Enter a valid email!")];
};

module.exports = {
  validateNewUser,
  validateLogin,
  validateEmail,
  validateNewPassword
};
