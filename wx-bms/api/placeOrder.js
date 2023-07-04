import {http,requestUrl} from "../utils/request.js"
/**
 * 获取创建订单所填写的条件
 * @param {{attribute_type:string,attribute_id	:string,iv:string,type:string}} data 
 * @returns 
 */
export function newOrderConditions(data){
    return http({
        url:  '/newOrderConditions',
        method:'post',
        data
      });
}

/**
 * 获取加工工序
 * @param {} data 
 * @returns 
 */
 export function machiningCategoryAttribute(data){
  return http({
      url:  '/machiningCategoryAttribute',
      method:'post',
      data
    });
}

/**
 * 客户列表
 * @param {} data 
 * @returns 
 */
export function customerList(data){
    return http({
        url:  '/customerList',
        method:'post',
        data
      });
  }
  

/**
 * 模糊查询到傲彩订单数据
 * @param {} data 
 * @returns 
 */
 export function queryOrder(data){
  return http({
      url:  '/queryOrder',
      method:'post',
      data
    });
}

/**
 * 添加订单
 * @param {} data 
 * @returns 
 */
export function addOrderBill(data){
  return http({
      url:  '/addOrderBill',
      method:'post',
      data
    });
}

/**
 * 订单图片上传
 * @param {} data 
 * @returns 
 */
 export const uploadImg = requestUrl+"/api/uploadImg"



/**
 * 获取账单详情
 * @param {} data 
 * @returns 
 */
 export function getOrderBill(data){
  return http({
      url:  '/getOrderBill',
      method:'post',
      data
    });
}

  
 /**
 * 编辑订单
 * @param {} data 
 * @returns 
 */
  export function editOrderBill(data){
    return http({
        url:  '/editOrderBill',
        method:'post',
        data
      });
  }
  