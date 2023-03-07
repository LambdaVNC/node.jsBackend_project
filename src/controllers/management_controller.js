const User = require("../model/user_model");

const managementPanel = (req, res, next) => {
  res.render("index", {user: req.user, layout: "./layout/management_layout.ejs" , title: "Management Panel"});
};

const showProfileForm = (req, res, next) => {
  console.log(req.user);
  res.render("profile", {
    user: req.user,
    layout: "./layout/management_layout.ejs"
    , title: "Profile",
  });
};

const updateProfile = async (req, res, next) => {
  const updatedInfo = {
    name: req.body.name,
    surname: req.body.surname,
  };
  try {
    if (req.file) {
      updatedInfo.avatar = req.file.filename;
    }
    console.log("güncellenecek olan bilgiler");
    console.log(updatedInfo);

    const _user = await User.User.findOneAndUpdate(req.user.id, updatedInfo);

    res.redirect("/management/profile",{ title: "Login"});
  } catch (err) {
    console.log("MİSTAKE" + err);
  }
};

module.exports = {
  managementPanel,
  showProfileForm,
  updateProfile,
};
