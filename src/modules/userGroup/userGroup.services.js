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



module.exports = {
  getUserGroup,
  duplicatedUserGroup,
  insertUserGroup,
  deleteUserGroup
}