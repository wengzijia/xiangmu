import api from '@/api';
import { axios } from '@/utils/request';

export function getInvoiceByUid(parameter) {
  return axios({
    url: api.users.userInvoice.getByUid,
    method: 'post',
    data: parameter
  });
}

export function updateDefault(parameter) {
  return axios({
    url: api.users.userInvoice.updateDefault,
    method: 'post',
    data: parameter
  });
}

export function saveOrUpdate(parameter) {
  return axios({
    url: api.users.userInvoice.saveOrUpdate,
    method: 'post',
    data: parameter
  });
}

export function deleteById(parameter) {
  return axios({
    url: api.users.userInvoice.deleteById,
    method: 'post',
    data: parameter
  });
}

export function getById(parameter) {
  return axios({
    url: api.users.userInvoice.getById,
    method: 'post',
    data: parameter
  });
}

export function getInvoiceDefault(parameter) {
  return axios({
    url: api.users.userInvoice.getDefault,
    method: 'post',
    data: parameter
  });
}

export function getInvoiceCodeByWord(parameter) {
  return axios({
    url: api.users.userInvoice.getInvoiceCodeByWord,
    method: 'post',
    data: parameter
  });
}
