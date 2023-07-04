import request from '@/utils/request'
const BASE_URL = `/file-task`

// 获取撤单消息数量
export function getMsgCount() {
  return request({
    url: BASE_URL+'/original-design/self-work/msgCount',
    method: 'get'
  })
}

// 获取撤单消息列表
export function getCancelMsg(params) {
    return request({
      url: BASE_URL+'/original-design/self-work/getCancelMsg',
      method: 'get',
      params
    })
}

// 提交撤单消息结果
export function submitMsgOps(data) {
  return request({
    url: BASE_URL+'/original-design/self-work/submitMsgOps',
    method: 'post',
    data
  })
}

// 领取任务
export function getTask() {
    return request({
      url: BASE_URL+'/original-design/self-work/getTask',
      method: 'get'
    })
}

// 获取我的工作台列表
export function getSelfWorkList(params) {
    return request({
      url: BASE_URL+'/original-design/self-work/getSelfWorkList',
      method: 'get',
      params
    })
}

// 上传正稿文件
export function saveFile(data) {
    return request({
      url: BASE_URL+'/original-design/self-work/saveFile',
      method: 'post',
      data
    })
}

// 获取工单附件
export function getAnnexByOriginalId(params) {
    return request({
      url: BASE_URL+'/original-design/self-work/getAnnexByOriginalId',
      method: 'get',
      params
    })
}

// 完成正稿
export function finish(data) {
    return request({
      url: BASE_URL+'/original-design/self-work/finish',
      method: 'post',
      data
    })
}

// 驳回正稿
export function refusalOutwork(data) {
    return request({
      url: BASE_URL+'/original-design/self-work/reject',
      method: 'post',
      data
    })
}

// 转移正稿
export function transferOutwork(data) {
    return request({
      url: BASE_URL+'/original-design/self-work/transfer',
      method: 'post',
      data
    })
}

// 同意授权修改备注
export function agreeModifyRemark(data) {
    return request({
      url: BASE_URL+'/original-design/self-work/agreeModifyRemark',
      method: 'post',
      data
    })
}
// 退回推送前
export function returnBeforeSend(data) {
  return request({
    url: BASE_URL+'/original-design/self-work/returnBeforeSend',
    method: 'post',
    data
  })
}

// 获取工单备注信息
export function getRemark(params) {
  return request({
    url: BASE_URL+'/original-design/self-work/getRemark',
    method: 'get',
    params
  })
}

// 注意跟色跟样备注
export function bulkorderFollow(params) {
  return request({
    url: BASE_URL+'/original-design/self-work/getFollowInfo',
    method: 'get',
    params
  })
}