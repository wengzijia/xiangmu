import api from '@/api/index';
import { axios } from '@/utils/request';
//获取所有用户的地址
export function getAddressByUid(parameter) {
  return axios({
    url: api.cart.checkOrder.getMyAddress,
    method: 'post',
    data: parameter
  });
}
//保存或更新地址
export function saveOrupdateAddress(parameter) {
  return axios({
    url: api.cart.checkOrder.saveOrUpdateAddress,
    method: 'post',
    data: parameter
  });
}

//根据id删除某些地址
export function deleteAddressById(parameter) {
  return axios({
    url: api.cart.checkOrder.deleteAddressById,
    method: 'post',
    data: parameter
  });
}

// 获取一个订单的详情
export function getAddressById(parameter) {
  return axios({
    url: api.cart.checkOrder.getMyAddressById,
    method: 'post',
    data: parameter
  });
}

// 设置默认收货地址
export function setAddresDefault(parameter) {
  return axios({
    url: api.cart.checkOrder.setAddressDefault,
    method: 'post',
    data: parameter
  });
}

// 获取一个大货寄样地址
export function getMiniAddress() {
  return axios({
    url: api.cart.checkOrder.getMiniSampleAddress,
    method: 'post'
  });
}

// 保存大货寄样地址
export function saveMiniAddress(parameter) {
  return axios({
    url: api.cart.checkOrder.saveMiniSampleAddress,
    method: 'post',
    data: parameter
  });
}

// 修改大货寄样地址
export function modifyMiniAddress(parameter) {
  return axios({
    url: api.cart.checkOrder.modifyMiniSampleAddress,
    method: 'post',
    data: parameter
  });
}

// 删除大货寄样地址
export function deleteMiniAddress(parameter) {
  return axios({
    url: api.cart.checkOrder.deleteMiniSampleAddress,
    method: 'post',
    data: parameter
  });
}

// 获取发货人信息
export function getSenderInfoAll(parameter) {
  return axios({
    url: api.cart.checkOrder.getSenderInfo,
    method: 'post',
    data: parameter
  });
}

// 获取保存发货人信息
export function saveSenderInfo(parameter) {
  return axios({
    url: api.cart.checkOrder.saveSenderInfo,
    method: 'post',
    data: parameter
  });
}

// 设置默认发货人
export function setSenderDefault(parameter) {
  return axios({
    url: api.cart.checkOrder.setSenderDefault,
    method: 'post',
    data: parameter
  });
}

// 获取订单商品信息
export function getOrderGoodsInfoList(parameter) {
  return axios({
    url: api.cart.checkOrder.getShippingMode,
    method: 'post',
    data: parameter
  });
}

// 创建订单
export function commitOrder(parameter) {
  return axios({
    url: api.cart.checkOrder.createOrder,
    method: 'post',
    data: parameter
  });
}

// 获取翻单信息
export function getReOrder(parameter) {
  return axios({
    url: api.cart.checkOrder.getReOrderInfo,
    method: 'post',
    data: parameter
  });
}

// 修改翻单
export function updateReOrderNum(parameter) {
  return axios({
    url: api.cart.checkOrder.updateReOrder,
    method: 'post',
    data: parameter
  });
}
