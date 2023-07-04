// 信用支付支付

import { http } from "../utils/request.js"
//拼版订单信用支付合并支付
export function togetherCreditPurchasePay(data) {
  return http({
    url: '/order/miniOrdersTogether/creditPurchasePay',
    method: 'post',
    data
  });
}


/**
 * 拼版订单信用支付支付
 * @argument orderNo
 */
 export function creditPurchasePay(data) {
    return http({
      url: "/order/miniOrders/creditPurchasePay",
      method: "post",
      data,
    });
  }


  /**
 * 整版订单信用支付合并支付
 * @argument orderNo
 */
 export function editionMergeCreditPurchasePay(data) {
    return http({
      url: "/edition/miniEditionOrderTogether/creditPurchasePay",
      method: "post",
      data,
    });
  }

  
  /**
 * 整版订单信用支付支付
 * @argument orderNo
 */
 export function editionCreditPurchasePay(data) {
    return http({
      url: "/order/miniEditionOrder/creditPurchasePay",
      method: "post",
      data,
    });
  }
  
 /**
 * 获取信用购支付订单
 * @argument orderNo
 */
 export function getUserCreditPurchaseAllList(data) {
  return http({
    url: "/user/creditPurchase/getUserCreditPurchaseAllList",
    method: "post",
    data,
  });
}

// 预存 余额支付

//拼版订单余额支付合并支付
export function togetherBalancePay(data) {
  return http({
    url: '/order/miniOrdersTogether/balancePay',
    method: 'post',
    data
  });
}


/**
 * 拼版订单余额支付支付
 * @argument orderNo
 */
 export function balancePay(data) {
    return http({
      url: "/order/miniOrders/balancePay",
      method: "post",
      data,
    });
  }


  /**
 * 整版订单信用支付合并支付
 * @argument orderNo
 */
 export function togetherEditionBalancePay(data) {
    return http({
      url: "/edition/miniEditionOrderTogether/balancePay",
      method: "post",
      data,
    });
  }

  
  /**
 * 整版订单余额支付支付
 * @argument orderNo
 */
 export function editionBalancePay(data) {
    return http({
      url: "/order/miniEditionOrder/balancePay",
      method: "post",
      data,
    });
  }
  
  /**
 * 补差价-信用支付
 * @argument orderNo
 */
   export function creditPurchasePayDiff(data) {
    return http({
      url: "/order/miniDiffOrder/creditPurchasePay",
      method: "post",
      data,
    });
  }
    
/**
 * 补差价-余额支付
 * @argument orderNo
 */
   export function balancePayDiff(data) {
    return http({
      url: "/order/miniDiffOrder/balancePay",
      method: "post",
      data,
    });
  }