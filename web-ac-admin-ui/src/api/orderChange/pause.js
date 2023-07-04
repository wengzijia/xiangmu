import request from '@/utils/request'
const BASE_URL = `/order-change/miniOrderModifyPause`

// 订单变更详情
export function changeDetail(data) {
    return request({
        url: BASE_URL + '/changeDetail',
        method: 'post',
        data
    })
}