import request from '@/utils/request'
const BASE_URL = `/file-task`

// 获取正稿检测列表
export function getDetectionList(params) {
    return request({
      url: BASE_URL+'/original-check/list',
      method: 'get',
      params
    })
}

// 获得待审核正稿附件
export function getOriginalAnnex(taskId) {
    return request({
      url: BASE_URL+'/original-check/getOriginalAnnex',
      method: 'get',
      params:taskId
    })
}

// 提交审核结果
export function checkResult(data) {
    return request({
      url: BASE_URL+'/original-check/checkOriginal',
      method: 'post',
      data
    })
}