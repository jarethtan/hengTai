const express = require('express')
const router = express.Router()

const passport = require('passport')

const userController = require('../controller/user')

const handleAsync = require('../utility/handleAsync')
const {validateUser} = require('../middleware')

router.get('/register', userController.userRegisterForm)

router.post('/register', validateUser, handleAsync(userController.registerUser))

router.get('/login', userController.userLoginForm)

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid username or password.'}), validateUser, handleAsync(userController.loginUser))

router.get('/logout', userController.logoutUser)

module.exports = router