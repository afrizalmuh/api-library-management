const db = require('../../../../config/database')
const services = require('./user.services')
const response = require('../../../../response')
const http = require('../../../../response/http_code')
const bcrypt = require("bcrypt");
const { validationResult, check } = require('express-validator')


exports.insertUser = async (req, res) => {
  try {
    const {
      fullname,
      username,
      password,
      email,
      user_group
    } = req.body;

    const payload = {
      fullname: fullname,
      username: username,
      password: password,
      email: email,
      user_group: user_group
    }

    await db.transaction(async trx => {

      const err = validationResult(req)

      if (!err.isEmpty()) {
        return response.error(res, http.CONFLICT, err.errors[0].msg)
      }

      let checkDuplicatedUser = await services.duplicatedUser(payload, trx)

      if (checkDuplicatedUser.rowCount > 0) return response.error(res, http.BAD_REQUEST, `Username or user group can't be registered`)

      let dataUser = {}

      //encrypt password
      if (payload.password !== null || payload.password !== "") {
        const saltRound = 10;
        let salt = bcrypt.genSaltSync(saltRound);
        let passwordHash = bcrypt.hashSync(payload.password, salt)
        dataUser = { ...payload, password: passwordHash }
      }

      //insert user
      let insertUser = await services.insertUser(dataUser, trx)

      if (!insertUser) {
        await trx.rollback();
        return response.error(res, http.CONFLICT, 'Failed insert data')
      }
      return response.success(res, http.CREATED, 'Sucess', insertUser.rows[0])
    })

  } catch (e) {
    return response.error(res, http.INTERNAL_SERVER_ERROR, e.message)
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const getUser = await services.getUser(req.params.code, db);

    if (getUser.rowCount <= 0) return response.error(res, http.NOT_FOUND, 'Username not found')

    let deletedUser = await services.deleteUser(req.params.code, db)

    return response.success(res, http.SUCCESS, 'sucess', deletedUser.rows[0])
  } catch (e) {
    return response.error(res, http.INTERNAL_SERVER_ERROR, e.error)
  }
}

exports.resetPassword = async (req, res) => {
  try {

    let {
      body
    } = req

    const payload = {
      user_name: body.username
    }


    await db.transaction(async trx => {
      const errValidation = validationResult(req)

      if (!errValidation.isEmpty()) return response.error(res, http.CONFLICT, errValidation.errors[0].msg)

      const getUser = await services.getUser(req.params.code, db)

      if (getUser.rowCount <= 0) return response.error(res, http.NOT_FOUND, 'User not found')

      const comparePass = await bcrypt.compare(body.old_password, getUser.rows[0].password_var)

      if (comparePass) {

        const saltRound = 10;
        let salt = bcrypt.genSaltSync(saltRound)
        let passwordHash = bcrypt.hashSync(body.new_password, salt)
        //changePassword = { ...payload, new_password: passwordHash }
        body = {
          ...body,
          new_password: passwordHash
        }
        // let result = await services.resetPassword(req.params.code, changePassword, trx)
        let result = await services.resetPassword(req.params.code, body, payload, trx)
        return response.success(res, http.SUCCESS, 'success', result.rows[0])

      } else {
        return response.error(res, http.NOT_FOUND, 'Password does not match')
      }

    })
  } catch (e) {
    console.log(e)
    return response.error(res, http.INTERNAL_SERVER_ERROR, e.error)
  }
}