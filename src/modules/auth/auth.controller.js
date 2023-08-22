const db = require('../../../config/database')
const services = require('./auth.services')
const response = require('../../../response')
const http = require('../../../response/http_code')
const bcrypt = require("bcrypt");
const jwt = require('../../../middleware/jwt.middleware')
const helper = require('../../../helpers/helper')
const { validationResult, check } = require('express-validator')


exports.loginUser = async (req, res) => {
  try {
    let {
      username,
      password
    } = req.body

    let refreshToken = ""
    let accessToken = ""

    let checkUser = await services.checkUser(username, db)
    if (!checkUser) {
      return response.error(res, http.FORBIDDEN, 'Invalid username or password')
    }

    let checkPassword = await bcrypt.compare(password, checkUser.password_var)
    if (!checkPassword) {
      return response.error(res, http.FORBIDDEN, 'Invalid password')
    }

    // if (checkUser.is_login_int === 1) return response.error(res, http.FORBIDDEN, 'This account already login')

    // let updateLogin = await services.updateLogin(checkUser.id_seq, db)

    let checkUserLogin = await services.checkUserLogin(checkUser.id_seq, db);
    if (!checkUserLogin) {

      //generate access token
      accessToken = jwt.generateAccessToken({
        code: helper.encryptTextSecret(checkUser.id_seq),
        username: helper.encryptTextSecret(checkUser.username_var),
        group: helper.encryptTextSecret(checkUser.user_group_id_int),
      })

      //generate refresh token
      refreshToken = jwt.generateRefreshToken({
        code: helper.encryptTextSecret(checkUser.id_seq)
      })

      //insert refresh token
      await services.insertRefreshToken(checkUser.id_seq, refreshToken, db)

    } else {
      //generate access token
      accessToken = jwt.generateAccessToken({
        code: helper.encryptTextSecret(checkUser.id_seq),
        username: helper.encryptTextSecret(checkUser.username_var),
        group: helper.encryptTextSecret(checkUser.user_group_id_int),
      })

      refreshToken = checkUserLogin.refresh_token
    }

    let data = {
      username: checkUser.username_var,
      email: checkUser.email_var,
      group_name: checkUser.group_name_var,
      access_token: accessToken,
      refresh_token: refreshToken
    }

    return response.success(res, http.SUCCESS, 'sucess', data)
  }
  catch (e) {
    return response.error(res, http.INTERNAL_SERVER_ERROR, "ERROR BOS")
  }
}

exports.logoutUser = async (req, res) => {
  try {
    const code = req.body.code
    const deleteRefreshToken = await services.deleteRefreshToken(code, db)
    if (deleteRefreshToken < 1) {
      return response.error(res, http.UNAUTHORIZED, 'Invalid session')
    }
    return response.success(res, http.SUCCESS, 'sucess')
  }
  catch (e) {
    return response.error(res, http.INTERNAL_SERVER_ERROR, "ERROR BOS")
  }
}

exports.refreshToken = async (req, res) => {
  try {
    let code = req.code
    let { refresh_token } = req.body
    let checkRefreshToken = await services.checkRefreshToken(refresh_token, code, db)

    if (!checkRefreshToken)
      return response.error(res, http.UNAUTHORIZED, 'Refresh token is invalid')

    let refreshToken;
    let accessToken;

    let checkDataUserLogin = await services.checkUserLogin(code, db)
    console.log("checkDataUserLogin =>", checkDataUserLogin)
    if (!checkDataUserLogin) {
      return response.error(res, http.UNAUTHORIZED, 'Refresh token is invalid')
    }

    //generate new access token
    accessToken = jwt.generateAccessToken({
      code: helper.encryptTextSecret(checkDataUserLogin.id_seq),
      username: helper.encryptTextSecret(checkDataUserLogin.username_var),
      group: helper.encryptTextSecret(checkDataUserLogin.user_group_id_int)
    })

    //generate new refresh token
    refreshToken = jwt.generateRefreshToken({
      code: helper.encryptTextSecret(checkDataUserLogin.user_code)
    })

    //update new refresh token in database
    await services.updateRefreshToken(code, refresh_token, refreshToken, db)
    data = {
      access_token: accessToken,
      refresh_token: refreshToken
    }
    return response.success(res, http.SUCCESS, 'sucess', data)

  }
  catch (e) {
    return response.error(res, http.INTERNAL_SERVER_ERROR, "ERROR BOS")
  }
}