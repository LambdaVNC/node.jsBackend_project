const router = require("express").Router();
const managementController = require("../controllers/management_controller.js");
const authMiddleware = require("../middlewares/auth_middleware")
const multerConfig = require("../config/multer_config")

router.get("/",authMiddleware.loggedIn,managementController.managementPanel)
router.get("/profile",authMiddleware.loggedIn,managementController.showProfileForm)

router.post("/update-profile",authMiddleware.loggedIn,multerConfig.single("avatar"),managementController.updateProfile)


module.exports = router;