import api from '@/api';
import { axios } from '@/utils/request';

export function getDefaultDesigner(parameter) {
  return axios({
    url: api.proof.designerExtend.getDefaultDesigner,
    method: 'post',
    data: parameter
  });
}
