import request from '@/utils/request'
const BASE_URL = `/file-task`

// 获取正稿列表
export function getOutworkList(params) {
    return request({
      url: BASE_URL+'/original-design/list',
      method: 'get',
      params
    })
  }

// 查询待处理和处理中数据
export function getDisposeData(params) {
  return request({
    url: BASE_URL+'/original-design/getTaskCount',
    method: 'get',
    params
  })
}

// 驳回正稿
export function refusalOutwork(data) {
  return request({
    url: BASE_URL+'/original-design/self-work/reject',
    method: 'POST',
    data
  })
}

// 转移正稿
export function transferOutwork(data) {
  return request({
    url: BASE_URL+'/original-design/self-work/transfer',
    method: 'POST',
    data
  })
}