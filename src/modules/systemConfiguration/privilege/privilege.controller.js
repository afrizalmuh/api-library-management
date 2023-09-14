const db = require('../../../../config/database')
const services = require('./privilege.services')
const response = require('../../../../response')
const http = require('../../../../response/http_code')
const { validationResult } = require('express-validator')

exports.privilege = async (req, res) => {
  let { user_group_id } = req.body
  let rows;
  let data = {}
  let menu = {}
  try {

    let data = await services.privilege(user_group_id, db)
    if (data[0].all_submenus === null) return response.error(res, http.BAD_REQUEST, 'Bad request', 'error')
    // privilege.map((item) => {
    //   let menuId = item.menu_id
    //   let nameMenu = item.name_var
    //   if (!resultMap[menuId]) {
    //     resultMap[menuId] = {
    //       menu_id: menuId,
    //       name: nameMenu
    //     }
    //   }
    // })

    // rows = Object.values(resultMap)
    // console.log(rows)

    // var resultData = [];

    // data.map((item) => {
    //   // Cari atau buat menu dengan menu_id yang sesuai
    //   var menuu = resultData.find(function (menuItem) {
    //     return menuItem.menu_id === item.menu_id;
    //   });

    //   let menuId = item.menu_id
    //   let nameMenu = item.name_var
    //   let parentId = item.parent_id_int
    //   if (!menu[menuId] && parentId === 0) {
    //     menu[menuId] = {
    //       menu_id: menuId,
    //       name: nameMenu,
    //       action: [{
    //         action: item.action_var,
    //         privilege_id: item.privilege_id,
    //         user_group_id: item.user_group_id,
    //         menu_id: item.menu_id,
    //         detail_id: item.detail_id,
    //         status: item.status_int
    //       }],
    //       children: []
    //     }
    //   }
    // })

    // let datas = []
    // datas = Object.values(menu)
    // let cek;

    // datas.map((items, index) => {
    //   // console.log(`lopp ke-${index} => ${items.menu_id}`)
    //   cek = data.filter(parents => parents.parent_id_int === items.menu_id)
    //   console.log(cek)
    // })
    // cek = data.filter(parents => parents.parent_id_int === 2)

    // console.log(cek)
    // console.log(data)
    // console.log(JSON.stringify(datas))
    // return response.success(res, http.SUCCESS, 'success', datas)


    // Iterasi melalui data JSON awal
    // data.forEach(function (item) {
    //   // Cari atau buat menu dengan menu_id yang sesuai
    //   var menu = resultData.find(function (menuItem) {
    //     return menuItem.menu_id === item.menu_id;
    //   });

    //   console.log(menu)

    //   if (!menu) {
    //     menu = {
    //       menu_id: item.menu_id.toString(),
    //       name: item.name_var,
    //       action: [],
    //       state: 'closed',
    //       children: []
    //     };
    //     resultData.push(menu);
    //   }

    //   // Tambahkan informasi aksi ke dalam menu
    //   menu.action.push({
    //     action: item.action_var,
    //     privilege_id: item.privilege_id,
    //     user_group_id: item.user_group_id,
    //     menu_id: item.menu_id.toString(),
    //     detail_id: item.detail_id,
    //     status: item.status_int.toString()
    //   });
    // });

    // console.log(resultData);
    return response.success(res, http.SUCCESS, "sucess", data)

  } catch (er) {
    return response.error(res, http.INTERNAL_SERVER_ERROR, 'Error', er.message)
  }
}