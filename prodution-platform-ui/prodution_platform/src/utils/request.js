import $http from "./http"
import { ElLoading } from 'element-plus'

export const request = (config) => {
  let loadingInstance = null
  if (!config.isLoading) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0)',
    })
  }
  return new Promise((resolve, reject) => {
    if (window.noPagePermission) {
      return resolve({ code: window.HTTP_SUCCESS })
    }

    $http.request(config).then(res => {
      if (!config.isLoading && loadingInstance) setTimeout(()=>loadingInstance.close(),300)
      resolve(res)
    }).catch(err => {
      if (!config.isLoading && loadingInstance) setTimeout(()=>loadingInstance.close(),300)
      reject(err)
    })
  })
}
export const post = (paramsObj) => {
  return request({
    headers: {
      'Content-Type': paramsObj.type || 'application/json'
    },
    url: paramsObj.url,
    method: 'Post',
    isLoading: paramsObj.isLoading,//是否禁用正在加载提示框,默认不禁用
    data: paramsObj.data || {},
  });
}

export const get = (paramsObj) => {
  return request({
    headers: {
      'Content-Type': paramsObj.type || 'application/json'
    },
    url: paramsObj.url,
    method: 'get',
    isLoading: paramsObj.isLoading,//是否禁用正在加载提示框,默认不禁用
    data: paramsObj.data || {},
  });
}