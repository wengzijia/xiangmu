import api from '@/api';
import { axios } from '@/utils/request';

export function getMyList(parameter) {
  return axios({
    url: api.users.address.getMyList,
    method: 'post',
    data: parameter
  });
}

export function saveOrUpdate(parameter) {
  return axios({
    url: api.users.address.saveOrUpdate,
    method: 'post',
    data: parameter
  });
}

export function deleteById(parameter) {
  return axios({
    url: api.users.address.deleteById,
    method: 'post',
    data: parameter
  });
}

export function getById(parameter) {
  return axios({
    url: api.users.address.getById,
    method: 'post',
    data: parameter
  });
}
