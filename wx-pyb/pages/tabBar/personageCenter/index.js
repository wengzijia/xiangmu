//index.js
import { getCurrentUserInfo } from "../../../api/orderApi.js";
import { getByUid,getUserCreditPurchaseDetail, gainActivities} from "../../../api/userApi.js";
import { copyQQ, isProxy } from '../../../utils/util'
import Toast from '@vant/weapp/toast/toast';

//获取应用实例
const app = getApp()

Page({

  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    statusBarHeight: '',
    fontSizeSetting: '',
    screenWidth: '',
    boxHeight: '',
    boxLineHeight: '',
    recommendType: false,
    modal: {
      show: false,//modal是否显示，默认false
      contentText: '',
      icon: '',
      iconSize: '',
      image: '',
      imageSize: ''
    },
    navList: [
      {
        title: '待付款',
        url: {
          path: 'allSingleOrder/index',
          type: '1',
          report:'{"actionId": 4,"channel":700000}'
        },
        imageUrl: '../../../image/Frame.png'
      },
      {
        title: '待确认',
        url: {
          path: 'allSingleOrder/index',
          type: '2',
          report:'{"actionId": 4,"channel":700000}'
       
        },
        imageUrl: '../../../image/Frame-1.png'
      },
      {
        title: '待发货',
        url: {
          path: 'allSingleOrder/index',
          type: '5',
          report:'{"actionId": 5,"channel":700000}'
        },
        imageUrl: '../../../image/Frame-2.png'
      },
      {
        title: '已发货',
        url: {
          path: 'allSingleOrder/index',
          type: '3',
          report:'{"actionId": 6,"channel":700000}'
        },
        imageUrl: '../../../image/Frame-3.png'
      }
    ],
    isProxy: false,
    credit:false,
    isShowActivities: false
  },
  modalFun({ contentText, icon, iconSize, image, imageSize, time }) {
    var than = this;
    this.setData({
      modal: {
        show: true,
        contentText, icon, iconSize, image, imageSize
      }
    })
    setTimeout(() => {
      than.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
      })
    }, time ? time : 2000);
  },
  myNavigateTo: function (e) {
    console.log('isLogin', e);
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '提示',
        cancelText: '否',
        confirmText: '是',
        confirmColor: '#ff0036',
        content: '您未授权登录，无法访问该页面，是否前往授权登录',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '跳转中', mask: true
            })
            let url = '../../login/index'
            if (app.globalData.userInfo && app.globalData.phoneNumber) {
              url = '../../login/index?userCenter=1'
            }
            wx.navigateTo({
              url: url,
              complete: () => {
                wx.hideLoading()
              }
            })
          } else if (res.cancel) {

          }
        }
      })
      return
    }
    // if (this.data.hasUserInfo) {
    // if (true) {
      let {report,url,type,order} = e.currentTarget.dataset;
      if(report) app.saveReport(JSON.parse(report));
      if (type) {
        wx.navigateTo({ url: '../../personageCenter/' +url + '?type=' + type + '&orderType=' + order })
      } else {
        wx.navigateTo({ url: '../../personageCenter/' + url })
      }
    // } else {
    //   this.alert()
    // }
  },
  onLoad: function () {
    var than = this;
    wx.showShareMenu()
    console.log('app', app.globalData)
    
    wx.getSystemInfo({
      success: function (res) {
        // console.log('System',res)
        than.setData({
          statusBarHeight: res.statusBarHeight,
          fontSizeSetting: res.fontSizeSetting,
          boxHeight: (500 / 750 * res.screenWidth) - (res.statusBarHeight * 1.4 + res.fontSizeSetting + res.statusBarHeight / 2),
          boxLineHeight: 130 / 750 * res.screenWidth
        })
      }
    })
    gainActivities().then(res => {
      if(!res.success) {
        Toast.fail(res.message)
        return
      }
      if (!res.data) {
        return
      }
      if (res.data?.status == 1) {
        this.setData({
          isShowActivities: true
        })
      }else {
        this.setData({
          isShowActivities: false
        })
      }
    })
  },
  onShow: function () {
    // console.log('onShow');
    
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
    let userInfo =  app.globalData.userInfo;
    /** 未授权或者授权的微信名为微信用户时用拼一版头像 */
    if(!app.globalData.userInfo.nickName||app.globalData.userInfo.nickName=='微信用户'){
      userInfo = {avatarUrl:'../../../image/user.png',nickName:'微信用户'}
    }
    this.setData({
      userInfo: app.globalData.userInfo?.nickName?app.globalData.userInfo:{avatarUrl:'../../../image/user.png',nickName:'微信用户'},
      hasUserInfo: app.globalData.isLogin
    })
  
    if (!app.globalData.isLogin) {
      return false
    }
    // 判断代理人身份
    

    getCurrentUserInfo().then(res => {
      if (res.data.pybAdminMobile) {
        app.globalData.admin = true
      } else {
        app.globalData.admin = false
      }
      this.setData({
        admin: app.globalData.admin
    });
      app.globalData.CurrenUserInfo = res.data
      if (isProxy(app.globalData.CurrenUserInfo)) {
        this.setData({
          isProxy: true,
          navList: [
            {
              title:'全部订单',
              url:{
                path:'newOrder/index',
                type:'0'
              },
              imageUrl: '../../../image/personage1.png'
            },
            {
              title:'待付预付款',
              url:{
                path:'newOrder/index',
                type:'1'
              },
              imageUrl: '../../../image/Frame-2.png'
            },
            {
              title:'已付预付款',
              url:{
                path:'newOrder/index',
                type:'2'
              },
              imageUrl: '../../../image/Frame-3.png'
            },
            {
              title:'尾款',
              url:{
                path:'newOrder/index',
                type:'5'
              },
              imageUrl: '../../../image/Frame.png'
            }
          ]
        })
      }
    })

    getByUid().then(res => {
      //2审核未通过，1正常，0审核中
      if (res.data == null) {
        this.setData({
          recommendType: false,
          recommendStatus: 3
        })
      } else {
        if (res.data.status == 1) {
          this.setData({
            recommendType: true
          })
        } else if (res.data.status == 0) {
          this.setData({
            recommendType: false,
            recommendStatus: 0
          })
        } else {
          this.setData({
            recommendType: false,
            recommendStatus: 2
          })
        }
      }
      // if (!res.success) {
      //   this.setData({
      //     hasUserInfo: false
      //   })
      // }
    }),
    //查询用户信用额度
    getUserCreditPurchaseDetail().then(res=>{
      if (res.success){
        if (res.data && Object.keys(res.data).length > 0){
          app.globalData.credit = res.data
          this.setData({
            credit:true
          })
        }else{
          app.globalData.credit = null
          this.setData({
            credit:false
          })
        }
      }else{
        app.globalData.credit = null
        this.setData({
          credit:false
        })
      }
    })
    app.saveReport({
      "actionId": 1,
      "channel":700000
    })
  },
  copyQQ: function () {
    let than = this;
    copyQQ(app, than.modalFun)
  },
  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  alert: function () {
    wx.showModal({
      title: '未登录',
      showCancel: true,//隐藏取消按钮
      content: '您还未登录，请登录',
      success: function (res) {
        if (res.confirm) {
          console.log('8888');
          wx.navigateTo({
            url: '../../login/index?userCenter=1',
          })
        } else {
          console.log('点击取消回调')
        }
      }
    })
  }
})
