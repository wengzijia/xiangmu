import {http} from "../utils/request.js"
/**
 * 授权登录
 * @param {{code:string,encryptedData:string,iv:string,type:string}} data 
 * @returns 
 */
export function setWxPhoneLogin(data){
    return http({
        url:  '/setWxPhoneLogin',
        method:'post',
        data
      });
}
/**
 * 存储微信头像与微信名称
 * @param {{wx_portrait:string,wx_nickname:string}}
 */
export function setWxNickname(data){
    return http({
        url:  '/setWxNickname',
        method:'post',
        data
      });
}
/**
 * 获取用户信息
 * 
 */
export function getWxUserInfo(){
  return http({
    url:'/getWxUserInfo',
    method:'post'
  })
}


