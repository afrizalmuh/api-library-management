const { param, body } = require('express-validator')

const validators = {
  insertMenu: [
    body('name_menu').notEmpty().withMessage("name menu is required"),
    body('order').notEmpty().withMessage("order is required").isNumeric().withMessage('order any allow integer')
  ]
}

module.exports = validators