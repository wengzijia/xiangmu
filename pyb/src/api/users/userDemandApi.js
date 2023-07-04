import api from '@/api';
import { axios } from '@/utils/request';

export function getAllProofOrder(parameter) {
  return axios({
    url: api.users.userDemandList.getAllProofOrder,
    method: 'post',
    data: parameter
  });
}

export function adaptationOrder(parameter) {
  return axios({
    url: api.order.proofOrder.adaptationOrder,
    method: 'post',
    data: parameter
  });
}

export function ProofOrderSend(parameter) {
  return axios({
    url: api.order.proofOrder.ProofOrderSend,
    method: 'post',
    data: parameter
  });
}
