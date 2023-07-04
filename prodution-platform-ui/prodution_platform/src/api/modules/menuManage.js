import { request } from '@/utils/request';

// 获取菜单列表
export function getMenuTreeList(data) {
    return request({
        url: "/api/mes/oauth/sys/sysMenu/getMenuTreeList",
        method: "Post",
        data
    });
};

// 菜单新增
export function saveMenu(data) {
    return request({
        url: "/api/mes/oauth/sys/sysMenu/saveMenu",
        method: "Post",
        data
    });
};

// 菜单修改
export function updateMenu(data) {
    return request({
        url: "/api/mes/oauth/sys/sysMenu/updateMenu",
        method: "Post",
        data
    });
};
// 菜单删除
export function deleteMenu(data) {
    return request({
        url: `/api/mes/oauth/sys/sysMenu/deleteMenu/${data.id}`,
        method: "Post",
        data
    });
};
 // 为角色配菜单权限
export function saveOrUpdateRoleMenuList(data) {
    return request({
        url: "/api/mes/oauth/sys/sysOrgRole/saveOrUpdateRoleMenuList",
        method: "Post",
        data
    });
};

// 菜单详情
export function getMenuDetail(data) {
    return request({
        url: `/api/mes/oauth/sys/sysMenu/getMenuDetail/${data.id}`,
        method: "Post",
        data
    });
};

// // 产业园表列表分页查询
// export function getIndustrialParkPage(data) {
//     return request({
//         url: "/api/mes/courtship/park/industrialPark/getIndustrialParkPage",
//         method: "Post",
//         data
//     });
// };

// // 产业园表保存信息
// export function saveInfo(data) {
//     return request({
//         url: "/api/mes/courtship/park/industrialPark/saveIndustrialPark",
//         method: "Post",
//         data
//     });
// };

// // 获取编辑信息(id获取产业园表详细信息)
// export const getParkDetail = (data) => {
//     return request({
//         url: `/api/mes/courtship/park/industrialPark/getParkDetail/${data.id}`,
//         method: "Get",
//     });
// };

// // 产业园表修改信息
// export function updateIndustrialPark(data) {
//     return request({
//         url: "/api/mes/courtship/park/industrialPark/updateIndustrialPark",
//         method: "Post",
//         data
//     });
// };

export default {
    getMenuTreeList,
    saveMenu,
    updateMenu,
    deleteMenu,
    saveOrUpdateRoleMenuList,
    getMenuDetail 
}