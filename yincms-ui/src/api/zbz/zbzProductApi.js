import api from '@/api';
import { axios } from '@/utils/request';

export function addSalesCount(parameter) {
  return axios({
    url: api.zbz.product.addSalesCount,
    method: 'post',
    data: parameter
  });
}

export function getProductById(parameter) {
  return axios({
    url: api.zbz.product.getProductById,
    method: 'post',
    data: parameter
  });
}

export function getProductList(parameter) {
  return axios({
    url: api.zbz.product.getProductList,
    method: 'post',
    data: parameter
  });
}

export function getRecommendList(parameter) {
  return axios({
    url: api.zbz.product.getRecommendList,
    method: 'post',
    data: parameter
  });
}

export function getUnitList(parameter) {
  return axios({
    url: api.zbz.product.getUnitList,
    method: 'post',
    data: parameter
  });
}

export function groupCateList(parameter) {
  return axios({
    url: api.zbz.product.getCateList,
    method: 'post',
    data: parameter
  });
}

export function getProductDetail(parameter) {
  return axios({
    url: api.zbz.product.getProductDetailById,
    method: 'post',
    data: parameter
  });
}

export function getProductTitle(parameter) {
  return axios({
    url: api.zbz.product.getProductTitleById,
    method: 'post',
    data: parameter
  });
}

// 计价
export function getProductPrice(parameter) {
  return axios({
    url: api.zbz.product.getPrice,
    method: 'post',
    data: parameter
  });
}

// 立即购买
export function buyNowProduct(parameter) {
  return axios({
    url: api.zbz.product.buyNow,
    method: 'post',
    data: parameter
  });
}
