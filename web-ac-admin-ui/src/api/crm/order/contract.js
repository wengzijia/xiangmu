import request from "@/utils/request";
const BASE_URL = '/customer-crm'
import { download } from "@/utils/request";

//分页查询合同管理
export function management(params) {
  return request({
    url: BASE_URL + `/crm-order-proc-view/contract/management`,
    method: "get",
    params
  });
}

//方案设计订单详情
export function getcrmprojectdesignorderprocid(params) {
    return request({
        url: BASE_URL + `/crm-project-design-order-proc/${params}`,
        method: "get"
    });
}

//方案设计合同驳回记录
export function getdesignservicecontractid(params) {
  return request({
      url: BASE_URL + `/crm-project-design-task/history/design-service-contract/${params}`,
      method: "get"
  });
}

//大货驳回 crm-bulk-contract-task/history/bulk-contract
export function bulkcontract(params) {
  return request({
      url: BASE_URL + `/crm-bulk-contract-task/history/bulk-contract/${params}`,
      method: "get"
  });
}
//大货合同签订
export function procbulkcontract(data) {
  return request({
      url: BASE_URL + `/crm-bulk-contract-proc/bulk-contract`,
      method: "post",
      data
  });
}
//签订合同
export function designservicecontract(data) {
  return request({
      url: BASE_URL + `/crm-project-design-proc/design-service-contract`,
      method: "post",
      data
  });
}

//对账单列表
export function accountStatement(params) {
  return request({
      url: BASE_URL + `/crm-payment-proc/account-statement`,
      method: "get",
      params
  });
}

//提交对账单
export function SubmitGeneralAccountStatement(data) {
  return request({
      url: BASE_URL + `/crm-payment-proc/submit-general-account-statement`,
      method: "post",
      data
  });
}


//分页查询订单确认审核
export function FinancialAudit(params) {
  return request({
      url: BASE_URL + `/crm-payment-proc/financial-audit`,
      method: "get",
      params
  });
}

//根据节点id查询付款凭证集合
export function RecordTaskRelation(id) {
  return request({
    url: BASE_URL + `/crm-payment-record-task-relation/task/${id}`,
    method: "get",
  });
}

//订单审核是否通过
export function financialAudit(data) {
  return request({
      url: BASE_URL + `/crm-payment-proc/batch/financial-audit`,
      method: "post",
      data
  });
}
/**导出订单确认列表 */
export function exportFinancialAuditList(data,name){
  return download( `/customer-crm/crm-payment-proc/export/financial-audit`,data,name )
}