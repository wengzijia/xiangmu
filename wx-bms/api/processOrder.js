import { http }  from "../utils/request.js"

// 获取用户信息
export function getWxUserInfo(){
  return http({
      url:  '/getWxUserInfo',
      method:'post'
    });
}

// 获取加工工序
export function getManufacturingProcedure(){
  return http({
      url:  '/machiningCategoryAttribute',
      method:'post'
    });
}

// 获取加工单列表和搜索
export function getOrderList(parameter){
  return http({
      url:  '/getOrderList',
      method:'post',
      data:parameter
    });
}

// 删除订单
export function deleteOrder(order_id){
  return http({
    url:'/delOrderBill',
    method:'post',
    data:{
      order_id
    }
  })
}

// 创建支付订单
export function paymentOrder(parameter){
  return http({
      url:  '/addOrderPay',
      method:'post',
      data:parameter
  });
}

// 支付
export function pay(param){
  return http({
    url:'/orderPaySuccess',
    method:'post',
    data:param
  })
}

// 转生产
export function changeProduction(orderId){
  return http({
    url:'/pushOrderProduction',
    method:'post',
    data:{
      order_id:orderId
    }
  })
}

// 撤回生产
export function revocationProduction(orderId){
  return http({
    url:'/revocationOrderProduction',
    method:'post',
    data:{
      order_id:orderId
    }
  })
}


