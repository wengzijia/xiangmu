import api from '@/api';
import { axios } from '@/utils/request';

//获取一二级分类
export function getRealNameCert(parameter) {
  return axios({
    url: api.designer.cert.getCert,
    method: 'post',
    data: parameter
  });
}
export function checkRealNameCert(parameter) {
  return axios({
    url: api.designer.cert.checkCert,
    method: 'post',
    data: parameter
  });
}
