import { code } from "./code";
import { getAndSetConfig } from "../../api/orderDetailsApi.js";
import { getCurrentTimeMillis } from "../../api/userApi";
import { formatTime2 } from "../../utils/util";

/**
 * 上报埋点数据
 * @param {*} data
 */
function reported(data) {
  wx.request({
    method: "POST",
    url: `https://www.aocai.cn/api/reported/system/action/report`,
    data: JSON.stringify(
      data.map((e) => {
        e.actionName && delete e.actionName;
        e.channelName && delete e.channelName;
        return e;
      })
    ),
    header: {
      "Content-type": "application/json;charset=UTF-8",
    },
    success: function (res) {},
    fail: function (res) {},
  });
}

module.exports = {
  /**
   * 保存埋点的操作数据，到达阈值就上报到服务器
   * @param {*} report
   * @returns
   */
  saveReport(report = {}) {
    let _this = this;
    if (report.type && report.goodsId) {
      // 使用商品ID+操作模块+操作id 获取数据
      let info = code.find(
        (e) =>
          e.type == report.type &&
          e.goodsId == report.goodsId &&
          e.actionId == report.actionId
      );
      report = { ...info };
    } else if (report.type && report.boxId) {
      // 使用盒子品类ID+操作模块+操作id 获取数据
      let info = code.find(
        (e) =>
          e.type == report.type &&
          e.boxId == report.boxId &&
          e.actionId == report.actionId
      );
      report = { ...info };
    }
    if (!report.actionId || !report.channel) {
      console.warn("数据缺少channel或者actionId", report);
      return;
    }
    if (_this.globalData.isLogin) {
      report.timestramp = Math.floor(
        (new Date().getTime() - _this.globalData.serverTimeDiff) / 1000
      );
      report.uid = _this.globalData.CurrenUserInfo.id;
    } else {
      return;
    }
    var reportedList = wx.getStorageSync("reportedList");
    if (!reportedList) reportedList = [];
    report.appId = 2;
    let ipInfo = wx.getStorageSync("ipInfo");
    if (ipInfo) {
      report.ip = ipInfo.ip;
    }
    let reportInfo = code.find(
      (e) =>
        e.appId == report.appId &&
        e.channel == report.channel &&
        e.actionId == report.actionId
    );
    reportedList.push({
      ...report,
      actionName: reportInfo.actionName,
      channelName: reportInfo.channelName,
    });
    if (reportedList.length >= _this.globalData.repotedLen) {
      reported(reportedList);
      wx.setStorageSync("reportedList", []);
    } else {
      wx.setStorageSync("reportedList", reportedList);
    }
  },
  /**
   * 获取服务器的设定的埋点日志上报阈值,
   */
  setAndSetConfig() {
    let _this = this;
    getAndSetConfig({ status: 2, secretKey: 2, key: "repoted" }).then(
      (result) => {
        let len = result;
        if (len > 1) {
          _this.globalData.repotedLen = len;
        }
      }
    );
  },
  /** 获取服务器时间计算客户端和服务端的时间差 */
  setTimeDiff() {
    let newTime = new Date().getTime();
    getCurrentTimeMillis().then((res) => {
      let time = newTime - res.data;
      if (time > 60 * 1000 || time < -60 * 1000) {
        this.globalData.serverTimeDiff = time;
      }
    });
  },
  /**
   * 获取客户端IP，每日获取一次
   */
  getClientIP() {
    let ipInfo = wx.getStorageSync("ipInfo");
    let time = formatTime2(new Date());
    if (ipInfo && ipInfo.time === time) {
      return;
    }
    wx.request({
      url: `https://www.liaotu.com/api/lt/certifyFree/user/getClientIP`,
      success: function (res) {
        if (res.data.success) {
          wx.setStorageSync("ipInfo", { ip: res.data.data, time });
        }
      },
    });
  },
};

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
