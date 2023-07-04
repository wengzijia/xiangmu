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
export function queryData(parameter) {
  return axios({
    url: api.goods.miniGoods.queryData,
    method: 'post',
    data: parameter
  });
}
export function byModelSn(parameter) {
  return axios({
    url: api.goods.miniGoods.byModelSn,
    method: 'post',
    data: parameter
  });
}
export function listAll() {
  return axios({
    url: api.goods.miniGoods.listAll,
    method: 'post'
  });
}
export function uploadProofFile(parameter) {
  return axios({
    url: api.goods.miniGoods.uploadProofFile,
    method: 'post',
    data: parameter
  });
}
export function addOriginalDesignOrder(parameter) {
  return axios({
    url: api.goods.miniGoods.addOriginalDesignOrder,
    method: 'post',
    data: parameter
  });
}
