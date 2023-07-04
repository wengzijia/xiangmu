// pages/personageCenter/coupon/history/index.js
import {getDbUserInfo } from "../../../../api/userApi"
import {formatTime4} from '../../../../utils/util'
import {couponDrawPage } from "../../../../api/couponApi"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    couponList:[],
    navTitle:[
      {name:'已使用',id:3},
      {name:'已过期',id:5}
    ],
    navId:3,
    couponDetail: {
      status:3,
      pageNumber: 1,//页数
      pageSize: 10,//条数 默认10条
      systemType: 'pinyiban_wx'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    wx.showLoading({
      title: '加载中',
      mask:true
    })
  this.getBonusList()
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

  tabSwitch(e){
  let _this = this
  let id = e.currentTarget.dataset.id
  if(_this.data.navId == id){
    return
  }else{
    _this.setData({
      navId: id,
      'couponDetail.status': id,
      couponList:[]
    });
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    this.getBonusList()
  }
  },
  getBonusList(){
    getDbUserInfo().then(res=>{
      this.data.couponDetail.uuid = res.data.uuid
      couponDrawPage(this.data.couponDetail).then(res => {
        this.setData({
          couponList: res.data?.records.map(e => {
            if (e.useEffectivityType == 2) {
              e.startEffectivityTime = formatTime4(Number(e.receiverTime) * 1000)
              e.endEffectivityTime = formatTime4(Number(e.receiverTime) * 1000 + (86400000 * Number(e.useEffectivityDay)))
            } else {
              e.startEffectivityTime = formatTime4(Number(e.startEffectivityTime) * 1000)
              e.endEffectivityTime = formatTime4(Number(e.endEffectivityTime) * 1000)
            }
            return e
          })
        })
      }).finally(() => {
        wx.hideLoading()
      })
    }).finally(() => {
      wx.hideLoading()
    })
  },
})