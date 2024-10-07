const express = require("express");
const user_controller = require("../controllers/user.controller");
const router = express.Router();
const { authUser } = require("../middleware/auth");



router.post("/register", user_controller.register);
router.post("/login", user_controller.login);




module.exports = router;
