const express = require('express')
const router = express.Router()
const authController = require('./auth.controller')
const auth = require('../../../middleware/jwt.middleware')

router.post('/login', authController.loginUser);
router.post('/logout', auth.authenticateToken, authController.logoutUser)
router.post('/refresh-token', authController.refreshToken)

module.exports = router