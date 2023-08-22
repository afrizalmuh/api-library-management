const express = require('express')
const router = express.Router()
const userGroupController = require('./userGroup.controller')
const userGroupValidator = require('./userGroup.validators')
const auth = require('../../../middleware/jwt.middleware')

// user group
router.post('/', auth.authenticateToken, userGroupValidator.validateUserGroup, userGroupController.insertUserGroup)
router.delete('/:code', auth.authenticateToken, userGroupController.deleteUserGroup)

module.exports = router