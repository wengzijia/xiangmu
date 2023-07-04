// pages/newClient/index.js
import {
  addClient
} from "../../api/myClient.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerName: "" // 客户名
  },
  // 获取输入的值
  getValue(e) {
    let {
      value
    } = e.detail

    this.setData({
      customerName: value.replace(/\s+/g, "").slice(0, 10) // 去除空格并截取10位
    })
    if (value.length > 10) {
      wx.showToast({
        title: '不能大于十个字',
        icon: "none"
      })
    }
  },
  // 保存
  async save() {
    try {
      wx.showLoading({
        title: "保存中..."
      })
      let {
        code,
        data,
        msg
      } = await addClient(this.data.customerName);
      if (code === 200) {
        wx.showToast({
          title: '添加成功'
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //当前页面
        if(prevPage.getCustomerList){
          prevPage.setData({
            newCustomerId:data.customer_id
          })
          prevPage.getCustomerList()
        }
        setTimeout(function () {
          wx.navigateBack({})
        }, 2000)
      } else {
        wx.showToast({
          title: msg,
          icon: 'none'
        })
      }
      setTimeout(function(){
        wx.hideLoading()
      },2000)
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
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
  onShow: function () {

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