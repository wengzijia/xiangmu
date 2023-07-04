import file from '@/api/previewfileapi';
import { axios } from '@/utils/request';
import axios2 from 'axios';
// import axios from '@/utils/axios'
export function getUploads(parameter) {
  return axios({
    url: file.previewApi.uploads,
    method: 'post',
    data: parameter
  });
}
export function previewProductionById(parameter) {
  return axios({
    url: '/api/lt/user/acLtUserProduction/alibaba/oss/previewProductionById/',
    method: 'get',
    params: parameter,
    responseType: 'arraybuffer'
  });
}

export function getPreviewPro(url) {
  return axios2({
    url: '/previewpdf/' + url,
    method: 'get',
    responseType: 'arraybuffer'
  });
}
