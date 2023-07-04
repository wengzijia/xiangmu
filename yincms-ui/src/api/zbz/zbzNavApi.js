import api from '@/api';
import { axios } from '@/utils/request';

export function allCate(parameter) {
  return axios({
    url: api.zbz.nav.listAllCate,
    method: 'post',
    data: parameter
  });
}
