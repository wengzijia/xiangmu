import request from '@/utils/request2';

/** 获取包装方案专题用户提交信息 */
export function pageListCustomer(data) {
  return request({
    url: '/promotion/miniPromotionPackCustomer/pageListCustomer',
    method: 'post',
    headers:{repeatSubmit:false },
    data
  })
}
/** 获取包装方案关键词统计 */
export function pageKeywordLogs(data) {
  return request({
    url: '/promotion/miniPromotionPackKeywordLog/countLog',
    method: 'post',
    headers:{repeatSubmit:false },
    data
  })
}

