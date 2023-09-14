const privilege = async (user_group_id, trx) => {
  let result = await trx.raw(`
    WITH submenus AS (
      -- CTE untuk mendapatkan menu utama
      SELECT
        cc.id_seq,
        parent_id_int,
        cc.name_var,
        icon_var,
        slug_var,
        order_int
      FROM
        core.t_mtr_privilege aa
        JOIN core.t_mtr_user_group bb ON bb.id_seq = aa.user_group_id_int AND bb.status_int = 1 AND bb.id_seq = ${user_group_id}
        JOIN core.t_mtr_menu_web cc ON cc.id_seq = aa.menu_id_int AND cc.status_int = 1
        JOIN core.t_mtr_menu_detail dd ON dd.id_seq = aa.menu_detail_id_int AND dd.status_int = 1
        JOIN core.t_mtr_menu_action ee ON ee.id_seq = dd.menu_action_id_int AND ee.status_int = 1 AND LOWER(ee.action_var) = 'view'
      WHERE
        aa.status_int = 1 AND slug_var = '/#'
    ),
    submenu_children AS (
      -- CTE untuk mendapatkan menu anak
      SELECT
        cc.id_seq AS child_id_seq,
        parent_id_int AS child_parent,
        cc.name_var AS child_name,
        icon_var AS child_icon,
        slug_var AS child_slug,
        order_int
      FROM
        core.t_mtr_privilege aa
        JOIN core.t_mtr_user_group bb ON bb.id_seq = aa.user_group_id_int AND bb.status_int = 1 AND bb.id_seq = 1
        JOIN core.t_mtr_menu_web cc ON cc.id_seq = aa.menu_id_int AND cc.status_int = 1
        JOIN core.t_mtr_menu_detail dd ON dd.id_seq = aa.menu_detail_id_int AND dd.status_int = 1
        JOIN core.t_mtr_menu_action ee ON ee.id_seq = dd.menu_action_id_int AND ee.status_int = 1 AND LOWER(ee.action_var) = 'view'
      WHERE
        aa.status_int = 1
    ),
    sub_submenu_children AS (
      -- CTE untuk mendapatkan menu anak
      SELECT
        cc.id_seq AS child_id_seq,
        parent_id_int AS child_parent,
        cc.name_var AS child_name,
        icon_var AS child_icon,
        slug_var AS child_slug,
        order_int
      FROM
        core.t_mtr_privilege aa
        JOIN core.t_mtr_user_group bb ON bb.id_seq = aa.user_group_id_int AND bb.status_int = 1 AND bb.id_seq = 1
        JOIN core.t_mtr_menu_web cc ON cc.id_seq = aa.menu_id_int AND cc.status_int = 1
        JOIN core.t_mtr_menu_detail dd ON dd.id_seq = aa.menu_detail_id_int AND dd.status_int = 1
        JOIN core.t_mtr_menu_action ee ON ee.id_seq = dd.menu_action_id_int AND ee.status_int = 1 AND LOWER(ee.action_var) = 'view'
      WHERE
        aa.status_int = 1
    )
    SELECT
      json_agg(submenu) AS all_submenus -- Menggabungkan semua submenu menjadi satu array
    FROM (
      SELECT
        json_build_object(
          'id_seq', id_seq,
          'title', name_var,
          'icon', icon_var,
          'path', slug_var,
          'parent', true,
          'submenuId', order_int,
          'submenuItems', (
            SELECT
              json_agg(
                json_build_object(
                  'child_id', child_id_seq,
                  'child_parent', child_parent,
                  'title', child_name,
                  'icon', child_icon,
                  'path', child_slug,
                  'submenuId', order_int,
                  'submenuItems', (
                    SELECT
                      json_agg(
                        json_build_object(
                          'child_id', child_id_seq,
                          'child_parent', child_parent,
                          'title', child_name,
                          'icon', child_icon,
                          'path', child_slug
                        )
                      )
                    FROM
                      sub_submenu_children
                    WHERE
                      child_parent = submenu_children.child_parent
                      AND length(child_slug) - length(replace(child_slug, '/', '')) = 3
                  )
                )
              )
            FROM
              submenu_children
            WHERE
              child_parent = submenus.id_seq
              AND length(child_slug) - length(replace(child_slug, '/', '')) = 2
          )
        ) AS submenu
      FROM
        submenus
      GROUP BY
        id_seq, name_var, icon_var, slug_var, order_int
      ORDER BY
        order_int ASC
    ) AS subquery;
  `)
  return result.rows
}


module.exports = {
  privilege
}