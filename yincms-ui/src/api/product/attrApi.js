import api from '@/api/index';
import { axios } from '@/utils/request';

export function getVoList(parameter) {
  return axios({
    url: api.product.attr.getVoList,
    method: 'post',
    data: parameter
  });
}

export function getByParentId(parameter) {
  return axios({
    url: api.product.attr.getByParentId,
    method: 'post',
    data: parameter
  });
}

export function getTreeVoList(parameter) {
  return axios({
    url: api.product.attr.getTreeVoList,
    method: 'post',
    data: parameter
  });
}

export function getAttrList(parameter) {
  return axios({
    url: api.product.attr.getAttrList,
    method: 'post',
    data: parameter
  });
}

export function getById(parameter) {
  return axios({
    url: api.product.attr.getById,
    method: 'post',
    data: parameter
  });
}

export function getAttrById(parameter) {
  return axios({
    url: api.product.attr.getAttrById,
    method: 'post',
    data: parameter
  });
}

export function saveOrUpdate(parameter) {
  return axios({
    url: api.product.attr.saveOrUpdate,
    method: 'post',
    data: parameter
  });
}

export function addGroup(parameter) {
  return axios({
    url: api.product.attr.addGroup,
    method: 'post',
    data: parameter
  });
}

export function addGroupAttr(parameter) {
  return axios({
    url: api.product.attr.addGroupAttr,
    method: 'post',
    data: parameter
  });
}

export function deleteById(parameter) {
  return axios({
    url: api.product.attr.deleteById,
    method: 'post',
    data: parameter
  });
}

export function deleteAttrById(parameter) {
  return axios({
    url: api.product.attr.deleteAttrById,
    method: 'post',
    data: parameter
  });
}
export function deleteAttrByIds(parameter) {
  return axios({
    url: api.product.attr.deleteAttrByIds,
    method: 'post',
    data: parameter
  });
}
export function copyAttrInfo(parameter) {
  return axios({
    url: api.product.attr.copyAttrInfo,
    method: 'post',
    data: parameter
  });
}

export function getGroupList(parameter) {
  return axios({
    url: api.product.attr.getGroupList,
    method: 'post',
    data: parameter
  });
}
export function updateBatchById(parameter) {
  return axios({
    url: api.product.attr.updateBatchById,
    method: 'post',
    data: parameter
  });
}
export function getBySubBindId(parameter) {
  return axios({
    url: api.product.attr.getBySubBindId,
    method: 'post',
    data: parameter
  });
}
export function getByGoodsId(parameter) {
  return axios({
    url: api.product.attr.getByGoodsId,
    method: 'post',
    data: parameter
  });
}

export async function checkPantone(parameter) {
  return await axios({
    url: api.product.attr.checkPantone,
    method: 'post',
    data: parameter
  });
}
export async function computeSize(parameter) {
  return await axios({
    url: api.product.attr.computeSize,
    method: 'post',
    data: parameter
  });
}

export function getPaper(parameter) {
  return axios({
    url: api.product.attr.getPaper,
    method: 'post',
    data: parameter
  });
}
