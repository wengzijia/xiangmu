// subpackageA/pages/reported/index.js
import {
  production
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
    poList: [],
    showDeplane: false, // 是否显示下机提示弹窗
    fileList: [], //需要上传的图片列表
    nearCount: 0,
    doneProParam: {
      deviceId: "", // 设备id
      deviceOperatorId: "", // 设备操作员id
      groupNo: "", // 大版号
      lossCount: "", // 较版纸数量（本工序校版纸）
      mainId: "", // 大版订单id
      onCount: "", // 下机数(良品数)
      onFinishImage: "", // 下机图片
      optionType: 2, // 操作类型,1开始生产，2完成生产，3停止生产
      poFinishList: [] // po完成列表(主键,良品数,校版纸)
    },
    isDetail: 2 // 是否详情页跳过来   1 是  2 否
  },
  // 获取input的值
  getInputVal(e) {
    console.log(e);
    let _this = this;
    let {
      type
    } = e.currentTarget.dataset
    let {
      value
    } = e.detail
    console.log('value', value);
    // type 1 良品数  2 校版纸
    if (type == 1) {
      _this.setData({
        ['doneProParam.onCount']: value.replace(/^(0+)|[^\d]+/g, '').slice(0, 9) // 只能输整数
      })
    } else if (type == 2) {
      _this.setData({
        ['doneProParam.lossCount']: value.replace(/^(0+)|[^\d]+/g, '').slice(0, 9) // 只能输整数
      })
    }
    let onCount = _this.data.doneProParam.onCount;
    let lossCount = _this.data.doneProParam.lossCount;
    let poList = _this.data.poList;
    let poFinishList = _this.data.doneProParam.poFinishList;
    console.log('良品数', onCount, '校版纸', lossCount);
    if (poList.length) {
      if (onCount) {
        poList.forEach(e => {
          e.onCount = Number((onCount * e.modNum).toString().slice(0, 9))
        })
      } else {
        poList.forEach(e => {
          e.onCount = ""
        })
      }
      if (lossCount) {
        poList.forEach(e => {
          e.lossCount = Number((lossCount * e.modNum).toString().slice(0, 9))
        })
      } else {
        poList.forEach(e => {
          e.lossCount = ""
        })
      }
      _this.setData({
        poList,
        ['doneProParam.poFinishList']: poList.map(e => {
          return {
            idBwGroupSubject: e.idBwGroupSubject,
            lossCount: e.lossCount,
            onCount: e.onCount
          }
        })
      })
      console.log('422', _this.data.doneProParam.poFinishList);
    }
  },
  poListVal(e) {
    let _this = this;
    let {
      type,
      index
    } = e.currentTarget.dataset
    let {
      value
    } = e.detail
    console.log('index', index);
    let poList = _this.data.poList
    let poFinishList = _this.data.doneProParam.poFinishList
    if (poFinishList?.length) {
      if (type == 1) {
        poList[index].onCount = value.replace(/^(0+)|[^\d]+/g, '').slice(0, 9)
        poFinishList[index].onCount = value.replace(/^(0+)|[^\d]+/g, '').slice(0, 9) // 只能输整数
        _this.setData({
          ['doneProParam.poFinishList']: poFinishList,
          poList
        })
      } else if (type == 2) {
        poList[index].lossCount = value.replace(/^(0+)|[^\d]+/g, '').slice(0, 9)
        poFinishList[index].lossCount = value.replace(/^(0+)|[^\d]+/g, '').slice(0, 9) // 只能输整数
        _this.setData({
          ['doneProParam.poFinishList']: poFinishList,
          poList
        })
        console.log('poList222', _this.data.doneProParam.poFinishList);
      }
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
  // 取消
  cancel() {
    wx.navigateBack()
  },
  // 确认
  async affirm(e) {
    let _this = this;
    let poFinishList = _this.data.doneProParam.poFinishList;
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
    let stopReq = false; // 是否停止请求
    console.log('sagdgsd', _this.data.doneProParam.onCount, _this.data.doneProParam.lossCount);
    if (!_this.data.doneProParam.onCount || !_this.data.doneProParam.lossCount) {
      console.log('sss');
      _this.setData({
        showDeplane: true
      })
      stopReq = true
    }
    if (poFinishList?.length) {
      poFinishList.forEach(item => {
        if (!item.onCount || !item.lossCount) {
          console.log('ssfddg', item.onCount, item.lossCount);
          _this.setData({
            showDeplane: true
          })
          stopReq = true
        }
      })
      console.log('poFinishList', poFinishList);
    }
    if (stopReq) return
    _this.setData({
      ['doneProParam.onFinishImage']: imglist.toString()
    })
    console.log('doneProParam', _this.data.doneProParam);
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    let {
      code,
      data,
      message
    } = await production(_this.data.doneProParam);
    wx.hideLoading()
    if (code == '000000') {
      // wx.setStorageSync('isStartPro', 2)
      if (_this.data.isDetail == 1) {
        wx.switchTab({
          url: '/pages/proList/index'
        })
      } else {
        wx.navigateBack()
      }
    } else if (code == '980003') {
      // 订单已经外发
      wx.showToast({
        title: message,
        icon: "none"
      })
      if (_this.data.isDetail == 1) {
        setTimeout(() => {
          wx.navigateBack({
            delta: 2
          })
        }, 2000)
      }else{
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    } else if(code != "401") {
      wx.showToast({
        title: message,
        icon: "none"
      })
    }
  },
  // 下机提示弹窗关闭
  deplaneClose() {
    let _this = this;
    _this.setData({
      showDeplane: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options1111', options);
    let _this = this;
    if (options) {
      let {
        groupNo,
        mainId,
        poFinishList,
        isDetail,
        nearCount
      } = options
      console.log('poFinishList', poFinishList);
      let poListData = [];
      let poList = [];
      if (poFinishList?.length) {
        poList = JSON.parse(poFinishList)
        poListData = JSON.parse(poFinishList).map(e => {
          return {
            idBwGroupSubject: e.idBwGroupSubject,
            lossCount: e.lossCount,
            onCount: e.onCount
          }
        })
      } else {
        poListData = []
        poList = []
      }
      if (nearCount) {
        nearCount = Number(nearCount.slice(0, 9))
        _this.setData({
          ['doneProParam.onCount']: nearCount
        })
        if (poList.length) {
          poList.forEach(e => {
            e.onCount = Number((nearCount * e.modNum).toString().slice(0, 9))
          })
        }
      }
      _this.setData({
        ['doneProParam.groupNo']: groupNo,
        ['doneProParam.mainId']: mainId,
        ['doneProParam.poFinishList']: poListData,
        poList,
        isDetail
      })
      console.log('poList', _this.data.poList);
    }
    if (wx.getStorageSync('ids')) {
      _this.setData({
        ids: wx.getStorageSync('ids')
      })
      let {
        supplierId,
        deviceId,
        pilotId
      } = _this.data.ids
      _this.setData({
        ['doneProParam.deviceId']: deviceId,
        ['doneProParam.deviceOperatorId']: pilotId
      })
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