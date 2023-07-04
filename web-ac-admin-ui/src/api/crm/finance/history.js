import request from "@/utils/request";
const BASE_URL = "/customer-crm";

/**
 * 查询设计服务合同财务审核驳回记录
 */
export function getDesignServiceContractAudit(procId) {
  return request({
    url:
      BASE_URL +
      `/crm-project-design-task/history/design-service-contract-audit/${procId}`,
    method: "get",
  });
}
/**
 * 查询设计服务合同部门审核驳回记录
 */
export function getDesignServiceContractDeptAudit(procId) {
  return request({
    url:
      BASE_URL +
      `/crm-project-design-task/history/design-service-contract-dept-audit/${procId}`,
    method: "get",
  });
}
/**
 * 查询设计服务合同部门审核驳回记录
 */
export function getDesignServiceContractAuditTotal(procId) {
  return request({
    url:
      BASE_URL +
      `/crm-project-design-task/history/design-service-contract/${procId}`,
    method: "get",
  });
}

/**
 * 根据大货报价id查询供应商合同部门审核驳回数据
 */
export function getSupplierContractAuditTotal(bulkQuoteId) {
  return request({
    url:
      BASE_URL +
      `/crm-bulk-design-task/bulk-quote/reject/supplier-contract/${bulkQuoteId}`,
    method: "get",
  });
}
/**
 * 根据大货报价id查询供应商合同部门审核驳回数据
 */
export function getSupplierContractDeptAudit(bulkQuoteId) {
  return request({
    url:
      BASE_URL +
      `/crm-bulk-design-task/bulk-quote/reject/dept/supplier-contract-dept-audit/${bulkQuoteId}`,
    method: "get",
  });
}
/**
 * 根据大货报价id查询供应商合同财务审核驳回数据
 */
export function getSupplierContractAudit(bulkQuoteId) {
  return request({
    url:
      BASE_URL +
      `/crm-bulk-design-task/bulk-quote/reject/finance/supplier-contract-audit/${bulkQuoteId}`,
    method: "get",
  });
}

/**
 * 查询合同财务审核驳回记录
 */
export function getBulkContractAudit(procId) {
  return request({
    url:
      BASE_URL +
      `/crm-bulk-contract-task/history/bulk_contract_audit/${procId}`,
    method: "get",
  });
}
/**
 * 查询合同部门审核驳回记录
 */
export function getBulkContractDeptAudit(procId) {
  return request({
    url:
      BASE_URL +
      `/crm-bulk-contract-task/history/bulk_contract_dept_audit/${procId}`,
    method: "get",
  });
}
/**
 * 大货合同审核驳回记录
 */
export function getBulkContractAuditTotal(procId) {
  return request({
    url:
      BASE_URL + `/crm-bulk-contract-task/history/bulk-contract/${procId}`,
    method: "get",
  });
}

/**
 * 打样合同财务审核驳回记录
 */
export function getProofContractAudit(procId) {
  return request({
    url:
      BASE_URL + `/crm-proofing-task/reject/finance/contract-audit/${procId}`,
    method: "get",
  });
}
/**
 * 打样合同部门审核驳回记录
 */
export function getProofContractDeptAudit(procId) {
  return request({
    url:
      BASE_URL + `/crm-proofing-task/reject/dept/contract-dept-audit/${procId}`,
    method: "get",
  });
}
/**
 * 打样合同部门审核驳回记录
 */
export function getProofContractAuditTotal(procId) {
  return request({
    url:
      BASE_URL + `/crm-proofing-task/reject/contract-audit/${procId}`,
    method: "get",
  });
}

