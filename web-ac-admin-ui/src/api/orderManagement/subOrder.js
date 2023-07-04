import request from "@/utils/request";
import { download } from "@/utils/request";


/**导出订单列表 */
export function exportOrderList(data,name){
  return download( `/customer-crm/crm-order-proc-view/export/order`,data,name )
}

//  crm订单流程视图--分页查询订单
export function crmOrderProcView(params) {
  return request({
    url: '/customer-crm/crm-order-proc-view',
    method: 'get',
    params,
  })
}
//  crm获取所有业务员
export function roleKey(path,params) {
  return request({
    url: `/system/user/role/role-key/${path}`,
    method: 'get',
    params
  })
}
//  crm获取所有业务员(开发用)
export function roleKey2(path,params) {
  return request({
    url: `/customer-crm/crm-dept/role/role-key/${path}`,
    method: 'get',
    params
  })
}
//  crm获取所有业务员
export function customerBaseInfo(params) {
  return request({
    url: `/customer-crm/crm-customer-base-info`,
    method: 'get',
    params,
  })
}
//  CRM分页查询已启动的客户数据
export function customerEnabled(params) {
  return request({
    url: `/customer-crm/crm-customer/enabled`,
    method: 'get',
    params,
  })
}
//  新增方案设计订单
export function crmProjectDesignOrderProc(data) {
  return request({
    url: `/customer-crm/crm-project-design-order-proc`,
    method: 'post',
    data,
  })
}
//  新增大货订单
export function crmBulkOrderProc(data) {
  return request({
    url: `/customer-crm/crm-bulk-order-proc`,
    method: 'post',
    data,
  })
}
//  新增大货设计生产订单
export function crmBulkDesignProdOrderProc(data) {
  return request({
    url: `/customer-crm/crm-bulk-design-prod-order-proc`,
    method: 'post',
    data,
  })
}
// 查询开票主体
export function crmInvoiceConfig(params) {
  return request({
    url: `/customer-crm/crm-invoice-config/${params}`,
    method: 'get',
    params,
  })
}
// 分页查询供应商信息
export function crmSupplier(params) {
  return request({
    url: `/customer-crm/crm-supplier`,
    method: 'get',
    params,
  })
}
/**导出供应商列表 */
export function exportSupplierList(data,name){
  return download( `/customer-crm/crm-supplier/export`,data,name )
}
// 查询品类
export function baseCategory(params) {
  return request({
    url: `/base-data/base-category`,
    method: 'get',
    params,
  })
}
// 查询供应商详情数据
export function supplierDetail(params) {
  return request({
    url: `/customer-crm/crm-supplier/${params}`,
    method: 'get',
  })
}
// 根据客户id查询收货地址
export function customerAddress(params) {
  return request({
    url: `/customer-crm/crm-customer-address/${params}`,
    method: 'get',
  })
}

//查询客户详情
export function customerdata(params) {
  return request({
    url: `/customer-crm/crm-customer/${params}`,
    method: 'get',
  })
}

// 修改供应商启动状态
export function crmEnabled(params) {
  return request({
    url: `/customer-crm/crm-supplier/enabled`,
    method: 'put',
    data:params,
  })
}
// 新增供应商
export function newNupplier(params) {
  return request({
    url: `/customer-crm/crm-supplier`,
    method: 'post',
    data:params,
  })
}
// 编辑供应商资料
export function editNupplier(params) {
  return request({
    url: `/customer-crm/crm-supplier`,
    method: 'put',
    data:params,
  })
}
// 获得方案设计订单详情
export function projectDesignOrderProc(params) {
  return request({
    url: `/customer-crm/crm-project-design-order-proc/${params}`,
    method: 'get',
  })
}
// 获得大货订单详情
export function bulkOrderProc(params) {
  return request({
    url: `/customer-crm/crm-bulk-order-proc/${params}`,
    method: 'get',
  })
}

//驳回人列表
export function rejecterlist(params) {
  return request({
    url: `/customer-crm/crm-order-proc-view/contract/management/rejecter`,
    method: 'get',
  })
}

// 获得大货设计生产订单详情
export function bulkDesignProdOrderProc(params) {
  return request({
    url: `/customer-crm/crm-bulk-design-prod-order-proc/${params}`,
    method: 'get',
  })
}
// 查询所有的客户评价规则--获取结算方式
export function gradingCalculate(params) {
  return request({
    url: `/customer-crm/crm-customer-grading-calculate-config`,
    method: 'get',
  })
}


