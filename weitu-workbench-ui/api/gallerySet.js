import {http} from "../utils/request.js"
const BESA_URL = `/consumer`;
// 企业轮播图、合作案例、工厂展示添加
export function addAdSetting(data){
  return http({
      url: BESA_URL + '/picture/enterprise/miniWechatPictureAdSetting/addAdSetting',
      method:'post',
      data 
    });
}
// 企业简介 联系电话地址添加添加
export function addInformation(data){
  return http({
      url: BESA_URL + '/picture/enterprise/miniWechatPictureAdSetting/addInformation',
      method:'post',
      data
    });
}
// 获取展厅信息
export function geinInformation(data){
  return http({
      url: BESA_URL + '/picture/enterprise/miniWechatPictureAdSetting/geinInformation',
      method:'post',
      data
    });
}
// 企业轮播图、合作案例、工厂展示修改
export function updateAdSetting(data){
  return http({
      url: BESA_URL + '/picture/enterprise/miniWechatPictureAdSetting/updateAdSetting',
      method:'post',
      data
    });
}
//企业轮播图、合作案例、工厂展示删除
export function delAdSetting(data){
  return http({
      url: BESA_URL + '/picture/enterprise/miniWechatPictureAdSetting/delAdSetting',
      method:'post',
      data
    });
}