import api from '@/api';
import { axios } from '@/utils/request';

export function getMyList(parameter) {
  return axios({
    url: api.users.designAddress.getMyList,
    method: 'post',
    data: parameter
  });
}

export function saveOrUpdate(parameter) {
  return axios({
    url: api.users.designAddress.saveOrUpdate,
    method: 'post',
    data: parameter
  });
}

export function deleteById(parameter) {
  return axios({
    url: api.users.designAddress.deleteById,
    method: 'post',
    data: parameter
  });
}

export function getById(parameter) {
  return axios({
    url: api.users.designAddress.getById,
    method: 'post',
    data: parameter
  });
}
