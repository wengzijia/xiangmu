import request from '@/utils/request'
import {download} from  '@/utils/request2'
const BASE_URL = `/file-task/digital-print`
const BASE_cut_URL = `/file-task/cutting`
/**
 * 按条件查询数码打印列表
 * @param {Object} params
 * @returns 
 */
export function getDigitalList(params) {
    return request({
      url: BASE_URL + '/list',
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
 * 按条件查询我的数码打印列表
 * @param {Object} params
 * @returns 
 */
 export function getmyWorkList(params) {
  return request({
    url: BASE_URL + '/myWorkList-v2',
    method: 'get',
    params
  })
}
/**
 * 领取任务
 * @param {Object} params
 * @returns 
 */
export function getTask(activityId) {
    return request({
      url: BASE_URL + '/getTask/' +activityId,
      method: 'post',
    })
}

/**
 * 打印
 * @param {Object} params
 * @returns 
 */
export function print(activityId) {
    return request({
      url: BASE_URL + '/print/' +activityId,
      method: 'post',
    })
}
/**
 * 驳回
 * @param {Object} data
 * @returns 
 */
export function turnDown(data) {
    return request({
      url: BASE_URL + '/turnDown',
      method: 'post',
      data
    })
}
/**
 * 下载文件
 * @param {Object} data
 * @returns 
 */
export function downloadFile(data) {
  return request({
    url: BASE_cut_URL + '/downloadFile',
    method: 'post',
    data:data,
    responseType: 'blob',
  })
}
/**
 * 获取备注信息
 * @param {Object} params
 * @returns 
 */
 export function getDigitalLogs(activityId) {
  return request({
    url: BASE_URL + "/getLogs/"+activityId,
    method: "get",
  });
}
export function getLogs(activityId) {
  return request({
    url: BASE_URL + "/logs/"+activityId,
    method: "get",
  });
}

/**
 * 同意授权修改备注
 * @param {Object} data
 * @returns 
 */
 export function agreeDigitalModifyRemark(data) {
  return request({
    url: BASE_URL + "/agreeModifyRemark",
    method: "post",
    data,
  });
}
/**
 * 获取备注信息
 * @param {Object} params
 * @returns 
 */
 export function getCuttingLogs(activityId) {
  return request({
    url: BASE_cut_URL + "/getLogs/"+activityId,
    method: "get",
  });
}
/**
 * 同意授权修改备注
 * @param {Object} data
 * @returns 
 */
 export function agreeCuttingModifyRemark(data) {
  return request({
    url: BASE_cut_URL + "/agreeModifyRemark",
    method: "post",
    data,
  });
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
/**
 * 获取用料明细
 * @param {Object} params
 * @returns 
 */
export function getMaterials(activityId) {
  return request({
    url: BASE_URL + `/getMaterials/${activityId}`,
    method: 'get'
  })
}
/**
 * 录入用料
 * @param {Object} params
 * @returns 
 */
export function inputMaterials(data) {
  return request({
    url: BASE_URL + `/inputMaterials`,
    method: 'post',
    data
  })
}