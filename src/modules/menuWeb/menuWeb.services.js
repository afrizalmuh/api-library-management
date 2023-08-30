const listMenuWeb = async (trx) => {
  let result = await trx.select([
    "id_seq as parent_id",
    "parent_id_int as children_id",
    "name_var",
    "icon_var",
    "slug_var",
    "order_int",
    "status_int",
    "created_on_dtm"
  ])
    .from("core.t_mtr_menu_web")
  return result
}

const insertMenuWeb = async (data, trx) => {
  let result = await trx("core.t_mtr_menu_web")
    .returning(['name_var', 'slug_var', 'created_by_var', 'created_on_dtm'])
    .insert({
      name_var: data.name_menu,
      icon_var: data.icon,
      slug_var: data.slug,
      order_int: data.order,
      parent_id_int: data.parent_id,
      created_by_var: data.created_by
    })
  return result[0]
}

const checkOrder = async (data, trx) => {
  let result = await trx('core.t_mtr_menu_web')
    .where("parent_id_int", data.parent_id)
    .where("order_int", data.order)
    .first()
  return result
}


module.exports = {
  listMenuWeb,
  insertMenuWeb,
  checkOrder
}