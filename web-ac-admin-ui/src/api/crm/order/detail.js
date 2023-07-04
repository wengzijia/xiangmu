import request from "@/utils/request";
const BASE_URL = "/customer-crm";

/**根据订单id查看方案设计流程所有数据,流程，节点，品类 */
export function getDesignProc(id, params) {
  return request({
    url: BASE_URL + `/crm-project-design-proc/order/all/${id}`,
    method: "get",
    params,
  });
}
/**通过订单id获得大货方案设计订单详情*/
export function getProjectDesignOrderProc(id) {
  return request({
    url: BASE_URL + `/crm-bulk-design-prod-order-proc/${id}`,
    method: "get",
  });
}
/**查询设计服务合同驳回记录*/
export function getDesignContractRecord(procId) {
  return request({
    url: BASE_URL + `/crm-project-design-task/history/design-service-contract/${procId}`,
    method: "get",
  });
}
/**查询提交设计方案驳回记录*/
export function getSubmitDesignProposal(procId) {
  return request({
    url: BASE_URL + `/crm-project-design-task/history/submit-design-proposal/${procId}`,
    method: "get",
  });
}
/**查询客户确认审核记录*/
export function getConfirmsDesignProposal(procId) {
  return request({
    url: BASE_URL + `/crm-project-design-task/history/customer_confirms_design_proposal/${procId}`,
    method: "get",
  });
}
/**通过订单id获得打样所有数据 */
export function getProofingOrderProc(id, params) {
  return request({
    url: BASE_URL + `/crm-proofing-proc/order/${id}`,
    method: "get",
    params,
  });
}
/**通过订单id获得大货报价流程所有数据 */
export function getBulkQuoteOrderProc(id, params) {
  return request({
    url: BASE_URL + `/crm-bulk-quote-proc/order/${id}`,
    method: "get",
    params,
  });
}
/**通过订单id获得大货合同流程所有数据 */
export function getBulkContractOrderProc(id, params) {
  return request({
    url: BASE_URL + `/crm-bulk-contract-proc/order/${id}`,
    method: "get",
    params,
  });
}
/**通过订单id获得大货设计流程所有数据 */
export function getBulkDesignOrderProc(id, params) {
  return request({
    url: BASE_URL + `/crm-bulk-design-proc/order/${id}`,
    method: "get",
    params,
  });
}
/** 通过订单id获得大货生产流程所有数据*/
export function getBulkProductionOrderProc(id, params) {
  return request({
    url: BASE_URL + `/crm-bulk-production-proc/order/${id}`,
    method: "get",
    params,
  });
}
/** 通过订单id获得付款对账流程所有数据*/
export function getPaymentProc(id, params) {
  return request({
    url: BASE_URL + `/crm-payment-proc/order/${id}`,
    method: "get",
    params,
  });
}
/**通过流程id查询提交总对账单节点驳回记录*/
export function getSubmitGeneralAccountStatement(procId) {
  return request({
    url: BASE_URL + `/crm-payment-task/reject/submit-general-account-statement/${procId}`,
    method: "get",
  });
}
/**通过流程id查询对账单客户确认审核记录*/
export function getAccountCustomerConfirmsRecord(procId) {
  return request({
    url: BASE_URL + `/crm-payment-task/reject/customer-confirms/${procId}`,
    method: "get",
  });
}
/**通过流程id查询履约付款(付款进度)驳回记录*/
export function getAccountPaymentRecord(procId) {
  return request({
    url: BASE_URL + `/crm-payment-task/reject/payment/${procId}`,
    method: "get",
  });
}

