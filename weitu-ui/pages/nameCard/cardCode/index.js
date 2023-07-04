// pages/nameCard/cardCode/index.js
import {getWeChatMiniReferralCode} from '../../../api/user';
import {accountInfo,imageBaseUrl,staticFileBaseUrl} from '../../../utils/request'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticFileBaseUrl,
    imageBaseUrl,
    employeeInfo:{},
    cardInfo:{},
    userInfo:{},
    codeBase64:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let {employeeInfo,cardInfo,userInfo} = app.globalData
    if(employeeInfo.userId){
      this.setData({
        employeeInfo,
        cardInfo,
        userInfo
      })
      let formData = {
        "avatarUrl":imageBaseUrl+employeeInfo.avatar,
        "envVersion":accountInfo.miniProgram.envVersion,
        "mobile": employeeInfo.mobile,
        "salesperson":employeeInfo.userId,
        "recommender":userInfo.id,
        "pageUrl":"pages/nameCard/index"
    }
  
      getWeChatMiniReferralCode(formData).then(res=>{
        this.setData({
          codeBase64:res
        })
      })
      this.onShareAppMessage = function(){
        return {
          title	:'向您推荐微图名片',
          path:'/pages/nameCard/index?recommender='+userInfo.id+'&salesperson='+employeeInfo.userId
        }
      }
    }else{
      wx.navigateBack()
    }
  },
  getCardCode(){
    let page = 'pages/nameCard/index'
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})