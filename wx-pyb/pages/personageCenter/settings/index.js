//index.js
import { getCurrentUserInfo } from "../../../api/orderApi.js";
import { logout } from "../../../api/userApi.js";
import { isProxy } from "../../../utils/util.js";

//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    userInfo:{},
    mobile:'',
    isProxy:false,
    accountInfo: {}
  }, 

  onLoad: function () {
    getCurrentUserInfo().then(res => {
      this.setData({
        userInfo:res.data,
        mobile:res.data.qqMobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2"),
        isProxy: isProxy(res.data)
      }) 
    })
    
    this.setData({
      accountInfo: wx.getAccountInfoSync()
    })

    console.log('版本号：',this.data.accountInfo?.plugin?.version) // 插件版本号， 'a.b.c' 这样的形式
  },
  // 版本升级
  upgrade: function () {
    wx.showToast({
      title: '正在更新版本...',
      icon: 'loading'
    })
    const um = wx.getUpdateManager()
    um.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        um.onUpdateReady(function () {
          um.applyUpdate()
          wx.showToast({
            title: '更新完成',
          })
        })
      } else {
        wx.showToast({
          title: '已是最新版本',
        })
      }
    })
  },
  // onShow:function(){
  //   getCurrentUserInfo().then(res => {
  //     console.log('res.data',isProxy(res.data))
  //     this.setData({
  //       userInfo:res.data,
  //       mobile:res.data.qqMobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2"),
        
  //     }) 
  //   })
   
  // },
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
