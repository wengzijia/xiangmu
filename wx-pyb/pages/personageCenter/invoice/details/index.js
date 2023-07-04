import { getSupplierOrderDetails } from "../../../../api/orderApi";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    orderData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getSupplierOrderDetails({orderNo: options.orderNo}).then(res => {
      if (res.success) {
        this.setData({
          orderData: res.data,
          type: res.data.invoiceNote == "" ? 1 : 2
        })
      }
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
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