//index.js
import {getCurrentUserInfo, getWeChatMiniReferralCode, WxPayUrl} from "../../../../api/orderApi.js";
import {logout} from "../../../../api/userApi";
//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})

  },
  data: {
    recommendCodeImgY:''
  },
  onLoad: function (data) {

    var that = this
   
    getCurrentUserInfo().then(res => {
      this.setData({
        userInfo:res.data,
        mobile:res.data.qqMobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
      })
      this.getWeChatMiniReferralCode(res.data.qqMobile);
    })
  },
  getWeChatMiniReferralCode:function(qqMobile){
    getWeChatMiniReferralCode({ qqMobile: qqMobile,avatarUrl:app.globalData.userInfo.avatarUrl }).then(res => {
      this.setData({
        recommendCodeImgY: res
      })
    })
  }
})
