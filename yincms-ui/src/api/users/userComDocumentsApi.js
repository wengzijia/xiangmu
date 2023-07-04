import api from '@/api';
import { axios } from '@/utils/request';

export function getComDocumentsByUid(parameter) {
  return axios({
    url: api.users.userComDocuments.getDocumentsByUid,
    method: 'post',
    data: parameter
  });
}

export function saveOrUpdate(parameter) {
  return axios({
    url: api.users.userComDocuments.saveOrUpdate,
    method: 'post',
    data: parameter
  });
}

export function updateDefault(parameter) {
  return axios({
    url: api.users.userComDocuments.updateDefault,
    method: 'post',
    data: parameter
  });
}

export function getById(parameter) {
  return axios({
    url: api.users.userComDocuments.getById,
    method: 'post',
    data: parameter
  });
}

export function deleteByIds(parameter) {
  return axios({
    url: api.users.userComDocuments.deleteByIds,
    method: 'post',
    data: parameter
  });
}
export function deleteById(parameter) {
  return axios({
    url: api.users.userComDocuments.deleteById,
    method: 'post',
    data: parameter
  });
}

export function getDefault(parameter) {
  return axios({
    url: api.users.userComDocuments.getDefault,
    method: 'post',
    data: parameter
  });
}

export function uploadDocumentsFile(parameter) {
  return axios({
    url: api.users.userComDocuments.uploadDocumentsFile,
    method: 'post',
    data: parameter
  });
}
