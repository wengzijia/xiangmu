import request from '@/utils/request'
const BASE_URL = `/file-task/structural-design/self-design`

/**
 * 分页查询我的结构列表
 * @param {Object} params
 * @returns 
 */
export function getStructuralList(params) {
    return request({
      url: BASE_URL + '/list',
      method: 'get',
      params
    })
}
/**
 * 撤销结构完成
 * @param {Object} data
 * @returns 
 */
export function getStructuralCancel(data) {
    return request({
      url: BASE_URL + '/cancel',
      method: 'post',
      data
    })
}
/**
 * 导出
 * @param {Object} data
 * @returns 
 */
export function getExport(data) {
  return request({
    url: BASE_URL + '/export',
    method: 'post',
    data
  })
}