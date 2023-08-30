const response = {
  success: (res, _code, _message, _data) => {
    res.status(200).json({
      code: _code,
      message: _message,
      data: _data
    })
  },
  error: (res, _code, _message, err) => {
    return res.status(200).json({
      code: _code,
      message: _message,
      error: err,
    })
  }
}

module.exports = response