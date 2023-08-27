const listMenuWeb = async (trx) => {
  let result = await trx.select([
    "id_seq",
    "parent_id_int",
    "name_var",
    "icon_var",
    "slug_var",
    "order_int",
    "status_int"
  ])
    .from("core.t_mtr_menu_web")
  return result
}


module.exports = {
  listMenuWeb
}