import api from '@/api';
import { axios } from '@/utils/request';
import { downloadFile } from '@/utils/requestDownload';
export function getCateByParentId(parameter) {
  return axios({
    url: api.template.cate.getByParentId,
    method: 'post',
    data: parameter
  });
}
export function getCateById(parameter) {
  return axios({
    url: api.template.cate.getById,
    method: 'post',
    data: parameter
  });
}

export function getFieldByParentId(parameter) {
  return axios({
    url: api.template.fields.getByParentId,
    method: 'post',
    data: parameter
  });
}

export function getFieldById(parameter) {
  return axios({
    url: api.template.fields.getById,
    method: 'post',
    data: parameter
  });
}

export function getTemplatePage(parameter) {
  return axios({
    url: api.template.template.getTemplatePage,
    method: 'post',
    data: parameter
  });
}

export function getTemplateInfoById(parameter) {
  return axios({
    url: api.template.template.getById,
    method: 'post',
    data: parameter
  });
}

export function downloadTemplateFile(parameter, callback) {
  return downloadFile(api.template.template.downloadTemplateFile, parameter, callback);
}

export function createTemplateOrder(parameter) {
  return axios({
    url: api.template.order.createTemplateOrder,
    method: 'post',
    data: parameter
  });
}

export function createPayQrCode(parameter) {
  return axios({
    url: api.template.order.createPayQrCode,
    method: 'post',
    data: parameter
  });
}

export function getByOrderNo(parameter) {
  return axios({
    url: api.template.order.getByOrderNo,
    method: 'post',
    data: parameter
  });
}
