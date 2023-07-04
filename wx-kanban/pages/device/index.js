// pages/device/index.js
import {
  getDevice
} from "../../api/device"
import {
  loginOut
} from "../../api/login"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplierId: "", // 加工商id
    deviceList: [], // 设备列表
    isLogin: 2 // 是否登录   1 已登录  2 未登录
  },
  // 获取设备数据
  async getDeviceData() {
    let _this = this;
    let param = {
      supplierId: _this.data.supplierId,
      attributeId: 48 ///  48 是获取除废工艺
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getDevice(param);
    console.log(code, data, message);
    if (code == '000000') {
      _this.setData({
        deviceList: data
      })
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
    wx.hideLoading();
  },

  // 跳转机长
  jumpPilot(e) {
    console.log('sss', e);
    let {
      supplierid,
      choosetype,
      deviceid,
      devicename
    } = e.currentTarget.dataset;
    // choosetype   设备选择状态  0 未选中   1 选中
    if (choosetype == 1) {
      return false
    }
    wx.setStorageSync('deviceId', deviceid)
    wx.setStorageSync('deviceName', devicename)
    wx.setStorageSync('supplierId', supplierid)
    wx.navigateTo({
      url: `/pages/pilot/index?supplierId=${supplierid}&deviceId=${deviceid}&deviceName=${devicename}`,
    })
  },

  // 退出登录
  async exitLogin() {
    wx.showLoading({
      title: '退出中...',
      mask: true
    })
    let {
      code,
      data,
      message
    } = await loginOut();
    if (code == "000000") {
      wx.reLaunch({
        url: '/pages/login/index'
      })
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
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
      isLogin: wx.getStorageSync('isLogin'),
      supplierId: wx.getStorageSync('supplierId')
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
    // 获取设备数据
    _this.getDeviceData()
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