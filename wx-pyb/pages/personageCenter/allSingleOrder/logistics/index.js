//index.js
import { getShippingTrack } from "../../../../api/orderDetailsApi";
//获取应用实例
const app = getApp()

Page({
  data: {
    orderNo: '',
    PoList: [],
    active:''
  },
  onLoad: function (options) {
    this.setData({
      orderNo:options.orderSn
    })
    this.getLogistics()
  },
  copy:function(e){
    wx.setClipboardData({
      data:e.currentTarget.dataset.sn,
      success (res) {
        console.log('copySuccess');
      }
    })
  },
  getLogistics() {
      getShippingTrack({ data: this.data.orderNo }).then(res => {
      if (res.success) {
        let obj = res.data
        let arr = Object.keys(obj)
        this.setData({
          PoList: arr.map(item => { 
            let newObj =  obj[item]
            newObj.steps = newObj.trackRecord?.map(items=>{
              return {text:items.trackDetail,desc:items.adate}
            })
            return newObj
          })
        })
        // console.log('PoList', this.data.PoList);
      }
    })
  },
  onShow: function () {
  },
  onChange: function () {}
})
