import request from '@/utils/request'
const BASE_URL = '/base-data'
/**
 * 分页查询申请记录
 * @param {Object} params
 * @param {number} params.size 分页大小
 * @param {number} params.current 页码
 * @param {number} params.applyNo 申请编号
 * @param {number} params.baseDateTable 基础数据表名
 * @param {string} params.keyWord 异动内容
 * @param {string} params.approvalState 审批状态
 * @param {string} params.appleTimeStart 申请时间-开始时间
 * @param {string} params.appleTimeEnd 申请时间-结束时间
 * @param {string} params.approvalTimeStart 审批时间-开始时间
 * @param {string} params.approvalTimeEnd 审批时间-结束时间
 * @returns 
 */
 export function getApplyRecord(params) {
  return request({
    url: BASE_URL + '/base-apply',
    method: 'get',
    params,
  })
}

/**
* 审批
* @param { flag } 审批状态
* @param { id } 记录id
* @returns 
*/
export function baseApproval(data) {
  return request({
    url: BASE_URL + '/base-apply',
    method: 'post',
    data,
  })
}

/**
* 查看材质信息
* @param {number} id
* @returns
*/
export function materialId(id) {
  return request({
    url: BASE_URL + "/base-apply/material/" + id,
    method: "get",
  });
}

/**
* 查看物料信息
* @param {number} id
* @returns
*/
export function materialInfoId(id) {
  return request({
    url: BASE_URL + "/base-apply/material-info/" + id,
    method: "get",
  });
}

/**
* 查看配件信息
* @param {number} id
* @returns
*/
export function accessoryId(id) {
  return request({
    url: BASE_URL + "/base-apply/accessory/" + id,
    method: "get",
  });
}

/**
* 查看耗材信息
* @param {number} id
* @returns
*/
export function consumablesId(id) {
  return request({
    url: BASE_URL + "/base-apply/consumables/" + id,
    method: "get",
  });
}

/**
* 查看烫金工艺颜色信息
* @param {number} id
* @returns
*/
export function bronzeColorId(id) {
  return request({
    url: BASE_URL + "/base-apply/bronze-color/" + id,
    method: "get",
  });
}

/**
* 查看压纹工艺纹理
* @param {number} id
* @returns
*/
export function embossTextureId(id) {
  return request({
    url: BASE_URL + "/base-apply/emboss-texture/" + id,
    method: "get",
  });
}


