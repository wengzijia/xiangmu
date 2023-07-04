//index.js
import {getCurrentUserInfo, getWeChatMiniReferralCode, WxPayUrl} from "../../../../api/orderApi.js";
import {logout} from "../../../../api/userApi";
import {IMG_BASE_URL} from '../../../../utils/request.js'
//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})

  },
  data: {
    recommendCodeImgY:'',
    imgBaseUrl:IMG_BASE_URL
  },
  onLoad: function (data) {

    var _this = this
   
    getCurrentUserInfo().then(res => {
        _this.setData({
        userInfo:res.data,
        mobile:res.data.qqMobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
      })
      _this.getWeChatMiniReferralCode(res.data.qqMobile);
    })
  },
  getWeChatMiniReferralCode:function(qqMobile){
    getWeChatMiniReferralCode({ qqMobile: qqMobile,avatarUrl:'https://www.aocai.cn/static/wxpyb/logo.png' }).then(res => {
      this.setData({
        recommendCodeImgY: res
      })
    })
  }
})
