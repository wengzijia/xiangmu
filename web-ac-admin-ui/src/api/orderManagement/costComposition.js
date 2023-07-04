import request from "@/utils/request";

//  分页查询成本构成
export function costStructure(params) {
  return request({
    url: '/customer-crm/crm-order-proc-view/cost-structure',
    method: 'get',
    params,
  })
}
//  通过节点id获得方案设计节点数据
export function projectDesignTask(id) {
  return request({
    url: `/customer-crm/crm-project-design-task/${id}`,
    method: 'get',
  })
}
//  通过节点id获得节点数据---方案设计订单获取全成本核算表和方案设计成本费(含税)
export function projectDesignOrderTask(id) {
  return request({
    url: `/customer-crm/crm-project-design-order-task/${id}`,
    method: 'get',
  })
}
//  通过节点id获得节点数据---大货订单和大货设计生产订单获取全成本核算表和方案设计成本费(含税)
export function bulkContractTask(id) {
  return request({
    url: `/customer-crm/crm-bulk-contract-task/${id}`,
    method: 'get',
  })
}
// 查询成本构成上传人集合
export function uploader() {
  return request({
    url: `/customer-crm/crm-order-proc-view/cost-structure/uploader`,
    method: 'get',
  })
}
// 通过订单id获得打样所有数据
export function proofingAllData(orderId,params) {
  return request({
    url: `/customer-crm/crm-proofing-proc/order/${orderId}`,
    method: 'get',
    params,
  })
}
// 通过订单id获得大货流程
export function bulkAllData(orderId,params) {
  return request({
    url: `/customer-crm/crm-bulk-quote-proc/order/bulk/${orderId}`,
    method: 'get',
    params,
  })
}
//  方案设计的成本构成 -提交
export function projectDesignCost(data) {
  return request({
    url: '/customer-crm/crm-project-design-order-proc/cost-structure',
    method: 'post',
    data,
  })
}
//  大货订单和大货设计生产订单的成本构成 -提交
export function bulkContractCost(data) {
  return request({
    url: '/customer-crm/crm-bulk-contract-proc/cost-structure',
    method: 'post',
    data,
  })
}