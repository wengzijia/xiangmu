import request from '@/utils/request'
const BASE_URL = `/file-task/structural-design/self-work`
const BASE_URL2 = `/file-task/prepress-design/self-work/`
/**
 * 获取结构列表
 * @param {Object} params
 * @returns 
 */
export function getSelfWorkList(params) {
    return request({
      url: BASE_URL,
      method: 'get',
      params
    })
}
/**
 * 获取结构列表(新)
 * @param {Object} params
 * @returns 
 */
 export function getSelfWorkSpace(params) {
  return request({
    url: `/file-task/structural-design/self-work/getSelfWorkSpace`,
    method: 'get',
    params
  })
}
/**
 * 复制打样结构文件
 * @param {Object} params
 * @returns 
 */
export function copyProofAnnex(params) {
    return request({
      url: BASE_URL+'/copyProofAnnex',
      method: 'get',
      params
    })
}
/**
 * 完成正稿
 * @param {Object} data
 * @returns 
 */
export function finish(data) {
    return request({
      url: BASE_URL+'/finish',
      method: 'post',
      data
    })
}
/**
 * 获取工单附件
 * @param {Object} params
 * @returns 
 */
export function getAnnexByOriginalId(params) {
    return request({
      url: BASE_URL+'/getAnnexByOriginalId',
      method: 'get',
      params
    })
}
/**
 * 获取撤单消息接口
 * @param {Object} params
 * @returns 
 */
export function getCancelMsg(params) {
    return request({
      url: BASE_URL+'/getCancelMsg',
      method: 'get',
      params
    })
}
export function getTaskCount(params) {
  return request({
    url: '/file-task/structural-design/getTaskCount',
    method: 'get',
    params
  })
}
/**
 * 领取任务
 * @param {Object} params
 * @returns 
 */
export function getTask(params) {
    return request({
      url: BASE_URL+'/getTask',
      method: 'get',
      params
    })
}
/**
 * 领取任务-按PO号精确搜索来领取工单
 * @param {Object} params
 * @returns 
 */
export function getTaskByPo(params) {
  return request({
    url: BASE_URL+'/getTaskByPo',
    method: 'get',
    params
  })
}
/**
 * 印前领取任务
 * @param {Object} params
 * @returns 
 */
 export function preGetTask(activityId,params) {
  return request({
    url:`${BASE_URL2}task/${activityId}`,
    method: 'get',
    params
  })
}
/**
 * 获取撤单消息数量
 * @param {Object} params
 * @returns 
 */
export function msgCount(params) {
    return request({
      url: BASE_URL+'/msgCount',
      method: 'get',
      params
    })
}
/**
 * 保存上传文件
 * @param {Object} data
 * @returns 
 */
export function saveFile(data) {
    return request({
      url: BASE_URL+'/saveFile',
      method: 'post',
      data
    })
}
/**
 * 提交撤单消息结果
 * @param {Object} data
 * @returns 
 */
export function submitMsgOps(data) {
    return request({
      url: BASE_URL+'/submitMsgOps',
      method: 'post',
      data
    })
}
/**
 * 退回推送前
 * @param {Object} data
 * @returns 
 */
 export function returnBeforeSend(data) {
  return request({
    url: BASE_URL+'/returnBeforeSend',
    method: 'post',
    data
  })
}

// 获取工单备注信息
export function getStrRemark(params) {
  return request({
    url: BASE_URL+'/getRemark',
    method: 'get',
    params
  })
}
// 同意授权修改备注
export function agreeStrModifyRemark(data) {
  return request({
    url: BASE_URL+'/agreeModifyRemark',
    method: 'post',
    data
  })
}
// 注意跟色跟样备注
export function structuralFollow(params) {
  return request({
    url: BASE_URL+'/getFollowInfo',
    method: 'get',
    params
  })
}

/** 精装盒文件上传获取上传数据 */
export function getHardBoundBoxFileDetail(params) {
  return request({
    url: BASE_URL+'/getHardBoundBoxFileDetail',
    method: 'get',
    params
  })
}

/** 大货精装盒保存上传文件 */
export function saveHardBoundFile(data) {
  return request({
    url: BASE_URL+'/saveHardBoundFile',
    method: 'post',
    data
  })
}

/** 吸塑内托推送产前样 */
export function sendSample(data) {
  return request({
    url: BASE_URL+'/sendSample',
    method: 'post',
    data
  })
}
/** 吸塑内托推送产前样 */
export function cancelSendSample(id) {
  return request({
    url: BASE_URL+'/cancelSendSample/'+id,
    method: 'PUT'
    
  })
}
/** AI检测结构成型 */
export function checkTakeShape(data) {
  return request({
    url: BASE_URL+'/checkTakeShape',
    method: 'post',
    data
  })
}


