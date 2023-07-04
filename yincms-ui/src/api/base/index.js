import api from '../index';
import { axios } from '@/utils/request';

export function pageEmbossTexture(parameter) {
  return axios({
    url: api.base.pageEmbossTexture,
    method: 'post',
    data: parameter
  });
}
