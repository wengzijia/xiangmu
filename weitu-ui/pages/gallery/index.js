// pages/gallery/index.js
import {
  staticFileBaseUrl,
  imageBaseUrl
} from '../../utils/request.js'
import {
  geinInformation
} from '../../api/gallery'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl,
    staticFileBaseUrl,
    isNull: true,
    information: {},
    Carousel: [],
    exhibition: [],
    industry: [],
    employeeInfo: {},
    longitude: "", // 经度
    latitude: "", //  纬度
    markers: [] // 标记点
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
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      employeeInfo: app.globalData.employeeInfo
    })
    console.log(app.globalData.employeeInfo);
    // 阻止发送给朋友
    if(JSON.stringify(app.globalData.employeeInfo) == '{}'){
      wx.hideShareMenu({})
    }
    if (app.globalData.employeeInfo && app.globalData.employeeInfo.enterpriseCode) {
      geinInformation({
        enterpriseCode: app.globalData.employeeInfo.enterpriseCode
      }).then(res => {
        if (res.code == "000000") {
          let {
            Carousel,
            exhibition,
            industry
          } = res.data.adSetting;
          let information = res.data.information;
          let longitudeLatitude = information.longitudeLatitude?.split(',');
          if (res.data.information === null) {
            return
          }
          this.setData({
            isNull: false,
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
          wx.setStorageSync('exhibition', exhibition)
        }
      })
    } else {
      this.setData({
        isNull: true,
      })
    }
  },
  /**
   * 监听用户点击右上角菜单的「转发」按钮时触发的事件
   */
  onShareAppMessage(){
    let _this = this;
    let employeeInfo = this.data.employeeInfo;
    // 设置转发的参数
    return {
      // title: employeeInfo ? `${employeeInfo.enterpriseName + "微信展厅"}` : "展厅"
      title:`${employeeInfo.enterpriseName + "微信展厅"}`
    }
  },
  /**拨打电话 */
  phoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.information.phone //仅为示例，并非真实的电话号码
    })

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
  checkIndustryImgs(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    console.log(index);
    let industry = _this.data.industry.map(e => _this.data.imageBaseUrl + e.coverPath)
    let current = industry[index];
    let urls = industry
    _this.previewImage(current, urls)
  },
  checkExhibitionImgs(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    console.log(index);
    let exhibition = _this.data.exhibition.map(e => _this.data.imageBaseUrl + e.coverPath)
    let current = exhibition[index];
    let urls = exhibition
    _this.previewImage(current, urls)
  },
  checkCarouselImgs(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    console.log(index);
    let Carousel = _this.data.Carousel.map(e => _this.data.imageBaseUrl + e.coverPath)
    let current = Carousel[index];
    let urls = Carousel
    _this.previewImage(current, urls)
  },
  previewImage(current, urls) {
    wx.previewImage({
      current,
      urls, // 需要预览的图片http链接列表
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