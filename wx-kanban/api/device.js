import {http} from "../utils/request.js"
// const BESA_URL = `/consumer`;
const BESA_URL = `/mes/bw`;

// 获取设备
export function getDevice(data){
  return http({
      url: BESA_URL + '/record/punch/getDevices',
      method:'post',
      data
    });
}

// 获取机长
export function getPilot(supplierId){
  return http({
      url: BESA_URL + `/record/punch/getOperatorsBySupplierId/${supplierId}`,
      method:'get'
    });
}

// 上下班打卡
export function punchClock(data){
  return http({
      url: BESA_URL + '/record/punch/confirm',
      method:'post',
      data
    });
}


