// pages/my/index.js
import {
  format
} from "../../utils/util"
// 图片域名
import {
  imageBaseUrl
} from '../../utils/request'
import {
  queryRushOrder
} from "../../api/my"
import {
  punchClock
} from "../../api/device"
import {
  getCurrentOrderInfo
} from "../../api/current"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: 2, // 是否登录 1 已登录   2 未登录
    timer: "", // 用来清除定时器
    time: "", // 时间
    ids: "",
    deviceName: "", // 设备名
    userInfo: "", // 用户信息
    imageBaseUrl: imageBaseUrl, // 图片域名
    isClockOutHint: false, // 是否显示下班打卡弹窗
    // isStartPro: 2, // 是否开始生产  1 开始  2 完成
    proStatus: 0, //  0 未开始生产  2 开始生产
    isRushOrder: false, // 是否有急单
    clockOutParam: {
      deviceId: "", // 设备id
      deviceOperatorId: "", // 机长id
      punchType: "1" // 打卡类型：0 上班 1 下班
    }
  },
  // 跳转到除废操作规程
  jumpSop() {
    let _this = this;
    if (_this.data.isLogin != 1) {
      return
    }
    wx.navigateTo({
      url: '/subpackageA/pages/process/index'
    })
  },
  // 获取本地存储
  getStorageSync(key) {
    return wx.getStorageSync(key)
  },
  // 获取时分秒
  getTime() {
    let _this = this;
    //定时器  函数赋值给timer  方便clearInterval（）使用
    _this.data.timer = setInterval(
      function () {
        _this.setData({
          time: format("hh:mm:ss")
        })
      }, 1000);
    _this.setData({
      timer: _this.data.timer
    });
  },
  // 清除定时器
  clearTimer() {
    let _this = this;
    clearInterval(_this.data.timer)
    _this.setData({
      timer: null
    });
  },
  // 获取生产状态
  async getProStatus() {
    let _this = this;
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getCurrentOrderInfo(_this.data.ids.deviceId);
    if (code == '000000') {
      if (data) {
        _this.setData({
          proStatus: data?.productStatus
        })
      }else{
        _this.setData({
          proStatus: 0
        })
      }
      console.log('生产状态',_this.data.proStatus);
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    } else {
      _this.setData({
        proStatus: 0
      })
    }
    wx.hideLoading()
  },
  // 获取急单结果
  async getRushOrder() {
    let _this = this;
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await queryRushOrder(48);
    wx.hideLoading()
    if (code == "000000") {
      _this.setData({
        isRushOrder: data
      })
      console.log('急单', _this.data.isRushOrder);
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 下班打卡
  async clockOff() {
    let _this = this;
    // 未登录
    if (_this.data.isLogin != 1) {
      return
    }
    // 开始生产判断
    if (_this.data.proStatus == 2) {
      return
    } else {
      // 判断急单
      await _this.getRushOrder()
      console.log('isRushOrder', _this.data.isRushOrder);
      if (_this.data.isRushOrder) {
        _this.setData({
          isClockOutHint: true
        })
        return
      }
      _this.clockOut()
    }
  },
  // 打卡下班
  async clockOut() {
    let _this = this;
    let {
      supplierId,
      deviceId,
      pilotId
    } = _this.data.ids;
    _this.setData({
      ['clockOutParam.deviceId']: deviceId,
      ['clockOutParam.deviceOperatorId']: pilotId
    })
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await punchClock(_this.data.clockOutParam);
    wx.hideLoading()
    if (code == '000000') {
      // wx.removeStorageSync('token')
      wx.setStorageSync('isOnDuty', 2)
      wx.reLaunch({
        url: '/pages/pilot/index'
      })
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 下班打卡取消
  clockOutCatch() {
    let _this = this;
    _this.setData({
      isClockOutHint: false
    })
  },
  // 下班打卡确认
  clockOutAffirm() {
    let _this = this;
    _this.clockOut()
  },
  // 预览图片
  previewImage(e) {
    let _this = this;
    let {
      img
    } = e.currentTarget.dataset
    if (img) {
      wx.previewImage({
        urls: [imageBaseUrl + img], // 需要预览的图片http链接列表
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _this = this
    _this.getTime()
    _this.setData({
      isLogin: wx.getStorageSync('isLogin')
    })
    if (_this.data.isLogin != 1) {
      wx.showModal({
        title: '提示',
        content: '您未登录，无法访问该页面，请前往登录。',
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
    _this.setData({
      deviceName: wx.getStorageSync('deviceName') || wx.getStorageSync('userInfo').deviceName,
      userInfo: wx.getStorageSync('userInfo'),
      // isStartPro: wx.getStorageSync('isStartPro'),
      ids: wx.getStorageSync('ids')
    })
    _this.getProStatus()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let _this = this;
    _this.clearTimer()
    _this.setData({
      isClockOutHint: false
    })
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