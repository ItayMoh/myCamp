const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync.js')
const passport = require('passport')
const user = require("../controllers/users.js")

const {alreadyLoggedIn} = require('../middleware.js')

router.route('/register')
.get(alreadyLoggedIn, user.registerPage)
.post(alreadyLoggedIn, catchAsync(user.register));

router.route('/login')
.get(alreadyLoggedIn, user.loginPage)
.post(alreadyLoggedIn, passport.authenticate('local', {failureFlash: 'Invalid username or password.', failureRedirect: '/login'}), user.flashing)

router.get('/logout', user.logout) 

module.exports = router;

