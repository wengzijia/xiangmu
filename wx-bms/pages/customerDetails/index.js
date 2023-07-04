// pages/customerDetails/index.js
import { editClient,editCustomerSubmit} from "../../api/myClient.js"
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false, // 是否显示保存弹窗
    customer:"", // 客户
    customerId:"", // 客户id
    customerInfo:[], // 客户信息
    customerUid:"", // 绑定的客户id
    customerName:"" // 备注名
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  // 获取备注名
  getRemarkName(e){
    let { value } = e.detail
    this.setData({
      customerName:value.slice(0,10)
    })
    if (value.length > 10) {
      Toast({
        message:'不能大于十个字',
        position:'top'
      })
    }
  },

  // 保存
  save(){
    if(!this.data.customerName){
        wx.showToast({
          title: '备注名不能为空',
          icon:"none"
        })
    }else{
        this.showPopup()
    }
  },
  // 弹窗确认
  async affirm(){
      try{
          let param = {
            customer_id:Number(this.data.customerId),
            customer_name:this.data.customerName.slice(0,10),
            customer_uid:this.data.customerUid ?  this.data.customerUid : ""
          }
          wx.showLoading({
            title: '保存中...',
            mask:true
          })
          let {code,data,msg} = await editCustomerSubmit(param)
          if(code===200){
            wx.showToast({
              title: msg
            })
            setTimeout(function(){
              wx.navigateBack({})
            },2000)
          }else{
            wx.showToast({
              title: "客户名重复,请重新输入",
              icon:"none"
            })
            this.setData({
              show:false
            })
          }
          setTimeout(function(){
            wx.hideLoading()
          },2000)
      }catch{
        wx.hideLoading()
        console.log(err.message);
      }
  },
  // 修改单选框状态
  onChange(e) {
    this.setData({
      customerUid: e.detail
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    try{
      wx.showLoading({
        title: '加载中...',
        mask:true
      })
    // 客户id
    let { customerId,customerName } = options
    let { data } =  await editClient(customerId)
    this.setData({
      customer:data,  // 客户
      customerId, // 客户id
      customerUid:data.customer_uid,  // 绑定的客户uid
      customerInfo:data.customer_info, // 客户信息
      customerName  // 备注名
    })
    wx.hideLoading()
  }catch(err){
    wx.hideLoading()
    console.log(err.message);
  }
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