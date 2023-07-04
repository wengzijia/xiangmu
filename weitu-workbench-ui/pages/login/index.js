// pages/login/index.js
import {
  getCode,
  smsLogin
} from "../../api/login"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: "", // 手机号
    codeTime: "", // 用来清除验证码定时器
    countDown:"", // 倒计时
    showCode: true, // 是否显示获取验证码
    code: "", // 验证码
    isCodeSuccess: false, // 获取验证码是否成功
    showWTPopup:false  // 是否显示微图弹窗
  },
  // 获取输入框值
  getInputVal(e) {
    console.log(e);
    let _this = this;
    let {
      value
    } = e.detail
    let {
      type
    } = e.currentTarget.dataset
    // 0 手机号  1 密码
    if (type == 0) {
      _this.setData({
        phoneNumber: value
      })
    } else if (type == 1) {
      _this.setData({
        code: value
      })
    }
  },
  // 校验手机号
  checkPhone() {
    let _this = this;
    // 手机号
    let phoneNumber = _this.data.phoneNumber;
    if (!phoneNumber) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }
    // 手机号正则
    let phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false
    }
    return true
  },
  // 获取验证码
  sendCode() {
    let _this = this;
    if (!_this.checkPhone()) return;
    let num = 60;
    // 参数
    let param = {
      language: "zh-cn",
      mobile: _this.data.phoneNumber
    }
    wx.showLoading({
      title: '获取中...',
      mask: true
    })
    getCode(param).then((res) => {
      wx.hideLoading()
      let {
        code,
        data,
        message
      } = res
      console.log('ss', code, message);
      if (code == '000000') {
        wx.setStorageSync('uuid', data)
        wx.showToast({
          title: message,
          icon: "none"
        })
        _this.setData({
          isCodeSuccess: true
        })
        let codeTime = _this.data.codeTime;
        codeTime = setInterval(function () {
          num--
          if (num > 0) {
            _this.setData({
              countDown: num + 's',
              showCode: false
            })
          } else {
            clearInterval(codeTime)
            _this.setData({
              countDown: "",
              showCode: true,
            })
          }
        }, 1000)
      } else {
        wx.showToast({
          title: message,
          icon: "none"
        })
      }
    }).catch(err => {
      console.log('err', err)
      wx.hideLoading()
    })
  },

  // 登录
  async login() {
    let _this = this;
    if (!_this.checkPhone()) return;
    // 验证码
    if (!_this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return false
    }
    let param = {
      language: "zh-cn",
      mobile: _this.data.phoneNumber,
      remember: 0,
      smsVerifyUuid: wx.getStorageSync('uuid'),
      smsVerifyCode: _this.data.code
    }
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    let {
      code,
      data,
      message
    } = await smsLogin(param);
    wx.hideLoading()
    if (code == '000000') {
      wx.showToast({
        title: message,
        icon: "none"
      })
      wx.setStorageSync('token', data)
      // isLogin  1 已登录   2 未登录
      wx.setStorageSync('isLogin', 1)
      wx.navigateTo({
        url: `/pages/workbench/index`
      })
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 关于微图
  aboutWT(){
    this.setData({
      showWTPopup:true
    })
  },
  // 关闭微图弹窗
  WTPopupClose(){
    this.setData({
      showWTPopup:false
    })
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
    let _this = this;
    wx.setStorageSync('isLogin', 2)
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