import {http} from "../utils/request.js"

//添加购物车
export function addEdition(data) {
  return http({
    url:  '/cart/miniCartEdition/addEdition',
    method:'post',
    data
  });
}

//单款添加购物车
export function add(data) {
  return http({
    url:  '/cart/add',
    method:'post',
    data
  });
}
//单款删除购物车
export function del(data) {
  return http({
    url:  '/cart/del',
    method:'post',
    data
  });
}

//购物车数量
export function countCart(data) {
  return http({
    url:  '/cart/countCart',
    method:'post',
    data
  });
}


//单款购物车勾选
export function singUpdateCheck(data) {
  return http({
    url:  '/cart/updateCheck',
    method:'post',
    data
  });
}

//单款确认订单列表
export function getShippingMode(data) {
  return http({
    url:  '/order/miniAttr/getShippingMode' ,
    method:'post',
    data
  });
}

// 一键翻单
export function saveXcxOrdersRepurchase(data) {
  return http({
    url:  '/order/miniSupplierOrders/saveXcxOrdersRepurchase' ,
    method:'post',
    data
  });
}

// 翻单数据
export function getXcxReorderCartData(data) {
  return http({
    url:  '/order/miniAttr/getXcxReorderCartData' ,
    method:'post',
    data
  });
}
// 翻单改变数量
export function editXcxReorderGoods(data) {
  return http({
    url:  '/order/miniReorderGoods/editXcxReorderGoods' ,
    method:'post',
    data
  });
}
// 创建翻单订单
export function createOrder(data) {
  return http({
    url:  '/order/miniOrders/createOrder' ,
    method:'post',
    data
  });
}

//计算运费
export function getByIdAddCartFreight(data) {
  return http({
    url:  '/users/address/getByIdAddCartFreight' ,
    method:'post',
    data
  });
}

//购物车列表
export function getUserCartEdition() {
    return http({
      url:  '/cart/miniCartEdition/getUserCartEdition' ,
      method:'post',
      data:{}
    });
}

//购物车修改数量
export function updateNum(data) {
    return http({
      url:  '/cart/miniCartEdition/updateNum',
      method:'post',
      data
    });
}

//删除购物车
export function deleteByIds(data) {
    return http({
      url:  '/cart/miniCartEdition/deleteByIds',
      method:'post',
      data
    });
}

//购物车选中状态
export function updateCheck(data) {
    return http({
      url:  '/cart/miniCartEdition/updateCheck',
      method:'post',
      data
    });
}

//订单确认
export function checkEdition(data) {
    return http({
      url:  '/order/miniEditionOrder/checkEdition',
      method:'post',
      data
    });
}

//创建订单
export function addEditionOrder(data) {
    return http({
      url:  '/order/miniEditionOrder/addEditionOrder',
      method:'post',
      data
    });
}
//创建订单
export function updateTemplateEditionOrder(data) {
  return http({
    url:  '/order/miniEditionOrder/updateTemplateEditionOrder',
    method:'post',
    data
  });
}
//微信支付
export function createWxPayUrl(data) {
    return http({
      url:  '/order/miniEditionOrder/createWxPayUrl',
      method:'post',
      data
    });
}

//多订单微信支付
export function createWxPayUrl2(data) {
    return http({
      url:  '/edition/miniEditionOrderTogether/createWxPayUrl',
      method:'post',
      data
    });
}
//添加分切费
export function addSlittingFee(data) {
  return http({
    url:  '/cart/miniCartEdition/addSlittingFee',
    method:'post',
    data
  });
}
//整版报价购物车-买纸和印刷加工增加分切费
export function addPaperAndPrintSlittingFee(data) {
  return http({
    url:  '/cart/miniCartEdition/addPaperAndPrintSlittingFee',
    method:'post',
    data
  });
}
//查询订单提交次数
export function queryOrderCount(data) {
  return http({
    url:  '/order/miniEditionOrder/queryOrderCount',
    method:'post',
    data
  });
}
//单款购物车列表
export function getCartByUid(data) {
  return http({
    url:  '/cart/getCartByUid',
    method:'post',
    data
  });
}
/**
 * 获取默认收货地址
 */
 export function getDefault(data){
  return http({
    url:'/user/miniComDocuments/getDefault',
    method:'post',
    data
  })
}
/**
 * 修改大货购物车商品
 * @param {{id:id,num:商品数量}} data 
 */
 export function updateCart(data){
  return http({
    url:'/cart/update',
    method:'post',
    data
  })
}
/**
 * 订单绑定 订阅消息
 * 
 */
 export function orderSubscribeMessage(data){
  return http({
    url:'/message/miniMessageWechatRecord/orderSubscribeMessage',
    method:'post',
    data
  })
}
/**
 * 订阅消息模板列表
 * 
 */
 export function listTemplateId(data){
  return http({
    url:'/message/miniMessageWechatRecord/listTemplateId',
    method:'post',
    data
  })
}

/**
 * 压纹工艺纹理
 * @param {{pageNumber:页数,pageSize:页大小}} data 
 */
 export function pageEmbossTexture(data){
  return http({
    url:'/certifyFree/base/miniBaseEmbossTexture/pageEmbossTexture',
    method:'post',
    data
  })
}




