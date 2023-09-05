const express = require('express')
const router = express.Router();
const menu = require('./menuWeb.controller')
const auth = require('../../../../middleware/jwt.middleware')
const menuWebValidators = require('./menuWeb.validators')

router.get('/list_menu', auth.authenticateToken, menu.getMenu)
router.post('/insert_menu', auth.authenticateToken, menuWebValidators.insertMenu, menu.insertMenu)

module.exports = router;