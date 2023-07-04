//index.js
import { getCurrentUserInfo } from "../../../../api/orderApi.js";
import { logout } from "../../../../api/userApi.js";


//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    userInfo:{},
    mobile:''
  }, 

  onLoad: function () {
    getCurrentUserInfo().then(res => {
      this.setData({
        userInfo:res.data,
        mobile:res.data.qqMobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
      }) 
    })
  },

  changePwd:function (e) {
    wx.navigateTo({
      url: 'verification/index?mobile=' +this.data.userInfo.qqMobile
      })
  },
  //退出登录
  sub:function(){
    // wx.clearStorage()
    try {
      wx.removeStorageSync('token')
    } catch (e) {
      // Do something when catch error
    }
    app.globalData.isLogin = false
    logout().then(res => {
      wx.navigateBack({
        delta: 2
      })
    })
  }

})
