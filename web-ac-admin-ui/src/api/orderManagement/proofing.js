import request from "@/utils/request";
import { download } from "@/utils/request";

/**导出打样列表 */
export function exportProofingList(data,name){
  return download( `/customer-crm/crm-proofing-proc/export`,data,name )
}

/**   分页查询打样*/
export function proofingProc(params) {
  return request({
    url: '/customer-crm/crm-proofing-proc',
    method: 'get',
    params,
  })
}

/**   打样供应链专员领取任务*/
export function receivesTask(data) {
  return request({
    url: `/customer-crm/crm-proofing-proc/supply-chain-specialist-receives-task`,
    method: 'post',
    data,
  })
}
/**  大货供应链专员领取任务 */
export function bulkReceivesTask(data) {
  return request({
    url: `/customer-crm/crm-bulk-quote-proc/supply-chain-specialist-receives-task`,
    method: 'post',
    data,
  })
}
/** 根据流程类型获得节点配置集合*/
export function processTaskConfig(data) {
  return request({
    url: `/customer-crm/crm-process-task-config/${data}`,
    method: 'get',
  })
}
/** 获得打样流程所有数据,包含流程、节点、品类 */
export function proofingProcAll(data) {
  return request({
    url: `/customer-crm/crm-proofing-proc/all/${data}`,
    method: 'get',
  })
}
//  根据大货报价流程id获得大货设计节点品类数据，客户确认通过
export function bulkQuote(bulkQuoteId) {
  return request({
    url: `/customer-crm/crm-bulk-design-task-category/bulk-quote/${bulkQuoteId}`,
    method: 'get',
  })
}
/** 通过订单id获得打样数据，包括打样流程，打样流程品类 */
export function proofingProcOrder(data,params) {
  return request({
    url: `/customer-crm/crm-proofing-proc/order/${data}`,
    method: 'get',
    params,
  })
}
/**  分页查询大货生产*/
export function bulkQuoteProc(params) {
  return request({
    url: `/customer-crm/crm-bulk-quote-proc`,
    method: 'get',
    params,
  })
}
/**导出大货列表 */
export function exportBlukList(data,name){
  return download( `/customer-crm/crm-bulk-quote-proc/export`,data,name )
}


