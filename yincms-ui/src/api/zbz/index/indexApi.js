import api from '@/api';
import { axios } from '@/utils/request';

export function listAll(parameter) {
  return axios({
    url: api.zbz.index.listAllAd,
    method: 'post',
    data: parameter
  });
}
