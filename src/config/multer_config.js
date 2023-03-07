const multer = require("multer");
const path = require("path");

const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/avatars"));
  },
  filename: (req, file, cb) => {
    console.log(req.user.email);

    cb(
      null,
      req.user.email +
        "_" +
        path.extname(file.originalname)
    );
  },
});
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    console.log("****** FİLE UPLOAD İS DONE ******")
    cb(null, true);
  } else {
    console.log("****** FİLE UPLOAD İS UNSUCCSESSFULLY *****")
    cb(null, false);
  }
};

const uploadImage = multer({storage: myStorage , fileFilter : imageFileFilter})

module.exports = uploadImage;
