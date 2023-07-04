import request from "@/utils/request";
import request2 from "@/utils/request2";
import { downloadZip } from "@/utils/request";
const BASE_URL = `/file-task`;
/**
 * 获取印前列表
 * @param {*} params 
 * @returns 
 */
export function getPrepressList(params) {
  return request({
    url: BASE_URL + "/prepress-design/list",
    method: "get",
    params,
  });
}
/**
 * 驳回
 * @param {*} data 
 * @returns 
 */
export function rejectPrepress(data) {
  return request({
    url: BASE_URL + "/prepress-design/reject",
    method: "post",
    data,
  });
}
/**
 * 领取任务
 * @param {Object} params
 * @param {Number} params.type
 * @returns 
 */
export function getTask(params) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/getTask",
    method: "get",
    params,
  });
}
/**
 * 领取任务(新)
 * @param {Object} params
 * @param {Number} params.type
 * @returns 
 */
 export function getTask2(params,activityId) {
  return request({
    url: BASE_URL + `/prepress-design/self-work/task/${activityId}`,
    method: "get",
    params,
  });
}
/**
 * 领取任务-按PO号精确搜索来领取工单
 * @param {Object} params
 * @returns 
 */
export function getPerperssTaskByPo(params) {
  return request({
    url: BASE_URL + `/prepress-design/self-work/task`,
    method: "get",
    params,
  });
}
//精装盒一键三连
export function downloadComponentPoXml(data,name) {
  return downloadZip(BASE_URL + `/prepress-design/self-work/downloadComponentPoXml`,data,name);
}

/**
 * 个人工作台列表
 * @param {Object} params
 * @param {Number} params.type
 * @returns 
 */
export function getMyTaskList(params) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/myTaskList",
    method: "get",
    params,
  });
}
/**
 * 个人工作台列表(新)
 * @param {Object} params
 * @param {Number} params.type
 * @returns 
 */
 export function getMyTaskWork(params) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/myTaskWork",
    method: "get",
    params,
  });
}
/**
 * 印前详情
 * @argument {String} taskId
 * @returns 
 */
 export function getPrepressDetailById(taskId) {
  return request({
    url: BASE_URL + "/prepress-design/"+taskId,
    method: "get",
  });
}
/**
 * 获取印前文件详情
 * @param {Object} params
 * @param {String} params.activityId
 * @returns 
 */
 export function getPrepressFile(id) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/getPrepressFile/"+id,
    method: "get",
  });
}
/**
 * 保存上传文件
 * @param {Object} data
 * @returns 
 */
 export function saveUploadFile(data) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/saveUploadFile",
    method: "post",
    data,
  });
}
/**
 * 保存打样上传文件
 * @param {Object} data
 * @returns 
 */
 export function saveProofFile(data) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/saveProofFile",
    method: "post",
    data,
  });
}
/**
 * 印前已完成列表
 * @param {Object} params
 * @returns 
 */
 export function getFinishedList(params) {
  return request({
    url: BASE_URL + "/prepress-design/self-finished/finishedList",
    method: "get",
    params,
  });
}
/**
 * 完成印前单
 * @param {Object} data
 * @returns 
 */
 export function finishPrepress(params,activityId) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/finish/"+activityId,
    method: "post",
    params,
  });
}
/**
 * 转移印前单
 * @param {Object} data
 * @returns 
 */
 export function transferTask(data) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/transferTask",
    method: "post",
    data,
  });
}
/**
 * 获取部门所有用户
 * @param {Object} params
 * @param {Number} params.deptId
 * @returns 
 */
 export function getDeptUser(id) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/user/getDeptUser/"+id,
    method: "get",
  });
}
/**
 * 撤单消息
 * @param {Object} params
 * @returns 
 */
 export function cancellationMessage(params) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/cancellationMessage",
    method: "get",
    params,
  });
}
/**
 * 撤单消息数量
 * @param {Object} params
 * @returns 
 */
 export function cancellationMessageSum(params) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/cancellationMessageSum",
    method: "get",
    params,
  });
}
/**
 * 印前处理数量
 * @param {Object} params
 * @returns 
 */
 export function getCountOfStatus(params) {
  return request({
    url: BASE_URL + "/prepress-design/getCountOfStatus",
    method: "get",
    params,
  });
}
/**
 * 同意撤单
 * @param {Object} data
 * @returns 
 */
 export function agreeToWithdraw(id) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/agreeToWithdraw/"+id,
    method: "post",
  });
}
/**
 * 不同意撤单
 * @param {Object} data
 * @returns 
 */
 export function doNotAgreeToCancelTheOrder(id) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/doNotAgreeToCancelTheOrder/"+id,
    method: "post",
  });
}
/**
 * 印前保存pdf文件
 * @param {Object} data
 * @returns 
 */
 export function selfworkUploadFile(data) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/uploadFile",
    method: "post",
    data,
    timeout: 1000 * 60 * 10
  });
}
/**
 * 印前撤销推送
 * @param {Object} data
 * @returns 
 */
 export function withdrawWithUnaccalimed(data) {
  return request({
    url: BASE_URL + "/prepress-design/self-finished/withdrawWithUnaccalimed",
    method: "post",
    data,
  });
}
/**
 * 印前下载poxml文件
 * @param {Object} data
 * @returns 
 */
 export function downloadPoxml(data) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/downloadPoxml",
    method: "post",
    data,
    responseType: 'blob',
  });
}
/**
 * 印前导出Excel文件
 * @param {Object} data
 * @returns 
 */
 export function exportExcel(params) {
  return request({
    url: BASE_URL + "/prepress-design/self-finished/export",
    method: "post",
    params,
    responseType: 'blob',
  });
}
/**
 * 属性分解
 * @param {Object} params
 * @returns 
 */
 export function getParsingAttributes(id) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/parsingAttributes/"+id,
    method: "get",
  });
}
/**
 * 退回文件推送前
 * @param {Object} data
 * @returns 
 */
 export function returnFileBeforePushing(data) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/returnFileBeforePushing",
    method: "post",
    data,
  });
}
/**
 * 跨节点转单
 * @param {Object} data
 * @returns 
 */
 export function transferOrderAcrossNodes(data) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/transferOrderAcrossNodes",
    method: "post",
    data,
  });
}
/**
 * 获取备注信息
 * @param {Object} params
 * @returns 
 */
 export function getPrepressLogs(activityId) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/getLogs/"+activityId,
    method: "get",
  });
}
/**
 * 同意授权修改备注
 * @param {Object} data
 * @returns 
 */
 export function agreePrepressModifyRemark(data) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/agreeModifyRemark",
    method: "post",
    data,
  });
}
/**
 * 上传印前pdf文件
 * @param {Object} data
 * @returns 
 */
 export function upLoadedPofile(data,params) {
  return request2({
    url: "prepressFile/pofile",
    method: "post",
    data,
    params,
    timeout: 1000 * 60 * 10,
  });
}
/**
 * 上传印前pdf文件
 * @param {Object} data
 * @returns 
 */
 export function getPdfPagesInfo(params) {
  return request2({
    url: "prepressFile/getPdfPagesInfo",
    method: "post",
    params,
    timeout: 1000 * 60 * 10,
  });
}

/**
 * 获取pdf页面信息
 * @param {Object} data
 * @returns 
 */
 export function getPdfPagesDetail(data) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/getPdfPagesInfo",
    method: "post",
    data,
  });
}
/**
 * 注意跟色跟样备注
 * @param {Object} data
 * @returns 
 */
export function prepressFollow(params) {
  return request({
    url: BASE_URL + "/prepress-design/self-work/getFollowInfo/"+params.id,
    method: 'get'
    
  });
}
