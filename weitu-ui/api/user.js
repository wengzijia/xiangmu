import {
  http
} from "../utils/request.js"
const BESA_URL = `/consumer`;

/**
 * 获取当前登录用户信息
 * @param {*} data 
 * @returns 
 */
export function getCurrentUserInfo(data) {
  return http({
    url: BESA_URL + '/user/miniWechatPictureUser/weChat/getCurrentUserInfo',
    method: 'post',
    data
  });
}

/**
 * 获取当前登录用户信息
 * @param {*} data 
 * @returns 
 */
export function getPictureUserInfo(data) {
  return http({
    url: BESA_URL + '/user/miniWechatPictureUser/weChat/getPictureUserInfo',
    method: 'post',
    data
  });
}


/**
 * 添加名片信息
 * @param {*} data 
 * @returns 
 */
export function addConsumerSalesperson(data) {
  return http({
    url: BESA_URL + '/user/miniWechatPictureUser/weChat/addConsumerSalesperson?salesperson='+data.salesperson,
    method: 'post'
  });
}
/**
 * 取消关注一个销售人员
 * @param {*} data 
 * @returns 
 */
export function releaseFocus(data) {
  return http({
    url: BESA_URL + '/user/miniWechatPictureUser/releaseFocus',
    method: 'post',
    data
  });
}
/**
 * 获取当前消费者关注的所有消费者
 * @param {*} data 
 * @returns 
 */
export function getCurrentUserFocusUser(data) {
  return http({
    url: BESA_URL + '/user/miniWechatPictureUser/getCurrentUserFocusUser',
    method: 'post',
    data
  });
}


/**
 * 获取当前微信小程序用户的推荐码
 * @param {*} data 
 * @returns 
 */
export function getWeChatMiniReferralCode(data) {
  return http({
    url: BESA_URL + '/user/miniWechatPictureUser/weChat/getWeChatMiniReferralCode',
    method: 'post',
    data
  });
}

/**
 * 获取当前微信小程序用户的推荐码
 * @param {*} data 
 * @returns 
 */
export function getAdministratorInfo(data) {
  return http({
    url: BESA_URL + '/weitu/user/miniWechatPictureEmployee/getAdministratorInfo',
    method: 'post',
    data
  });
}

/**
 * 获取当前微信小程序用户的推荐码
 * @param {*} data 
 * @returns 
 */
export function getEmployeeInfo(data) {
  return http({
    url: BESA_URL + '/weitu/user/miniWechatPictureEmployee/getEmployeeInfo',
    method: 'post',
    data
  });
}

/**
 * 名片切换或者进入名片时调用
 * @param {*} data 
 * @returns 
 */
export function addPageView(data) {
  return http({
    url: BESA_URL + '/user/miniWechatPictureUser/weChat/addPageView?salespersonId='+data.userId,
    method: 'post'
    // data
  });
}
