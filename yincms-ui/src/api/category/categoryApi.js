import api from '@/api/index';
import { axios } from '@/utils/request';

export function getAllCategoryList(parameter) {
  return axios({
    url: api.category.category.getAllCategoryList,
    method: 'post',
    data: parameter
  });
}

export function findCategoryById(parameter) {
  return axios({
    url: api.category.category.findCategoryById,
    method: 'post',
    data: parameter
  });
}
export function getProofCategory(parameter) {
  return axios({
    url: api.category.category.getProofCategory,
    method: 'post',
    data: parameter
  });
}
export function getCategoryByPagerId(parameter) {
  return axios({
    url: api.category.category.getCategoryByPagerId,
    method: 'post',
    data: parameter
  });
}
export function getAllVoList(parameter) {
  return axios({
    url: api.category.category.getAllVoList,
    method: 'post',
    data: parameter
  });
}
export function getAllNavs(parameter) {
  return axios({
    url: api.category.category.getAllNavs,
    method: 'post',
    data: parameter
  });
}
export function uploadFile(data, parameter) {
  return axios({
    url: api.category.category.uploadFile,
    method: 'post',
    data: data,
    params: parameter
  });
}
