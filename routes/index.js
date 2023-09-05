const express = require('express');
const router = express.Router();

const authRouter = require('../src/modules/auth/auth.routes')
const userGroupRouter = require('../src/modules/systemConfiguration/userGroup/userGroup.routes')
const userRouter = require('../src/modules/systemConfiguration/user/user.routes')
const menuWebRouter = require('../src/modules/systemConfiguration/menuWeb/menuWeb.routes')
const privilegeRouter = require('../src/modules/systemConfiguration/privilege/privilege.routes')

router.use('/user', userRouter)
router.use('/user_group', userGroupRouter)
router.use('/auth', authRouter)
router.use('/menu_web', menuWebRouter)
router.use('/privilege', privilegeRouter)

router.use('/', function (req, res, next) {
  res.status(404).json({ message: 'Welcome to library management' })
})

module.exports = router