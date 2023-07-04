//index.js
import { updateReceiver } from "../../../../../api/orderApi.js";
//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    name:'',
    mobile:'',
    orderSn:'',
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
  }
  }, 
  onLoad: function (e) {
    this.setData({
      orderSn:e.sn
    })
  },
  cgname:function(e) {
    var val = e.detail.value;
    this.setData({
      name:val
    })
  },
  cgmobile:function(e) {
    var val = e.detail.value;
    this.setData({
      mobile:val
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
  submit:function() {
    if(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.data.mobile)){
      wx.showLoading({
        title:'加载中...',
        mask:true
      });
      const updata = {
        consigneeName:'',
        mobile:'',
        orderNo:''
      }
      updata.consigneeName = this.data.name
      updata.mobile = this.data.mobile
      updata.orderNo = this.data.orderSn
      updateReceiver(updata).then(res => {
        wx.hideLoading();
        if (res.success) {
          this.modalFun({contentText:'修改成功',icon:'ac-icon-check'})
          // wx.showToast({
          //   title: '修改成功',
          //   icon: '',     //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
          //   duration: 2000,      //停留时间
          // })
        }else{
          this.modalFun({contentText:'修改失败,请稍后重试'})
          // wx.showToast({
          //   title: '修改失败',
          //   icon: 'none',     //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
          //   duration: 2000,      //停留时间
          // })
        }
        wx.navigateBack({
          delta: 1
        })
      })
    }else{
      this.modalFun({contentText:'请输入正确的手机号'})
    }
    
  }
})
