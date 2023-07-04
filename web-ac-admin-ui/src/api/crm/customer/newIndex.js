import request from "@/utils/request";
import { download } from "@/utils/request";
const BASE_URL = "/customer-crm";

/**分页查询客户信息列表 */
export function getCustomerList(params) {
  return request({
    url: BASE_URL + `/new/crm-customer`,
    method: "get",
    params,
  });
}


/** 分页查询部门审批列表 */
export function getApplyDeptList(params) {
  return request({
    url: BASE_URL + `/new/crm-customer-apply/dept`,
    method: "get",
    params,
    headers:{
      Accept:'*/*',
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
    }
  });
}

/**查询客户信息详情 */
export function getCrmCustomer(id) {
  return request({
    url: BASE_URL + `/new/crm-customer/${id}`,
    method: "get",
  });
}

/**客户建档 */
export function newCrmCustomer(data) {
  return request({
    url: BASE_URL + `/new/crm-customer`,
    method: "post",
    data
  });
}

/**查看部门/财务审核记录详情 */
export function getCrmCustomerApply(id) {
  return request({
    url: BASE_URL + `/new/crm-customer-apply/${id}`,
    method: "get",
  });
}

/**部门审批 */
export function getCrmCustomerApplyDept(data) {
  return request({
    url: BASE_URL + `/new/crm-customer-apply/dept`,
    method: "post",
    data
  });
}
/** 分页查询财务审批列表 */
export function getFinanceList(params) {
  return request({
    url: BASE_URL + `/new/crm-customer-apply/finance`,
    method: "get",
    params,
    headers:{
      Accept:'*/*',
      'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
    }
  });
}

/** 财务联合审批 */
export function customerfinanceAccount(data) {
  return request({
    url: BASE_URL + `/new/crm-customer-apply/finance/account`,
    method: "post",
    data
  });
}

/** 财务审批账期申请 */
export function customerfinanceAll(data) {
  return request({
    url: BASE_URL + `/new/crm-customer-apply/finance/all`,
    method: "post",
    data
  });
}
/** 财务审批账期申请 */
export function customerfinanceBaseInfo(data) {
  return request({
    url: BASE_URL + `/new/crm-customer-apply/finance/base-info`,
    method: "post",
    data
  });
}



/**修改客户信息/申请账期 */
export function modifyCrmCustomer(data) {
  return request({
    url: BASE_URL + `/new/crm-customer`,
    method: "PUT",
    data
  });
}

/**导出业务员提交审核数据 */
export function exportCrmCustomer(id,name) {
  return download( BASE_URL + `/new/crm-customer-apply/export/business/${id}`,null,name )
}

