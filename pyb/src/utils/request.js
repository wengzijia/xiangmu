import axios from 'axios';
import store from '@/store';
import { VueAxios } from './axios';
import { ACCESS_TOKEN } from '@/store/global-constant';
// import { Message } from 'element-ui';
import router from '@/router';
import { message as Message } from '@/utils/resetMessage';
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 60000 // 请求超时时间
});
// 错误
const err = error => {
  if (error.response) {
    const data = error.response.data;
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (error.response.status === 403) {
      Message({
        message: '禁止访问',
        type: 'error'
      });
    } else if (error.response.status === 500) {
      Message({
        message: '服务器异常',
        type: 'error'
      });
    } else if (error.response.status === 404) {
      Message({
        message: '请求失败',
        type: 'error'
      });
    } else if (error.response.status === 401) {
      Message({
        message: '用户未登录',
        type: 'error'
      });
      // if (token) {
      //   // 退出登录
      //   store.dispatch("Logout").then(() => {
      //     setTimeout(() => {
      //       console.log('response2');
      //       window.location.reload();
      //     }, 1500);
      //   });
      // }
    }
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use(config => {
  // console.log("请求域名",config);
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    config.headers['token'] = token; // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  config.headers['sysType'] = 'pinyiban';
  return config;
}, err);

// response interceptor
service.interceptors.response.use(response => {
  // console.log('response', response);
  if (response.data.code === '970005') {
    store.dispatch('Logout').then(() => {
      setTimeout(() => {
        console.log('response3', localStorage.getItem(ACCESS_TOKEN));
        // window.location.reload();
        router.push({ path: '/login' });
      }, 1500);
    });
  } else if (response.data.code === '970006' || response.data.code === '970007') {
    return response.data;
  } else if (response.data.code === '980003') {
    return response.data;
  } else if (response.data.code !== '000000') {
    Message({
      message: response.data.message,
      type: 'error'
    });
    return Promise.reject(response.data);
  }
  return response.data;
}, err);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service);
  },
  test:{}
}; 

export { installer as VueAxios, service as axios };
