import {http} from "../utils/request.js"
const BESA_URL = `/consumer`;

// 添加分类
export function addOrUpdateCategory(data){
  return http({
      url: BESA_URL + '/weitu/miniWechatPictureCategory/addOrUpdateCategory',
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

// 添加轮播图
export function addOrUpdateAdSettingBath(data){
  return http({
      url: BESA_URL + '/picture/enterprise/miniWechatPictureAdSetting/addOrUpdateAdSettingBath',
      method:'post',
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

// 商场轮播图删除
export function deleteAdSettingBath(data){
  return http({
      url: BESA_URL + '/picture/enterprise/miniWechatPictureAdSetting/deleteAdSettingBath',
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

// 获取分类(一二级)
export function getCurrentAndParents(data){
  return http({
      url: BESA_URL + '/weitu/miniWechatPictureCategory/getCurrentAndParents',
      method:'post',
      data
    });
}

// 获取分类列表
export function categoryList(data){
  return http({
      url: BESA_URL + '/certifyFree/pack/miniPackWebCategory/categoryList',
      method:'post',
      data
    });
}

// 获取方案分页
export function pagePackScheme(data){
  return http({
      url: BESA_URL + '/certifyFree/pack/miniPackScheme/pagePackScheme',
      method:'post',
      data
    });
}

// 查询方案
export function queryScheme(data){
  return http({
      url: BESA_URL + '/weitu/miniWechatPictureCategory/pagePackScheme',
      method:'post',
      data
    });
}