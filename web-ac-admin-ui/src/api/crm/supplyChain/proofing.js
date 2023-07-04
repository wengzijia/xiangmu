import request from "@/utils/request";
import request2 from "@/utils/request2";
const BASE_URL = '/customer-crm'

/**得打样流程所有数据,包含流程、节点、品类*/
export function getProofingDetail(id) {
  return request({
    url: BASE_URL + `/crm-proofing-proc/all/${id}`,
    method: "get",
  });
}
/**中台计价*/
export function invoke(data) {
  return request2({
    url: `/certifyFree/price/invoke`,
    method: "post",
    data
  });
}
/**中台打样计价*/
export function proofInvoke(data) {
  return request2({
    url: `/certifyFree/proof/getPrice`,
    method: "post",
    data
  });
}
/**供应商合同签订*/
export function contractWithSupplier(data) {
  return request({
    url: BASE_URL + `/crm-proofing-proc/contract-with-supplier`,
    method: "post",
    data
  });
}
/**样品发货*/
export function proofingDelivery(data) {
  return request({
    url: BASE_URL + `/crm-proofing-proc/proofing-delivery`,
    method: "post",
    data
  });
}
/**
 * 获取方案设计订单详情
 * @param {*} id 
 * @returns 
 */
export function getDesignOrderDetail(id) {
  return request({
    url: BASE_URL + `/crm-project-design-order-proc/${id}`,
    method: "get",
  });
}
/**
 * 获取大货订单详情
 * @param {*} id 
 * @returns 
 */
 export function getBulkDesignOrderDetail(id) {
  return request({
    url: BASE_URL + `/crm-bulk-design-prod-order-proc/${id}`,
    method: "get",
  });
}
/**
 * 获取大货订单详情
 * @param {*} id 
 * @returns 
 */
 export function getOrderDetail(id) {
  return request({
    url: BASE_URL + `/crm-bulk-order-proc/${id}`,
    method: "get",
  });
}
/** 供应商合同签订驳回记录*/
export function contractAudit(procId) {
  return request({
    url: BASE_URL +`/crm-proofing-task/reject/contract-audit/${procId}`,
    method: 'get',
  })
}
/** 样品发货驳回记录*/
export function customerConfirms(procId) {
  return request({
    url: BASE_URL +`/crm-proofing-task/reject/customer-confirms/${procId}`,
    method: 'get',
  })
}