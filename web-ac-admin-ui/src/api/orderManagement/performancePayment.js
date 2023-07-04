import request from "@/utils/request";import { download } from "@/utils/request";


/**导出履约付款管理列表 */
export function exportPaymentRecordList(data,name){
  return download( `/customer-crm/crm-performance-payment-record/export`,data,name )
}

//  分页履约付款
export function performancePaymentRecord(params) {
  return request({
    url: '/customer-crm/crm-performance-payment-record/page',
    method: 'get',
    params,
  })
}

//  获得履约付款详情
export function performancePaymentDetails(params) {
  return request({
    url: `/customer-crm/crm-performance-payment-record/${params}`,
    method: 'get',
  })
}
//  新增付款凭证记录
export function paymentRecord(data) {
  return request({
    url: `/customer-crm/crm-payment-record`,
    method: 'post',
    data,
  })
}
//  分页查询付款凭证
export function lookPaymentRecord(params) {
  return request({
    url: `/customer-crm/crm-payment-record`,
    method: 'get',
    params,
  })
}
//  分页查询付款凭证
export function deletePaymentRecord(params) {
  return request({
    url: `/customer-crm/crm-payment-record/${params}`,
    method: 'DELETE',
  })
}
//  付款凭证审核
export function auditPaymentRecord(data) {
  return request({
    url: `/customer-crm/crm-payment-record/audit`,
    method: 'post',
    data,
  })
}
//  履约付款提交订单审核,提交对账进度节点
export function submitPayment(id) {
  return request({
    url: `/customer-crm/crm-payment-proc/payment/${id}`,
    method: 'post',
  })
}
//  通过流程id查询履约付款驳回记录
export function rejectRecord(procId) {
  return request({
    url: `/customer-crm/crm-payment-task/reject/payment/${procId}`,
    method: 'get',
  })
}


