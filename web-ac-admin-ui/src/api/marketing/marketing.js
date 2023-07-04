import request from '@/utils/request'
import request2 from '@/utils/request2'
// 获取优惠类型列表
export function miniCouponType(query) {
  return request({
    url: '/coupon/couponplan/miniCouponType/list',
    method: 'get',
    params: query
  })
}
// 获取优惠券类型额度列表
export function getCouponQuotaConfig(query) {
  return request({
    url: '/coupon/couponplan/miniCouponQuotaConfig/getCouponQuotaConfig',
    method: 'get',
    params: query
  })
}
// 修改优惠券类型额度
export function updateCouponQuota(query) {
  return request({
    url: '/coupon/couponplan/miniCouponQuotaConfig/updateCouponQuota',
    method: 'post',
    data: query
  })
}
// 优惠券类型配置
export function getCouponKindConfigList(query) {
  return request({
    url: '/coupon/couponplan/miniCouponKindConfig/getCouponKindConfigList',
    method: 'get',
    params: query
  })
}
// 优惠券类型配置修改
export function updateCouponKindConfig(query) {
  return request({
    url: '/coupon/couponplan/miniCouponKindConfig/updateCouponKindConfig',
    method: 'post',
    data: query
  })
}
// 获取创建计划列表
export function couponPlanPage(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlan/couponPlanPage',
    method: 'post',
    data: query
  })
}
// 获取优惠券计划详情
export function couponPlanDetails(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlan/couponPlanDetails',
    method: 'post',
    data: query
  })
}
// 编辑优惠券计划详情
export function updateCouponPlan(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlan/updateCouponPlan',
    method: 'post',
    data: query
  })
}
// 创建优惠券计划
export function addCouponPlan(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlan/addCouponPlan',
    method: 'post',
    data: query
  })
}
// 审核优惠券计划
export function couponPlanAudit(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlan/couponPlanAudit',
    method: 'post',
    data: query
  })
}
// 终止与删除优惠券计划
export function couponPlanBreakOrDel(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlan/couponPlanBreakOrDel',
    method: 'post',
    data: query,
  })
}
// 优惠券计划明细
export function couponPlanDetail(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlan/couponPlanDetail',
    method: 'post',
    data: query
  })
}
// 券计划明细导出
export function couponPlanDetailExport(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlan/couponPlanDetail/export',
    method: 'post',
    data: query,
    responseType: 'blob',
  })
}
// 获取可领取的券类型
export function gainCouponTypeLists(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlanDraw/gainCouponTypeLists',
    method: 'get',
    params: query,
  })
}
// 查询当前用户是否可领取
export function gainCouponPlanCheckWhetherItIsAvailable(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlanDraw/gainCouponPlanCheckWhetherItIsAvailable',
    method: 'post',
    data: query,
  })
}
// 后台领取优惠券
export function gainCouponPlanDraw(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlanDraw/gainCouponPlanDraw',
    method: 'post',
    data: query,
  })
}
// 我的优惠券列表-领券中心
export function myCouponDrawPage(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlanDraw/myCouponDrawPage',
    method: 'post',
    data: query,
  })
}
// 优惠券发放列表
export function drawPage(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlanDraw/drawPage',
    method: 'post',
    data: query,
  })
}
// 数据概览
export function dataOverview(query) {
  return request({
    url: '/coupon/report/coupon/grant/dataOverview',
    method: 'get',
    params: query,
  })
}
// 优惠券使用总览
export function used(query) {
  return request({
    url: '/coupon/report/coupon/used',
    method: 'post',
    data: query,
  })
}
// 优惠券发放统计列表
export function grant(query) {
  return request({
    url: '/coupon/report/coupon/grant',
    method: 'post',
    data: query,
  })
}
// 优惠券使用明细列表
export function useDetail(query) {
  return request({
    url: '/coupon/report/coupon/useDetail',
    method: 'post',
    data: query,
  })
}
// 拼版详情-模糊查询手机号
export function getMobileNumber(parameter) {
  return request2({
    url: '/spell/getMobileNumber',
    method: 'post',
    data: parameter
  });
}
// 业务中心转赠优惠券
export function givePresentedCouponPlanDraw(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlanDraw/givePresentedCouponPlanDraw',
    method: 'post',
    data: query,
  })
}
// 优惠券发放列表导出
export function exportDrawPage(query) {
  return request({
    url: '/coupon/couponplan/miniCouponPlanDraw/drawPage/export',
    method: 'post',
    data: query,
    responseType: 'blob',
  })
}
// 获取根据输入查询用户
export function listAllPage(query) {
  return request({
    url: '/system/user/listAllPage',
    method: 'get',
    params: query,
  })
}
// 赠送优惠券-模糊查询手机号
export function getMobileNumberPage(parameter) {
  return request({
    url: '/system/user/getMobileNumberPage',
    method: 'get',
    params: parameter
  });
}