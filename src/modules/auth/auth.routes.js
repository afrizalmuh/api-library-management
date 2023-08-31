const express = require('express')
const router = express.Router()
const authController = require('./auth.controller')
const auth = require('../../../middleware/jwt.middleware')
const authValidator = require('./auth.validators')

router.post('/login', authValidator.login, authController.loginUser);
router.post('/logout', auth.authenticateToken, authController.logoutUser)
router.post('/refresh-token', authController.refreshToken)

module.exports = router