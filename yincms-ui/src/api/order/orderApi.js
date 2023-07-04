import api from '@/api';
import { axios } from '@/utils/request';

export function createOrder(parameter) {
  return axios({
    url: api.order.order.createOrder,
    method: 'post',
    data: parameter
  });
}

export function createPayQrCode(parameter) {
  return axios({
    url: api.order.order.createPayQrCode,
    method: 'post',
    data: parameter
  });
}

export function cancelOrder(parameter) {
  return axios({
    url: api.order.order.cancelOrder,
    method: 'post',
    data: parameter
  });
}

export function createOrderRefund(parameter) {
  return axios({
    url: api.order.miniOrdersRefund.createOrderRefund,
    method: 'post',
    data: parameter
  });
}

// 取消文件
export function cancelConfirmFile(parameter) {
  return axios({
    url: api.order.order.cancelFile,
    method: 'post',
    data: parameter
  });
}

// 取消文件
export function addDoc(parameter) {
  return axios({
    url: api.order.order.saveOrUpdateDoc,
    method: 'post',
    data: parameter
  });
}

export function getOrderList(parameter) {
  return axios({
    url: api.order.order.getOrderList,
    method: 'post',
    data: parameter
  });
}
//自定义名称
export function updateName(parameter) {
  return axios({
    url: api.order.order.updateName,
    method: 'post',
    data: parameter
  });
}

//修改pdf备注
export function modifityPdfNote(parameter) {
  return axios({
    url: api.order.order.prepressNotes,
    method: 'post',
    data: parameter
  });
}

//精装盒
export function addHardcoverOrder(parameter) {
  return axios({
    url: api.order.order.addHardcoverOrder,
    method: 'post',
    data: parameter
  });
}
/**
 * 重新goods是否是首单
 * @param {*} parameter
 * @returns
 */
export function getDiscountByGoodsId(parameter) {
  return axios({
    url: api.order.order.getDiscountByGoodsId,
    method: 'post',
    data: parameter
  });
}

//自定义接受工艺
export function userDefinedConfirm(parameter) {
  return axios({
    url: api.order.order.userDefinedConfirm,
    method: 'post',
    data: parameter
  });
}

// 获取pdf新文件
export function getModifyDetailByPoSns(parameter) {
  return axios({
    url: api.order.order.getModifyDetailByPoSns,
    method: 'post',
    data: parameter
  });
}

// pdf新文件确认
export function newFileConfirm(parameter) {
  return axios({
    url: api.order.order.confirm,
    method: 'post',
    data: parameter
  });
}