import {Dialog, Toast} from 'vant'
import store from '@/store'
import service from './axios'
import {removeToken} from "@/utils/auth";
import router from "@/router";


export const request = (config) => {
  return new Promise((resolve, reject) => {
    service.request(config).then(res => {
        if(res.data.code==='970005'||res.data.code==='100003'){
          Toast.clear()
          removeToken()
          return  Dialog.alert({
                    title: '提示',
                    message: '登录已过期，请重新登录。'
                  }).then(() => {
                    console.log('登录已过期，请重新登录')
                    router.replace('/')
                  })
        }
        if(res.data.code==='966666'){//当前版本号和线上版本号不一致
          console.log('当前版本和线上版本不一致',res.data)
          localStorage.setItem("ipadVersion", res.data.data)
          location.reload()
          return 
        }
        resolve(res.data)
      },err => {
        Toast.clear()
        reject(err)
      }
    )
  })
}

export const post =(paramsObj) =>{
  return request({
      headers: {
          'Content-Type': paramsObj.type || 'application/json'
      },
      url: paramsObj.url,
      method: 'post',
      data: paramsObj.data||{},
  });
}

export const get =(paramsObj) =>{
  return request({
      headers: {
          'Content-Type': paramsObj.type || 'application/json'
      },
      url: paramsObj.url,
      method: 'get',
      data: paramsObj.data||{},
  });
}
export const downloadFile = (params) => {
  return request({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      responseType: "blob", //响应数据的类型选择blob
      url: params.url,
      method: 'post',
      data: params.data||{},
  })
}

