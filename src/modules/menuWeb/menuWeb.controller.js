const db = require("../../../config/database")
const services = require('./menuWeb.services')
const http = require('../../../response/http_code')
const response = require('../../../response')

exports.getMenu = async (req, res) => {
  try {
    let data;
    let newSubmenu = [];
    const getListMenu = await services.listMenuWeb(db);
    const parentMenu = getListMenu.filter(item => item.parent_id_int == 0).sort((a, b) => a.order_int - b.order_int);
    getListMenu.map((item) => {
      parentMenu.map((parent) => {
        if (parent.id_seq === item.parent_id_int) {
          newSubmenu.push(item);
          data = newSubmenu.filter(itemList => itemList.parent_id_int === parent.id_seq).sort((first, next) => first.order_int - next.order_int);
          parent.subMenu = data;
        }
      })
    })
    return response.success(res, http.SUCCESS, 'sucess', parentMenu);
  } catch (e) {
    return response.error(res, http.INTERNAL_SERVER_ERROR, 'error')
  }
}