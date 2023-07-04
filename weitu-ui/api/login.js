import {http} from "../utils/request.js"
const BESA_URL = `/consumer`;

// 授权登录
export function authorizeLogin(data){
  return http({
      url: BESA_URL + '/certifyFree/picture/weChat/authorizeLogin',
      method:'post',
      data
    });
}

// 校验token
export function checkToken(data){
  return http({
      url: BESA_URL + '/certifyFree/picture/weChat/checkToken',
      method:'post',
      data
    });
}