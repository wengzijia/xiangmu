import { request } from '@/utils/request';

// 获取产业园名称
export function getIndustrialParkList(data) {
    return request({
        url: "/api/mes/courtship/park/industrialPark/getIndustrialParkList",
        method: "Post",
        data
    });
};

// 产业园表列表分页查询
export function getIndustrialParkPage(data) {
    return request({
        url: "/api/mes/courtship/park/industrialPark/getIndustrialParkPage",
        method: "Post",
        data
    });
};

// 产业园表保存信息
export function saveInfo(data) {
    return request({
        url: "/api/mes/courtship/park/industrialPark/saveIndustrialPark",
        method: "Post",
        data
    });
};

// 获取编辑信息(id获取产业园表详细信息)
export const getParkDetail = (data) => {
    return request({
        url: `/api/mes/courtship/park/industrialPark/getParkDetail/${data.id}`,
        method: "Get",
    });
};

// 产业园表修改信息
export function updateIndustrialPark(data) {
    return request({
        url: "/api/mes/courtship/park/industrialPark/updateIndustrialPark",
        method: "Post",
        data
    });
};

export default {
    getIndustrialParkList,
    getIndustrialParkPage,
    saveInfo,
    getParkDetail,
    updateIndustrialPark
}