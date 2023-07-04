// subpackageA/pages/process/index.js
import {
  requestUrl
} from "../../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: requestUrl // 请求地址
  },
  // 预览图片
  previewImage(e) {
    let _this = this;
    // let url = `${_this.data.requestUrl}/api/consumer/file/downloadSOP/48`
    let url = `${_this.data.requestUrl}/api/mes/bw/file/downloadSOP/48`
    wx.previewImage({
      urls:[url] // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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