import {getDbUserInfo } from "../../../api/userApi"
import {formatTime4} from '../../../utils/util'
import {couponDrawPage } from "../../../api/couponApi"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    couponList:[],
    loadingType: 0,//下拉数据的状态
    contentText: {
      contentrefresh: "正在加载...",
      contentnomore: ""
    },
    couponDetail: {
      status:2,
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
    this.getBonusList();
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
//点击下拉
  panel(e){
    this.data.couponList[e.currentTarget.dataset.index].isShow = !this.data.couponList[e.currentTarget.dataset.index].isShow
    this.setData({
      couponList:this.data.couponList
    })
  },
  goHistory(){
    wx.navigateTo({
      url: './history/index',
    })
    app.saveReport({"actionId": 2,"channel":702000})
  },
  getBonusList(){
    let _this=this
    wx.showLoading({
      title:'加载中...',
      mask:true
    });
    
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
  bindDownLoad: function () {
    let _this = this;
    if (_this.data.loadingType == 1){
      _this.setData({
        ['contentText.contentnomore']:'没有更多数据了'
      })
      return
    }
    _this.getBonusList()
  },
})