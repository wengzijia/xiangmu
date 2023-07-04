//index.js
import { updatePassword } from "../../../../../api/userApi.js";
//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    tp1:{
      type:true,
      icon:'ac-icon-eye2'
    },
    tp2:{
      type:true,
      icon:'ac-icon-eye2'
    },
    pwd1:'',
    pwd2:'',
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
  onLoad: function () {
  },
  changeType:function(e){
    if (e.currentTarget.dataset.index=='1') {
      if (this.data.tp1.type) {
        this.setData({
          'tp1.type':false,
          'tp1.icon':'ac-icon-eye'
        })
      }else{
        this.setData({
          'tp1.type':true,
          'tp1.icon':'ac-icon-eye2'
        })
      }
    }else{
      if (this.data.tp2.type) {
        this.setData({
          'tp2.type':false,
          'tp2.icon':'ac-icon-eye'
        })
      }else{
        this.setData({
          'tp2.type':true,
          'tp2.icon':'ac-icon-eye2'
        })
      }
    }
  },
  change:function () {
    if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$/.test(this.data.pwd1)) {
      if(this.data.pwd1 == this.data.pwd2){
        updatePassword({confirmNewPwd:this.data.pwd1,newPwd:this.data.pwd2}).then(res => {
          this.modalFun({contentText:'修改密码成功', icon:'ac-icon-check'})
          wx.navigateBack({
            delta: 2
          })
        })
      }else{
        this.modalFun({contentText:'两次输入密码不一致'})
      }
    }else{
      this.modalFun({contentText:'密码至少6位数并包含一个字母'})
    }    
  },
  pwd1: function(e) {
    var val = e.detail.value;
    this.setData({
      pwd1:val
    })
  },
  pwd2: function(e) {
    var val = e.detail.value;
    this.setData({
      pwd2:val
    })
  }
})
