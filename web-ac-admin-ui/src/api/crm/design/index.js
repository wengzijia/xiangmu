import request from "@/utils/request";
const BASE_URL = '/customer-crm'
import { download } from "@/utils/request";

/**分页查询方案设计 */
export function getDesignList(params) {
  return request({
    url: BASE_URL + `/crm-project-design-proc`,
    method: "get",
    params
  });
}
/**导出方案设计列表 */
export function exportDesignProcList(data,name){
  return download( `/customer-crm/crm-project-design-proc/export`,data,name )
}

/**通过节点id获得方案设计节点数据*/
export function getDesignTask(id) {
  return request({
    url: BASE_URL + `/crm-project-design-task/${id}`,
    method: "get",
  });
}

/**根据节点id查询品类集合*/
export function getDesignCategoryTask(taskId) {
  return request({
    url: BASE_URL + `/crm-project-design-category/task/${taskId}`,
    method: "get",
  });
}

/**提交设计方案*/
export function submitDesign(data) {
  return request({
    url: BASE_URL + `/crm-project-design-proc/submit-design-proposal`,
    method: "post",
    data
  });
}
/**设计师接单(领取)*/
export function takeDesigner(id) {
  return request({
    url: BASE_URL + `/crm-project-design-proc/designer-take-orders/${id}`,
    method: "post",
  });
}
/**查询提交设计方案驳回记录*/
export function getDesignProposal(procId) {
  return request({
    url: BASE_URL + `/crm-project-design-task/history/submit-design-proposal/${procId}`,
    method: "get",
  });
}
/**根据订单id和订单类型查询设计需求*/
export function getDesignRequirement(orderId,params) {
  return request({
    url: BASE_URL + `/crm-project-design-category/order/design_requirement/${orderId}`,
    method: "get",
    params
  });
}
