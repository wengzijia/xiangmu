// import { code } from './code';
let code = [];
import { getCurrentTimeMillis, getAndSetConfig, report, getClientIP } from '@/api/reportedApi.js';
import { getUid } from '@/utils/utils';

/**
 * 上报埋点数据
 * @param {*} data
 */
function reported(data) {
  let params = JSON.stringify(
    data.map(e => {
      e.actionName && delete e.actionName;
      e.channelName && delete e.channelName;
      return e;
    })
  );
  report(params).catch(err => {});
}
/**
 * 保存埋点的操作数据，到达阈值就上报到服务器
 * @param {*} report
 * @returns
 */
export function saveReport(report = {}) {
  // console.log(report);
  let _this = this;
  let maxLen = 10;
  if (!report.actionId || !report.channel) {
    console.warn('数据缺少channel或者actionId', report);
    return;
  }
  // console.log(_this.$store.getters);
  if (_this.$store.getters && _this.$store.getters.userInfo) {
    report.uid = _this.$store.getters.userInfo.id;
    localStorage.setItem('custom_uid', report.uid);
  } else {
    let custom_uid = localStorage.getItem('custom_uid');
    if (!custom_uid) {
      custom_uid = getUid();
      localStorage.setItem('custom_uid', custom_uid);
    }
    maxLen = 3;
    report.uid = custom_uid;
  }
  let serverTimeDiff = sessionStorage.getItem('timeDiff');
  if (serverTimeDiff) {
    report.timestramp = Math.floor((new Date().getTime() - serverTimeDiff) / 1000);
  } else {
    report.timestramp = Math.floor(new Date().getTime() / 1000);
  }

  var reportedList = localStorage.getItem('reportedList');
  if (!reportedList) reportedList = [];
  else reportedList = JSON.parse(reportedList);
  report.appId = 1;
  let ipInfo = localStorage.getItem('ipInfo');
  if (ipInfo) {
    report.ip = ipInfo;
  }
  // console.log(report);
  reportedList.push({
    ...report
  });
  if (reportedList.length >= maxLen) {
    reported(reportedList);
    localStorage.setItem('reportedList', []);
  } else {
    localStorage.setItem('reportedList', JSON.stringify(reportedList));
  }
}
/**
 * 获取服务器的设定的埋点日志上报阈值,
 */
export function setAndSetConfig() {
  getAndSetConfig({ status: 2, secretKey: 2, key: 'repoted' }).then(result => {
    let len = result;
    if (len > 1) {
      sessionStorage.setItem('repotedLen', len);
    }
  });
}
/** 获取服务器时间计算客户端和服务端的时间差 */
export function setTimeDiff() {
  if (sessionStorage.getItem('timeDiff')) return;
  let newTime = new Date().getTime();
  getCurrentTimeMillis().then(res => {
    let time = newTime - res.data;
    if (time > 60 * 1000 || time < -60 * 1000) {
      sessionStorage.setItem('timeDiff', time);
    }
  });
}
/**
 * 获取客户端IP
 */

export function setClientIP() {
  let ipInfo = localStorage.getItem('ipInfo');
  if (!ipInfo) {
    getClientIP().then(res => {
      localStorage.setItem('ipInfo', res.data);
    });
  }
}

/**
 * 小程序用户操作日志上报
 * 方案1：每个操作都上报一次
 *      优点：能精确的知道用户的每一个操作的时间
 *      缺点：用户过多和操作频繁的话并发量过大会导致服务器的压力过大
 * 方案2：定时上传多个操作
 *      优点：减少并发量，减小服务器压力
 *      缺点：用户突然退出会导致定时器失效
 * 方案3：操作次数达到30个上报一次
 *      优点：减少并发量，减小服务器压力
 *      缺点：用户操作时间过长，或者每一步的操作过长会导致操作时间无法正确识别
 */
