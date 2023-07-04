import request from "@/utils/request";
import { download } from "@/utils/request";
const BASE_URL = `/customer-crm`;
/**
 * 分页查询客户信息
 */
export function GetCustomer(params) {
  return request({
    url: BASE_URL+'/crm-customer',
    method: 'get',
    params,
  })
}
// 分页查询申请记录
export function Getcustomerapply(params) {
  return request({
    url: BASE_URL+'/crm-customer-apply',
    method: 'get',
    params,
  })
}
export function Getcustomerapplyid(params) {
  return request({
    url: BASE_URL+'/crm-customer-apply/'+params.id,
    method: 'get',
  })
}
export function setcustomerapply(data) {
  return request({
    url: BASE_URL+'/crm-customer-apply/',
    method: 'post',
    data
  })
}
// 审批详情
export function GetCustomerid(params) {
  return request({
    url: BASE_URL+'/crm-customer/'+params.id,
    method: 'get',
  })
}
export function setenabled(data) {
  return request({
    url: BASE_URL+'/crm-customer/enabled',
    method: 'PUT',
    data
  })
}
/**
 * 新建客户
 */
export function AddCustomer(data) {
  return request({
    url: BASE_URL+'/crm-customer',
    method: 'post',
    data,
  })
}
export function SetCustomer(data) {
  return request({
    url: BASE_URL+'/crm-customer',
    method: 'put',
    data,
  })
}
/**
 * 更改客户状态
 */
export function changeStatus(){

}
/**
 * 查询客户信息详情
 */
 export function customerDetail(data) {
  return request({
    url: BASE_URL+`/crm-customer/${data}`,
    method: 'get',
  })
}

export function gradingCalculateConfig(data) {
  return request({
    url: BASE_URL+`/crm-customer-grading-calculate-config`,
    method: 'get',
  })
}
/**
 * 查询变更审核人集合
 */
export function getApprovaler() {
  return request({
    url: BASE_URL+`/crm-customer-apply/approvaler`,
    method: 'get',
  })
}
/**
 * 导出客户表
 * @returns boob
 */
export function exportCustomer(data,name){
  return download( BASE_URL+`/crm-customer/export`,data,name )
}

// 方案设计驳回节点数据
export function projectreject(data) {
  return request({
    url: BASE_URL+`/crm-project-design-task/newest/reject/${data}`,
    method: 'get',
    data
  })
}

// 大货驳回节点数据
export function bulkreject(data) {
  return request({
    url: BASE_URL+`/crm-bulk-contract-task/newest/reject/${data}`,
    method: 'get',
    data
  })
}
