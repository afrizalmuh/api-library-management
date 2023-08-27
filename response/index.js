const response = {
  success: (res, _code, _message, _data) => {
    res.status(200).json({
      code: _code,
      message: _message,
      data: _data
    })
  },
  error: (res, _code, _message) => {
    return res.status(200).json({
      code: _code,
      message: _message,
      data: {}
    })
  }
}

module.exports = response