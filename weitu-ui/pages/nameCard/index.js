// pages/nameCard/index.js
import {
  getPictureUserInfo,
  addConsumerSalesperson,
  getCurrentUserFocusUser,
  getAdministratorInfo,
  getEmployeeInfo,
  releaseFocus,
  addPageView
} from '../../api/user.js'
import {
  staticFileBaseUrl,
  imageBaseUrl
} from '../../utils/request.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl,
    statusBarHeight: '',
    fontSizeSetting: '',
    staticFileBaseUrl,
    boxHeight: '',
    boxLineHeight: '',
    showCardList: false,
    cardList: [{
      name: '王五'
    }],
    cardInfo: {},
    userInfo: {},
    employeeInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let salesperson, recommender, packid;
    console.log('options', options)
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      console.log('scene', scene)
      scene = scene.split('&')
      if (scene.length > 0) {
        scene.forEach(e => {
          let arr = e.split('=')
          if (arr[0] == 'c') {
            recommender = arr[1]
          } else if (arr[0] == 's') {
            salesperson = arr[1]
          } else if (arr[0] == 'r') {
            packid = arr[1]
          }
        })
      }
    } else {
      salesperson = options?.salesperson
      recommender = options?.recommender
      packid = options?.packid
    }
    if (packid) app.globalData.packid = packid
    if (recommender) {
      app.globalData.recommender = recommender
    }
    if (salesperson) {
      app.globalData.salesperson = salesperson
      wx.setStorageSync('selectCardId', salesperson)
    }
    console.log('recommender', recommender)
    console.log('salesperson', salesperson)
    wx.getSystemInfo({
      success: function (res) {
        // console.log('System',res)
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    getPictureUserInfo().then((res) => {
      console.log('res', res)
      if (res.success && res.data) {
        app.globalData.userInfo = res.data
        _this.setData({
          userInfo: res.data
        })
        // if(res.data.roles&&res.data.roles.length>0){
        //     _this.setData({
        //       cardInfo:res.data
        //     })
        //     _this.getEmployeeInfo(res.data.id)
        //     _this.getCurrentUserFocusUser()
        // }else{
          if(app.globalData.salesperson){
            console.log('res',res)
            addConsumerSalesperson({salesperson:app.globalData.salesperson}).then(res=>{
              console.log('res',res)
              app.globalData.salesperson = ''
              _this.getCurrentUserFocusUser()
              
            })
          }else{
            _this.getCurrentUserFocusUser()
            
          }

      }
    })
  },
  getCurrentUserFocusUser() {
    let _this = this;
    getCurrentUserFocusUser().then(res => {
      if (res.success && res.data.length > 0) {
        let selectCardId = wx.getStorageSync('selectCardId')
        let cardInfo = res.data.find((e) => {
          return selectCardId && e.id == selectCardId
        })
        if (!cardInfo) {
          cardInfo = res.data[0]
        }
        _this.setData({
          cardInfo,
          cardList: res.data
        })

        _this.getEmployeeInfo(cardInfo.id)
      } else {
        _this.setData({
          cardInfo: {},
          cardList: [],
          employeeInfo: {}
        })
        // 阻止发送给朋友
        if (JSON.stringify(_this.data.employeeInfo) == '{}') {
          wx.hideShareMenu({})
        }
        app.globalData.employeeInfo = {}
        app.globalData.cardInfo = {}
      }

    })
  },
  getEmployeeInfo(userId) {
    let _this = this;
    wx.setStorageSync('selectCardId', userId)
    getEmployeeInfo({
      userId
    }).then(res => {
      if (res.success) {

        res.data.sellingPointList = res.data.sellingPoint.split(',')
        _this.setData({
          employeeInfo: res.data
        })
        app.globalData.employeeInfo = res.data
        _this.goodsDetails()
        // _this.onShareAppMessage = function(){
        //   return {
        //     title	:'向您推荐微图名片',
        //     path:'/pages/nameCard/index?recommender='+_this.data.userInfo.id+'&salesperson='+userId
        //   }
        // }
        console.log('employeeInfo', _this.data.employeeInfo)
        // 添加名片访客记录
        addPageView({
          userId
        })
      }
    })
  },
  /**
   * 监听用户点击右上角菜单的「转发」按钮时触发的事件
   */
  onShareAppMessage() {
    let _this = this;
    let employeeInfo = this.data.employeeInfo;
    // 设置转发的参数
    return {
      // title: employeeInfo ? `您好，我是${employeeInfo.enterpriseName + employeeInfo.position + employeeInfo.fullname}，这是我的名片……` : "名片"
      title: `您好，我是${employeeInfo.enterpriseName + employeeInfo.position + employeeInfo.fullname}，这是我的名片……`
    }
  },
  /** 打开名片列表选择 */
  showCardListFun() {
    this.setData({
      showCardList: true
    })
  },
  /** 关闭名片列表选择 */
  hideCardList() {
    this.setData({
      showCardList: false
    })
  },
  /** 选择名片 */
  selectCard(e) {
    let _this = this;
    console.log('eee', e)
    let {
      item
    } = e.currentTarget.dataset
    this.getEmployeeInfo(item.id)
    _this.hideCardList()
  },
  /**拨打电话 */
  phoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.cardInfo.mobile //仅为示例，并非真实的电话号码
    })

  },
  /**添加手机通讯录 */
  addPhoneContact() {
    wx.addPhoneContact({
      firstName: this.data.cardInfo.fullname,
      mobilePhoneNumber: this.data.cardInfo.mobile,
      fail() {
        wx.setClipboardData({
          data: this.data.cardInfo.mobile,
          success: function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '手机号已复制',
              icon: 'none'
            })
          }
        })
      }
    })
  },
  /** 加微信好友 */
  addWechatCode() {
    wx.setClipboardData({
      data: this.data.cardInfo.wechatCode,
      success: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '微信号已复制',
          icon: 'none'
        })
      }
    })
  },
  toPage(event) {
    let _this = this;
    let {
      url,
      istabbar
    } = event.currentTarget.dataset;
    if (url) {
      wx.showLoading({
        title: '跳转中',
        mask: true
      })
      console.log('isTabbar', event)
      if (istabbar) {
        wx.switchTab({
          url: url,
          complete: () => {
            wx.hideLoading()
          }
        })
        return
      }
      wx.navigateTo({
        url: url,
        complete: () => {
          wx.hideLoading()
        }
      })
    }

  },


  /** 删除名片 */
  delCard(e) {
    let _this = this;
    let {
      item
    } = e.currentTarget.dataset
    console.log('item', item)
    wx.showModal({
      title: '提示',
      content: '确定要删除' + item.fullname + '的名片信息吗？',
      complete: (res) => {
        if (res.confirm) {
          releaseFocus({
            salespersonId: item.id
          }).then(res => {
            if (res.success) {
              _this.hideCardList()
              _this.getCurrentUserFocusUser()
            }
          })
        }
      }
    })
  },
  /** 跳转包装方案详情页 */
  goodsDetails() {
    if (app.globalData.packid && app.globalData.packid != '') {
      let id = app.globalData.packid
      app.globalData.packid = ''
      wx.navigateTo({
        url: '/pages/shop/goods/index?id=' + id,
      })
    }
  },
})