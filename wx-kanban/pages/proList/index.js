// pages/proList/index.js
import {
  getWaitPro,
  getAnomaly,
  getDoneList,
  getRecoverPro,
  getCountProcessLossList
} from "../../api/proList";
import {
  checkReport,
  production
} from "../../api/current"
// 图片域名
import {
  imageBaseUrl
} from '../../utils/request'
import {
  anoTypeMap
} from "../../utils/util"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: 2, // 是否登录  1 已登录   2 未登录
    activeIndex: 0, // 激活下标
    isShowHint: false, // 是否显示提示弹窗
    imageBaseUrl, // 图片域名
    anoTypeMap, // 异常类型遍历
    ids: "",
    abnormalNum: 0, // 异常数量
    // 待排产参数
    waitProParam: {
      attId: "48", // 工艺属性id    48是除废
      no: "" // 大版号或者po号
    },
    // 异常参数
    anomalyParam: {
      attId: "48", // 工艺属性id    48是除废
      deviceId: "", // 设备id
      no: "" // 大版号或者po号
    },
    // 完成参数
    doneParam: {
      attId: "48", // 工艺属性id    48是除废
      deviceId: "", // 设备id
      deviceOperatorId: "", // 机长id
      no: "" // 大版号或者po号
    },
    searchVal: '', // 搜索值
    searchCode: "", // 搜索状态码 用来判断
    searchMessage: "", // 搜索消息
    waitProData: "", // 待排产数据
    anomalyData: "", // 异常数据
    doneData: "", // 完成数据
    proParam: {
      deviceId: '', // 设备id
      deviceOperatorId: '', // 设备操作员id(机长id)
      groupNo: '', // 大版号
      mainId: '', // 大版订单id
      onCount: '', // 下机数
      optionType: '1' // 操作类型,1开始生产，2完成生产，3停止生产
    }, // 开始生产参数
    groupImg: [], // 大版图(优先展示groupSmallImage 后面展示groupImg)
    groupPreImg: [], // 大版预览图(groupImg)
    previewShow: false, // 图片预览是否显示 
    isAnoMsgHint: false, // 异常信息提示弹窗
    anoMsgHintData: {}, // 异常信息提示数据
    isPullRefresh: true, // 下拉刷新是否触发
    page: 1,
    pagesize: 20,
    allData: [] // 所有数据
  },
  // 获取本地存储
  getStorageSync(key) {
    return wx.getStorageSync(key)
  },
  // 搜索框
  searchInput(e) {
    let _this = this;
    _this.setData({
      searchVal: e.detail.value
    })
    console.log('searchVal', _this.data.searchVal);
  },
  // 清除搜索值
  clearSearchVal() {
    let _this = this;
    _this.setData({
      searchVal: ''
    })
    _this.cutGet()
  },
  // tab标签改变
  tabChange(e) {
    console.log('tab改变', e.detail);
    let {
      index
    } = e.detail
    let _this = this;
    _this.setData({
      activeIndex: index
    })
    _this.cutGet()
  },
  // 开始生产
  async startPro(e) {
    let _this = this;
    if (e.currentTarget.dataset) {
      let {
        groupno,
        mainid,
        oncount
      } = e.currentTarget.dataset
      _this.setData({
        ['proParam.groupNo']: groupno,
        ['proParam.mainId']: mainid,
        ['proParam.onCount']: oncount,
      })
    }
    if (_this.data.ids) {
      let {
        supplierId,
        deviceId,
        pilotId
      } = _this.data.ids;
      _this.setData({
        ['proParam.deviceId']: deviceId,
        ['proParam.deviceOperatorId']: pilotId
      })
    }
    console.log('proParam', _this.data.proParam);
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await production(_this.data.proParam);
    wx.hideLoading()
    if (code == '000000') {
      // wx.setStorageSync('isStartPro', 1)
      wx.switchTab({
        url: '/pages/current/index'
      })
    } else if (code == '980001' || code == '910023') {
      _this.setData({
        isShowHint: true
      })
    } else if (code == '980003') {
      // 订单已经外发
      wx.showToast({
        title: message,
        icon: "none"
      })
      setTimeout(() => {
        _this.cutGet()
      }, 2000)
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 恢复生产
  async recoverPro(e) {
    let _this = this;
    console.log(e);
    let {
      idprocessloss
    } = e.currentTarget.dataset
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getRecoverPro(idprocessloss);
    wx.hideLoading()
    if (code == '000000') {
      // wx.setStorageSync('isStartPro', 2)
      wx.showToast({
        title: message,
        icon: "none"
      })
      setTimeout(() => {
        _this.cutGet()
      }, 1000)
    } else {
      wx.showToast({
        title: message,
        icon: "none"
      })
      setTimeout(() => {
        _this.cutGet()
      }, 1000)
    }
  },
  // 提示关闭
  hintClose() {
    let _this = this;
    _this.setData({
      isShowHint: false
    })
  },
  // 提示确认
  hintAffirm() {
    let _this = this;
    _this.setData({
      isShowHint: false
    })
    _this.cutGet()
  },
  // 异常信息提示弹窗
  anoMsgHintClose() {
    let _this = this;
    _this.setData({
      isAnoMsgHint: false
    })
  },
  // 异常信息提示弹窗确认
  anoMsgHintAffirm(e) {
    let _this = this;
    _this.setData({
      isAnoMsgHint: false
    })
  },
  // 获取异常数量
  async countProcessLossList() {
    let _this = this;
    let ids = _this.data.ids;
    let param = {
      attributeId: 48,
      deviceId: ids.deviceId,
      no: ""
    }
    console.log(param);
    let activeIndex = _this.data.activeIndex
    if (activeIndex == 0) {
      param.no = _this.data.waitProParam.no
    } else if (activeIndex == 1) {
      param.no = _this.data.anomalyParam.no
    } else if (activeIndex == 2) {
      param.no = _this.data.doneParam.no
    }
    let {
      code,
      data,
      message
    } = await getCountProcessLossList(param);
    if (code == '000000') {
      _this.setData({
        abnormalNum: data
      })
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    } else {
      _this.setData({
        abnormalNum: 0
      })
    }
  },
  // 切换请求
  cutGet() {
    let _this = this;
    // 判断登录
    if (_this.data.isLogin != 1) {
      return
    }
    let activeIndex = _this.data.activeIndex
    _this.setData({
      page: 1,
      pagesize: 20
    })
    if (activeIndex == 0) {
      _this.setData({
        waitProData: []
      })
      _this.waitPro()
    } else if (activeIndex == 1) {
      _this.setData({
        anomalyData: []
      })
      _this.anomaly()
    } else if (activeIndex == 2) {
      _this.setData({
        doneData: []
      })
      _this.doneList()
    }
    _this.countProcessLossList()
  },
  // 待排产
  async waitPro() {
    let _this = this;
    _this.setData({
      ['waitProParam.no']: _this.data.searchVal
    })
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getWaitPro(_this.data.waitProParam);
    if (code == '000000') {
      data.forEach(e => {
        e.deadline = e.deadline?.slice(5, 16) // 截止时间
        e.deliveryDate = e.deliveryDate?.slice(5, 10) // 交货日期
        e.groupImg = e.groupImg ? e.groupImg.split(',').filter(e => e) : []; // 大版图片
        e.groupSmallImage = e.groupSmallImage ? e.groupSmallImage.split(',').filter(e => e) : []; // 大版图片
        // 大版优先展示groupSmallImage 后展示groupImg
        // if(e.groupSmallImage){
        //   _this.setData({
        //     groupImg:e.groupSmallImage
        //   })
        // }else if(e.groupImg){
        //   _this.setData({
        //     groupImg:e.groupImg,
        //     groupPreImg:e.groupImg
        //   })
        // }
        // console.log('e.groupImg',e.groupImg);
      })
      console.log('data', data);
      console.log('_this.data.page', _this.data.page);
      console.log('_this.data.pagesize', _this.data.pagesize);
      _this.setData({
        searchCode: code,
        allData: data,
        waitProData: data && data.length ? data.slice(_this.data.page - 1, _this.data.pagesize) : data
      })
    } else if (code == '910020') {
      _this.setData({
        searchCode: code,
        searchMessage: message,
        allData: data,
        waitProData: data && data.length ? data.slice(_this.data.page - 1, _this.data.pagesize) : data
      })
    } else if (code == '910021') {
      _this.setData({
        searchCode: code,
        searchMessage: message,
        allData: data,
        waitProData: data && data.length ? data.slice(_this.data.page - 1, _this.data.pagesize) : data
      })
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    } else {
      _this.setData({
        searchCode: "",
        searchMessage: "",
        allData: [],
        waitProData: null
      })
    }
    wx.hideLoading()
  },
  // 异常
  async anomaly() {
    let _this = this;
    let {
      supplierId,
      deviceId,
      pilotId
    } = _this.data.ids;
    _this.setData({
      ['anomalyParam.deviceId']: deviceId,
      ['anomalyParam.no']: _this.data.searchVal
    })
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getAnomaly(_this.data.anomalyParam);
    if (code == '000000') {
      data?.forEach(item => {
        item.groupImg = item.groupImg ? item.groupImg.split(',').filter(e => e) : []
        item.photoPath1 = item.photoPath1 ? item.photoPath1.split(',').filter(e => e) : []
        item.attributeExceptionType = item.attributeExceptionType ? item.attributeExceptionType.split(',').filter(e => e) : []
      })
      console.log('_this.data.page', _this.data.page);
      console.log('_this.data.pagesize', _this.data.pagesize);
      _this.setData({
        searchCode: code,
        allData: data,
        anomalyData: data && data.length ? data.slice(_this.data.page - 1, _this.data.pagesize) : data,
        abnormalNum: data && data.length ? data.length : 0
      })
    } else if (code == '910020') {
      _this.setData({
        searchCode: code,
        allData: data,
        searchMessage: message,
        anomalyData: data && data.length ? data.slice(_this.data.page - 1, _this.data.pagesize) : data,
        abnormalNum: data && data.length ? data.length : 0
      })
    } else if (code == '910021') {
      _this.setData({
        searchCode: code,
        allData: data,
        searchMessage: message,
        anomalyData: data && data.length ? data.slice(_this.data.page - 1, _this.data.pagesize) : data,
        abnormalNum: data && data.length ? data.length : 0
      })
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    } else {
      _this.setData({
        searchCode: "",
        anomalyData: null,
        searchMessage: "",
        allData: []
      })
    }
    wx.hideLoading()
  },
  // 完成
  async doneList() {
    let _this = this;
    let {
      supplierId,
      deviceId,
      pilotId
    } = _this.data.ids;
    _this.setData({
      ['doneParam.deviceId']: deviceId,
      ['doneParam.deviceOperatorId']: pilotId,
      ['doneParam.no']: _this.data.searchVal
    })
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getDoneList(_this.data.doneParam);
    if (code == '000000') {
      data?.forEach(e => {
        e.onFinishTime = e.onFinishTime.slice(5, 16); // 完成日期
        e.groupImg = e.groupImg ? e.groupImg.split(',').filter(e => e) : []; // 大版图片
      })
      console.log('_this.data.page', _this.data.page);
      console.log('_this.data.pagesize', _this.data.pagesize);
      _this.setData({
        searchCode: code,
        allData: data,
        doneData: data && data.length ? data.slice(_this.data.page - 1, _this.data.pagesize) : data
      })
    } else if (code == '910020') {
      _this.setData({
        searchCode: code,
        allData: data,
        searchMessage: message,
        doneData: data && data.length ? data.slice(_this.data.page - 1, _this.data.pagesize) : data,
      })
    } else if (code == '910021') {
      _this.setData({
        searchCode: code,
        allData: data,
        searchMessage: message,
        doneData: data && data.length ? data.slice(_this.data.page - 1, _this.data.pagesize) : data,
      })
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    } else {
      _this.setData({
        searchCode: "",
        doneData: null,
        searchMessage: "",
        allData: []
      })
    }
    wx.hideLoading()
  },
  // 搜索 
  search() {
    let _this = this;
    _this.cutGet()
  },
  // 跳转详情
  async jumpDetails(e) {
    let _this = this;
    let param = {
      mainId: e.currentTarget.dataset.mainid,
      deviceId: _this.data.ids.deviceId
    }
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await checkReport(param);
    wx.hideLoading()
    if (code == '000000') {
      wx.navigateTo({
        url: `/subpackageA/pages/orderDetails/index?mainId=${e.currentTarget.dataset.mainid}`,
      })
    } else if (code == '980001' || code == '910023') {
      _this.setData({
        isShowHint: true
      })
    } else if (code == '980003') {
      // 订单已经外发
      wx.showToast({
        title: message,
        icon: "none"
      })
      setTimeout(() => {
        _this.cutGet()
      }, 2000)
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 预览图片
  previewImage(e) {
    let _this = this;
    let {
      index,
      imglist
    } = e.currentTarget.dataset
    console.log('previewimage', e);
    if (imglist.length) {
      imglist = imglist.map(e => {
        return _this.data.imageBaseUrl + e
      })
      wx.previewImage({
        urls: imglist, // 需要预览的图片http链接列表
        current: index ? imglist[index] : imglist[0]
      })
      _this.setData({
        previewShow: true
      })
    }
  },
  // 上拉加载更多
  scrollLoadMore(e) {
    let _this = this;
    let activeIndex = _this.data.activeIndex;
    let page = _this.data.page;
    _this.setData({
      isPullUp: true,
      page: page + 1
    })
    let num = (_this.data.page - 1) * _this.data.pagesize
    let num2 = num + _this.data.pagesize
    let allData = _this.data.allData
    console.log('sfddf', num, num2);
    console.log('allData', allData);
    let qielist = allData.slice(num, num2)
    console.log('qielist', qielist);
    // let slist = this.data.waitProData
    // let newarr = slist.concat(qielist)
    console.log('_this.data.waitProData.length',_this.data.waitProData.length);
    console.log('_this.data.anomalyData.length',_this.data.anomalyData.length);
    console.log('_this.data.doneData.length',_this.data.doneData.length);
    if (allData.length == _this.data.waitProData.length || allData.length == _this.data.anomalyData.length || allData.length == _this.data.doneData.length) {
      return
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    if (activeIndex == 0) {
      _this.setData({
        waitProData: _this.data.waitProData.concat(qielist)
      })
    } else if (activeIndex == 1) {
      _this.setData({
        anomalyData: _this.data.anomalyData.concat(qielist)
      })
    } else if (activeIndex == 2) {
      _this.setData({
        doneData: _this.data.doneData.concat(qielist)
      })
    }
    wx.hideLoading()
  },
  // 下拉刷新
  pullToRefresh(e) {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    // 复位
    _this.setData({
      isPullRefresh: false,
      page: 1,
      pagesize: 20
    })
    let allData = _this.data.allData
    console.log('allData', allData);
    let cutlist = allData.slice(_this.data.page - 1, _this.data.pagesize)
    console.log('cutlist', cutlist);
    let activeIndex = _this.data.activeIndex;
    if (activeIndex == 0) {
      _this.setData({
        waitProData: cutlist
      })
    } else if (activeIndex == 1) {
      _this.setData({
        anomalyData: cutlist
      })
    } else if (activeIndex == 2) {
      _this.setData({
        doneData: cutlist
      })
    }
    wx.hideLoading()
    // _this.setData({
    //   ['planParam.pageNumber']: 1,
    //   planList: []
    // })
    // _this.getPlanList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      ids: wx.getStorageSync('ids')
    })
    // 适配顶部
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          statusBarHeight: res.statusBarHeight,
          fontSizeSetting: res.fontSizeSetting,
          boxHeight: (500 / 750 * res.screenWidth) - (res.statusBarHeight * 1.4 + res.fontSizeSetting + res.statusBarHeight / 2),
          boxLineHeight: 130 / 750 * res.screenWidth
        })
      }
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
      isLogin: wx.getStorageSync('isLogin')
    })
    if (_this.data.isLogin != 1) {
      wx.showModal({
        title: '提示',
        content: '您未登录，无法访问该页面，请前往登录。',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/login/index'
            })
          }
        }
      });
      return
    }
    // 预览图片阻止请求
    if (_this.data.previewShow) {
      _this.setData({
        previewShow: false
      })
      return
    }
    _this.setData({
      page: 1,
      size: 20,
      waitProData: []
    })
    _this.cutGet()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let _this = this;
    // 预览图片阻止
    if (_this.data.previewShow) {
      return
    }
    _this.setData({
      activeIndex: 0,
      isShowHint: false
    })
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