//index.js
import { getCurrentUserInfo, getDocumentsByUid, add, createWxPayUrl } from "../../../../../api/orderApi.js";
//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    userInfo:{},
    name:[],    
    orderId:'',
    qualificationsList:[],
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
  }
  }, 
  checkboxChange:function(e){
    // console.log(e.detail.value)
    this.setData({
      qualificationsList:e.detail.value
    })
  },

  onLoad: function (e) {
    this.setData({
      orderId:e.orderId
    })
    getDocumentsByUid({data:{pageNumber:1,pageSize:20}}).then(res => {
      this.setData({
        name:res.data
      })
    })
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
  bind:function(){
    if (this.data.qualificationsList) {
      add({
        documentsIdList:this.data.qualificationsList,
        orderId:this.data.orderId
      }).then(res => {
        if(res.success){
          this.modalFun({contentText:'关联成功',icon:'ac-icon-check'})
        }
        wx.navigateBack({
          delta:1
        })
      })
    }else{
      wx.navigateBack({
        delta:1
      })
    }
  },

})
