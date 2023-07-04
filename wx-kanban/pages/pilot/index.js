// pages/pilot/index.js
import {
  getPilot,
  punchClock
} from "../../api/device"
import {
  validDeviceStatus
} from "../../api/login"
// 图片域名
import {
  imageBaseUrl
} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: 2, // 是否登录 1 已登录   2 未登录
    showPassword: false, // 是否显示打卡密码弹窗
    // psdErrorMsg: "", // 密码错误信息
    deviceId: "", // 设备id
    supplierId: "", // 供应商id
    pilotId: "", // 机长id
    ids: null,
    password: "", // 打卡密码
    pilotList: [], // 机长列表
    imageBaseUrl: imageBaseUrl, // 图片域名
    userInfo: {
      deviceName: "", // 设备名
      pilotName: "", // 机长名
      operatorUrl: "" // 机长头像
    }
  },
  // 打开密码弹窗
  openPsdPopup(e) {
    console.log(e.currentTarget.dataset);
    let {
      pilotid,
      pilotname,
      operatorurl
    } = e.currentTarget.dataset
    let _this = this;
    _this.setData({
      showPassword: true,
      pilotId: pilotid,
      ['userInfo.pilotName']: pilotname,
      ['userInfo.operatorUrl']: operatorurl,
    })
  },
  // 获取输入框的值
  getInputVal(e) {
    let _this = this;
    _this.setData({
      password: e.detail.value
    })
  },
  // 清除密码值
  clearPsdVal() {
    console.log('三生三世');
    let _this = this;
    _this.setData({
      password: ''
    })
  },
  // 关闭密码弹窗
  onPsdClose() {
    let _this = this;
    _this.setData({
      showPassword: false,
      password: ""
    })
  },
  // 获取机长列表数据
  async getPilotData() {
    let _this = this;
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getPilot(_this.data.supplierId)
    if (code == '000000') {
      _this.setData({
        pilotList: data
      })
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
    wx.hideLoading();
  },
  // 上班打卡确认
  async psdAffirm() {
    let _this = this;
    // 供应商id
    let supplierId = _this.data.supplierId;
    // 设备id
    let deviceId = _this.data.deviceId;
    // 机长id
    let pilotId = _this.data.pilotId;
    if (!_this.data.password) {
      wx.showToast({
        title: '请输入打卡密码',
        icon: "none"
      })
      return false
    }
    // 参数
    let param = {
      deviceId,
      deviceOperatorId: pilotId,
      operatorPassword: _this.data.password,
      punchType: 0 //  打卡类型：0 上班 1 下班
    }
    let {
      code,
      data,
      message
    } = await punchClock(param);
    console.log(code, data, message);
    if (code == '000000') {
      // 用来存本地存储
      let ids = {
        supplierId, // 供应商id
        deviceId, // 设备id
        pilotId // 机长id
      }
      wx.setStorageSync('ids', ids)
      wx.setStorageSync('userInfo', _this.data.userInfo)
      wx.setStorageSync('isOnDuty', 1)
      wx.switchTab({
        url: '/pages/current/index'
      })
    } else if (code == '990003') {
      // 机台处于异常状态
      wx.showToast({
        title: message,
        icon:"none"
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/device/index',
        })
      },2000)
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 跳转设备
  jumpDevice() {
    wx.navigateTo({
      url: '/pages/device/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options);
    let _this = this;
    if (options) {
      let {
        supplierId,
        deviceId,
        deviceName
      } = options
      _this.setData({
        deviceId: deviceId ? deviceId : wx.getStorageSync('deviceId'),
        supplierId: supplierId || wx.getStorageSync('supplierId'),
        ids: wx.getStorageSync('ids'),
        ['userInfo.deviceName']: deviceName
      })
    }
    console.log('deviceId', _this.data.deviceId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let _this = this;
    _this.setData({
      isLogin: wx.getStorageSync('isLogin')
    })
    if (_this.data.isLogin != 1) {
      wx.showModal({
        title: '提示',
        content: '您未登录，无法访问该页面，请前往登录。',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/login/index'
            })
          }
        }
      });
      return
    }
    // 获取机长列表数据
    _this.getPilotData()
    let ids = _this.data.ids;
    // 判断是否正常下班
    if (wx.getStorageSync('isOnDuty') == 1) {
      if(!wx.getStorageSync('ids')){
        return
      }
      let result = await validDeviceStatus(ids.deviceId);
      wx.switchTab({
        url: '/pages/current/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})