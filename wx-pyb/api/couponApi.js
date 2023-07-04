import {http, COUPON_URL} from "../utils/request.js"

// 获取我的优惠券
export function couponDrawPage(data) {
    return http({
      url: COUPON_URL + '/ac-inner/coupon/couponplan/customerCouponPlanDraw/couponDrawPage',
      method:'POST',
      data,
    });
}
// 根据订单获取可领取优惠券
export function customerOrderCouponDrawList(data) {
  return http({
    url: COUPON_URL + '/ac-inner/coupon/couponplan/customerCouponPlanDraw/customerOrderCouponDrawList',
    method:'POST',
    data,
  });
}
