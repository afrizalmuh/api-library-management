const { param, body } = require('express-validator')

const validator = {
  login: [
    body('username').notEmpty().withMessage("username is required"),
    body('password').notEmpty().withMessage("password is required"),
  ]
}

module.exports = validator