import {request} from '@/utils/request'
import { BASEURL } from '@/store/global-constant'
/**
 * 登录
 * @returns 
 */
export function userLogin() {
  return request({
    url: BASEURL+'',
    method: 'post'
  })
}

/**
 * 获取用户信息
 * @returns 
 */
 export function getUserInfo() {
  return request({
    url: BASEURL+'',
    method: 'post'
  })
}


/**
 * 获取用户信息
 * @returns 
 */
 export function checkToken() {
  return request({
    url: BASEURL+'',
    method: 'post'
  })
}



