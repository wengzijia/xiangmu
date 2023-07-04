import api from '@/api';
import { axios } from '@/utils/request';

export function getSenderByUid(parameter) {
  return axios({
    url: api.users.sender.getByUid,
    method: 'post',
    data: parameter
  });
}
