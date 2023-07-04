import api from '@/api';
import { axios } from '@/utils/request';
//获取数量
export function getCount(parameter) {
  return axios({
    url: api.home.getCount,
    method: 'post',
    data: parameter
  });
}
//订单列表
export function listOrder(parameter) {
  return axios({
    url: api.home.listOrder,
    method: 'post',
    data: parameter
  });
}

// 增加访问量
export function addFrom(parameter) {
  return axios({
    url: api.home.addFrom,
    method: 'post',
    data: parameter
  });
}
/** 包装方案推广页-保存客户提交信息 */
export function savePackCustomer(parameter) {
  return axios({
    url: api.promotion.savePackCustomer,
    method: 'post',
    data: {
      data: parameter
    }
  });
}
/** 包装方案推广页-保存客户搜索关键字 */
export function saveKeyword(parameter) {
  return axios({
    url: api.promotion.saveKeyword,
    method: 'post',
    data: {
      data: parameter
    }
  });
}
