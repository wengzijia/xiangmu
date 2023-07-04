// pages/login/index.js
import {
  authorizeLogin
} from "../../api/login"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 微信登录
  getPhoneNumber(e) {
    console.log('e', e);
    let _this = this;
    let {
      encryptedData,
      iv,
      code
    } = e.detail;
    if (iv) {
      wx.login({
        success(res) {
          console.log('res', res);
          let param = {
            encryptedData, // 加密信息
            iv, // 加密算法的初始向量
            codeModel:code, // 手机号code(上面获取)
            code: res.code, // 登录码
            recommender: app.globalData.recommender, // 推荐人 后面分享再做
            salesperson: app.globalData.salesperson // 业务员 后面分享再做
          }
          wx.showLoading({
            title: "登录中..."
          })
          authorizeLogin(param).then(res => {
            console.log('res', res);
            if (res.code == '000000') {
              wx.setStorageSync('token', res.data.token)
              app.globalData.isLogin = true
              app.globalData.recommender = ''
              // app.globalData.salesperson = ''
              _this.goodsDetails()
            } else {
              wx.showToast({
                title: res.message,
                icon: "none"
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '用户拒绝,请重新授权登录',
        icon: "none"
      })
    }
  },
  /** 跳转包装方案详情页 */
  goodsDetails() {
    if(app.globalData.packid&&app.globalData.packid!=''){
      let id = app.globalData.packid
      app.globalData.packid = ''
      wx.redirectTo({
        url: '/pages/shop/goods/index?id=' + id,
      })
    }else{
      wx.switchTab({
        url: '/pages/nameCard/index'
      })
    }
  },
  // 先去看看
  look() {
    wx.switchTab({
      url: '/pages/nameCard/index'
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