import api from '@/api';
import { axios } from '@/utils/request';

export function getStatusStatisticsCount(parameter) {
  return axios({
    url: api.order.supplierOrders.getStatusStatisticsCount,
    method: 'post',
    data: parameter
  });
}
export function getAllSupplierOrder(parameter) {
  return axios({
    url: api.order.supplierOrders.getAllSupplierOrder,
    method: 'post',
    data: parameter
  });
}
export function getOfflineCartByUid(parameter) {
  return axios({
    url: api.order.supplierOrders.getOfflineCartByUid,
    method: 'post',
    data: parameter
  });
}
export function updateOfflineCart(parameter) {
  return axios({
    url: api.order.supplierOrders.updateOfflineCart,
    method: 'post',
    data: parameter
  });
}
export function findAssociationGoodsById(parameter) {
  return axios({
    url: api.order.supplierOrders.findAssociationGoodsById,
    method: 'post',
    data: parameter
  });
}
export function queryOrderClassify(parameter) {
  return axios({
    url: api.order.supplierOrders.queryOrderClassify,
    method: 'post',
    data: parameter
  });
}
export function updatePdfFile(parameter) {
  return axios({
    url: api.order.supplierOrders.updatePdfFile,
    method: 'post',
    data: parameter
  });
}

export function getOrderDetails(parameter) {
  return axios({
    url: api.order.supplierOrders.getOrderDetails,
    method: 'post',
    data: parameter
  });
}

export function getSupplierOrderDetails(parameter) {
  return axios({
    url: api.order.supplierOrders.getSupplierOrderDetails,
    method: 'post',
    data: parameter
  });
}

/**
 * 确认样品
 *
 * @param {Object} parameter
 */
export function confirmSample(parameter) {
  return axios({
    url: api.order.supplierOrders.confirmSampleSend,
    method: 'post',
    data: parameter
  });
}

/**
 * 确认精装盒
 *
 * @param {Object} parameter
 */
export function confirmHardcover(parameter) {
  return axios({
    url: api.order.supplierOrders.confirmHardcoverSend,
    method: 'post',
    data: parameter
  });
}

/**
 * 确认吸塑
 *
 * @param {Object} parameter
 */
export function confirmBliter(parameter) {
  return axios({
    url: api.order.supplierOrders.confirmBlisterSend,
    method: 'post',
    data: parameter
  });
}

/**
 * 查看文件
 *
 * @param {Object} parameter
 */
export function fileLookStatus(parameter) {
  return axios({
    url: api.order.supplierOrders.editFileLook,
    method: 'post',
    data: parameter
  });
}

/**
 * 查询翻单列表
 *
 * @param {Object} parameter
 */
export function listFlipOrder(parameter) {
  return axios({
    url: api.order.supplierOrders.listFlipOrder,
    method: 'post',
    data: parameter
  });
}
