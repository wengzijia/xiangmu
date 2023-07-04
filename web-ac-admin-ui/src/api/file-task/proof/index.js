import request from '@/utils/request'
const BASE_URL = `/file-task`
/**
 * 获取工单经过的节点信息
 * @param {Object} params
 * @returns 
 */
export function getTaskList(activityId) {
    return request({
      url: BASE_URL + '/flow-data/'+activityId,
      method: 'get'
    })
}