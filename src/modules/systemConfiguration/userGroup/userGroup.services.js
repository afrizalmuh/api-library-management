const getUserGroup = async (params, trx) => {
  const result = await trx.raw(`
    SELECT
      group_name_var
    FROM
      core.t_mtr_user_group
    WHERE
      id_seq = '${params}'
  `)
  return result
}

const duplicatedUserGroup = async (payload, trx) => {
  let result = await trx.raw(`
    SELECT 
      group_name_var
    FROM
      core.t_mtr_user_group
    WHERE
      group_name_var = '${payload.group_name}'
  `);
  return result
}

const insertUserGroup = async (payload, trx) => {
  const result = await trx.raw(`
    INSERT INTO
      core.t_mtr_user_group(
        group_name_var,
        created_by_var
      )
    VALUES (
      '${payload.group_name}',
      '${payload.created_by}'
    )
    RETURNING group_name_var, status_int, created_by_var
  `)
  return result
}

const deleteUserGroup = async (params, trx) => {
  const result = await trx.raw(`
    DELETE FROM
      core.t_mtr_user_group
    WHERE
      id_seq = '${params}'
    RETURNING group_name_var  
  `)
  return result
}

const getAllUserGroup = async (trx) => {
  const result = await trx.raw(`
  select user_group_id_int , tmug.group_name_var, username_var  from core.t_mtr_user as tmu
  left join core.t_mtr_user_group as tmug on tmug.id_seq = tmu.user_group_id_int 
  `)
  return result.rows
}

module.exports = {
  getUserGroup,
  duplicatedUserGroup,
  insertUserGroup,
  deleteUserGroup,
  getAllUserGroup
}