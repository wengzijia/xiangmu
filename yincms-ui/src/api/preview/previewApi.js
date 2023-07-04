import pf from '@/api/previewapi';
import { axios } from '@/utils/request';
//开始预检接口
export function getGenReport(parameter) {
  return axios({
    url: pf.previewApi.genReport,
    method: 'get',
    params: parameter
  });
}
//预检报告列表接口
export function getReportList(parameter) {
  return axios({
    url: pf.previewApi.reportList,
    method: 'get',
    params: parameter
  });
}
//预检报告详情
export function getReportDetail(parameter) {
  return axios({
    url: pf.previewApi.reportDetail,
    method: 'get',
    params: parameter
  });
}

//轮询预检结果
export function getPollReport(parameter) {
  return axios({
    url: pf.previewApi.pollReport,
    method: 'get',
    params: parameter
  });
}
