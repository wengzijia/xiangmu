import axios from 'axios'
import { ElNotification , ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from '@/utils/ruoyi'
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'
import useUserStore from '@/store/modules/user'
import {getFileName} from '@/utils/index'
const BASE_ROUTER = import.meta.env.VITE_APP_ROUTER_BASE_URL
let appMode = import.meta.env.VITE_APP_ENV
let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: '/api/consumer',
  // 超时
  timeout: 1000 * 30
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  const token = localStorage.getItem('Access-Token')
  if(token) config.headers['token'] = token
  // // 大货印前上传印前pdf文件
  // console.log('config',config)
  // if(config.url.indexOf('prepressFile')==0){
  //   config.baseURL = '/';
  //   config.url = config.url.replace('prepressFile','pdf')
  // }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url;                // 请求地址
      const s_data = sessionObj.data;              // 请求数据
      const s_time = sessionObj.time;              // 请求时间
      const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交';
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = res.data.message || res.data.msg || errorCode[code] || errorCode['default']
    // 二进制数据则直接返回
    if(res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer'){
      return res
    }
    if ( code === '970007') {
      if (!isRelogin.show) {
        isRelogin.show = true;
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        isRelogin.show = false;
        useUserStore().logOut()
      }).catch(() => {
        isRelogin.show = false;
      });
    }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500||code === '999999') {
      ElMessage({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if ( code != '000000' && code != 200) {
      ElNotification.error({
        title: msg
      })
      return Promise.reject('error')
    }else {
      return  Promise.resolve(res.data)
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 通用下载方法
export function download(url, params, filename, config={}) {
  let data = {...params,isUrlEncode:true}
  downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, data, {
    // transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/json' },
    responseType: 'blob',
    ...config
  }).then(async (res) => {
    let name  = ''
    
      try {
        let str = res.headers['content-disposition']?.split('fileName=')[1]
        if (str) {
          name  = getFileName(decodeURIComponent(str));
        }else{
          name  = false
        }
      } catch (error) {
        name  = false
      }
    if(params.fileName) name = getFileName(decodeURIComponent(params.fileName));
    const isLogin = await blobValidate(res.data);
    if (isLogin) {
      const blob = new Blob([res.data])
      saveAs(blob, name||filename)
    } else {
      const resText = await res.data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}
// 通用下载方法
export function downloadZip(url, params, filename, config={}) {
  let data = {...params,isUrlEncode:true}
  downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, data, {
    // transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/json' },
    responseType: 'blob',
    ...config
  }).then(async (res) => {
    if(res.data.size===0){
      let fileList = params.fileList.map(e => {
        let arr = e.split('/');
        return arr[arr.length-1]
      })
      let setObj = new Set(fileList)
      let arr = [...setObj]
      if(arr.length!=fileList.length){
        ElMessage.error('存在相同文件名称文件，下载失败！')
      }else{
        ElMessage.error('下载文件出现错误，请联系管理员！')
      }
      downloadLoadingInstance.close();
      return
    }
    let name  = ''
      try {
        console.log('str',res.headers['content-disposition']?.split('filename='))
        let str = res.headers['content-disposition']?.split('filename=')[1]
        if (str) {
          name  = decodeURI(str);
        }else{
          name  = false
        }
      } catch (error) {
     
        name  = false
      }
    const isLogin = await blobValidate(res.data);
    if (isLogin) {
      const blob = new Blob([res.data])
      saveAs(blob, name||filename)
    } else {
      const resText = await res.data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}
export default service
