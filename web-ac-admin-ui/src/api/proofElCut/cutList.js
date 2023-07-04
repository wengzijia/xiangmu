// 打样数码切割列表
import request from '@/utils/request'
const BASE_URL = `/file-task`

// 获取打样数码切割列表
export function getCutList(params) {
    return request({
      url: BASE_URL+'/cutting/list',
      method: 'get',
      params
    })
}
export function getTaskCount(params) {
  return request({
    url: BASE_URL+'/cutting/getTaskCount',
    method: 'get',
    params
  })
}

// 驳回
export function turnDown(data) {
  return request({
    url: BASE_URL+'/cutting/turnDown',
    method: 'post',
    data
  })
}

// 领取
export function getTask(activityId) {
  return request({
    url: BASE_URL+`/cutting/getTask/${activityId}`,
    method: 'post',
  })
}
//处理历史
export function getLogs(activityId) {
  return request({
    url: BASE_URL+`/cutting/getLogs/${activityId}`,
    method: 'get',
  })
}

