import api from '@/api';
import { axios } from '@/utils/request';

export function getUserBonusList(parameter) {
  return axios({
    url: api.users.userBonus.getUserBonusList,
    method: 'post',
    data: parameter
  });
}
export function receiveUserBonus(parameter) {
  return axios({
    url: api.users.userBonus.receiveUserBonus,
    method: 'post',
    data: parameter
  });
}
