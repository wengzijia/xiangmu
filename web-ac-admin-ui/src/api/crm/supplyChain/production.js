import request from "@/utils/request";
const BASE_URL = "/customer-crm";

/**获得大货报价流程所有数据*/
export function getBulkDetail(id) {
  return request({
    url: BASE_URL + `/crm-bulk-quote-proc/all/${id}`,
    method: "get",
  });
}
/**大货报价外发供应商*/
export function sourcingSupplier(data) {
  return request({
    url: BASE_URL + `/crm-bulk-quote-proc/out-sourcing-supplier`,
    method: "post",
    data,
  });
}

/**根据大货报价流程id获得大货合同流程所有数据*/
export function getBulkContractDetail(id) {
  return request({
    url: BASE_URL + `/crm-bulk-contract-proc/all/bulk-quote/${id}`,
    method: "get",
  });
}
/**根据大货报价流程id获得大货设计流程所有数据*/
export function getBulkQuoteDetail(id) {
  return request({
    url: BASE_URL + `/crm-bulk-design-proc/all/bulk-quote/${id}`,
    method: "get",
  });
}
/**根据大货报价流程id获得大货生产流程所有数据*/
export function getBulkProductionDetail(id) {
  return request({
    url: BASE_URL + `/crm-bulk-production-proc/all/bulk-quote/${id}`,
    method: "get",
  });
}
/**大货报价外发供应商*/
export function supplierContract(data) {
  return request({
    url: BASE_URL + `/crm-bulk-design-proc/supplier-contract`,
    method: "post",
    data,
  });
}
/**提交大货文件设计*/
export function bulkDesignFile(data) {
  return request({
    url: BASE_URL + `/crm-bulk-design-proc/bulk-file-design`,
    method: "post",
    data,
  });
}
/**提交大货发货*/
export function bulkDelivery(data) {
  return request({
    url: BASE_URL + `/crm-bulk-production-proc/bulk-delivery`,
    method: "post",
    data,
  });
}
/**根据大货报价id查询大货文件设计驳回数据*/
export function bulkDesignHistory(bulkQuoteId) {
  return request({
    url: BASE_URL + `/crm-bulk-design-task/bulk-quote/reject/bulk-file-design/${bulkQuoteId}`,
    method: "get",
  });
}
/**根据大货报价id查询供应商合同驳回数据*/
export function bulkContractHistory(bulkQuoteId) {
  return request({
    url: BASE_URL + `/crm-bulk-design-task/bulk-quote/reject/supplier-contract/${bulkQuoteId}`,
    method: "get",
  });
}
/**根据大货报价id查询客户确认设计方案审核记录*/
export function bulkConfirmsHistory(bulkQuoteId) {
  return request({
    url: BASE_URL + `/crm-bulk-design-task/bulk-quote/customer-confirms/${bulkQuoteId}`,
    method: "get",
  });
}