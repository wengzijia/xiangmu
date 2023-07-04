//index.js
//获取应用实例
const app = getApp()
import {
  save
} from "../../api/orderDetailsApi.js";

Page({
 
  data: {
    arr:[true,false,false,false,false,false,false,false,false],
    info:{
    
      "mobile": "",
      "shopName": "",
      paperInfo:''
    },
    modal:{
      show:false
    },
    phoneType:true
  },
 
  onLoad: function (o) {
    wx.showShareMenu()
   var phone = wx.getSystemInfoSync()
   console.log('phone',phone);
   this.setData({
     phoneType:phone.platform=='ios'?true:false
   })
  },
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  /**
   * 消息提示
   * @param {Object} 
   */
   modalFun({contentText,icon,iconSize,image,imageSize,time}){
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
  setInfo(e){
    console.log('eeeeee',e);
    this.setData({
      ['info.'+e.currentTarget.dataset.key] : e.detail.value
    })
  },

 async submit(){
    setTimeout( async ()=>{
    var info = this.data.info;
    if(info.shopName==''){
      this.modalFun({contentText:'纸行名称不能为空'})
      return 
    }
    if(info.mobile==''){
      this.modalFun({contentText:'联系号码不能为空'})
      return 
    }
    const mobileReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    if(!mobileReg.test(info.mobile)){
      this.modalFun({contentText:'手机号格式不正确'})
      return 
    }
    if(info.paperInfo==''){
      this.modalFun({contentText:'纸张信息不能为空'})
      return 
    }
    // if(info.kg==''){
    //   this.modalFun({contentText:'纸张克重不能为空'})
    //   return 
    // }
    // if(info.brand==''){
    //   this.modalFun({contentText:'纸张品牌不能为空'})
    //   return 
    // }
    // if(info.paperTonprice==''){
    //   this.modalFun({contentText:'纸张吨价不能为空'})
    //   return 
    // }
    wx.showLoading({
      title: '正在提交',
    })
    try {
      var res = await save({data:info})
      if(res.success){
        this.modalFun({contentText:'提交成功'})
      }else{
        this.modalFun({contentText:res.message})
      }

     
    } catch (error) {
      this.modalFun({contentText:error})
    }
    wx.hideLoading()
  },500)
  }
  // test(e){
  //   console.log('eeeee',e)
  //   var arr= this.data.arr.map((s,i) =>{
  //     if(i==1+Number(e.currentTarget.dataset.index)){
  //       return true
  //     }else{
  //       return false
  //     }
  //   });
  //   console.log('arrarrarr',arr);
  //   this.setData({
  //     arr
  //   })

  // }
})
