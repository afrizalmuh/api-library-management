const express = require('express')
const router = express.Router();
const menu = require('./menuWeb.controller')
const auth = require('../../../middleware/jwt.middleware')

router.get('/list_menu', auth.authenticateToken, menu.getMenu)

module.exports = router;