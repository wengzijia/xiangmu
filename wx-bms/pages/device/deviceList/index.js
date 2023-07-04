// pages/myDevice/index.js
import { deviceList } from "../../../api/device.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList:[]
  },
  // 跳转到设备信息页
  addDevice(){
     let _this = this;
    wx.navigateTo({
      url: '/pages/device/deviceList/edit/index'
    })
  },
  // 跳转到机长列表页
  skip(e){
    let { deviceid } = e.currentTarget.dataset;
    let _this = this;
    wx.navigateTo({
      url: `/pages/device/deviceList/edit/index?deviceId=${deviceid}`
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
  async onShow() {
    let _this = this;
    try{
      wx.showLoading({
        title:'获取中...'
      })
      let {code,data} = await deviceList();
      if(code===200){
        _this.setData({
          deviceList:data
        })
      }
      wx.hideLoading()
    }catch(err){
      wx.hideLoading()
      console.log(err.message);
    }
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