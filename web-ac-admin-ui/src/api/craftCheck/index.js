import request from "@/utils/request";
const BASE_URL = `/file-task`;
/**
 * 查询工艺审核列表
 * @param {*} params
 * @returns
 */
export function getCraftcheckList(params) {
  return request({
    url: BASE_URL + "/craft-check/page",
    method: "get",
    params,
  });
}
export function getTaskCount(params) {
  return request({
    url: BASE_URL + "/craft-check/getTaskCount",
    method: "get",
    params,
  });
}
/**
 * 领取任务
 * @param {*} params
 * @returns
 */
export function getCraftTask(params) {
  return request({
    url: BASE_URL + "/craft-check/getTask",
    method: "get",
    params,
  });
}
/**
 * 审核
 * @param {*} params
 * @returns
 */
export function craftCheck(params) {
  return request({
    url: BASE_URL + "/craft-check/check",
    method: "get",
    params,
  });
}
/**
 * 通过
 * @param {*} params
 * @returns
 */
export function passCraft(id) {
  return request({
    url: BASE_URL + "/craft-check/pass/" + id,
    method: "put",
  });
}
//历史
export function getLogs(id) {
  return request({
    url: BASE_URL + "/craft-check/getLogs/" + id,
    method: "get",
  });
}
/**
 * 通过
 * @param {*} params
 * @returns
 */
export function passCraftV2(data) {
  return request({
    url: BASE_URL + "/craft-check/pass-v2" ,
    method: "post",
    data
  });
}
/**
 * 驳回
 * @param {*} params
 * @returns
 */
export function rejectCraft(data) {
  return request({
    url: BASE_URL + "/craft-check/reject",
    method: "post",
    data
  });
}
/**
 * 获取撤单消息
 * @param {*} params
 * @returns
 */
 export function getCancelMsg(params) {
  return request({
    url: BASE_URL + "/craft-check/getCancelMsg",
    method: "get",
    params
  });
}
/**
 * 获取撤单消息数量
 * @param {*} params
 * @returns
 */
 export function craftCheckMsgCount(params) {
  return request({
    url: BASE_URL + "/craft-check/msgCount",
    method: "get",
    params
  });
}
/**
 * 提交撤单结果
 * @param {*} params
 * @returns
 */
 export function submitMsgOps(data) {
  return request({
    url: BASE_URL + "/craft-check/submitMsgOps",
    method: "post",
    data
  });
}

// 属性分解
export function craParsingAttributes(taskId) {
  return request({
    url:`${BASE_URL}/craft-check/parsingAttributes/${taskId}`,
    method: 'get',
  })
}

// 获取跟色跟样信息
export function craftCheckFollow(params) {
  return request({
    url:`${BASE_URL}/craft-check/getFollowInfo`,
    method: 'get',
    params
  })
}
