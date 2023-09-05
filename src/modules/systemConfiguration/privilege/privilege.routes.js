const express = require('express')
const router = express.Router()
const privilegeController = require('./privilege.controller')

router.post('/privilege', privilegeController.privilege)

module.exports = router