// pages/program/index.js
import {
  imageBaseUrl
} from '../../utils/request'
import {
  getCategories,
  pagePackScheme
} from "../../api/shop"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl, //  图片域名
    sortInfo: {}, // 分类信息
    employeeInfo: {}, // 员工信息表
    sortIndex: 0, // 分类下标
    sortParam: {
      categoryId: "",
      enterpriseCode: ""
    },
    planParam: {
      categoryId: "",
      enterpriseCode: "",
      path: "",
      pageNumber: 1,
      pageSize: 10
    },
    sortData: [], // 分类数据
    planData: [], // 分类数据
    isPullRefresh: true // 下拉刷新是否触发
  },
  // 分类切换
  sortCut(e) {
    let _this = this;
    console.log('e', e);
    let {
      index
    } = e.currentTarget.dataset;
    _this.setData({
      sortIndex: index
    })
    console.log('sortIndex', _this.data.sortIndex);
    let sortInfo = _this.data.sortInfo;
    let sortIndex = _this.data.sortIndex;
    if (sortIndex == 0) {
      _this.setData({
        ['planParam.categoryId']: sortInfo.id,
        ['planParam.enterpriseCode']: sortInfo.enterprisecode,
        ['planParam.path']: sortInfo.path
      })
    } else {
      let {
        index,
        id,
        enterprisecode,
        path
      } = e.currentTarget.dataset;
      _this.setData({
        ['planParam.categoryId']: id,
        ['planParam.enterpriseCode']: enterprisecode,
        ['planParam.path']: path
      })
    }
    console.log('planParam', _this.data.planParam);
    // 重置
    _this.reset()
    // 获取方案
    _this.getPlan()
  },
  // 获取分类
  async getSort() {
    let _this = this;
    _this.setData({
      ['sortParam.enterpriseCode']: _this.data.employeeInfo.enterpriseCode
    })
    console.log('sortParam', _this.data.sortParam);
    let {
      code,
      data,
      message
    } = await getCategories(_this.data.sortParam);
    data.forEach(e => {
      e.children?.unshift({
        name: "全部"
      })
    })
    if (code == '000000') {
      _this.setData({
        sortData: data
      })
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 获取方案
  async getPlan() {
    let _this = this;
    wx.showLoading({
      title:"获取中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await pagePackScheme(_this.data.planParam);
    if (code == '000000') {
      data = data.map(item=>{
        if(item.goodsImg){
          item.goodsImg = JSON.parse(item.goodsImg)
        }
        return item
      })
      // 得在合并数据之前处理数据
      data = [..._this.data.planData, ...data]
      _this.setData({
        planData: data
      })
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 重置
  reset() {
    let _this = this;
    _this.setData({
      ['planParam.pageNumber']: 1,
      planData: []
    })
  },
  // 上拉加载更多
  scrollLoadMore(e) {
    let _this = this;
    _this.setData({
      isPullUp: true
    })
    _this.data.planParam.pageNumber++
    _this.getPlan()
  },
  // 下拉刷新
  pullToRefresh(e) {
    let _this = this;
    // 复位
    _this.setData({
      isPullRefresh: false
    })
    // 重置
    _this.reset()
    _this.getPlan()
  },
  goodsDetails(e) {
    let {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/shop/goods/index?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log('e', e);
    let {
      id,
      enterprisecode,
      path,
      name
    } = e;
    let _this = this;
    wx.setNavigationBarTitle({
      title: name
    })
    _this.setData({
      sortInfo: e,
      ['sortParam.categoryId']: id,
      ['planParam.categoryId']: id,
      ['planParam.enterpriseCode']: enterprisecode,
      ['planParam.path']: path
    })
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
    let _this = this;
    _this.setData({
      employeeInfo: app.globalData.employeeInfo
    })
    console.log('employeeInfo', _this.data.employeeInfo);
    // 获取分类
    _this.getSort()
    // 获取方案
    _this.getPlan()
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