// pages/nameCard/index.js
import { getEmployeeInfo } from '../../../api/nameCardSet'
import { staticFileBaseUrl, imageBaseUrl } from '../../../utils/request.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: '',
    fontSizeSetting: '',
    imageBaseUrl,
    staticFileBaseUrl,
    boxHeight: '',
    boxLineHeight: '',
    showCardList: false,
    cardList: [{
      name: '王五'
    }],
    cardInfo: { name: '王五' },
    employeeInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('System', res)
        _this.setData({
          statusBarHeight: res.statusBarHeight,
          fontSizeSetting: res.fontSizeSetting,
          boxHeight: (500 / 750 * res.screenWidth) - (res.statusBarHeight * 1.4 + res.fontSizeSetting + res.statusBarHeight / 2),
          boxLineHeight: 130 / 750 * res.screenWidth
        })
      }
    })
    getEmployeeInfo({ "userId": options.userId }).then((res) => {
      console.log(res)
      if (res.success) {
        res.data.sellingPoint = res.data.sellingPoint.split(',')
        this.setData({
          employeeInfo: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if(!app.globalData.isLogin){
    //   wx.showLoading({
    //     title: '跳转中',
    //     mask: true
    // })
    //     wx.navigateTo({
    //         url: '/pages/login/index',
    //         complete: () => {
    //             wx.hideLoading()
    //         }
    //     })
    // }else{

    // }
  },
  showCardListFun() {
    this.setData({
      showCardList: true
    })
  },
  selectCard(e) {
    console.log('eee', e)
  },
  phoneCall() {


  },
  toPage(event) {
    let { url } = event.currentTarget.dataset;
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
  }
})