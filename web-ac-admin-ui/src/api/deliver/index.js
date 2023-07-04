import request from '@/utils/request'
const BASE_URL = `/file-task/proof-deliver`
/**
 * 分页查询我的结构列表
 * @param {Object} params
 * @returns 
 */
 export function getPage(params) {
    return request({
      url: BASE_URL + '/page',
      method: 'get',
      params
    })
}

export function getTaskCount(params) {
  return request({
    url: BASE_URL + '/getTaskCount',
    method: 'get',
    params
  })
}
/**
 * 驳回
 * @param {Object} data
 * @returns 
 */
 export function getReject(data) {
    return request({
      url: BASE_URL + '/reject',
      method: 'post',
      data
    })
}

/**
 * 发货
 * @param {Object} data
 * @returns 
 */
 export function getDeliver(data) {
    return request({
      url: BASE_URL + '/deliver',
      method: 'post',
      data
    })
}

// 获取工单备注信息
export function getDelRemark(params) {
  return request({
    url: BASE_URL+'/getRemark',
    method: 'get',
    params
  })
}
// 同意授权修改备注
export function agreeDelModifyRemark(data) {
  return request({
    url: BASE_URL+'/agreeModifyRemark',
    method: 'post',
    data
  })
}
// 属性分解
export function delParsingAttributes(taskId) {
  return request({
    url:`${BASE_URL}/parsingAttributes/${taskId}`,
    method: 'get',
  })
}
/**
 * 获取撤单消息数量
 * @param {Object} params
 * @returns 
 */
export function getMsgCount(params) {
  return request({
    url: BASE_URL + '/msgCount',
    method: 'get',
    params
  })
}
/**
 * 获取撤单消息列表
 * @param {Object} params
 * @returns 
 */
export function getCancelMsg(params) {
  return request({
    url: BASE_URL + '/getCancelMsg',
    method: 'get',
    params
  })
}
/**
 * 获取撤单消息列表
 * @param {Object} params
 * @returns 
 */
export function submitMsgOps(data) {
  return request({
    url: BASE_URL + '/submitMsgOps',
    method: 'post',
    data
  })
}