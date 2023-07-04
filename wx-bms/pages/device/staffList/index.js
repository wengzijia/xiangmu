// pages/infoList/index.js
import {
  getManufacturingProcedure
} from "../../../api/processOrder.js"
import {
  addDevice,
  editDevice,
  deviceInfo
} from "../../../api/device.js"
import {
  pilotList,
  getSupplierDeviceProductionStatus
} from "../../../api/pilot.js"
import {
  imageBaseUrl
} from '../../../utils/request'
import { debounce } from "../../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pilotList: [], //  机长列表
    imageBaseUrl: imageBaseUrl, // 图片域名
    
  },


  // 跳转到机长维修页
  skip(e) {
    let {
      pilotid
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/device/staffList/edit/index?pilotId=${pilotid}`,
    })
  },
  // 跳转到添加机长页
  jump() { 
    wx.navigateTo({
      url: `/pages/device/staffList/add/index`,
    })
  },
  // 切换开关状态
  toggleState(e) {
    let {
      index
    } = e.currentTarget.dataset
    console.log(index);
    this.setData({
      statusIndex: index,
      
    })
    if(!this.data.isShowBtn){
      this.setData({
        isShowBtn: true
      })
    }
  },
  // 获取机长列表
  async getPilotList() {
    let _this = this;
    try {
      wx.showLoading({
        title: '获取中...',
      })
      let {
        code,
        data
      } = await pilotList(_this.data.deviceId);
      if (code === 200) {
        _this.setData({
          pilotList: data
        })
      }
      console.log('ss', this.data.pilotList);
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
  
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
    // 获取机长列表
    this.getPilotList()
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