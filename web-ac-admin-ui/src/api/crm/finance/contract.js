import request from "@/utils/request";
const BASE_URL = '/customer-crm'
import { download } from "@/utils/request";

/**
 * 分页查询部门合同审核
 */
export function getDeptAuditList(params) {
  return request({
    url: BASE_URL + `/crm-order-proc-view/contract/dept/audit`,
    method: "get",
    params
  });
}
/**
 * 分页查询合同审核
 */
export function getAuditList(params) {
  return request({
    url: BASE_URL + `/crm-order-proc-view/contract/audit`,
    method: "get",
    params
  });
}
/**导出合同审核列表 */
export function exportContractAuditList(data,name){
  return download( `/customer-crm/crm-order-proc-view/export/contract/audit`,data,name )
}
/**
 * 大货合同审核
 */
export function bulkContractAudit(data) {
  return request({
    url: BASE_URL + `/crm-bulk-contract-proc/bulk-contract-audit`,
    method: "post",
    data
  });
}
/**
 * 大货合同部门审核
 */
export function bulkDeptContractAudit(data) {
  return request({
    url: BASE_URL + `/crm-bulk-contract-proc/bulk-contract-dept-audit`,
    method: "post",
    data
  });
}
/**
 * 方案设计合同审核
 */
 export function designContractAudit(data) {
  return request({
    url: BASE_URL + `/crm-project-design-proc/design-service-contract-audit`,
    method: "post",
    data
  });
}
/**
 * 方案设计服务合同部门审核
 */
export function designDeptContractAudit(data) {
  return request({
    url: BASE_URL + `/crm-project-design-proc/design-service-contract-dept-audit`,
    method: "post",
    data
  });
}
/**
 * 供应商合同部门审核（打样）
 */
 export function proofDeptContractAudit(data) {
  return request({
    url: BASE_URL + `/crm-proofing-proc/contract-dept-audit`,
    method: "post",
    data
  });
}
/**
 * 供应商合同（打样）
 */
export function proofContractAudit(data) {
  return request({
    url: BASE_URL + `/crm-proofing-proc/contract-audit`,
    method: "post",
    data
  });
}
/**
 * 供应商合同（大货）
 */
 export function supplierContractAudit(data) {
  return request({
    url: BASE_URL + `/crm-bulk-design-proc/supplier-contract-audit`,
    method: "post",
    data
  });
}
/**
 * 供应商合同部门审核（大货）
 */
export function supplierDeptContractAudit(data) {
  return request({
    url: BASE_URL + `/crm-bulk-design-proc/supplier-contract-dept-audit`,
    method: "post",
    data
  });
}
/**
 * 获得设计订单详情
 */
 export function getDesignOrderProc(id) {
  return request({
    url: BASE_URL + `/crm-project-design-order-proc/${id}`,
    method: "get",
  });
}
/**
 * 获得设计订单节点详情
 */
 export function getDesignOrderTask(id) {
  return request({
    url: BASE_URL + `/crm-project-design-task/${id}`,
    method: "get",
  });
}
/**
 * 获得打样节点详情
 */
 export function getProofingTask(id) {
  return request({
    url: BASE_URL + `/crm-proofing-task/${id}`,
    method: "get",
  });
}
/**
 * 根据打样流程id获得品类集合
 */
 export function getProofingCategory(procId) {
  return request({
    url: BASE_URL + `/crm-proofing-category/${procId}`,
    method: "get",
  });
}

/**对账单审核列表*/
export function GetAccountStatementAudit(params) {
  return request({
    url: BASE_URL + `/crm-payment-proc/account-statement-audit`,
    method: "get",
    params
  });
}
/**导出对账单审核列表 */
export function exportAccountStatementAuditList(data,name){
  return download( `/customer-crm/crm-payment-proc/export/account-statement-audit`,data,name )
}

export function SetaccountStatementAudit(data) {
  return request({
    url: BASE_URL + `/crm-payment-proc/account-statement-audit`,
    method: "post",
    data
  });
}

//发票列表
export function GetInvoiceRecord(params) {
  return request({
    url: BASE_URL + `/crm-invoice-record`,
    method: "get",
    params
  });
}
/**导出发票列表 */
export function exportInvoiceList(data,name){
  return download( `/customer-crm/crm-invoice-record/export`,data,name )
}
/**获得订单节点详情 */
export function getBulkTask(id) {
  return request({
    url: BASE_URL + `/crm-bulk-contract-task/${id}`,
    method: "get",
  });
}
/**通过订单id获得打样所有数据 */
export function getBulkProofingDetail(id,params) {
  return request({
    url: BASE_URL + `/crm-proofing-proc/order/${id}`,
    method: "get",
    params
  });
}

//申请开票列表
export function GetApplyInvoice(params) {
  return request({
    url: BASE_URL + `/crm-order-proc-view/apply-invoice`,
    method: "get",
    params
  });
}

//根据客户id查询客户发票数据
export function CustomerInvoice(id) {
  return request({
    url: BASE_URL + `/crm-customer-invoice/${id}`,
    method: "get",
  });
}

//申请开票
export function InvoiceRecordApply(data) {
  return request({
    url: BASE_URL + `/crm-invoice-record/apply`,
    method: "post",
    data
  });
}

//根据客户id查询客户发票数据
export function InvoiceRecord(id) {
  return request({
    url: BASE_URL + `/crm-invoice-record/${id}`,
    method: "get",
  });
}

//财务开票
export function FinancialInvoice(data) {
  return request({
    url: BASE_URL + `/crm-invoice-record/financial-invoice`,
    method: "post",
    data
  });
}

//取消开票
export function InvoiceCancel(id) {
  return request({
    url: BASE_URL + `/crm-invoice-record/cancel/${id}`,
    method: "post",
  });
  }
/**过订单id获得整个大货流程(报价/设计/生产) */
export function getBulkProc(id,params) {
  return request({
    url: BASE_URL + `/crm-bulk-quote-proc/order/bulk/${id}`,
    method: "get",
    params
  });
}
//发票处理人
export function Getassignee(id) {
  return request({
    url: BASE_URL + `/crm-invoice-record/assignee/${id}`,
    method: "get",
  });
}
//通过节点id获得付款对账节点数据
export function PaymentTask(id) {
  return request({
    url: BASE_URL + `/crm-payment-task/${id}`,
    method: "get",
  });
}
/**通过大货设计流程id获得大货报价详情，供应商合同(大货)审核详情 */
export function getBulkDesignProc(id) {
  return request({
    url: BASE_URL + `/crm-bulk-design-proc/quote/${id}`,
    method: "get",
  });
}
/**根据节点id获得大货设计节点数据 */
export function getBulkDesignProcTask(id) {
  return request({
    url: BASE_URL + `/crm-bulk-design-task/${id}`,
    method: "get",
  });
}
/**通过订单id获得大货设计生产订单详情 */
export function getBulkDesignDetail(id,params) {
  return request({
    url: BASE_URL + `/crm-bulk-design-prod-order-proc/${id}`,
    method: "get",
    params
  });
}
/**查询付款对账流程处理人集合 */
export function assigneeType(assigneeType) {
  return request({
    url: BASE_URL + `/crm-payment-proc/assignee/${assigneeType}`,
    method: "get",
  });
}
/**查询合同审核审核人集合 */
export function getAuditer() {
  return request({
    url: BASE_URL + `/crm-order-proc-view/contract/audit/auditer`,
    method: "get",
  });
}
