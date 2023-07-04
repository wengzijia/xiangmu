import request from '@/utils/request'
import {download} from  '@/utils/request2'
const BASE_URL = `/file-task`
// 获取正稿列表
export function getOutworkList(params) {
    return request({
      url: BASE_URL+'/original-design/self-finished/list',
      method: 'get',
      params
    })
}

// 撤回正稿
export function refusalOutwork(data) {
  return request({
    url: BASE_URL+'/original-design/self-finished/cancel',
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

// 导出
export function exp(data){
  return request({
    url: BASE_URL+'/original-design/self-finished/export',
    method: 'POST',
    data,
    responseType: 'arraybuffer'   /* 解决请求数据乱码问题 */
  })
}

// export function exp(data,filename=new Date().getTime()+'.excel') {
//   return download("/original/original-design/self-finished/export",data,filename);
// }