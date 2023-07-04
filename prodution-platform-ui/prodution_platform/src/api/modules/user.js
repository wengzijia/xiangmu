// import request from "@/utils/http";
import {request} from '@/utils/request';
// 获取验证码
export const sendNoteLogin = (data) => {
  return request({
    url: "/api/mes/oauth/sys/login/sendNoteLogin",
    method: "Post",
    data,
  });
};

// 短信登录
export const loginValidCode = (data) => {
  return request({
    url: "/api/mes/oauth/sys/login/loginValidCode",
    method: "Post",
    data,
  });
};

export const loginOut = () => {
  return request({
    url: "/api/mes/oauth/sys/login/loginOut",
    method: "Get",
  });
};

// 获取微信授权二维码
export const getUuidAndQrUrl = (data) => {
  return request({
    url: `/api/mes/oauth/sys/login/getUuidAndQrUrl/${data.type}/${data.thirdType}`,
    method: "Post",
  });
};

// 查询微信授权状态或者登录状态
export const checkUuidStatus = (data) => {
  return request({
    url: `/api/mes/oauth/sys/login/checkUuidStatus/${data.type}/${data.uuid}/${data.thirdType}`,
    method: "Get",
    isLoading:true
  });
};

// token获取用户信息
export const loginOkUserRoleAuthList = () => {
  return request({
    // url: `/api/mes/oauth/sys/login/loginOkUserRoleAuthList`,
    url: `/api/mes/oauth/sys/sysUser/loginOkUserRoleAuthList`,
    method: "Post",
  });
};

// id获取用户信息
export const getPersonalDetail = (data) => {
  return request({
    url: `/api/mes/oauth/sys/personal/getPersonalDetail/${data.userId}`,
    method: "Get",
  });
};

// 个人中心-换绑手机号发送短信
export const sendNoteBind = (data) => {
  return request({
    url: `/api/mes/oauth/sys/personal/sendNoteBind`,
    method: "Post",
    data,
  });
};

// 个人中心-换绑短信验证及更换
export const changeBindMobile = (data) => {
  return request({
    url: `/api/mes/oauth/sys/personal/changeBindMobile`,
    method: "Post",
    data,
  });
};

// 个人中心-更换用户名
export const changeUserName = (data) => {
  return request({
    url: `/api/mes/oauth/sys/personal/changeUserName`,
    method: "Post",
    data,
  });
};
// 个人中心 - 解绑第三方信息;
export const unBindThirdLogin = (data) => {
  return request({
    url: `/api/mes/oauth/sys/personal/unBindThirdLogin/${data.thirdLoginId}`,
    method: "Delete",
  });
};

// 个人中心 - 上传头像;
export const uploadPortrait = (data) => {
  return request({
    url: `/api/mes/oauth/sys/personal/uploadPortrait`,
    method: "Post",
    data,
    headers: {
      "Content-Type": "multipart/form-data; charset=UTF-8",
      // "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
};

// 数据字典列表查询;
export const getMapData = (data) => {
  return request({
    url: `/api/mes/oauth/sys/sysDictionary/getList`,
    method: "Post",
    data,
  });
};
// 根据父级id查询子集列表信息
export const getRoleListByPid = (data) => {
  return request({
    url: `/api/mes/oauth/sys/sysOrgRole/getRoleListByPid/${data.pid}`,
    method: "Post",
  });
};
export default {
  sendNoteLogin,
  loginValidCode,
  loginOut,
  getUuidAndQrUrl,
  checkUuidStatus,
  loginOkUserRoleAuthList,
  getPersonalDetail,
  sendNoteBind,
  changeBindMobile,
  unBindThirdLogin,
  uploadPortrait,
  getMapData,
  getRoleListByPid,
  changeUserName
};
