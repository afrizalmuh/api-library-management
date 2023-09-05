const db = require("../../../../config/database")
const services = require('./menuWeb.services')
const http = require('../../../../response/http_code')
const response = require('../../../../response')
const helper = require('../../../../helpers/helper')
const { validationResult } = require('express-validator')

exports.getMenu = async (req, res) => {
  try {
    let data;
    let subMenu = [];
    const getListMenu = await services.listMenuWeb(db);

    const convertTime = getListMenu.map((item) => {
      for (const key in item) {
        if (key === "created_on_dtm") {
          const value = item[key]
          const time = helper.changeTimezone(value)
          return { ...item, created_on_dtm: time }
        }
      }
    })

    const parentMenu = convertTime.filter(item => item.children_id == 0).sort((a, b) => a.order_int - b.order_int);
    convertTime.map((item) => {
      parentMenu.map((parent) => {
        if (parent.parent_id === item.children_id) {
          subMenu.push(item);
          data = subMenu.filter(itemList => itemList.children_id === parent.parent_id).sort((first, next) => first.order_int - next.order_int);
          parent.subMenu = data;
        }
      })
    })
    return response.success(res, http.SUCCESS, 'sucess', parentMenu);
  } catch (e) {
    return response.error(res, http.INTERNAL_SERVER_ERROR, "Internal server error", e.message)
  }
}

exports.insertMenu = async (req, res) => {
  let {
    name_menu,
    order,
    icon,
    slug,
    parent_id,
    created_by
  } = req.body

  data = {
    name_menu,
    order,
    icon,
    slug,
    parent_id,
    created_by
  }
  try {
    const errValidation = validationResult(req)
    if (!errValidation.isEmpty()) return response.error(res, http.CONFLICT, errValidation.errors[0].msg)

    //cek list order apakah sudah ada atau belum
    const checkListMenu = await services.checkOrder(data, db);
    if (checkListMenu)
      return response.error(res, http.BAD_REQUEST, "masukkan ulang urutan list")

    //insert list menu
    let insertList = await services.insertMenuWeb(data, db)
    return response.success(res, http.SUCCESS, "sucess", insertList)
  } catch (e) {
    return response.error(res, http.INTERNAL_SERVER_ERROR, "Internal server error", e.message)
  }

}