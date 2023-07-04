import api from '@/api/index';
import { axios } from '@/utils/request';
import store from '@/store';
export function priceInvoke(parameter) {
  return axios({
    url: api.price.invoke,
    method: 'post',
    data: parameter,
    headers: store.getters.pinyibanHeaders
  });
}
export function getShippingFee(parameter) {
  return axios({
    url: api.price.getShippingFee,
    method: 'post',
    data: parameter
  });
}
export function querySizeData(parameter) {
  return axios({
    url: api.price.querySizeData,
    method: 'post',
    data: parameter
  });
}
export function computeSize(parameter) {
  return axios({
    url: api.price.computeSize,
    method: 'post',
    data: parameter
  });
}
