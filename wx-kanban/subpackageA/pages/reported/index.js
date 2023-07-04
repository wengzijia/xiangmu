// subpackageA/pages/donePromote/index.js
import {
  anoReport,
  uploadImg
} from "../../../api/current"
import {
  imageBaseUrl
} from "../../../utils/request"
import {
  uploadFile
} from "../../../utils/util"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ids: "",
    selectAll: false, //全选
    excRemark: "", // 异常备注
    orderNumList: [], // 订单号列表
    anoType: [], // 异常类型
    fileList: [], //需要上传的图片列表
    isPoSns: false, // 是否有po
    anoOrderAll: [], // 异常订单
    anomalyType: [{
        type: "3",
        name: "除废打坏"
      },
      {
        type: "2",
        name: "数量不足"
      },
      {
        type: "17",
        name: "啤爆"
      },
      {
        type: "18",
        name: "没啤穿"
      },
      {
        type: "19",
        name: "啤位不准"
      },
      {
        type: "20",
        name: "击凸不准"
      },
      {
        type: "1",
        name: "其他"
      }
    ],
    reportedParam: {
      attributeId:"", // 工艺id
      continueType: "", // 是否继续生产 Y 是 N 否
      deviceId: "", // 设备Id
      deviceOperatorId: "", // 机长Id
      exceptionSource:2, // 异常来源 1 跟单宝小程序 2 电子看版 3跟单宝web 4生产派单系统 5PDA
      mainId: "", // 看板-大版id
      groupId: "", // 大版id
      groupSn: "", // 大版号
      isAllPo: 1, // 是否全选po 0 否 1 是,PO工序的时候传1
      isGDBOperation: false, // 是否跟单宝web提出的异常 是：true 否：false
      attributeExceptionType: "", // 工艺异常类型
      poSns: [], //  异常的po集合  全选传空数组
      lossNum: "", // 损耗数量
      lossType: "0", // 损耗类型，0.全部，1.部分损耗
      photoPath1: "", // 损耗图片
      reason: "" // 损耗原因
    },
    reportDetail: 2, // 异常报备是否详情进来  1  是  2 不是
    reportMsg: "" // 异常报备提示信息
  },
  // 获取本地存储
  getStorageSync(key) {
    return wx.getStorageSync(key)
  },
  // 异常订单全选
  orderSelectAll() {
    let _this = this;
    for (let i = 0; i < _this.data.orderNumList.length; i++) {
      _this.data.orderNumList[i].checked = (!_this.data.selectAll)
    }
    _this.setData({
      orderNumList: _this.data.orderNumList,
      selectAll: (!_this.data.selectAll),
      ['reportedParam.poSns']: []
    })
    if (_this.data.selectAll) {
      _this.setData({
        ['reportedParam.isAllPo']: 1,
        anoOrderAll: _this.data.orderNumList.map(item => {
          return item.value
        })
      })
    } else {
      _this.setData({
        ['reportedParam.isAllPo']: 0,
        anoOrderAll: []
      })
    }

    console.log('异常全选(1是)', 'isAllPo(全选1)', _this.data.reportedParam.isAllPo, 'anoOrderAll', _this.data.anoOrderAll);
    console.log('isPoSns', _this.data.isPoSns, 'reportedParam.poSns', _this.data.reportedParam.poSns);
  },

  // 异常订单选中改变事件
  orderSelectChange(e) {
    let _this = this;
    let poSns = e.detail.value
    _this.setData({
      selectAll: poSns.length == _this.data.orderNumList.length,
      anoOrderAll: poSns
    })
    if (_this.data.selectAll) {
      _this.setData({
        ['reportedParam.poSns']: [],
        ['reportedParam.isAllPo']: 1
      })
    } else {
      _this.setData({
        ['reportedParam.poSns']: poSns,
        ['reportedParam.isAllPo']: 0
      })
    }
    console.log('异常订单选中改变', 'isAllPo(全选1)', _this.data.reportedParam.isAllPo, 'anoOrderAll', _this.data.anoOrderAll);
    console.log('isPoSns', _this.data.isPoSns, 'reportedParam.poSns', _this.data.reportedParam.poSns);
  },

  // 异常类型多选框改变
  expTypeChange(event) {
    let _this = this;
    _this.setData({
      anoType: event.detail,
    });
    console.log('anoType', _this.data.anoType);
  },
  // 异常纸张数单选框改变
  excPaperChange(event) {
    let _this = this;
    _this.setData({
      ['reportedParam.lossType']: event.detail,
    });
    console.log('addgd', _this.data.reportedParam.lossType);
  },
  // 获取输入框值
  getInputVal(e) {
    let _this = this;
    let {
      type
    } = e.currentTarget.dataset
    let {
      value
    } = e.detail
    // type  1 异常纸张数数量  2 异常备注
    if (type == 1) {
      _this.setData({
        ['reportedParam.lossNum']: value.replace(/^(0+)|[^\d]+/g, '') // 只能输整数
      })
    } else if (type == 2) {
      _this.setData({
        ['reportedParam.reason']: value.replace(/\\n/g,'\n')
      })
    }
  },
  // 上传图片
  uploadImg(event) {
    let _this = this;
    wx.showLoading({
      title: '上传中...'
    })
    const {
      file
    } = event.detail //获取所需要上传的文件列表
    console.log(file);
    let uploadPromiseTask = [] //定义上传的promise任务栈
    for (let i = 0; i < file.length; i++) {
      uploadPromiseTask.push(uploadFile(file[i].url)) //push进每一张所需要的上传的图片promise栈
    }
    Promise.all(uploadPromiseTask).then(res => {
      console.log('res', res);
      //全部上传完毕
      _this.setData({
        fileList: _this.data.fileList.concat(res)
      })
      console.log('fileList', _this.data.fileList);
      wx.hideLoading()
    }).catch(error => {
      //存在有上传失败的文件
      wx.hideLoading()
      wx.showToast({
        title: '上传失败！',
        icon: 'none',
      })
    })
  },
  // 删除图片
  deleteImg(event) {
    let _this = this;
    const delIndex = event.detail.index
    const {
      fileList
    } = _this.data
    fileList.splice(delIndex, 1)
    _this.setData({
      fileList
    })
  },
  // 返回页面
  backPage() {
    let _this = this;
    wx.showToast({
      title: _this.data.reportMsg,
      icon: "none",
      duration: 2000,
      success: () => {
        if (_this.data.reportDetail == 1) {
          // 异常报备详情进来返回到待排产
          setTimeout(() => {
            wx.navigateBack({
              delta: 2
            })
          }, 2000)
        } else {
          // 返回当前订单
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      }
    })
  },
  // 生产
  async production(e) {
    console.log('e', e.currentTarget.dataset);
    let _this = this;
    let {
      type
    } = e.currentTarget.dataset;
    let {
      anoType,
      isPoSns,
      anoOrderAll
    } = _this.data
    let {
      continueType,
      mainId,
      groupSn,
      attributeExceptionType,
      poSns,
      lossNum,
      lossType,
      photoPath1,
      reason
    } = _this.data.reportedParam
    console.log('isPoSns',isPoSns,'anoOrderAll.length',anoOrderAll.length);
    if (isPoSns&&!anoOrderAll.length) {
      // 判断po是否有选中
      wx.showToast({
        title: '请选择异常订单',
        icon: "none"
      })
      return
    } else if (!anoType.length) {
      wx.showToast({
        title: '请选择异常原因',
        icon: "none"
      })
      return
    } else if (lossType == 1 && !lossNum) {
      wx.showToast({
        title: '请输入数量',
        icon: "none"
      })
      return
    }
    // type   1 继续生产  2 停止生产
    if (type == 1) {
      _this.setData({
        ['reportedParam.continueType']: "Y"
      })
    } else if (type == 2) {
      _this.setData({
        ['reportedParam.continueType']: "N"
      })
    }
    console.log('continueType', continueType);
    let {
      supplierId,
      deviceId,
      pilotId
    } = _this.data.ids;
    let imglist = [];
    imglist = _this.data.fileList?.map(item => {
      console.log('item', item);
      if (item.url.includes(imageBaseUrl)) {
        let urlList = item.url.split(imageBaseUrl);
        console.log('urlList', urlList);
        return urlList[urlList.length - 1];
      }
      return item
    })
    console.log('imglist', imglist);
    _this.setData({
      ['reportedParam.deviceId']: deviceId, // 设备Id
      ['reportedParam.deviceOperatorId']: pilotId, // 机长Id
      ['reportedParam.attributeExceptionType']: anoType.toString(), // // 工艺异常类型
      ['reportedParam.photoPath1']: imglist.toString()
    })
    console.log('reportedParam', _this.data.reportedParam);
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await anoReport(_this.data.reportedParam);
    wx.hideLoading()
    _this.setData({
      reportMsg: message
    })
    if (code == '000000') {
      _this.backPage()
    } else if (code == '980001' || code == '910023') {
      _this.backPage()
    } else if (code == '980003') {
      // 订单已经外发
      _this.backPage()
    } else if (code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options);
    let _this = this;
    if (options) {
      let orderNumList = []
      options.poSns?.split(',').forEach(item => {
        orderNumList.push({
          value: item,
          checked: false
        })
      })
      _this.setData({
        isPoSns: options.poSns ? true : false,
        ['reportedParam.attributeId']: options.attributeId,
        ['reportedParam.groupId']: options.groupId,
        ['reportedParam.groupSn']: options.groupSn,
        orderNumList,
        ['reportedParam.mainId']: options.mainId,
        reportDetail: options.reportDetail
      })
    }
    this.orderSelectAll() // 默认全选
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
      ids: _this.getStorageSync('ids')
    })
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