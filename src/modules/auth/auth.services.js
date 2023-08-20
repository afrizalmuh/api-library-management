const checkUser = async (username, trx) => {
  let result = await trx.select([
    "tmu.id_seq",
    "tmu.username_var",
    "tmu.password_var",
    "tmu.email_var",
    "tmu.user_group_id_int",
    "tmu.is_login_int",
    "tmug.group_name_var"
  ])
    .from("core.t_mtr_user as tmu")
    .leftJoin("core.t_mtr_user_group as tmug", function () {
      this.on('tmu.user_group_id_int', '=', "tmug.id_seq")
    })
    .where("tmu.username_var", username)
  return result[0]
}

const checkUserLogin = async (user_code, trx) => {
  let result = await trx.select([
    'tmu.id_seq',
    'tmu.user_group_id_int',
    'tmu.email_var',
    'tmft.user_code',
    'tmft.refresh_token'
  ])
    .from('core.t_mtr_refresh_token as tmft')
    .leftJoin('core.t_mtr_user as tmu', function () {
      this.on('tmu.id_seq', '=', 'tmft.user_code')
    })
    .where('tmft.user_code', user_code)
  return result[0]
}

const insertRefreshToken = async (code, refreshToken, trx) => {
  let result = await trx('core.t_mtr_refresh_token')
    .insert({
      user_code: code,
      refresh_token: refreshToken
    })
  return result
}

const deleteRefreshToken = async (code, trx) => {
  let result = await trx('core.t_mtr_refresh_token')
    .where({ user_code: code })
    .delete()
  return result
}

module.exports = {
  checkUser,
  checkUserLogin,
  insertRefreshToken,
  deleteRefreshToken,
}