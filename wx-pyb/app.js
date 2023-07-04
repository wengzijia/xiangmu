//app.js
import {
  authorizeLogin,
  checkToken,
  getCurrentTimeMillis,
} from "./api/userApi";
import { requestUrl, OSSFileUrl } from "./utils/request.js";
import { getFrontPaperMap } from "./api/orderDetailsApi";
import { saveReport,setAndSetConfig,setTimeDiff,getClientIP } from "./utils/reported/reported";
import { logout } from "./api/userApi.js";

App({
  onload() {
    var _this = this;
    getFrontPaperMap().then((res) => {
      if (res.success) {
        _this.globalData.frontPaperMap = res.data;
      }
    });
  },
  saveReport,
  setAndSetConfig,
  setTimeDiff,
  getClientIP,
  onShow: async function (e) {
    var _this = this;
    _this.appUpdate();
    _this.setAndSetConfig()
    _this.setTimeDiff();
    _this.getClientIP();
  },
  /** 更新小程序 */
  appUpdate() {
    var _this = this;
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经上线，是否重启应用？",
              showCancel: false,
              success: function (res) {
                _this.globalData.isLogin = false;
                logout().finally(() => {
                  wx.clearStorage();
                });
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              },
            });
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
            });
          });
        }
      });
    }
  },
  globalData: {
    showModal: false,
    draw: false,
    credit: null,
    pdfPath: "", //拼版上传文件成功返回的地址
    payType: "wxpay2js",
    payType2: "wxjs",
    payType3: "wxpay4js",
    payType4: "wxpay3js", //信息技术
    admin: false, //是否业务
    authorization: 0, //请求用户信息授权次数
    userInfo: null, //用户信息，头像，昵称
    phoneNumber: null, //用户手机号
    isIphoneX: false,
    isLogin: false, //是否登录
    CurrenUserInfo: {},
    shareObj: {
      title: "专注服务包装印刷中间商",
      path: "/pages/home/index",
    },
    frontPaperMap: {}, //小程序前台纸张展示列表
    serviceQQ: "800822006",
    requestUrl: requestUrl, //上传文件URL
    OSSFileUrl: OSSFileUrl, //OSS地址
    serverTimeDiff: 0, //服务器和当前设备的时间差
    payUrl: "https://www.aocai.cn", //微信支付回调域名,不要乱动
    repotedLen:10,//埋点上报数据本地存储数组最大长度
  },
});
