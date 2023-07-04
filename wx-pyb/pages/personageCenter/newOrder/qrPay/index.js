//index.js
import { ordersDetails,createProxyPayQrCode,getOrderByOrderNo,createProxyMergePayQrCode,getMergeOrderByOrderNo } from "../../../../api/orderApi.js";
//获取应用实例
const app = getApp()

Page({
  data: {
    orderSn:'',
    imgUrl:'',
    time:'',
    merge:false,
    amount:''
  },
  onLoad(e){
    this.setData({
      orderSn:e.sn
    })
    if (e.type&&e.type=='merge') {
      this.setData({
        merge:true
      })
    }
  },
  onShow(){
    if (this.data.merge) {
      this.pay(this.data.orderSn)
    }else{
      this.getOrderDetails()
    }
  },
  //获取订单信息
  getOrderDetails(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    ordersDetails({ data: this.data.orderSn }).then(res=>{
      if (res.success) {
        if (res.data.status=='nopaid') {
          this.pay(res.data.parentOrderNo)
        } else {
          wx.hideLoading()
          this.err('该订单不是未支付订单！')
        }
      }else{
        wx.hideLoading()
        this.err('没有找到订单数据,请稍后重试！')
      }
    }).catch(err=>{
      console.log(err);
      wx.hideLoading()
      this.err('网络异常,请稍后重试！')
    })
  },
  //生成二维码
  pay(no){
    if (this.data.merge) {
      createProxyMergePayQrCode({orderNo:no,payType:'wxpay2'}).then(res=>{
        wx.hideLoading()
        if (res.success) {
          this.setData({
            imgUrl:res.data
          })
          this.queryOrder(no)
        }else{
          this.err('网络异常,请稍后重试！')
        }
      }).catch(err=>{
        wx.hideLoading()
        console.log(err);
        this.err('网络异常,请稍后重试！')
      })
    } else {
      createProxyPayQrCode({orderNo:no,payType:'wxpay2'}).then(res=>{
        wx.hideLoading()
        if (res.success) {
          this.setData({
            imgUrl:res.data
          })
          this.queryOrder(no)
        }else{
          this.err('网络异常,请稍后重试！')
        }
      }).catch(err=>{
        wx.hideLoading()
        console.log(err);
        this.err('网络异常,请稍后重试！')
      })
    }
  },
  //查询支付状态
  queryOrder(no){
    var _this = this
    if (this.data.merge) {
      getMergeOrderByOrderNo({data:no}).then(res=>{
        if (res.success) {
          this.setData({
            amount:res.data.amount
          })
        }
        if (res.data&&res.data.status=='paid') {
          _this.clera()
          wx.showModal({
            title: '支付成功',
            content: '订单支付成功！',
            showCancel:false,
            success (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }else if (res.data&&res.data.status!='nopaid') {
          _this.clera()
          _this.err('订单状态异常!')
        }else{
          _this.setData({
            time:setTimeout(()=>{_this.queryOrder(no)},1500)
          })
        }
      })
    } else {
      getOrderByOrderNo({data:no}).then(res=>{
        if (res.success) {
          this.setData({
            amount:res.data.amount
          })
        }
        if (res.data&&res.data.isPay==1) {
          _this.clera()
          wx.showModal({
            title: '支付成功',
            content: '订单支付成功！',
            showCancel:false,
            success (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }else if (res.data&&res.data.isPay!=0) {
          _this.clera()
          _this.err('订单状态异常!')
        }else{
          _this.setData({
            time:setTimeout(()=>{_this.queryOrder(no)},1500)
          })
        }
      })
    }
  },
  //清除定时器
  clera(){
    var _this = this
    clearTimeout(_this.data.time)
    this.setData({
      time:null
    })
  },
  //错误处理
  err(text){
    wx.showModal({
      title: '提示',
      content: text,
      showCancel:false,
      success (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  //页面卸载时清除定时器
  onUnload(){
    this.clera()
  }
})
