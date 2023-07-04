import {http} from "../utils/request.js"
// const BESA_URL = `/consumer`;
const BESA_URL = `/mes/bw`;

// 除废下班打卡前查询待排产列表是否有急单
export function queryRushOrder(attributeId){
  return http({
      url:  BESA_URL + `/record/punch/hasUrgentInToScheduled/${attributeId}`,
      method:'get'
    });
}