//index.js
import { refereeOrderList } from "../../../../api/orderApi.js";
//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    orderList: [],
    mobile: '',
    orderCount: 0,
    regdate: 0,
    totalAmount: 0
  },
  onLoad: function (data) {
    this.setData({
      mobile: data.data
    })
    var that = this
    refereeOrderList({ mobile: data.data }).then(res => {
      console.log('refereeOrderList', res);

      that.setData({
        orderCount:res.data.orderCount,
        mobile: res.data.qqMobile,
        regdate:this.timestampToTime(res.data.regdate),
        totalAmount: res.data.orderTotalAmount,
        orderList: res.data.orderList.map(item => {
          item.payTime = this.timestampToTime(item.payTime)
          return item
        })
      })
    })
  },
  timestampToTime: function (time) {
    var date = new Date(time * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
  },
  copyBtn: function (e) {
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.dataset.sn,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  }
})
