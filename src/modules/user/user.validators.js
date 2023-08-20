const { param, body } = require('express-validator')

const validators = {
  createUser: [
    body('fullname').notEmpty().withMessage('fullname is required').isLength({ max: 50 }).withMessage('fullname is out of length'),
    body('user_group').notEmpty().withMessage('user group is required'),
    body('username').notEmpty().withMessage('username is required').isLength({ max: 50, min: 3 }).withMessage('length out of range'),
    body('password').notEmpty().withMessage('password is required'),
    body('email').notEmpty().withMessage('email is required')
  ],
  resetPassword: [
    body('new_password').notEmpty().withMessage('reset password is required')
  ]
}

module.exports = validators