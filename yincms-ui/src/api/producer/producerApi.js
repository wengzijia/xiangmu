import api from '@/api';
import { axios } from '@/utils/request';

export function saveProducer(parameter) {
  return axios({
    url: api.producer.saveProducer,
    method: 'post',
    data: parameter
  });
}

export function addQuoteApi(parameter) {
  return axios({
    url: api.producer.addQuote,
    method: 'post',
    data: parameter
  });
}
