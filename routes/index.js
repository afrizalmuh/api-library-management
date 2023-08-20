const express = require('express');
const router = express.Router();

const userGroupRouter = require('../src/modules/userGroup/userGroup.routes')
const userRouter = require('../src/modules/user/user.routes')
const authRouter = require('../src/modules/auth/auth.routes')

router.use('/user', userRouter)
router.use('/user_group', userGroupRouter)
router.use('/auth', authRouter)

router.use('/', function (req, res, next) {
  res.status(404).json({ message: 'Welcome to library management' })
})

module.exports = router