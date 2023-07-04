// pages/gallery/index.js
import {
  staticFileBaseUrl,
  imageBaseUrl
} from '../../../utils/request.js'
import {
  geinInformation
} from '../../../api/gallerySet'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl,
    staticFileBaseUrl,
    information: {},
    Carousel: [],
    exhibition: [],
    industry: [],
    userInfo: {},
    longitude: "", // 经度
    latitude: "", //  纬度
    markers: [] // 标记点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(28, app.globalData);
    geinInformation().then(res => {
      console.log('res', res)
      if (res.code == "000000") {
        let {
          Carousel,
          exhibition,
          industry
        } = res.data.adSetting;
        let information = res.data.information;
        let longitudeLatitude = information.longitudeLatitude?.split(',');
        this.setData({
          Carousel,
          exhibition,
          industry,
          information: res.data.information,
          longitude: longitudeLatitude ? longitudeLatitude[0] : '',
          latitude: longitudeLatitude ? longitudeLatitude[1] : '',
          markers: [{
            id: 1,
            width: 15, //宽
            height: 20, //高
            longitude: longitudeLatitude ? longitudeLatitude[0] : '',
            latitude: longitudeLatitude ? longitudeLatitude[1] : ''
          }]
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toPage(event) {
    let {
      url
    } = event.currentTarget.dataset;
    console.log('url', url)
    if (url) {
      wx.showLoading({
        title: '跳转中',
        mask: true
      })
      wx.navigateTo({
        url: url,
        complete: () => {
          wx.hideLoading()
        }
      })
    }

  },
  closePreview() {
    wx.navigateBack({
      delta: 1,
    })
  },
  // 导航
  navigation() {
    let _this = this;
    let longitude = Number(_this.data.longitude);
    let latitude = Number(_this.data.latitude);
    let name = _this.data.information.address + _this.data.information.detailedAddress;
    wx.openLocation({
      type: 'gcj02',
      longitude, // 经度
      latitude, // 纬度
      name,
      scale: 18
    })
  }
})