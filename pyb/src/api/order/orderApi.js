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
