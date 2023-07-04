import api from '@/api/index';
import { axios } from '@/utils/request';

export function getSubCategoryGoods(parameter) {
  return axios({
    url: api.goods.miniGoods.getSubCategoryGoods,
    method: 'post',
    data: parameter
  });
}
export function getPriceSubCategoryGoods(parameter) {
  return axios({
    url: api.goods.miniGoods.getPriceSubCategoryGoods,
    method: 'post',
    data: parameter
  });
}
export function getById(parameter) {
  return axios({
    url: api.goods.miniGoods.getById,

    method: 'post',
    data: parameter
  });
}
export function getDescById(parameter) {
  return axios({
    url: api.goods.miniGoods.getDescById,

    method: 'post',
    data: parameter
  });
}
