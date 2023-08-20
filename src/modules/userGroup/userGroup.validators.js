const { param, body } = require('express-validator')

const validators = {
  validateUserGroup: [
    //body('group_name').exists({ checkNull: true }).withMessage('Group name is required')
    body('group_name').notEmpty().withMessage('User group name is required')
  ]
}

module.exports = validators