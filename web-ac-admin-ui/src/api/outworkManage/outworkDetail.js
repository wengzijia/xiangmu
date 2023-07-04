import request from '@/utils/request'

const BASE_URL = `/file-task`
// 获取正稿详情
export function getDetail(taskId) {
    return request({
      url: BASE_URL+'/original-design/getInfo',
      method: 'get',
      params:taskId
    })
}

// 属性分解
export function parsingAttributes(taskId) {
  return request({
    url:`${BASE_URL}/original-design/parsingAttributes/${taskId}`,
    method: 'get',
  })
}