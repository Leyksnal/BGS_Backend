const express = require('express')
const router = express.Router()
const { createUser, verifyadmin, signInUser, getUsers } = require("../controller/userController")


router.route("/").get(getUsers);
router.route('/register').post(createUser)
router.route('/signin').post(signInUser)
router.route("/token/:id/:token").get(verifyadmin)

module.exports = router