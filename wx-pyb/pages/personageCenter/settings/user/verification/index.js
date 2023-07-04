//index.js
import { sendRegSmsVerifyCode, verifyMsgCode } from "../../../../../api/userApi.js";
//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    uuid:'',
    mobile:'',
    phone:'',
    code:'',
    send:true,
    cdtime:60,
    cd:'',
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
  }
    },
    modalFun: function({contentText,icon,iconSize,image,imageSize,time}){
      var than = this;
      this.setData({
        modal: {
          show: true,
          contentText,icon,iconSize,image,imageSize
        }
      })
      setTimeout(() => {
        than.setData({
          modal: {
            show: false,//modal是否显示，默认false
          }
      }) }, time?time:2000);
    },
  onLoad: function (data) {
    this.setData({
      mobile:data.mobile,
      phone:data.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
    })
  },
  modify: function() {
    if(this.data.code){
      //校验短信
      verifyMsgCode({mobile:this.data.mobile,smsVerifyCode:this.data.code,smsVerifyUuid:this.data.uuid})
      .then(res => {
        console.log('verifyMsgCode',res);
        if(res.success){
          wx.navigateTo({
            url: '../modify/index'
          })
        }else{
          this.setData({
            code:''
          })
          this.modalFun({contentText:'验证失败'})
        }        
      })
    }    
  },
  incode: function(e) {
    var val = e.detail.value;
    this.setData({
      code:val
    })
  },
  sentSmS: function() {
    this.setData({
      send:false
    })
    var that = this
    that.data.cd = setInterval(function(){
       that.setData({
        cdtime:that.data.cdtime-1
      })
      if(that.data.cdtime<1){
        that.clearCD()
        that.setData({
          send:true,
          cdtime:60
        })
      }
    }
    ,1000)
    sendRegSmsVerifyCode({mobile:this.data.mobile}).then(res => {
      console.log('SmS',res);
      this.setData({
        uuid:res.data
      })
    })
  },
  clearCD: function () {
    clearInterval(this.data.cd)
  }
})
