// 我的数码切割工作台
import request from '@/utils/request'
const BASE_URL = `/file-task`

// 获取我的数码切割工作台列表
export function getBenchList(params) {
    return request({
      url: BASE_URL+'/cutting/myWorkList-v2',
      method: 'get',
      params
    })
}

// 完成
export function finish(activityId) {
    return request({
      url: BASE_URL+`/cutting/finishTask/${activityId}`,
      method: 'post'
    })
}

// 保存切割文件
export function saveCutFile(data) {
    return request({
      url: BASE_URL+'/cutting/saveFile',
      method: 'post',
      data
    })
}

// 查询用户上传附件详情(回显文件)
export function getAnnexInfo(activityId) {
    return request({
      url: BASE_URL+`/cutting-annex/getAnnexInfo/${activityId}`,
      method: 'get'
    })
}
// 下载切割文件
export function downloadCuttingFile(activityId) {
  return request({
    url: BASE_URL+`/cutting/downloadCuttingFile/${activityId}`,
    method: 'post'
  })
}
/**
 * 获取撤单消息数量
 * @param {Object} params
 * @returns 
 */
export function getMsgCount(params) {
  return request({
    url: BASE_URL + '/cutting/msgCount',
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
    url: BASE_URL + '/cutting/getCancelMsg',
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
    url: BASE_URL + '/cutting/submitMsgOps',
    method: 'post',
    data
  })
}