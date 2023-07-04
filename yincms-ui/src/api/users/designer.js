import api from '@/api';
import { axios } from '@/utils/request';
import { downloadFile } from '@/utils/requestDownload';

// 申请
export function apply(parameter) {
  return axios({
    url: api.designer.applyer.apply,
    method: 'post',
    data: parameter
  });
}
// 按照id获取
export function getById(parameter) {
  return axios({
    url: api.designer.applyer.getById,
    method: 'post',
    data: parameter
  });
}
// 按照用户id获取
export function getByUserId(parameter) {
  return axios({
    url: api.designer.applyer.getByUserId,
    method: 'post',
    data: parameter
  });
}
// 获取用户实名和签署信息
export function gainRealSignMessage(parameter) {
  return axios({
    url: api.designer.applyer.gainRealSignMessage,
    method: 'post',
    data: parameter
  });
}
// 到法大大注册用户并获取实名认证
export function getCertificationUrl(parameter) {
  return axios({
    url: api.designer.applyer.getCertificationUrl,
    method: 'post',
    data: parameter
  });
}
// 实名认证完成获取入驻签约合同地址
export function getCertificationSync(parameter) {
  return axios({
    url: api.designer.applyer.getCertificationSync,
    method: 'post',
    data: parameter
  });
}
// 获取电子合同签约地址
export function gainUserElectronicContractUrl(parameter) {
  return axios({
    url: api.designer.applyer.gainUserElectronicContractUrl,
    method: 'post',
    data: parameter
  });
}
// 任务实时动态
export function getPackOutDynamicList(parameter) {
  return axios({
    url: api.designer.applyer.getPackOutDynamicList,
    method: 'get',
    params: parameter
  });
}
// 获取任务大厅分页列表-模型品类
export function getCategoryPrice(parameter) {
  return axios({
    url: api.designer.applyer.getCategoryPrice,
    method: 'get',
    params: parameter
  });
}
// 获取任务大厅分页列表-模型品类
export function getCategoryTaskHall(parameter) {
  return axios({
    url: api.designer.applyer.getCategoryTaskHall,
    method: 'post',
    data: parameter
  });
}
//获取任务大厅分页列表
export function getTaskHallPage(parameter) {
  return axios({
    url: api.designer.applyer.getTaskHallPage,
    method: 'post',
    data: parameter
  });
}
//获取移动端实人认证结果
export function geCertificationResults(parameter) {
  return axios({
    url: api.designer.applyer.geCertificationResults,
    method: 'post',
    data: parameter
  });
}
//
// 获取认证入驻奖励活动信息
export function getActivity(parameter) {
  return axios({
    url: api.designer.applyer.getActivity,
    method: 'post',
    data: parameter
  });
}
// 入驻有上传作品但未评审 领取任务时确认修改为已评审
export function upReviewOver(parameter) {
  return axios({
    url: api.designer.applyer.upReviewOver,
    method: 'post',
    data: parameter
  });
}
// 获取标签
export function getLabelList(parameter) {
  return axios({
    url: api.designer.applyer.getLabelList,
    method: 'post',
    data: parameter
  });
}
// 上传初始设计文件
export function updateInitialDesignDocument(parameter) {
  return axios({
    url: api.designer.applyer.updateInitialDesignDocument,
    method: 'post',
    data: parameter
  });
}
// 设计师我的任务列表
export function getStylistTaskList(parameter) {
  return axios({
    url: api.designer.packOut.getStylistTaskList,
    method: 'post',
    data: parameter
  });
}
// 设计师我的任务列表-交付稿件下载
export function deliveryDownload(parameter) {
  return axios({
    url: api.designer.packOut.deliveryDownload,
    method: 'post',
    data: parameter
  });
}
// 设计师我的任务列表-查看详情
export function getStylistTaskParticulars(parameter) {
  return axios({
    url: api.designer.packOut.getStylistTaskParticulars,
    method: 'post',
    data: parameter
  });
}
// 设计师预览任务
export function getTaskdetail(parameter) {
  return axios({
    url: api.designer.packOut.getTaskdetail,
    method: 'get',
    params: parameter
  });
}

// 设计师领取任务
export function getTheTask(parameter) {
  return axios({
    url: api.designer.packOut.getTheTask,
    method: 'post',
    data: parameter
  });
}
// 上传文件
export function uploadFile(parameter) {
  return axios({
    url: api.designer.packOut.uploadFile,
    method: 'post',
    data: parameter
  });
}
// 设计师我的任务列表-查看详情-删减按钮
export function getDeleteButton(parameter) {
  return axios({
    url: api.designer.packOut.getDeleteButton,
    method: 'post',
    data: parameter
  });
}
// 设计师我的任务列表-查看详情-提交审核
export function getSubmitAudit(parameter) {
  return axios({
    url: api.designer.packOut.getSubmitAudit,
    method: 'post',
    data: parameter
  });
}
// 设计师我的任务列表-查看详情-新增按钮
export function getTheNewButton(parameter) {
  return axios({
    url: api.designer.packOut.getTheNewButton,
    method: 'post',
    data: parameter
  });
}
// 设计师我的任务列表-查看详情-设计师关闭任务
export function closeTask(parameter) {
  return axios({
    url: api.designer.packOut.closeTask,
    method: 'post',
    data: parameter
  });
}
// 下载文件添加水印
export function downloadWatermarkFile(parameter, callback) {
  return downloadFile(api.designer.packOut.downloadWatermarkFile, parameter, callback);
}
// 文件批量加水印压缩下载
export function zipDownload(parameter, callback) {
  return downloadFile(api.designer.packOut.zipDownload, parameter, callback);
}
// 设计师下载已上传的设计稿-全部份数
export function allDocument(parameter, callback) {
  return downloadFile(api.designer.packOut.allDocument, parameter, callback);
}
// 设计师财务结算-待结算任务单列表
export function getSettlementListPage(parameter) {
  return axios({
    url: api.designer.financial.getSettlementListPage,
    method: 'post',
    data: parameter
  });
}
// 设计师财务结算-累计收入及可结算收入
export function getSettlementMoney(parameter) {
  return axios({
    url: api.designer.financial.getSettlementMoney,
    method: 'post',
    data: parameter
  });
}
//设计师财务结算-提现操作
export function gainFinanceSettlemenWithdraw(parameter) {
  return axios({
    url: api.designer.financial.gainFinanceSettlemenWithdraw,
    method: 'post',
    data: parameter
  });
}
//设计师财务结算-获取用户提现账户
export function gainFinanceWithdrawalAccount(parameter) {
  return axios({
    url: api.designer.financial.gainFinanceWithdrawalAccount,
    method: 'post',
    data: parameter
  });
}
//设计师财务结算-获取用户提现账户
export function addFinanceWithdrawalAccount(parameter) {
  return axios({
    url: api.designer.financial.addFinanceWithdrawalAccount,
    method: 'post',
    data: parameter
  });
}
//设计师结算提现-提现任务单列表
export function getWithdrawListPage(parameter) {
  return axios({
    url: api.designer.financial.getWithdrawListPage,
    method: 'post',
    data: parameter
  });
}
//设计师结算提现-已结算页面获取包含订单详细数据
export function getSettlementWithdrawList(parameter) {
  return axios({
    url: api.designer.financial.getSettlementWithdrawList,
    method: 'post',
    data: parameter
  });
}
