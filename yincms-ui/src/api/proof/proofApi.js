import api from '@/api';
import { axios } from '@/utils/request';

export function createPayQrCode(parameter) {
  return axios({
    url: api.proof.proofOrder.createPayQrCode,
    method: 'post',
    data: parameter
  });
}
