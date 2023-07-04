import {http} from "../utils/request.js"

const BESA_URL = `/consumer`;

/**
 * 获取当前登录用户信息
 * @param {*} data 
 * @returns 
 */
export function getSchemeDetailBySchemeId(data) {
  return http({
    url: BESA_URL + '/certifyFree/pack/miniPackScheme/getSchemeDetailBySchemeId',
    method: 'post',
    data
  });
}

// 获取轮播图
export function getAdSetting(data){
  return http({
      url: BESA_URL + '/picture/enterprise/miniWechatPictureAdSetting/getAdSetting',
      method:'post',
      data
    });
}

// 获取二级分类方案(查询首页方案)
export function getSchemeForFrontPage(data){
  return http({
      url: BESA_URL + '/weitu/miniWechatPictureCategory/getSchemeForFrontPage',
      method:'post',
      data
    });
}

// 获取分类
export function getCategories(data){
  return http({
      url: BESA_URL + '/weitu/miniWechatPictureCategory/getCategories',
      method:'post',
      data
    });
}

// 查询方案
export function pagePackScheme(data){
  return http({
      url: BESA_URL + '/weitu/miniWechatPictureCategory/pagePackScheme',
      method:'post',
      data
    });
}