import request from "@/utils/request";
const BASE_URL = `/order-change`
// 订单审核详情
export function getApproveDetail(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/approve/getApproveDetail',
    method: 'post',
    data,
  })
}
//获取所有一级变更类型
export function getFirstCategory(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/common/getFirstCategory',
    method: 'get',
    data,
  })
}

// 根据ID查询审核内容
export function getById(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/approve/getById',
    method: 'post',
    data,
  })
}
// 订单审核
export function approve(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/approve/save',
    method: 'post',
    data,
  })
}

// 新增
export function save(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/cost/save',
    method: 'post',
    data,
  })
}

// 删除
export function deleteVal(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/cost/delete',
    method: 'post',
    data,
  })
}

// 修改
export function update(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/cost/update',
    method: 'post',
    data,
  })
}
// 费用项目列表
export function getCostProjectList(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/cost/getCostProjectList',
    method: 'post',
    data,
  })
}

// 计算货期
export function calculateOutTime(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/approve/calculateOutTime',
    method: 'post',
    data,
  })
}

// 差价单
export function getOrderDiff(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/approve/getOrderDiff',
    method: 'post',
    data,
  })
}

// 业务员待确认
export function salesmanConfirmation(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/apply/salesmanConfirmation',
    method: 'post',
    data,
  })
}


// 是否审核超时
export function isApproveOutTime(data) {
  return request({
      headers:{
        token:localStorage.getItem('Access-Token')
    },
    url: BASE_URL + '/approve/isApproveOutTime',
    method: 'post',
    data,
  })
}