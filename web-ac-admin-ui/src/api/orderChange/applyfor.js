import request from '@/utils/request'
import request2 from "@/utils/request2";
const BASE_URL = `/order-change/apply`

// 校验潘通号
export function checkPantone(data) {
    return request2({
        url: '/certifyFree/attrGroup/checkPantone',
        method: 'post',
        data
    })
}

// 获取订单名下的全部PO号
export function getAllPoSn(data) {
    return request({
        url: BASE_URL + '/getAllPoSn',
        method: 'post',
        data
    })
}

// 验证订单是否可变更
export function validateOrder(data) {
    return request({
        url: BASE_URL + '/validateOrder',
        method: 'post',
        data
    })
}

// 获取订单类型
export function childChangeCategory(id) {
    return request({
        url: `/order-change/common/childChangeCategory/${id}`,
        method: 'get'
    })
}

// 确认变更申请详情
export function submitChangeDetail(data) {
    return request({
        headers: {
            token: localStorage.getItem('Access-Token')
        },
        url: BASE_URL + '/submitChangeDetail',
        method: 'post',
        data
    })
}

// 确认变更
export function submitChange(data) {
    return request({
        headers: {
            token: localStorage.getItem('Access-Token')
        },
        url: BASE_URL + '/submit',
        method: 'post',
        data
    })
}