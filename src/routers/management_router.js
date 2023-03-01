const router = require("express").Router();
const managementController = require("../controllers/management_controller.js");
const authMiddleware = require("../middlewares/auth_middleware")

router.get("/",authMiddleware.loggedIn,managementController.managementPanel)

module.exports = router;