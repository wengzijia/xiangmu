import {http} from "../utils/request.js"
const BESA_URL = `/consumer`;

// 获取所有权限。
export function getRoles(data){
  return http({
      url: BESA_URL + '/weitu/user/miniWechatPictureRole/getRoles',
      method:'post',
      data
    });
}
// 添加企业信息
export function addEnterpriseSetting(data){
  return http({
      url: BESA_URL + '/weitu/picture/miniWechatPictureEnterpriseSetting/addEnterpriseSetting',
      method:'post',
      data
    });
}
// 添加员工
export function addEmployee(data){
  return http({
      url: BESA_URL + '/weitu/user/miniWechatPictureEmployee/addEmployee',
      method:'post',
      data
    });
}
// 获取员工信息
export function getEmployeeInfo(data){
  return http({
      url: BESA_URL + '/weitu/user/miniWechatPictureEmployee/getEmployeeInfo',
      method:'post',
      data
    });
}
// 获取管理员及企业信息
export function getAdministratorInfo(data){
  return http({
      url: BESA_URL + '/weitu/user/miniWechatPictureEmployee/getAdministratorInfo',
      method:'post',
      data
    });
}
// 获取所有员工
export function getAllEmployee(data){
  return http({
      url: BESA_URL + '/weitu/user/miniWechatPictureEmployee/getAllEmployee',
      method:'post',
      data
    });
}
// 修改员工
export function updateEmployee(data){
  return http({
      url: BESA_URL + '/weitu/user/miniWechatPictureEmployee/updateEmployee',
      method:'post',
      data
    });
}
// 移除员工
export function deleteEmployee(data){
  return http({
      url: BESA_URL + '/weitu/user/miniWechatPictureEmployee/deleteEmployee',
      method:'post',
      data
    });
}