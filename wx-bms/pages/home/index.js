// pages/home/index.js
//获取应用实例
const app = getApp();
import { getWxUserInfo } from "../../api/login";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: '',
    isProcessor: 0,
    isInit: false,
    img: '../../image/bill/agent1.png',
    supplierType: "" //供应商类型：1.傲彩园区内供应商，2.第三方供应商
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          statusBarHeight: res.statusBarHeight,
          fontSizeSetting: res.fontSizeSetting,
          boxHeight: (500 / 750 * res.screenWidth) - (res.statusBarHeight * 1.4 + res.fontSizeSetting + res.statusBarHeight / 2),
          boxLineHeight: 130 / 750 * res.screenWidth
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this
    // 判断是否登录,已经登录的，进入首页
    _this.initUserInfo()
  },
  /**
   * 进行授权登陆
   * @param {*} text 
   */
  isLogin(text) {
    wx.showModal({
      title: '提示',
      cancelText: '否',
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#ff0036',
      content: text,
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '跳转中',
            mask: true
          })
          console.log('666')
          wx.navigateTo({
            url: '../login/index',
            complete: () => {
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {

        }
      }
    });
    return;
  },
  // 判断是否登录
  login(e) {
    console.log(e);
    const token = wx.getStorageSync('token');
 
    let text;
    if (!app.globalData.isLogin && !token) {
      text = '您未授权登录，无法访问该页面，请前往授权登录'
      this.isLogin(text)
    } else {
      this.jumpIndex(e)
    }
  },
  /**
   * 页面跳转@param {*} e 
   */
  jumpIndex(e) {
    console.log(e);
    if (e != '进入页面') {
      let type = e.currentTarget.dataset.type
      const urlObj = {
        // this.data.isProcessor == 0 ? `/pages/printingModule/bill/index?isProcessor=1` :
        bill: '/pages/bill/index?isProcessor=' + app.globalData.userInfo.is_supplier,
        place:'/pages/placeOrder/index',
        deviceList:'/pages/device/deviceList/index',
        staffList:'/pages/device/staffList/index'
      }
      wx.navigateTo({
        url: urlObj[type],
        complete: () => {wx.hideLoading()}
      })
    }

    return
    if (e != '进入页面') {
      let type = e.currentTarget.dataset.type
      if (type == 'place') {
        wx.navigateTo({
          url: '/pages/placeOrder/index',
        })
      } else if (type == 'bill') {
        wx.navigateTo({
          url: '/pages/bill/index?isProcessor=' + app.globalData.userInfo.is_supplier,
          complete: () => {
            wx.hideLoading()
          }
        })
      }else if (type == 'deviceList'){
        wx.navigateTo({
          url: '/pages/device/deviceList/index'
        })
      }else if (type == 'staffList'){
        wx.navigateTo({
          url: '/pages/device/staffList/index'
        })
        
      }
    }
  },
  /**
   * 初始化用户信息
   */
  initUserInfo() {
    let _this = this
    wx.showLoading({
      title:'加载中...',
      mask:true
    });
    getWxUserInfo().then((resluts) => {
      if (resluts.code == 200) {
        app.globalData.isLogin = true
        app.globalData.userInfo = resluts.data
        if (resluts.data.is_supplier == 1) {
          _this.setData({
            img: '../../image/bill/process1.png'
          })
        }
        _this.setData({
          isProcessor: app.globalData.userInfo.is_supplier,
          supplierType: resluts.data.supplier_type
        })
      } else {
        // this.login('进入页面')
      }
      _this.setData({
        isInit: true
      })
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
      _this.setData({
        isInit: true
      })
    })
  }
})