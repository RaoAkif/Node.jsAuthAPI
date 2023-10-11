const router = require("express").Router();
const authController = require("../controllers/authController")

// Register
router.route("/register")
  .post(authController.registerUser)

// Login
router.route("/login")
  .post(authController.loginUser)

module.exports = router;
