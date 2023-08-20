const { param } = require("./user.routes")

const getUser = async (params, trx) => {
  const result = await trx.raw(`
    SELECT
      username_var, password_var
    FROM
      core.t_mtr_user
    WHERE 
      id_seq = '${params}'
  `)
  return result
}

const duplicatedUser = async (payload, trx) => {
  const result = await trx.raw(`
    SELECT 
      username_var,
      email_var
    FROM
      core.t_mtr_user
    WHERE
      username_var = '${payload.username}' 
    OR
      email_var = '${payload.email}'
  `)
  return result
}

const insertUser = async (payload, trx) => {
  const result = await trx.raw(`
    INSERT INTO 
      core.t_mtr_user (
        user_group_id_int,
        fullname_var,
        username_var,
        password_var,
        email_var,
        created_by_var
      )
    VALUES(
      ${payload.user_group},
      '${payload.fullname}',
      '${payload.username}',
      '${payload.password}',
      '${payload.email}',
      '-'
    )
    RETURNING fullname_var, username_var, email_var, created_by_var
  `)
  return result
}

const deleteUser = async (params, trx) => {
  const result = await trx.raw(`
    DELETE FROM
      core.t_mtr_user
    WHERE
      id_seq = '${params}'
    RETURNING username_var
  `)
  return result
}

const resetPassword = async (params, data, payload, trx) => {
  const query =
    `UPDATE core.t_mtr_user 
    SET password_var = '${data.new_password}',
    updated_by_var = '${payload.user_name}',
    updated_on_dtm = NOW() 
    WHERE id_seq = '${params}' 
    RETURNING fullname_var, username_var, created_by_var, created_on_dtm, updated_by_var, updated_on_dtm`
  const result = await trx.raw(query)
  return result
}

module.exports = {
  getUser,
  duplicatedUser,
  insertUser,
  deleteUser,
  resetPassword
}