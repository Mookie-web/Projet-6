const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const controlEmail = require("../middleware/controlEmail")
const controlPassword = require("../middleware/controlPassword")

// route for login and signup : user.
router.post("/signup", controlPassword, controlEmail, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;