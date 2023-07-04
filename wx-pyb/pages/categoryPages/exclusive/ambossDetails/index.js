// pages/categoryPages/exclusive/ambossDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: 'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/qcxyztTest/uploads/file/VO202208/temp/2022080315056197/Frame 464.png'
  },

  checkAll:function() {
    wx.previewImage({
      urls:[this.data.imageUrl]// 需要预览的图片http链接列表
    })
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