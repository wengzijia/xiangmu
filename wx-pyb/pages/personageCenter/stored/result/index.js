// pages/personageCenter/stored/result/index.js
import { getAccountTopupNo } from "../../../../api/userApi.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [
      {
        text: '提交成功',
        desc: '',
        // inactiveIcon: '',
        activeIcon: 'success',
      },
      {
        text: '充值中',
        desc: '财务人员将在1-3天内审核完成',
        // inactiveIcon: 'clock-o',
        activeIcon: 'clock',
      },
      {
        text: '充值成功',
        desc: '',
        // inactiveIcon: 'star-o',
        activeIcon: 'cross',
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options', options);
    let msg = ''  
    if(options.type == 1 ) {
      msg = '支付宝转账'
    } else if(options.type == 4) {
      msg = '银行卡转账'
    }

    getAccountTopupNo({data: options.dealNo}).then(res =>{
      if (res.data?.changeTime) {
        let time = new Date(res.data.changeTime*1000)
        let year = time.getFullYear()
        let month = time.getMonth()+1
        let date = time.getDate()
        let hours = time.getHours()
        let mintes = time.getMinutes()
        let seconds = time.getSeconds()
        time = `${year}-${month<10?'0':''}${month}-${date<10?'0':''}${date} ${hours<10?'0':''}${hours}:${mintes<10?'0':''}${mintes}:${seconds<10?'0':''}${seconds}`
        
        this.setData({
          typeText: msg,
          timeText: time
        })
      }
    })

  },
  back(){
    wx.navigateBack()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})