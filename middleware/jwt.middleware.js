const jwt = require('jsonwebtoken')
const response = require('../response')
const http = require('../response/http_code')
const helper = require('../helpers/helper')

const generateAccessToken = (req) => {
  let expiresIn = process.env.JWT_EXPIRATION ? process.env.JWT_EXPIRATION : '1h'

  let signOptions = {
    issuer: 'AFRIZAL',
    expiresIn: expiresIn,
  }
  return jwt.sign(req, process.env.TOKEN_SECRET, signOptions)
}

const generateRefreshToken = (req) => {
  let expiresIn = process.env.JWT_EXPIRATION ? process.env.JWT_EXPIRATION : '7d'

  let signOptions = {
    issuer: 'AFRIZAL',
    expiresIn: expiresIn,
  }
  return jwt.sign(req, process.env.REFRESH_TOKEN_SECRET, signOptions)
}

const authenticateToken = (req, res, next) => {
  let authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer')) {
    let token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      response.error(res, http.UNAUTHORIZED, 'Token is required')
    }

    let verifyOptions = {
      issuer: 'AFRIZAL',
    }

    jwt.verify(token, process.env.TOKEN_SECRET, verifyOptions, (err, data) => {
      if (err) {
        return response.error(res, http.FORBIDDEN, err.message)
      }

      req.code = helper.decryptTextSecret(data.code)
      req.username = helper.decryptTextSecret(data.username)
      req.group = helper.decryptTextSecret(data.group)

      next();
    })

  } else {
    response.error(res, http.UNAUTHORIZED, 'Header not found')
  }
}


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken
}