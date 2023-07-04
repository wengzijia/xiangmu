// subpackageA/pages/orderDetails/index.js
import {
  getDetail
} from "../../../api/proList"
import {
  checkReport,
  production,
  preFinishInfo
} from "../../../api/current"
// 图片域名
import {
  imageBaseUrl
} from '../../../utils/request'
// 工序
import {
  processMap
} from "../../../utils/util"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mainId: "",
    contentIndex: 1, // 内容切换下标
    ids: {}, // 机长设备加工商id
    imageBaseUrl: imageBaseUrl, // 图片域名
    orderData: null, // 订单详情所有数据
    detailData: [], // 详情数据
    remarkData: null, // 备注数据
    abnormalData: [], // 异常数据
    processMap: processMap, // 工序遍历
    previewShow: false, // 图片预览是否显示 
    showProRemarks: [], // 是否显示生产备注
    showMassContent: [], // 是否显示质量要求备注
    isShowHint: false, // 是否显示提示弹窗
    isDoneProHint: false, // 是否显示完成生产前置信息提示弹窗
    // isAnoMsgHint: false, // 异常信息提示弹窗
    doneProHintData: null, // 完成生产提示数据
    // anoMsgHintData: null, // 异常信息提示数据
    proParam: {
      deviceId: '', // 设备id
      deviceOperatorId: '', // 设备操作员id(机长id)
      groupNo: '', // 大版号
      lossCount: '', // 较版纸数量（本工序）
      mainId: '', // 大版订单id
      onCount: '', // 下机数
      onFinishImage: '', // 下机图片
      optionType: '' // 操作类型,1开始生产，2完成生产，3停止生产
    },
    picNum: 0 // 图片数量
  },
  // 图片改变
  picChange(e) {
    let _this = this;
    console.log("图片改变", e);
    _this.setData({
      picNum: e.detail.current
    })
  },
  // 获取本地存储
  getStorageSync(key) {
    return wx.getStorageSync(key)
  },
  // 截取时间格式
  cutTime(value, type) {
    // 只针对这种格式 ("2022-07-27 09:44:34")
    // 0 不含秒  1 不含时分秒
    if (value) {
      if (type == 0) {
        return value.slice(0, value.lastIndexOf(":"))
      } else if (type == 1) {
        return value.split(" ")[0]
      }
    }
    return value
  },
  // 内容切换
  switch (e) {
    console.log(e);
    let {
      index
    } = e.currentTarget.dataset;
    let _this = this;
    _this.setData({
      contentIndex: index
    })
  },
  // 获取订单详情所有数据
  async getDetailData() {
    let _this = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let {
      code,
      data,
      message
    } = await getDetail(_this.data.mainId);
    console.log('订单详情数据', data);
    if (code == '000000') {
      if (data) {
        data.deadline = _this.cutTime(data.deadline, 0)
        data.deliveryDate = _this.cutTime(data.deliveryDate, 1)
        data.groupImg = data.groupImg ? data.groupImg.split(',').filter(e => e) : []
        data.lossInfos?.forEach(item => {
          item.photoPath1 = item.photoPath1 ? item.photoPath1.split(',').filter(e => e) : []
        })
        console.log('data.lossInfos', data.lossInfos);
        data.poList?.forEach(item => {
          item.poImg = item.poImg ? item.poImg.split(',').filter(e => e) : []
          item.poSmallImg = item.poSmallImg ? item.poSmallImg.split(',').filter(e => e) : []
        })
        _this.setData({
          showProRemarks: data.remarkInfos?.productionPoRemarks?.filter(e => e.content) || [], // 生产备注
          showMassContent: data.remarkInfos?.qualityPoRemarks?.filter(e => e.content) || [], // 质量备注
          orderData: data,
          detailData: data.poList,
          remarkData: data.remarkInfos,
          abnormalData: data.lossInfos
        })
      } else {
        _this.setData({
          showProRemarks: [], // 生产备注
          showMassContent: [], // 质量备注
          orderData: null,
          detailData: [],
          remarkData: [],
          abnormalData: []
        })
      }
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
    wx.hideLoading()
  },
  // 跳转到除废操作规程
  jumpSop() {
    wx.navigateTo({
      url: '/subpackageA/pages/process/index'
    })
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
      this.setData({
        previewShow: true
      })
    }
  },
  // 订单被其他机长生产提示关闭弹窗
  hintClose() {
    let _this = this;
    _this.setData({
      isShowHint: false
    })
  },
  // 完成生产前置信息提示弹窗关闭
  doneProHintClose() {
    let _this = this;
    _this.setData({
      isDoneProHint: false
    })
  },
  // 异常信息提示弹窗
  anoMsgHintClose() {
    let _this = this;
    _this.setData({
      isAnoMsgHint: false
    })
  },
  // 完成生产前置信息提示弹窗确认
  doneProHintAffirm(e) {
    let _this = this;
    _this.setData({
      isDoneProHint: false
    })
  },
  // 异常信息提示弹窗确认
  anoMsgHintAffirm(e) {
    let _this = this;
    _this.setData({
      isAnoMsgHint: false
    })
  },
  // 开始生产
  async startPro() {
    let _this = this;
    let {
      supplierId,
      deviceId,
      pilotId
    } = _this.data.ids;
    let {
      groupSn,
      mainId,
      onCount
    } = _this.data.orderData;
    _this.setData({
      proParam: {
        deviceId, // 设备id
        deviceOperatorId: pilotId, // 设备操作员id(机长id)
        groupNo: groupSn, // 大版号
        mainId, // 大版订单id
        onCount, // 下机数
        optionType: '1' // 操作类型,1开始生产，2完成生产，3停止生产
      }
    })
    console.log('deviceId', _this.data.proParam);
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    let {
      code,
      data,
      message
    } = await production(_this.data.proParam);
    wx.hideLoading()
    if (code == '000000') {
      // wx.setStorageSync('isStartPro', 1)
      _this.getDetailData()
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
        wx.navigateBack()
      }, 2000)
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 完成生产
  async donePro(e) {
    console.log('e', e.currentTarget.dataset);
    let _this = this;
    if (e.currentTarget.dataset) {
      let {
        groupno,
        mainid,
        polist,
        nearcount
      } = e.currentTarget.dataset
      polist = polist?.map(e => {
        return {
          idBwGroupSubject: e.idBwGroupSubject,
          poSn: e.poSn,
          modNum: e.modNum,
          onCount: "",
          lossCount: ""
        }
      })
      console.log('polist', polist);
      if (polist) {
        polist = JSON.stringify(polist)
      } else {
        polist = []
      }
      let doneProHintParam = {
        id: mainid
      }
      wx.showLoading({
        title: '加载中...',
        mask:true
      })
      // 完成生产前置信息提示
      let {
        code,
        data,
        message
      } = await preFinishInfo(doneProHintParam);
      wx.hideLoading()
      if (code == '000000') {
        wx.navigateTo({
          url: `/subpackageA/pages/donePromote/index?groupNo=${groupno}&mainId=${mainid}&poFinishList=${polist}&nearCount=${nearcount}&isDetail=1`
        })
      } else if (code == '910024') {
        _this.setData({
          doneProHintData: data,
          isDoneProHint: true
        })
      } else if (code != "401") {
        wx.showToast({
          title: message,
          icon: "none"
        })
      }
    }
  },
  // 跳转异常报备
  async jumpReported(e) {
    let _this = this;
    let dataset = e.currentTarget.dataset;
    let {
      attributeId,
      groupId,
      groupSn,
      poSns,
      mainId
    } = _this.data.orderData
    let checkReportParam = {
      mainId,
      deviceId: _this.data.ids.deviceId
    }
    let {
      code,
      data,
      message
    } = await checkReport(checkReportParam)
    if (code == '000000') {
      wx.navigateTo({
        url: `/subpackageA/pages/reported/index?attributeId=${attributeId}&groupId=${groupId}&groupSn=${groupSn}&poSns=${poSns}&mainId=${mainId}&reportDetail=${dataset?.reportdetail}`
      })
    } else if (code == '980003') {
      // 订单已经外发
      wx.showToast({
        title: message,
        icon: "none"
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    } else if (code != "401") {
      _this.setData({
        isShowHint: true
      })
    }
  },
  // 获取订单情况
  async orderCondition() {
    let _this = this;
    let param = {
      mainId: _this.data.mainId,
      deviceId: _this.data.ids.deviceId
    }
    let {
      code,
      data,
      message
    } = await checkReport(param);
    if (code == '980001' || code == '910023') {
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
        wx.navigateBack()
      }, 2000)
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 提示确认
  hintAffirm() {
    let _this = this;
    _this.setData({
      isShowHint: false
    })
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      mainId: options.mainId
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
    // 预览图片阻止请求
    if (_this.data.previewShow) {
      _this.setData({
        previewShow: false
      })
      return
    }
    _this.setData({
      ids: _this.getStorageSync('ids'),
      contentIndex: 1
    })
    // 获取订单详情所有数据
    _this.getDetailData()
    // 获取订单情况
    _this.orderCondition()
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