import api from '@/api';
import { axios } from '@/utils/request';

export function saveProducer(parameter) {
  return axios({
    url: api.producer.saveProducer,
    method: 'post',
    data: parameter
  });
}
