const db = require('../../../config/database')
const services = require('./userGroup.services')
const response = require('../../../response')
const http = require('../../../response/http_code')
const { validationResult } = require('express-validator')

exports.insertUserGroup = async (req, res) => {
  try {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      return response.error(res, http.BAD_REQUEST, err.errors[0].msg)
    }

    let { group_name, created_by } = req.body

    const payload = {
      group_name: group_name,
      created_by: created_by
    }

    await db.transaction(async trx => {
      let checkDuplicatedUserGroup = await services.duplicatedUserGroup(payload, trx)

      // duplicate user group
      if (checkDuplicatedUserGroup.rowCount > 0) return response.success(res, http.CONFLICT, 'User group already registered')

      // insert user group
      const insertUser = await services.insertUserGroup(payload, trx)

      if (!insertUser) {
        await trx.rollback()
        return response.success(res, http.CONFLICT, 'Failed insert data')
      }

      return response.success(res, http.CREATED, 'Success', insertUser.rows[0])
    })
  } catch (e) {
    return response.error(res, e.error)
  }
}

exports.deleteUserGroup = async (req, res) => {
  try {
    //get user gorup
    let checkUserGroup = await services.getUserGroup(req.params.code, db)
    if (checkUserGroup.rowCount <= 0) return response.success(res, http.NOT_FOUND, 'User group not found')
    //delete user group
    let deleteUser = await services.deleteUserGroup(req.params.code, db)
    return response.success(res, http.SUCCESS, 'success', deleteUser.rows[0])
  } catch (e) {
    return response.error(res, e.error)
  }
}

exports.getUserGroup = async (req, res) => {
  let countUserGroup = await services.countingUser(db)
  let datas = [
    {
      "user_group_id": "14",
      "group_name": "DEVELOPMENT",
      "usernames": "test,rifqi",
      "number": 1
    }, {
      "user_group_id": "14",
      "group_name": "DEVELOPMENT",
      "usernames": "test,rifqi",
      "number": 1
    }
  ]
  let payload = {
    total: parseInt(countUserGroup),
    rows: datas
  }

  return response.success(res, http.SUCCESS, 'success', payload)

}