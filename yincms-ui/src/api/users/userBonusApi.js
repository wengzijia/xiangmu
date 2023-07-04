import api from '@/api';
import { axios } from '@/utils/request';

export function getUserBonusList(parameter) {
  return axios({
    url: api.users.userBonus.getUserBonusList,
    method: 'post',
    data: parameter
  });
}
export function receiveUserBonus(parameter) {
  return axios({
    url: api.users.userBonus.receiveUserBonus,
    method: 'post',
    data: parameter
  });
}
// 获取当前用户优惠券
export function couponDrawPage(parameter) {
  return axios({
    url: '/ac-inner/coupon/couponplan/customerCouponPlanDraw/couponDrawPage',
    method: 'post',
    data: parameter
  });
}
// 获取当前用户可领取优惠券
export function customerCouponInformation(parameter) {
  return axios({
    url: '/ac-inner/coupon/couponplan/customerCouponPlanDraw/customerCouponInformation',
    method: 'post',
    data: parameter
  });
}
//领取优惠券
export function customerGainCoupon(parameter) {
  return axios({
    url: '/ac-inner/coupon/couponplan/customerCouponPlanDraw/customerGainCoupon',
    method: 'post',
    data: parameter
  });
}