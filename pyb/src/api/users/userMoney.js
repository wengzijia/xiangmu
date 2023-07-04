import api from '@/api';
import { axios } from '@/utils/request';

export function listByUid(parameter) {
  return axios({
    url: api.users.accountLog.listByUid,
    method: 'post',
    data: parameter
  });
}
