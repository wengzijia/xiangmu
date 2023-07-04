import api from '@/api';
import { axios } from '@/utils/request';
import { downloadFile } from '@/utils/requestDownload';
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

export function updateAgentInfo(parameter) {
  return axios({
    url: api.users.userDemandList.updateAgentInfo,
    method: 'post',
    data: parameter
  });
}
export function updateDesignOrderFile(parameter) {
  return axios({
    url: api.users.userDemandList.updateDesignOrderFile,
    method: 'post',
    data: parameter
  });
}
export function updateProofInfosFiles(parameter) {
  return axios({
    url: api.users.userDemandList.updateProofInfosFiles,
    method: 'post',
    data: parameter
  });
}
// export function zipDownload(parameter) {
//   return axios({
//     url: api.users.userDemandList.zipDownload,
//     method: 'get',
//     params: parameter
//   });
// }
export function zipDownload(parameter) {
  return downloadFile(api.users.userDemandList.zipDownload, parameter);
}
export function confirmOriginalDesign(parameter) {
  return axios({
    url: api.order.order.confirmOriginalDesign,
    method: 'post',
    data: parameter
  });
}
export function updateProofOrderCancelPayment(parameter) {
  return axios({
    url: api.order.order.updateProofOrderCancelPayment,
    method: 'post',
    data: parameter
  });
}
