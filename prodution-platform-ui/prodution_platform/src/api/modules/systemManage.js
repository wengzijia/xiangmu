// import request from "@/utils/http";
import {request} from '@/utils/request';
//isLoading:true;表示当前接口调用的时候禁用正在加载的提示框

/**
 * 添加加工商时，输入电话号码，需要对电话号码进行校验
 */
// export const checkAndGetByMobile = (mobile) => {
//     return get({url: `/api/mes/courtship/manufacturer/checkAndGetByMobile/${mobile}`,isLoading:true})
// }


// 短信登录
export const getUserPage = (data) => {
  return request({
    url: "/api/mes/oauth/sys/sysUser/getUserPage",
    method: "Post",
    data,
  });
};

// 查询用户信息
export const getUserDetail = (data) => {
  return request({
    url: `/api/mes/oauth/sys/sysUser/getUserDetail/${data.userId}`,
    method: "Get",
  });
};

// 查询组织角色树形菜单
export const getRoleTreeList = (data) => {
  return request({
    url: "/api/mes/oauth/sys/sysOrgRole/getRoleTreeList",
    method: "Post",
    data,
  });
};

// 新增用户
export const saveUser = (data) => {
  return request({
    url: "/api/mes/oauth/sys/sysUser/saveUser",
    method: "Post",
    data,
  });
};

// 修改用户
export const updateUser = (data) => {
  return request({
    url: "/api/mes/oauth/sys/sysUser/updateUser",
    method: "Post",
    data,
  });
};

// 查询组织角色基本信息
export const getRoleBaseInfo = (data) => {
  return request({
    url: "/api/mes/oauth/sys/sysOrgRole/getRoleBaseInfo",
    method: "Post",
    data,
  });
};

// 查询组织角色数据权限
export const getRoleDataRuleList = (data) => {
  return request({
    url: "/api/mes/oauth/sys/sysOrgRole/getRoleDataRuleList",
    method: "Post",
    data,
  });
};

// 查询组织角色数据权限
export const getRoleUserPage = (data) => {
  return request({
    url: "/api/mes/oauth/sys/sysOrgRole/getRoleUserPage",
    method: "Post",
    data,
  });
};

// 角色信息修改
export const updateRole = (data) => {
  return request({
    url: "/api/mes/oauth/sys/sysOrgRole/updateRole",
    method: "Post",
    data,
  });
};

// 查询组织角色操作权限树
export const getRoleMenuTreeList = (data) => {
  return request({
    url: "/api/mes/oauth/sys/sysOrgRole/getRoleMenuTreeList",
    method: "Post",
    data,
  });
};

// 产业园表列表查询
export const getIndustrialParkList = () => {
  return request({
    url: "/api/mes/courtship/park/industrialPark/getIndustrialParkList",
    method: "Post",
  });
};

// 加工商表列表查询
export const getAllManufacturerList = () => {
  return request({
    url: "/api/mes/courtship/manufacturer/getAllManufacturerList",//旧地址
    method: "Post",
  });
};

// 查询组织下的角色信息
export const getRoleTreeByOrg = (data) => {
  return request({
    url: "/api/mes/oauth/sys/sysOrgRole/getRoleTreeByOrg",
    method: "Post",
    data,
  });
};

// 删除角色信息
export const delRoleById = (data) => {
  return request({
    url: `/api/mes/oauth/sys/sysOrgRole/delRoleById/${data.id}`,
    method: "Delete",
  });
};

// 保存角色信息
export const saveRole = (data) => {
  return request({
    url: `/api/mes/oauth/sys/sysOrgRole/saveRole`,
    method: "Post",
    data,
  });
};

export default {
  getUserPage,
  getRoleTreeList,
  saveUser,
  getUserDetail,
  updateUser,
  getRoleBaseInfo,
  getRoleDataRuleList,
  getRoleUserPage,
  updateRole,
  getRoleMenuTreeList,
  getIndustrialParkList,
  getAllManufacturerList,
  getRoleTreeByOrg,
  delRoleById,
  saveRole,
};
