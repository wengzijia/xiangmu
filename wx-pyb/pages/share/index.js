//index.js
//获取应用实例
const app = getApp()
import {createMiniCode,getCurrentUserInfo} from '../../api/userApi.js'
Page({
  data: {
    imageUrl:''
  },
  onLoad: function (o) {
    wx.showShareMenu()
  },
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  
})
