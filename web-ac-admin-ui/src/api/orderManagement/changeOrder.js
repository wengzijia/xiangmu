import request from "@/utils/request";
import { download } from "@/utils/request";


/**导出订单变更列表 */
export function exportChangeOrderList(data,name){
  return download( `/customer-crm/crm-order-change-record/export`,data,name )
}
/**   分页查询订单变更记录*/
export function orderChangeRecord(params) {
  return request({
    url: '/customer-crm/crm-order-change-record',
    method: 'get',
    params,
  })
}
/**   新建订单变更*/
export function newChangeOrder(data) {
  return request({
    url: `/customer-crm/crm-order-change-record`,
    method: 'post',
    data,
  })
}
/**   审批订单变更*/
export function auditOrder(data) {
  return request({
    url: `/customer-crm/crm-order-change-record`,
    method: 'put',
    data,
  })
}
/**   查询处理人集合*/
export function queryHandler(assigneeType) {
  return request({
    url: `/customer-crm/crm-order-change-record/assignee/${assigneeType}`,
    method: 'get',
  })
}
/**   根据订单编号查询订单变更申请前数据*/
export function preApplicationData(orderBusinessKey) {
  return request({
    url: `/customer-crm/crm-order-change-record/order/${orderBusinessKey}`,
    method: 'get',
  })
}