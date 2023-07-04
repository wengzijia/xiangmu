// pages/ordinaryCard/index.js
import {
  getRoles,
  getAdministratorInfo,
  getAllEmployee,
  getEmployeeInfo
} from "../../api/nameCardSet"
import {
  imageBaseUrl,
  staticFileBaseUrl
} from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AllEmployeeList: [],
    userId:'',
    staticFileBaseUrl,
    imageBaseUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.AdministratorInfo()
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

  bindPreview(e) {
    let img = e.currentTarget.dataset.img
    wx.previewImage({
      current: img,
      urls: [img], // 需要预览的图片http链接列表
    })
  },
  AllEmployee() {
    console.log(343);
    let _this = this;
    getEmployeeInfo({ userId:_this.data.userId }).then((res) => {
      console.log(2342, res);
      if (res.code == "000000") {
        if (res.data) {
          res.data.avatar =  res.data.avatar? imageBaseUrl +  res.data.avatar:  res.data.avatar;
        }
        _this.setData({
          AllEmployeeList: res.data
        })
      }
    }).catch(err => {

    })
  },
  AdministratorInfo() {
    let _this = this;
    getAdministratorInfo().then((res) => {
      if (res.code == "000000") {
        _this.setData({
          AdminInfo: res.data,
          headImgs: res.data.avatar,
          sellingPointList: res.data.sellingPoint.split(','),
          videos: res.data.promotionalVideo,
          fullname: res.data.fullname,
          position: res.data.position,
          wechatCode: res.data.wechatCode,
          slogan: res.data.slogan,
          userId: res.data.userId
        })
        this.AllEmployee()
        if (res.data.slogan) {
          _this.setData({
            Ishow: false
          })
        } else {
          _this.setData({
            Ishow: true
          })
        }
      }
      console.log(231423, res);
    }).catch(err => {

    })
  },
  toPage(event){
    let {url} = event.currentTarget.dataset;
    if(url){
        wx.showLoading({
            title: '跳转中',
            mask: true
        })
        wx.navigateTo({
            url: url,
            complete: () => {
                wx.hideLoading()
            }
        })
    }
    
},

})