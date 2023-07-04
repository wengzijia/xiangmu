import request from '@/utils/request'
import { download } from '@/utils/request'
const BASE_URL = `/file-task`
// 获取打样工单列表
export function getWorkorderList(params) {
    return request({
      url: BASE_URL+'/proof_over_view/list',
      method: 'get',
      params
    })
}

// 获取工单操作历史列表
export function getHistoryList(params) {
    return request({
      url: BASE_URL+'/proof_over_view/taskInfo',
      method: 'get',
      params
    })
}

// 打样部强制撤回
export function violentWithdrawal(data) {
  return request({
    url: BASE_URL + '/proof_over_view/violentWithdrawal',
    method: 'post',
    data
  })
}

// 打样工单列表导出
export function exportProofOrderList(data,name) {
  return download( BASE_URL+`/proof_over_view/export`,data,name )
}
// 用料列表导出
export function exportMaterialsList(data,name) {
  return download( BASE_URL+`/digital-print/exportMaterial`,data,name )
}
// 属性分解
export function getParsingAttributes(activityId) {
  return request({
    url: BASE_URL+`/flow-data/parsingAttributes/${activityId}`,
    method: 'get'
  })
}