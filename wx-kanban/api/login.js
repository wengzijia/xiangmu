import {
  http
} from "../utils/request.js"
// const BESA_URL = `/consumer`;
const BESA_URL = `/mes/bw`;

// 获取验证码
export function getCode(data) {
  return http({
    // myHeader: {
    //   "loginSource":"2"  // 来源 1 生产管理平台 2机长看板
    // },
    url: '/mes/oauth/sys/login/sendNoteLogin',
    method: 'post',
    data
  });
}

// 短信登录
export function smsLogin(data) {
  return http({
    url: '/mes/oauth/sys/login/loginValidCode',
    method: 'post',
    data
  });
}

// 登录成功初始用户角色及权限数据
export function loginOkUserRoleAuthList(data) {
  return http({
    url: '/mes/oauth/sys/sysUser/loginOkUserRoleAuthList',
    method: 'post',
    data
  });
}

// 查询上班状态(该设备如果是上班状态&&设备非禁用状态，返回true 前端直接跳转到看板页面)
export function validDeviceStatus(deviceId) {
  return http({
    url: BESA_URL + `/record/punch/validDeviceStatus/${deviceId}`,
    method: 'get'
  });
}

// 退出登录
export function loginOut() {
  return http({
    url: '/mes/oauth/sys/login/loginOut',
    method: 'get'
  });
}