// pages/workbench/index.js
import {
  getSpecifyDate
} from "../../utils/util"
import {
  geinPictureUserInfo,
  gainEnterpriseAdministrator,
  gainCorporateVisitor,
  gainEnterpriseTemplate,
  gainPdfChangeImgTemplate
} from "../../api/workbench"
// 图片域名
import {
  imageBaseUrl
} from '../../utils/request'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topIndex: 0, // 顶部下标
    bottomIndex: 0, // 底部下标
    timeTermIndex: 0, // 时间条件下标
    timeSelectIndex: 0, // 时间选择下标
    visitorPopup: false, // 企业访客弹窗
    timeSelectPopup: false, // 时间选择弹窗
    startTime: "", // 开始时间
    endTime: "", // 结束时间
    // minDate: new Date().getTime(), // 最小日期
    maxDate: new Date().getTime(), // 最大日期
    userInfo: null, // 用户信息 
    isAdministrator: false, // 是否管理员
    tabName: "我的访客",
    myVisitorParam: {
      oneDay: 1, // 昨天传2  当日传1或者不传
      startDate: "", // 开始日期
      endDate: "", // 结束日期
      userId: "", // 用户ID
      personStatus: "",
      pageNumber: 1, // 页数
      pageSize: 20 // 分页大小
    }, // 我的访客参数
    myVisitorData: [], // 我的访客数据
    // myVisitorDataLength: [], // 我的访客数据长度
    myVisitorTotal: 0, // 我的访客人数总数
    firmVisitorParam: {
      oneDay: 1, // 昨天传2  当日传1或者不传
      startDate: "", // 开始日期
      endDate: "", // 结束日期
      userId: "", // 用户ID
      pageNumber: 1, // 页数
      pageSize: 20 // 分页大小
    }, // 我的访客参数
    firmVisitorData: [], // 企业访客数据
    firmVisitorTotal: 0, // 企业访客人数总数
    templateAllData: [], // 营销模板所有数据
    templateIndex: 1, // 营销模板下标
    imageBaseUrl: imageBaseUrl, // 图片域名
    isPullRefresh: true // 下拉刷新是否触发
  },
  // 顶部tab切换
  tabChange(e) {
    console.log('e', e);
    let {
      index,
      name,
      title
    } = e.detail;
    let _this = this;
    _this.setData({
      topIndex: index,
      tabName: title
    })
    _this.reset()
    _this.cutReq()
    console.log('topIndex', _this.data.topIndex);
    console.log('tabName', _this.data.tabName);
  },
  // 时间条件切换
  timeTermSwitch(e) {
    let {
      index
    } = e.currentTarget.dataset;
    let _this = this;
    let tabName = _this.data.tabName;
    let date = new Date();
    _this.reset()
    _this.setData({
      timeTermIndex: index
    })
    if (tabName == "我的访客") {
      _this.setData({
        ['myVisitorParam.oneDay']: (index == 0 && 1) || (index == 1 && 2)
      })
      console.log('我的访客', _this.data.myVisitorParam);
    }
    if (tabName == "企业访客") {
      _this.setData({
        ['firmVisitorParam.oneDay']: (index == 0 && 1) || (index == 1 && 2)
      })
      console.log('企业访客', _this.data.firmVisitorParam);
    }
    _this.cutReq()
  },
  // 时间选择
  timeSelect(e) {
    let {
      index
    } = e.currentTarget.dataset;
    let _this = this;
    // let startTime = _this.data.startTime.replace(/\-/g, '/');
    // let endTime = _this.data.endTime.replace(/\-/g, '/');
    // console.log('startTime',startTime);
    // console.log('endTime',endTime);
    _this.setData({
      timeSelectIndex: index,
      timeSelectPopup: true
    })
    // // index  0 开始时间  1 结束时间 
    // if(index == 0){
    //   _this.setData({
    //     minDate: new Date(startTime).getTime(),
    //     maxDate: new Date().getTime()
    //   })
    // }else if(index == 1){
    //   _this.setData({
    //     minDate: new Date(endTime).getTime(),
    //     maxDate: new Date().getTime()
    //   })
    // }
    console.log('index', index);
    console.log('timeSelectIndex', _this.data.timeSelectIndex);
  },
  // 时间选择取消
  timeSelectCancel() {
    let _this = this;
    _this.setData({
      timeSelectPopup: false
    })
  },
  // 时间选择确认
  timeSelectConfirm(e) {
    console.log('e', e);
    let {
      detail
    } = e;
    let _this = this;
    console.log('getSpecifyDate', getSpecifyDate(detail, 0));
    let timeSelectIndex = _this.data.timeSelectIndex;
    let startTime = _this.data.startTime;
    let endTime = _this.data.endTime;
    let tabName = _this.data.tabName;
    _this.reset()
    _this.setData({
      timeTermIndex: 3,
      startTime: (timeSelectIndex == 0 && getSpecifyDate(detail, 0)) || startTime,
      endTime: (timeSelectIndex == 1 && getSpecifyDate(detail, 0)) || endTime
    })
    if (tabName == "我的访客") {
      _this.setData({
        ['myVisitorParam.oneDay']: "",
        ['myVisitorParam.startDate']: timeSelectIndex == 0 && getSpecifyDate(detail, 0) || startTime,
        ['myVisitorParam.endDate']: timeSelectIndex == 1 && getSpecifyDate(detail, 0) || endTime
      })
      console.log('我的访客', _this.data.myVisitorParam);
    }
    if (tabName == "企业访客") {
      _this.setData({
        ['firmVisitorParam.oneDay']: "",
        ['firmVisitorParam.startDate']: timeSelectIndex == 0 && getSpecifyDate(detail, 0) || startTime,
        ['firmVisitorParam.endDate']: timeSelectIndex == 1 && getSpecifyDate(detail, 0) || endTime
      })
      console.log('企业访客', _this.data.firmVisitorParam);
    }
    _this.cutReq()
    _this.setData({
      timeSelectPopup: false
    })

  },
  // 模板切换
  templateCut(e) {
    let {
      index
    } = e.currentTarget.dataset;
    let _this = this;
    _this.setData({
      templateIndex: index
    })
  },
  // 企业访客打开
  visitorPopupOpen(e) {
    console.log('e', e);
    let _this = this;
    let {
      userid
    } = e.currentTarget.dataset;
    _this.setData({
      myVisitorData: [],
      myVisitorParam: {
        oneDay: _this.data.firmVisitorParam.oneDay, // 昨天传2  当日传1或者不传
        startDate: _this.data.firmVisitorParam.startDate, // 开始日期
        endDate: _this.data.firmVisitorParam.endDate, // 结束日期
        userId: userid, // 用户ID
        personStatus: 1,
        pageNumber: 1, // 页数
        pageSize: 20 // 分页大小
      },
      visitorPopup: true
    })
    _this.getMyVisitor()
  },
  // 企业访客弹窗关闭
  visitorPopupClose() {
    let _this = this;
    _this.setData({
      visitorPopup: false
    })
  },
  // 获取当前登录用户信息(详细)
  async getUserInfo() {
    let _this = this;
    wx.showLoading({
      title: "获取中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await geinPictureUserInfo();
    console.log('code', code, data);
    if (code == '000000') {
      wx.setStorageSync('userInfo', data)
      app.globalData.userInfo = data
      _this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      _this.data.userInfo.roles.forEach(item => {
        if (item == 'administrator') {
          _this.setData({
            isAdministrator: true
          })
        }
      })
      // tab数据返回后对tab重绘
      _this.selectComponent('#tabs').resize();
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 获取我的访客
  async getMyVisitor() {
    let _this = this;
    wx.showLoading({
      title: '获取中...',
      mask: true
    })
    let {
      code,
      data,
      totalCount,
      message
    } = await gainEnterpriseAdministrator(_this.data.myVisitorParam);
    if (code == '000000') {
      data = data.map(item => {
        item.updateTime = item.updateTime?.split(" ")[1]
        return item
      })
      // 得在合并数据之前处理数据
      data = [..._this.data.myVisitorData, ...data]
      _this.setData({
        myVisitorData: data,
        myVisitorTotal: totalCount
      })
      console.log('myVisitorData', _this.data.myVisitorData);
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 获取企业访客
  async getFirmVisitor() {
    let _this = this;
    wx.showLoading({
      title: "获取中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await gainCorporateVisitor(_this.data.firmVisitorParam)
    if (code == '000000') {
      // 得在合并数据之前处理数据
      data[0].corporateVisitorList = [..._this.data.firmVisitorData, ...data[0].corporateVisitorList]
      _this.setData({
        firmVisitorData: data[0].corporateVisitorList,
        firmVisitorTotal: data[0].number
      })
      console.log('firmVisitorData', _this.data.firmVisitorData);
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 获取营销模板
  async getSEMTemplate() {
    let _this = this;
    wx.showLoading({
      title: '获取中...',
      mask: true
    })
    let {
      code,
      data,
      message
    } = await gainEnterpriseTemplate();
    if (code == '000000') {
      _this.setData({
        templateAllData: data
      })
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 上拉加载更多
  scrollLoadMore(e) {
    let _this = this;
    let {
      index
    } = e.currentTarget.dataset;
    console.log('scrollLoadMore', index);
    _this.setData({
      isPullUp: true
    })
    // 优化
    // if (_this.data.myVisitorDataLength.length > 0) {
    // index  0 我的访客  1 企业访客
    if (index == 0) {
      _this.data.myVisitorParam.pageNumber++
      _this.getMyVisitor()
    } else if (index == 1) {
      _this.data.firmVisitorParam.pageNumber++
      _this.getFirmVisitor()
    }
    // } else {
    //   wx.showToast({
    //     title: '已经到底了',
    //     icon: "none"
    //   })
    // }
  },
  // 下拉刷新
  pullToRefresh(e) {
    console.log('pullToRefresh');
    let _this = this;
    let {
      index
    } = e.currentTarget.dataset;
    // 复位
    _this.setData({
      isPullRefresh: false
    })
    // index  0 我的访客  1 企业访客
    if (index == 0) {
      // 重置
      _this.setData({
        ['myVisitorParam.pageNumber']: 1,
        myVisitorData: [],
        myVisitorTotal: 0
      })
      _this.getMyVisitor()
    }
    if (index == 1) {
      // 重置
      _this.setData({
        ['firmVisitorParam.pageNumber']: 1,
        firmVisitorData: [],
        firmVisitorTotal: 0
      })
      _this.getFirmVisitor()
    }
  },
  // 重置
  reset() {
    let _this = this;
    let tabName = _this.data.tabName;
    if (tabName == "我的访客") {
      _this.setData({
        myVisitorParam: {
          oneDay: 1, // 昨天传2  当日传1或者不传
          startDate: "", // 开始日期
          endDate: "", // 结束日期
          userId: "", // 用户ID
          personStatus: "",
          pageNumber: 1, // 页数
          pageSize: 20 // 分页大小
        },
        myVisitorData: [],
        myVisitorTotal: 0,
        timeTermIndex: 0
      })
    }
    if (tabName == "企业访客") {
      _this.setData({
        firmVisitorParam: {
          oneDay: 1, // 昨天传2  当日传1或者不传
          startDate: "", // 开始日期
          endDate: "", // 结束日期
          userId: "", // 用户ID
          pageNumber: 1, // 页数
          pageSize: 20 // 分页大小
        }, // 我的访客参数
        firmVisitorData: [], // 企业访客数据
        firmVisitorTotal: 0, // 企业访客人数总数
        timeTermIndex: 0
      })
    }
    if (tabName == "营销模板") {
      _this.setData({
        templateIndex: 1,
        templateAllData: []
      })
    }
  },
  // 切换请求
  cutReq() {
    let _this = this;
    let tabName = _this.data.tabName;
    console.log('tabName', tabName);
    if (tabName == "我的访客") {
      _this.getMyVisitor()
    } else if (tabName == "企业访客") {
      _this.getFirmVisitor()
    } else if (tabName == "营销模板") {
      _this.getSEMTemplate()
    }
  },
  // 跳转查看模板
  jumpLookTemplate(e) {
    console.log('e', e);
    let _this = this;
    console.log('是发发', _this.data.userInfo);
    if (!_this.data.userInfo.wechatCode) {
      wx.showToast({
        title: "请完善企业信息",
        icon: "none"
      })
      return
    }
    let {
      templateimg,
      templateindex
    } = e.currentTarget.dataset
    console.log('templateimg', templateimg);
    wx.setStorageSync('templateImg', templateimg)
    wx.navigateTo({
      url: `/pages/templateShow/index?templateIndex=${templateindex}&templateimg=${templateimg}`
    })
  },
  // 底部改变
  bottomChange(e) {
    console.log('e', e);
    let {
      index
    } = e.currentTarget.dataset;
    // index 0 名片设置  1 商城设置  2 展厅设置
    if (index == 0) {
      if (this.data.isAdministrator) {
        wx.navigateTo({
          url: '/pages/nameCardSet/index'
        })
      } else {
        wx.navigateTo({
          url: '/pages/ordinaryCard/index'
        })
      }


    } else if (index == 1) {
      wx.navigateTo({
        url: '/pages/shopSet/index'
      })
    } else if (index == 2) {
      wx.navigateTo({
        url: '/pages/gallerySet/index'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let date = new Date();
    _this.setData({
      startTime: getSpecifyDate(date, -30),
      endTime: getSpecifyDate(date, 0)
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
    // 获取用户信息
    _this.getUserInfo()
    _this.reset()
    _this.cutReq()
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