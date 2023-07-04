import Axios from "axios";
import { ElMessage } from "element-plus";
import { createPinia } from 'pinia';
import { useThrottleFn } from '@vueuse/core';
import { userLoginOut,getToken ,setLoginModule} from '@/utils/commonApi'

import store from "@/stores/index";


const defualtConfig = {
  // baseURL: "/request/",
  // baseURL: "/",
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
};
console.log('配置', import.meta.env)
const http = window.AXIOS || Axios.create(defualtConfig);
window.AXIOS = http;
const resWhiteList = ["/api/mes/oauth/sys/login/loginValidCode"];

http.interceptors.request.use(
  (config) => {
    const token = getToken()  // || '0cc428fd1fcd4d7cbdb81fc802fd6723_sms'
    console.log(token, 'token-------')
    if (token) {
      config.headers.token = token;
    }
    if(setLoginModule()) {
      config.headers.viewCode = setLoginModule()
    }
    // console.log(setLoginModule())
    config.headers["loginSource"] = 1 //表示生产管理平台
    const routerHint = setLoginModule()
    if(routerHint)config.headers["viewCode"] = routerHint

    return config;
  },
  (err) => {
    console.log("defualtConfigErr", err);
  }
);


const loginOut = useThrottleFn((message)=>{
  userLoginOut()
  ElMessage.error({ message })
},1500)

http.interceptors.response.use(
  (res) => {
    //错误码处理（000000 是成功）
    let { code, data, message } = res.data || {}
    if ([
      "401",// 身份验证失败，请重新登录（接入网关报错）
      '100003',//角色发生变化或者token过期
      '970005',//token无效
    ].indexOf(code) > -1 && !resWhiteList.includes(res.config.url)) {
      // store.useUserStore.userLoginOut();
      loginOut(message)
      throw new Error(message)
    }

    // 通用错误-优先提示
    const codeList = [
      '403',//您无权访问资源（网关报错）
      '100000',// 系统异常
      '100002',// 账号已被锁定，请联系管理员
      '100004',// 服务开小差了，请联系管理员
      '999999', // 系统异常
    ]
    if (codeList.indexOf(code) > -1) {
      ElMessage({
        type: 'error',
        message,
      })
      return reject()
    }

    return res.data;
  },
  (err) => {
    console.log("responseErr", err);
    // throw new Error(err);
    return err;
  }
);

export default http;
