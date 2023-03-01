const loggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", ["Please log in"]);
    res.redirect("/login");
  }
};

const loggedOut = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/management");
  }
};

module.exports = {
  loggedIn,
  loggedOut,
};
    