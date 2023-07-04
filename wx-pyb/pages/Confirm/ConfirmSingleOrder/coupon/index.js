import {
  formatTime4
} from '../../../../utils/util'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    couponList: [],
    radio: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options) {
      let val = JSON.parse(options.coupon)
      this.setData({
        radio: Number(options.radio),
        couponList: val.map(e => {
          if (e.useEffectivityType == 2) {
            e.startEffectivityTime = formatTime4(Number(e.receiverTime) * 1000)
            e.endEffectivityTime = formatTime4(Number(e.receiverTime) * 1000 + (86400000 * Number(e.useEffectivityDay)))
          } else {
            e.startEffectivityTime = formatTime4(Number(e.startEffectivityTime) * 1000)
            e.endEffectivityTime = formatTime4(Number(e.endEffectivityTime) * 1000)
          }
          return e
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  usCoupon(e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    let index = e.currentTarget.dataset.index
    let coupon = this.data.couponList[index];
    console.log('this.data.radio', index);
    this.setData({
      radio: index
    })
    if (index == -1) {
      prevPage.setData({
        coupon: {
          radio: -1
        }
      })
      wx.navigateBack({
        delta: 1,
      })
      return
    }

    if (!prevPage.coupon?.couponName) {
      coupon.radio = index
      prevPage.setData({
        coupon: coupon
      })
    } else {
      prevPage.setData({
        coupon: {
          radio: '-1'
        }
      })
    }
    wx.navigateBack({
      delta: 1,
    })
  }
})