//index.js
import { getByWithdrawalUid } from "../../../../api/orderApi.js";
//获取应用实例
const app = getApp()

Page({
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  data: {
    date:'2021-6',
    dateArr:[2021,6],
    withdrawalArray:[]
  },
  onLoad: function (data) {
    this.getProfit()
  },
  getProfit:function(e){
    getByWithdrawalUid({'year':this.data.dateArr[0]*1,'month':this.data.dateArr[1]*1}).then(res=>{
      console.log('res',res);
      var arr = res.data
      arr = arr.map(item=>{
        item.addTime = this.timestampToTime(item.addTime)
        return item
      })
      console.log(arr);
      this.setData({
        withdrawalArray:arr
      })
    })
  },
  timestampToTime: function (time) {
    var date = new Date(time * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    var D = date.getDate() + '日 ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return M + D + h + m;
  },  
  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
      dateArr:e.detail.value.split('-')
    })
    this.getProfit()
  },
})
