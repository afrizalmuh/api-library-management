const express = require('express')
const router = express.Router()
const userController = require('./user.controller')
const userValidator = require('./user.validators')
const auth = require('../../../middleware/jwt.middleware')
//user
router.post('/', auth.authenticateToken, userValidator.createUser, userController.insertUser)
router.delete('/:code', auth.authenticateToken, userController.deleteUser)
router.put('/:code', auth.authenticateToken, userValidator.resetPassword, userController.resetPassword)

module.exports = router