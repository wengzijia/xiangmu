// pages/previewPlan/index.js
import {
  imageBaseUrl
} from "../../utils/request"
import {
  getAdSetting,
  getSchemeForFrontPage
} from "../../api/shopSet"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "", // 用户信息
    imageBaseUrl, // 图片域名
    carouselList: [], // 轮播图列表
    planList: [] // 方案列表
  },
  // 获取轮播图
  async getCarousel() {
    let _this = this;
    let param = {
      enterpriseCode: _this.data.userInfo.enterpriseCode,
      type: "mallCarousel"
    }
    let {
      code,
      data,
      message
    } = await getAdSetting(param);
    if (code == '000000') {
      _this.setData({
        carouselList: data
      })
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 获取方案
  async getPlan() {
    let _this = this;
    let param = {
      enterpriseCode: _this.data.userInfo.enterpriseCode,
      size: 4
    }
    let {
      code,
      data,
      message
    } = await getSchemeForFrontPage(param);
    if (code == '000000') {
      data = data.map(e=>{
        e.packSchemes.map(item=>{
          if(item.goodsImg){
            item.goodsImg = JSON.parse(item.goodsImg)
          }
        })
        return e
      })
      _this.setData({
        planList: data
      })
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    // 获取轮播图
    _this.getCarousel()
    // 获取方案
    _this.getPlan()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})