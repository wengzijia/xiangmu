import {http} from "../utils/request.js"
const BESA_URL = `/consumer`;

// 获取验证码
export function getCode(data){
  return http({
      url: BESA_URL + '/certifyFree/user/miniWechatPictureUser/weChat/sendLoginSmsVerifyCode',
      method:'post',
      data
    });
}

// 短信登录
export function smsLogin(data){
  return http({
      url: BESA_URL + '/certifyFree/user/miniWechatPictureUser/weChat/smsLogin',
      method:'post',
      data
    });
}