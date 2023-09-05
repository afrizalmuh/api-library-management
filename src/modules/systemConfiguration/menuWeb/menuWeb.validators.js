const { param, body } = require('express-validator')

const validators = {
  insertMenu: [
    body('name_menu').notEmpty().withMessage("name_menu is required").isAlpha().withMessage('name_menu must be vokal'),
    body('order').notEmpty().withMessage("order is required").isNumeric().withMessage('order any allow integer'),
    body('icon').notEmpty().withMessage('icon is required'),
    body('parent_id').notEmpty().withMessage('parent_id is required').isNumeric().withMessage('parent_id any allow integer'),
    body('created_by').notEmpty().withMessage('created_by is required')
  ]
}

module.exports = validators