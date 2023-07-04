import request from "@/utils/request";
const BASE_URL = '/customer-crm'

/**分页查询客户确认 */
export function getConfirmsList(params) {
  return request({
    url: BASE_URL + `/crm-customer-confirms-record`,
    method: "get",
    params
  });
}
/**查看客户确认详情(设计详情) */
export function getConfirmsDetail(recordId) {
  return request({
    url: BASE_URL + `/crm-project-design-proc/customer-confirms-design-proposal/${recordId}`,
    method: "get",
  });
}
/**查询对账单客户确认详情 */
export function getConfirmsAccountDetail(recordId) {
  return request({
    url: BASE_URL + `/crm-payment-proc/customer-confirms-account-statement/${recordId}`,
    method: "get",
  });
}

/**对账单客户确认 */
export function confirmsAccountStatement(data) {
  return request({
    url: BASE_URL + `/crm-payment-proc/customer-confirms-account-statement`,
    method: "post",
    data
  });
}
/**客户确认设计方案 */
export function confirmsDesign(data) {
  return request({
    url: BASE_URL + `/crm-project-design-proc/customer-confirms-design-proposal`,
    method: "post",
    data
  });
}
/**查看打样客户确认详情 */
export function getProofConfirmsDetail(recordId) {
  return request({
    url: BASE_URL + `/crm-proofing-proc/customer-confirms/${recordId}`,
    method: "get",
  });
}
/**客户确认打样 */
export function confirmsProof(data) {
  return request({
    url: BASE_URL + `/crm-proofing-proc/customer-confirms`,
    method: "post",
    data
  });
}
/**查看大货设计客户确认详情 */
export function getCustomerConfirmsDetail(recordId) {
  return request({
    url: BASE_URL + `/crm-bulk-design-proc/customer-confirms/${recordId}`,
    method: "get",
  });
}
/**客户确认大货文件设计 */
export function customerConfirmsBulkFileDesign(data) {
  return request({
    url: BASE_URL + `/crm-bulk-design-proc/customerConfirmsBulkFileDesign`,
    method: "post",
    data
  });
}