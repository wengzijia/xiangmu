import api from '@/api';
import { axios } from '@/utils/request';

export function getInvoiceAddressByUid(parameter) {
  return axios({
    url: api.users.userInvoiceAddress.getByUid,
    method: 'post',
    data: parameter
  });
}

// 更新发票收货地址
export function updateInvoiceAddr(parameter) {
  return axios({
    url: api.users.userInvoiceAddress.update,
    method: 'post',
    data: parameter
  });
}

// 保存发票收货地址
export function addInvocieAddr(parameter) {
  return axios({
    url: api.users.userInvoiceAddress.save,
    method: 'post',
    data: parameter
  });
}
