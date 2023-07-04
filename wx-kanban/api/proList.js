import {
  http
} from "../utils/request.js"
// const BESA_URL = `/consumer`;
const BESA_URL = `/mes/bw`;

// 待排产
export function getWaitPro(data) {
  return http({
    url: BESA_URL + '/order/mesBwGroupOrder/tobeScheduledList',
    method: 'post',
    data
  });
}

// 异常
export function getAnomaly(data) {
  return http({
    url: BESA_URL + '/record/mesMachiningProcessLoss/getProcessLossList',
    method: 'post',
    data
  });
}

// 已完成
export function getDoneList(data) {
  return http({
    url: BESA_URL + '/order/mesBwGroupOrder/finishProductList',
    method: 'post',
    data
  });
}

// 恢复生产
export function getRecoverPro(idProcessLoss) {
  return http({
    url: BESA_URL + `/record/mesMachiningProcessLoss/resumeProductFromException/${idProcessLoss}`,
    method: 'post'
  });
}

// 详情
export function getDetail(mainId) {
  return http({
    url: BESA_URL + `/order/mesBwGroupOrder/getInfoByGroupId/${mainId}`,
    method: 'get'
  });
}

// 除废异常数量
export function getCountProcessLossList(data) {
  return http({
    url: BESA_URL + `/record/mesMachiningProcessLoss/countProcessLossList`,
    method: 'post',
    data
  });
}