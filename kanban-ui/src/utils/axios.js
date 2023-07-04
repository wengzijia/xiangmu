import axios from "axios";
import {getToken} from '@/utils/auth'
import {BASEURL} from "@/store/global-constant";

const service = axios.create({
  timeout: 60*1000,
  // withCredentials: true
  // baseURL:"zxhapi"
  //   baseURL:BASEURL
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token =  getToken();
    if (token) {
      config.headers["token"] = token; // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    const version = localStorage.getItem('ipadVersion') || 1
    config.headers["version"] = version //携带版本号，如果版本号不一样需要重新刷新页面
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
