import request from "@/utils/request";
const BASE_URL = '/customer-crm'

//获得当前登录用户crm部门数据
export function getCrmDept() {
  return request({
    url: BASE_URL + `/crm-dept`,
    method: "get"
  });
}

//获得当crm所有部门数据
export function getCrmAllDept() {
    return request({
      url: BASE_URL + `/crm-dept/all`,
      method: "get"
    });
  }
