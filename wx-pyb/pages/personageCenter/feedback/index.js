//index.js
import { miniUserFeedback } from "../../../api/userApi.js";
//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    username:'',
    proposal:'',
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
  onLoad: function(options) {
  },

  formname(e){
    this.setData({
      username:e.detail.value
    })
  },
  formproposal(e){
    this.setData({
      proposal:e.detail.value
    })
  },
  sub(){
    // console.log(this.data.username,this.data.proposal)
    if (this.data.proposal==''||this.data.username=='') {
      this.modalFun({contentText:'请输入内容'})
      return
    }
    var data={
      name:this.data.username,
      opinion:this.data.proposal
    }
    miniUserFeedback({data:data}).then(res=>{
      if(res.code=='000000'){
        this.modalFun({contentText:'提交成功',icon:'ac-icon-check'})
          // wx.showToast({
          //   title: res.message, // 标题
          //   icon: 'success',  // 图标类型，默认success
          //   duration: 1500  // 提示窗停留时间，默认1500ms
          // })
         setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
         },500)
        }else{
          this.modalFun({contentText:res.message})
          // wx.showToast({
          //   title: res.message, // 标题
          //   icon: 'none',  // 图标类型，默认success
          //   duration: 1500  // 提示窗停留时间，默认1500ms
          // })
        }
    })
  }

})
