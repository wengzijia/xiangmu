import request from '@/utils/request'

// 获取状态
export function getAllStatus(){
    return request({
        url: '/system/dict/data/list',
        method: 'get',
        params:{
            dictType:'ac_original_status'
        }
    })
}

// 获取大货所有类型
export function getAllType(){
    return request({
        url: '/system/dict/data/list',
        method: 'get',
        params:{
            dictType:'ac_original_order_type'
        }
    })
}