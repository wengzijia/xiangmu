// pages/editPlan/index.js
// 图片域名
import {
  imageBaseUrl
} from '../../utils/request'
import {
  queryScheme
} from "../../api/shopSet"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl, // 图片域名
    sortIndex: "", // 分类下标
    sortName: "", // 分类名字
    schemeNum: "", // 方案数量
    sortParam: {
      categoryId: "",
      enterpriseCode: "",
      pageNumber: 1,
      pageSize: 20,
      path: ""
    },
    planData: [], // 方案数据
    isPullRefresh: true // 下拉刷新是否触发
  },
  // 获取方案
  async getPlan() {
    let _this = this;
    wx.showLoading({
      title: "获取中..."
    })
    let {
      code,
      data,
      message
    } = await queryScheme(_this.data.sortParam);
    if (code == '000000') {
      data = data.map(e=>{
        if(e.goodsImg){
          e.goodsImg = JSON.parse(e.goodsImg)
        }
        return e
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
      ['sortParam.pageNumber']: 1,
      planData: []
    })
  },
  // 上拉加载更多
  scrollLoadMore(e) {
    let _this = this;
    _this.setData({
      isPullUp: true
    })
    _this.data.sortParam.pageNumber++
    _this.getPlan()
  },
  // 下拉刷新
  pullToRefresh(e) {
    let _this = this;
    // 复位
    _this.setData({
      isPullRefresh: false
    })
    _this.setData({
      ['sortParam.pageNumber']: 1,
      planData: []
    })
    _this.getPlan()
  },
  // 获取高度设置滚动高度
  getHeight(){
    let self = this;
    // 第一步 先取出页面高度 windowHeight
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    // 第二步 然后取出滚动上面盒子的高度
    // 根据文档，先创建一个SelectorQuery对象实例
    let query = wx.createSelectorQuery().in(self);
    // 然后逐个取出节点信息
    // 选择器的语法与jQuery语法相同
    query.select('#sortPlanBox').boundingClientRect();
    // 执行上面所指定的请求，结果会按照顺序存放于一个数组中，在callback的第一个参数中返回
    query.exec((res) => {
      // 取出 搜索框布局 的高度
      let reduceHeight = res[0].height;
      // 然后就是做个减法
      let scrollViewHeight = self.data.windowHeight - reduceHeight;
      // 算出来之后存到data对象里面
      self.setData({
        scrollViewHeight: scrollViewHeight
      });
    });
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
      sortIndex,
      sortName,
      schemeNum
    } = e;
    let _this = this;
    // 获取高度
    _this.getHeight()
    _this.setData({
      sortIndex,
      sortName,
      schemeNum,
      ['sortParam.categoryId']: id,
      ['sortParam.enterpriseCode']: enterprisecode,
      ['sortParam.path']: path
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