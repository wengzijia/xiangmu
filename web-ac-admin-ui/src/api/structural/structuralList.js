import request from '@/utils/request'
const BASE_URL = `/file-task/structural-design`
/**
 * 获取结构详情
 * @param {Object} params
 * @returns 
 */
export function getInfo(params) {
    return request({
      url: BASE_URL +'/getInfo',
      method: 'get',
      params
    })
}
/**
 * 查询待处理和处理中数据接口
 * @param {Object} params
 * @returns 
 */
export function getTaskCount(params) {
    return request({
      url: BASE_URL +'/getTaskCount',
      method: 'get',
      params
    })
}
/**
 * 分页查询结构列表
 * @param {Object} params
 * @returns 
 */
export function getPage(params) {
    return request({
      url: BASE_URL +'/page',
      method: 'get',
      params
    })
}
/**
 * 驳回结构申请
 * @param {Object} data
 * @returns 
 */
export function rejectStructural(data) {
    return request({
      url: BASE_URL +'/reject',
      method: 'post',
      data
    })
}
/**
 * 转移结构
 * @param {Object} data
 * @returns 
 */
export function transferStructural(data) {
    return request({
      url: BASE_URL +'/transfer',
      method: 'post',
      data
    })
}

// 属性分解
export function strParsingAttributes(taskId) {
  return request({
    url:`${BASE_URL}/parsingAttributes/${taskId}`,
    method: 'get',
  })
}

// 获取供应商信息
export function getSuppliers() {
  return request({
    url:`/dispatch/dispatch/getSuppliers`,
    method: 'get',
  })
}

