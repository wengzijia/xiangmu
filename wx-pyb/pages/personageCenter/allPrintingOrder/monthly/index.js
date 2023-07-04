import { countNoPaid,countNoPaidAll} from "../../../../api/orderApi";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    summary: 0,
    stay: 0
  },
  itemClick(e) {
    console.log(e.currentTarget.dataset.monthly);
    wx.navigateTo({
      url:`./details/index?monthly=${e.currentTarget.dataset.monthly}` 
  })
  },
  /**
   * 生命周期函数--监听页面 加载
   */
  onLoad(options) {
    this.getOrderAll()
    this.getOrder()
  },

  getOrder() {
    // 汇总
    countNoPaid({ orderType: 4,monthly: 1,status: "shipped"}).then(res => {
      this.setData({
        summary: res.data 
      })
    })
    // 待结
    countNoPaid({ orderType: 4,monthly: 1, balanceStatus: 0,status: "shipped"}).then(res => {
      this.setData({
        stay: res.data
      })
    })
  },
  getOrderAll() {
    countNoPaidAll({monthly: 1, orderType:4,status: "shipped"}).then(res => {
      this.setData({
        orderList: res.data
      })
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
    // this.getOrderAll()
    // this.getOrder()
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