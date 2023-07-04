import {
  http,requestUrl
} from "../utils/request.js"
// const BESA_URL = `/consumer`;
const BESA_URL = `/mes/bw`;

// 获取设备的当前订单
export function getCurrentOrderInfo(deviceId) {
  return http({
    url: BESA_URL + `/order/mesBwGroupOrder/getCurrentOrderInfo/${deviceId}`,
    method: 'get'
  });
}

// 生产(开始、完成、停止)
export function production(data) {
  return http({
    url: BESA_URL + '/order/mesBwGroupOrder/switchProductStatus',
    method: 'post',
    data
  });
}

// 除废小程序记录异常信息之前校验(异常报备)
export function checkReport(data) {
  return http({
    url: BESA_URL + '/record/mesMachiningProcessLoss/validBeforeRecordException',
    method: 'post',
    data
  });
}

// 异常报备
export function anoReport(data) {
  return http({
    url: BESA_URL + '/record/mesMachiningProcessLoss/recordExceptionInfo',
    method: 'post',
    data
  });
}

// 根据mainId查询未读异常信息列表
export function getExceptionList(data) {
  return http({
    url: BESA_URL + '/order/mesBwExceptionMsg/getExceptionList',
    method: 'post',
    data
  });
}

// 根据id将异常信息更新为已读
export function updateExceptionIsRead(data) {
  return http({
    url: BESA_URL + '/order/mesBwExceptionMsg/updateExceptionIsRead',
    method: 'post',
    data
  });
}

// 完成生产前置信息提示
export function preFinishInfo(data) {
  return http({
    url: BESA_URL + '/order/mesBwGroupOrder/preFinishInfo',
    method: 'post',
    data
  });
}