// pages/gallery/cooperation/index.js
import { imageBaseUrl } from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl,
    exhibition: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let exhibition = wx.getStorageSync('exhibition')
    if (exhibition.length) {
      this.setData({
        exhibition
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '未获取到更多的合作案例，返回展厅',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateBack()
          }
        }
      });
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

  checkExhibitionImgs(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    console.log(index);
    let exhibition = _this.data.exhibition.map(e => _this.data.imageBaseUrl + e.coverPath)
    let current = exhibition[index];
    let urls = exhibition
    _this.previewImage(current, urls)
  },
  previewImage(current, urls) {
    wx.previewImage({
      current,
      urls, // 需要预览的图片http链接列表
    })
  },
})