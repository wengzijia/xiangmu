// pages/myClient/index.js
import {
  getCustomerList
  // addClient
} from "../../api/myClient.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // show: false,
    // customerName: "", // 客户名
    customerList: [] // 客户列表
  },

  // showPopup() {
  //   this.setData({
  //     show: true
  //   });
  // },

  // onClose() {
  //   this.setData({
  //     show: false,
  //     customerName:""
  //   });
  // },
  // 获取客户列表
  async getClientList() {
    try {
      wx.showLoading({
        title: '加载中...',
        mask:true
      })
      let {
        data
      } = await getCustomerList(1);
      this.setData({
        customerList: data
      })
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      console.log(err.message);
    }
  },
  // 获取输入的值
  // getValue(e) {
  //   let {
  //     value
  //   } = e.detail
    
  //   this.setData({
  //     customerName: value.replace(/\s+/g,"").slice(0,10)  // 去除空格并截取10位
  //   })
  //   if(value.length > 10){
  //     wx.showToast({
  //       title: '不能大于十个字',
  //       icon:"none"
  //     })
  //   }
  // },
  // 保存
  // async save() {
  //   try {
  //     if (this.data.customerName) {
  //       wx.showLoading({
  //         title: '保存中...',
  //         mask:true
  //       })
  //       let {
  //         code,
  //         msg
  //       } = await addClient(this.data.customerName);
  //       wx.hideLoading()
  //       if (code === 3001) {
  //         wx.showToast({
  //           title: msg,
  //           icon: "none"
  //         })
  //       } else {
  //         this.setData({
  //           customerName: "",
  //           show: false
  //         })
  //         // 获取客户列表
  //         this.getClientList()
  //       }
  //     }
      
  //   } catch (err) {
  //     wx.hideLoading()
  //     console.log(err.message);
  //   }
  // },
  // 跳转详情
  skipCustomerDetails(e) {
    let {
      customerid,customername
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../customerDetails/index?customerId=${customerid}&customerName=${customername}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.getClientList() // 获取客户列表
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