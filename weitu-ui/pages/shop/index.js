// pages/shop/index.js
import {
  staticFileBaseUrl,
  imageBaseUrl
} from '../../utils/request'
import {
  getAdSetting,
  getSchemeForFrontPage
} from "../../api/shop"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticFileBaseUrl,
    imageBaseUrl,
    carouselList: [], // 轮播图列表
    planList: [], // 方案列表
    employeeInfo: {} // 员工信息表
  },
  // 复制
  copy() {
    let _this = this;
    wx.setClipboardData({
      //准备复制的数据
      data: _this.data.employeeInfo.mobile,
      success: function (res) {
        wx.showToast({
          title: "复制成功",
          icon: "none"
        })
      }
    })
  },
  /**拨打电话 */
  phoneCall() {
    let _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.employeeInfo.mobile //仅为示例，并非真实的电话号码
    })
  },
  // 查看更多方案
  catMorePlan(e) {
    console.log('e', e);
    let {
      id,
      enterprisecode,
      path,
      name
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/program/index?id=${id}&enterprisecode=${enterprisecode}&path=${path}&name=${name}`
    })
  },
  // 获取轮播图
  async getCarousel() {
    let _this = this;
    let param = {
      enterpriseCode: _this.data.employeeInfo.enterpriseCode,
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
      // 获取方案
      _this.getPlan()
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 查看轮播图
  checkCarouselImgs(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    console.log(index);
    let Carousel = _this.data.carouselList.map(e => _this.data.imageBaseUrl + e.coverPath)
    let current = Carousel[index];
    let urls = Carousel
    _this.previewImage(current, urls)
  },
  // 预览图片
  previewImage(current, urls) {
    wx.previewImage({
      current,
      urls, // 需要预览的图片http链接列表
    })
  },
  // 获取方案
  async getPlan() {
    let _this = this;
    let param = {
      enterpriseCode: _this.data.employeeInfo.enterpriseCode,
      size: 4
    }
    let {
      code,
      data,
      message
    } = await getSchemeForFrontPage(param);
    if (code == '000000') {
      data = data.map(item => {
        item.packSchemes.map(e => {
          if (e.goodsImg) {
            e.goodsImg = JSON.parse(e.goodsImg)
          }
        })
        return item
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
    _this.setData({
      employeeInfo: app.globalData.employeeInfo
    })
    console.log('employeeInfo', _this.data.employeeInfo);
    // 阻止发送给朋友
    if (JSON.stringify(app.globalData.employeeInfo) == '{}') {
      wx.hideShareMenu({})
    }
    // 获取轮播图
    _this.getCarousel()
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
   * 监听用户点击右上角菜单的「转发」按钮时触发的事件
   */
  onShareAppMessage() {
    let _this = this;
    let employeeInfo = this.data.employeeInfo;
    // 设置转发的参数
    return {
      // title: employeeInfo ? `${employeeInfo.enterpriseName + "微信商城"}` : "商城"
      title: `${employeeInfo.enterpriseName + "微信商城"}`
    }
  },
  goodsDetails(e) {
    let {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/shop/goods/index?id=' + id,
    })
  }
})