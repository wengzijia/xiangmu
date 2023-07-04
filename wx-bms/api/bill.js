import {http} from "../utils/request.js"




/**
 * 客户账单列表
 */
export function customerBill() {
  return http({
    url:'/customerBill',
    method:'post'
  })
}


/**
 * 加工商账单
 * @param {} data 
 * @returns 
 */

 export function supplierBill(data) {
   return http({
     url:'/supplierBill',
     method:'post',
     data
   })
 }
/**
 * 获取客户账单月份列表
 */
 
 export function customerBillMonth(data){
   return http({
url:'/customerBillMonth',
method:'post',
data
   })
 }
 /**
 * 客户账单月份详情  
 * @param {*} data
 *  @returns  
 */
 
export function customerBillMonthDetails(data){
  return http({
url:'/customerBillMonthDetails',
method:'post',
data
  })
}
/**
 * 加工商账单月份详情
 * @param {*} data 
 * @returns 
 */
export function supplierBillMonthDetails(data) {
  return http({
    url:'/supplierBillMonthDetails',
    method:'post',
    data
  })
}
/**
 * 添加分享账单 
 * @param {*} data 
 * @returns 
 */
export function addShareOrderBill(data) {
  return http({
    url:'/addShareOrderBill',
    method:'post',
    data
  })
}
/**
 * 获取分享账单数据 
 * @param {*} data 
 * @returns 
 */
export function getShareOrderBill(data) {
  return http({
    url:'/getShareOrderBill',
    method:'post',
    data
  })
}
/**
 * 创建支付订单 
 * @param {*} data 
 * @returns 
 */
export function addOrderPay(data) {
  return http({
    url:'/addOrderPay',
    method:'post',
    data
  })
}
/**
 * 模拟支付成功回调 
 * @param {*} data 
 * @returns 
 */
export function orderPaySuccess(data) {
  return http({
    url:'/orderPaySuccess',
    method:'post',
    data
  })
}

/**
 * 加工商账单列表--2022-08-02-钟世亮
 */
export const getSupplierBill=(data)=> {
  return http({
    url:'/processing/supplierBill',
    method:'post',
    data
  })
}
/**
 * 加工商账单列表明细--2022-08-02-钟世亮
 */
export const getSupplierBillMonthDetails=(data)=> {
  return http({
    url:'/processing/supplierBillMonthDetails',
    method:'post',
    data
  })
}
/**
 * 客户账单列表--2022-08-02-钟世亮
 */
export const getCustomerBill =()=>{
  return http({
    url:'/processing/customerBill',
    method:'post'
  })
}
/**
 * 客户账单月份数据列表--2022-08-02-钟世亮
 */
export const getCustomerBillMonth =(data)=>{
  return http({
    url:'/processing/customerBillMonth',
    method:'post',
    data
  })
}

/**
 * 客户账单月份数据列表详情--2022-08-02-钟世亮
 */
export const getCustomerBillMonthDetails =(data)=>{
  return http({
    url:'/processing/customerBillMonthDetails',
    method:'post',
    data
  })
}

/**
 * 添加分享账单--2022-08-02-钟世亮
 * @param {*} data 
 * @returns 
 */
export const setAddShareOrderBill=(data)=> {
  return http({
    url:'/processing/addShareOrderBill',
    method:'post',
    data
  })
}
/**
 * 获取分享账单数据--2022-08-02-钟世亮
 * @param {*} data 
 * @returns 
 */
export const getShareOrderBillData=(data)=> {
  return http({
    url:'/processing/getShareOrderBill',
    method:'post',
    data
  })
}

/**
 * 创建支付订单 --2022-08-02-钟世亮
 * @param {*} data 
 * @returns 
 */
export const setAddOrderPay=(data)=> {
  return http({
    url:'/processing/addOrderPay',
    method:'post',
    data
  })
}

/**
 * 获取支付信息 --2022-08-02-钟世亮
 * @param {*} data 
 * @returns 
 */
export const getOrderPaySuccess=(data)=> {
  return http({
    url:'/processing/orderPaySuccess',
    method:'post',
    data
  })
}







