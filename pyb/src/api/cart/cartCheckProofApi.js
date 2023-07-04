import api from '@/api/index';
import { axios } from '@/utils/request';
//获取所有用户的地址
export function getAddressByUid(parameter) {
  return axios({
    url: api.cart.checkProof.getMyAddress,
    method: 'post',
    data: parameter
  });
}
//保存或更新地址
export function updateAddress(parameter) {
  return axios({
    url: api.cart.checkProof.saveOrUpdateAddress,
    method: 'post',
    data: parameter
  });
}

//根据id删除某些地址
export function deleteAddressById(parameter) {
  return axios({
    url: api.cart.checkProof.deleteAddressById,
    method: 'post',
    data: parameter
  });
}

// 获取一个订单的详情
export function getAddressById(parameter) {
  return axios({
    url: api.cart.checkProof.getMyAddressById,
    method: 'post',
    data: parameter
  });
}

// 获取一个订单的详情
export function setAddresDefault(parameter) {
  return axios({
    url: api.cart.checkProof.setAddressDefault,
    method: 'post',
    data: parameter
  });
}

// 获取一个订单的详情
export function getCountCart(parameter) {
  return axios({
    url: api.cart.checkProof.countCart,
    method: 'post',
    data: parameter
  });
}

// 提交订单
export function commit(parameter) {
  return axios({
    url: api.cart.checkProof.commitCheckProof,
    method: 'post',
    data: parameter
  });
}
