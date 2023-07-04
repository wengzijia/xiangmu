// pages/Confirm/Confirmcredit/index.js
import {getUserCreditPurchaseMonthlyStatementList,payBackMonthlyStatement,payBackCurrentMonthlyStatement} from "../../../api/userApi"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no:'',
    amount:null,
    repayment:'****',
    bill:null,
    monthText:'本'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      no:options.no,
      amount:options.amount,
      repayment:options.amount,
    })
    if ((options.amount*1)>20000) {
      this.setData({
        repayment:'20000.00'
      })
    }
  },
  //获取月账单
  getMonthlyStatementList(){
    getUserCreditPurchaseMonthlyStatementList({}).then(res=>{
      if (res.success) {
        var data = res.data[0]
        if (data.payStatus==0&&res.data[1]&&res.data[1].payStatus==2) {
          data = res.data[1]
          this.setData({
            monthText:'上'
          })
        }
        this.setData({
          bill:data,
          surplus:((~~(data.amount*1000) - ~~(data.repaymentAmount*1000) - ~~(data.rebackAmount*1000))/1000).toFixed(2)
        })
        
        if (this.data.surplus*1>20000) {
          this.setData({
            repayment:'20000.00'
          })
        }else{
          this.setData({
            repayment:this.data.surplus
          })
        }
        if (this.data.surplus*1==0) {
          wx.showToast({
            title: '还款完成',
            icon: 'success',
            mask:true,
            duration: 1000,
            complete(){
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1
                })
              },1000)
            }
          })
        }
      }
    })
  },
  bindPay(){
    let _this = this
    wx.showLoading({
      title:'加载中',
      mask:true
    })
    var req = null
    if (this.data.bill.payStatus==2) {
      req = payBackMonthlyStatement({monthlyStatementNo:this.data.no,payBackAmount:this.data.repayment,payType:app.globalData.payType})
    }else if (this.data.bill.payStatus==0) {
      req = payBackCurrentMonthlyStatement({monthlyStatementNo:this.data.no,payBackAmount:this.data.repayment,payType:app.globalData.payType})
    }
    req.then(res=>{
      if (!res.success) {
        wx.hideLoading()
            wx.showToast({
              title: res.message,
              icon: 'none',
              mask:true,
              duration: 1000,
              complete(){
                setTimeout(()=>{
                  wx.navigateBack({
                    delta: 1
                  })
                },1000)
              }
            })
        return
      }
      var payBean = JSON.parse(res.data.payInfo)
        console.log(res)
        wx.requestPayment({
          'timeStamp': payBean.timeStamp,//时间戳
          'nonceStr': payBean.nonceStr,//随机字符串
          'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
          'signType': payBean.signType,//非必要——签名算法
          'paySign': payBean.paySign,//签名
          'success': function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              mask:true,
              duration: 1000,
              complete(){
                setTimeout(()=>{
                  wx.navigateBack({
                    delta: 1
                  })
                },1000)
              }
            })
            // _this.getMonthlyStatementList()
          },
          'fail': function (res) {
            console.log(JSON.stringify(res))
            console.log(res)
            wx.hideLoading()
            wx.showModal({
              title: "提示",
              content: "支付失败",
              showCancel: false,
              success: function () {
              }
            })
          }
        })
    })
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
    this.getMonthlyStatementList()
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
})