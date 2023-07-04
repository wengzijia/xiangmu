// pages/Confirm/ConfirmSingleOrder/logistics/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '',
    logisticsList: []
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  click(e) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-2];
    currentPage.setData({
      logistics: e.currentTarget.dataset.item
    })
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('datas', options, JSON.parse(options.data));
    this.setData({
      logisticsList: JSON.parse(options.data),
      radio: options.id ? Number(options.id) : ''
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