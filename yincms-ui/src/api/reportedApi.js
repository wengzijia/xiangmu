import { axios } from '@/utils/request';
import { BASE_URL } from './index';
/**
 * 配置接口
 * @param {
 *  secretKey: 密钥,
 *  data: 数据,
 *  status: 1 存 取
 *  key: 检索key 值   空为 自定义工艺配置 1 为自定义工艺是否展示
 * } data
 * @returns
 */
export function getAndSetConfig(data) {
  return axios({
    url: BASE_URL + '/special/miniCollageParams/getAndSetConfig',
    method: 'post',
    data
  });
}

/**
 * 获取服务器时间
 */
export function getCurrentTimeMillis() {
  return axios({
    url: BASE_URL + '/certifyFree/test/getCurrentTimeMillis',
    method: 'get'
  });
}
/**
 * 获取服务器时间
 */
export function getClientIP() {
  return axios({
    url: BASE_URL + '/certifyFree/user/getClientIP',
    // url: '/api/lt/certifyFree/user/getClientIP',
    method: 'get'
  });
}

/**
 * 上报埋点数据
 * @param {*} data
 */
export function report(data) {
  return axios({
    url: '/api/reported/system/action/report',
    method: 'POST',
    data,
    headers:{
      'Content-Type': 'application/json',
      Accept: '*/*'
    }
  });
}
