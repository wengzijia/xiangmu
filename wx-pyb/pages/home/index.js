//index.js
//获取应用实例
const app = getApp()
import { togetherCreditPurchasePay } from '../../api/credit.js'
import { getCurrentUserInfo, checkToken, updateAccountInfo,getCurrentTimeMillis,rebate,canRebate } from '../../api/userApi.js'
// import {countOrder} from '../../api/orderApi.js'
import {isProxy,formatTime2} from '../../utils/util'
import {IMG_BASE_URL} from '../../utils/request'
Page({

    data: {
        categoryList: ['卡盒'],
        bannerList: [
            { imageUrl: '/static/wxpyb/banner/threedays.gif' },
            // { imageUrl: '/static/wxpyb/banner/0.png' },
            // { imageUrl: '/static/wxpyb/banner/1.png?time=1' },
            // { imageUrl: '/static/wxpyb/banner/2.png' },
            // { imageUrl: '/static/wxpyb/banner/3.png' }
        ], //,{imageUrl:'../../image/home/banner4.jpg',pageUrl:'../draw/index'}
        statusBarHeight: '',
        fontSizeSetting: '',
        myWindowHeight: '',
        myScreenHeight: '',
        boxHeight: 230,
        paddingAll: '',
        modalPadding: '',
        orderCount: 0,
        modal: {
            show: false
        }, 
        info: null,
        nowTime:new Date(),
        isProxy:false,
        dialog:false,
        animationData: {},//初始动画数据
        cat:360/6,
        isAlert:false,
        amount:null,
        overdue:null,
        admin:false,
        imgBaseUrl:IMG_BASE_URL,
        aboutPopup:false,//关于拼一版弹出层
        /**跳转页面数据 */
        cartList:[
            {
                title:'拼版下单',
                styleType:'1',
                list:[{
                    title:'卡纸盒',
                    img:'/static/wxpyb/cart/box0.png',
                    url: '/pages/categoryPages/single/index',
                    reported:{ 
                        "actionId": 1,
                        "channel": 600000,
                    }
                },
                {
                    title:'坑纸内托',
                    img:'/static/wxpyb/cart/box1.png',
                    url: '/pages/categoryPages/singleTab/index',
                    reported:{ 
                        "actionId": 1,
                        "channel": 601000,
                    }
                }
                ]
            },
            {
                title:'专版下单',
                styleType:'1',
                list:[{
                    title:'卡纸盒',
                    img:'/static/wxpyb/cart/box0.png',
                    url: '/pages/categoryPages/exclusive/index',
                    val:'0',
                    reported:{ 
                        "actionId": 1,
                        "channel": 500000,
                    }
                },
                {
                    title:'微坑盒',
                    img:'/static/wxpyb/cart/box2.png',
                    url:'/pages/categoryPages/exclusive/index',
                    val:'1',
                    reported:{ 
                        "actionId": 1,
                        "channel": 501000,
                    }
                },
                {
                    title:'精装盒',
                    img:'/static/wxpyb/cart/box3.png',
                    url:'/pages/categoryPages/exclusive/index',
                    val:'2',
                    reported:{ 
                        "actionId": 1,
                        "channel": 502000,
                    }
                }]
            },
            
            {
                title:'我要买纸',
                styleType:'2',
                list:[{
                    title:'九发纸业',
                    img:'/static/wxpyb/cart/paper1.png',
                    url:'/pages/categoryPages/paperboard/index?paper=0'
                },
                // {
                //     title:'金福纸业',
                //     img:'/static/wxpyb/cart/paper2.png',
                //     url:'/pages/categoryPages/paperboard/index?paper=jinfu'
                // },
                {
                    title:'其他纸业',
                    img:'/static/wxpyb/cart/paper3.png',
                    url:'/pages/categoryPages/paperboard/index?paper=other'
                }]
            },
            {
                title:'提效工具',
                styleType:'1',
                list:[{
                    title:'拼版计价',
                    img:'/static/wxpyb/cart/tool1.png',
                    url:'/pages/patchwork/index'
                },
                {
                    title:'下载刀模',
                    img:'/static/wxpyb/cart/tool2.png',
                    url:'/pages/tool/cutter/index'
                },
                {
                    title:'3D软打样',
                    img:'/static/wxpyb/cart/tool3.png',
                    url:'/pages/tool/three/index'
                }]
            }
            
        ],
        noticePopup: false
    },
    getUserProfile(e) {
        wx.navigateTo({
            url: '../personageCenter/allSingleOrder/share/orderDetails/index',
            complete: () => {
                wx.hideLoading()
            }
        })
    },
    selectCategory: function(event) {
        
        app.globalData.authorization += 1
        if (!app.globalData.isLogin || !this.data.phoneNumber || !this.data.info) {
            let text = ''
            if (app.globalData.authorization == 1) {
                // if (app.globalData.isLogin&&(!this.data.phoneNumber||!this.data.info)) {
                // wx.clearStorage()
                text = '请完善您的登录信息~'
            } else if (!app.globalData.isLogin) {
                // wx.clearStorage()
                text = '您未授权登录，无法访问该页面，请前往授权登录'
            } else if (!this.data.phoneNumber) {
                text = '您未授权手机号，请前往授权'
            } 
            // else if (!this.data.info) {
            //     text = '您未授权微信头像昵称，请前往授权'
            // }
            wx.showModal({
                title: '提示',
                cancelText: '否',
                showCancel: false,
                confirmText: '确定',
                confirmColor: '#ff0036',
                content: text,
                success(res) {
                    if (res.confirm) {
                        wx.showLoading({
                            title: '跳转中',
                            mask: true
                        })
                        wx.navigateTo({
                            url: '../login/index',
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
        // 暂时关闭买纸跳转
        // let newTime = new Date().getTime()
        // let oldTime = new Date('2023-01-06 00:00:00').getTime()
        // let title = event.currentTarget.dataset.title
        // if (title && title.indexOf('纸') != -1 && oldTime < newTime) {
        //   wx.showToast({
        //     icon: 'none',
        //     title: '已暂停接单，年后恢复时间待定'
        //   })
        //   return
        // }
        if (!app.globalData.userInfo && !this.data.info && app.globalData.authorization < 1) {
            app.globalData.authorization = 1
            wx.getUserProfile({
                desc: '将作为个人特色信息展示', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    // console.log('userInfo',res);
                    app.globalData.userInfo = res.userInfo
                    wx.setStorageSync("wxUserInfo", JSON.stringify(res.userInfo))
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                    this.updateUserInfo()
                   
                },
                fail:()=>{
                    wx.setStorageSync("wxUserInfo", JSON.stringify({}))
                },
                complete: () => {
                   this.toPage2(event)
                }
            })
        } else {
           this.toPage2(event)
        }

    },
    toPage2(event){
        let {url,val,reported,type} = event.currentTarget.dataset;
        if(type==='proxy'){
            wx.navigateTo({
                url: '../categoryPages/proxy/index',
                complete: () => {
                    wx.hideLoading()
                }
            })
            return 
        }
        if(reported) app.saveReport(reported);
        if(val){
            wx.setStorageSync('valuation', val)
        }
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
    toPage(event){
        wx.showLoading({
            title: '跳转中',
            mask: true
        })
        switch (event.currentTarget.dataset.type) {
            case 'edition':
                wx.navigateTo({
                    url: '../categoryPages/edition/index',
                    complete: () => {
                        wx.hideLoading()
                    }
                })
                break;
            case 'single':
                wx.navigateTo({
                    url: '../categoryPages/single/index',
                    complete: () => {
                        wx.hideLoading()
                    }
                })
                break;
            case 'proxy':
                wx.navigateTo({
                    url: '../categoryPages/proxy/index',
                    complete: () => {
                        wx.hideLoading()
                    }
                })
                break;
            case 'processe':
                wx.navigateTo({
                    url: '../categoryPages/processe/index',
                    complete: () => {
                        wx.hideLoading()
                    }
                })
                break;
                case 'print':
                  wx.navigateTo({
                    // printUpload
                      url: '../categoryPages/printUpload/index',
                      complete: () => {
                          wx.hideLoading()
                      }
                  })
                  break;
            case 'exclusive':
                wx.setStorageSync('valuation', event.currentTarget.dataset.val)
                wx.navigateTo({
                    url: '../categoryPages/exclusive/index',
                    complete: () => {
                        wx.hideLoading()
                    }
                })
                break;
        
            default:
                wx.navigateTo({
                    url: '../categoryPages/paperboard/index',
                    complete: () => {
                        wx.hideLoading()
                    }
                })
                break;
        }
    },
    /**
     * 计算广告弹出的时间，如果今天已经弹出过了，就不再弹出
     */
    countBannerTime() {
        const bannerTime = ''
        const time = new Date().getTime()
        if (bannerTime) {
            if (time > bannerTime) {
                wx.hideTabBar()
                this.setData({
                    'modal.show': true
                })
                wx.setStorageSync('bannerTime', new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000)
            }
        } else {
            wx.hideTabBar()
            this.setData({
                'modal.show': true
            })
            wx.setStorageSync('bannerTime', new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000)
        }
    },
    onLoad: async function(o) {
      
        if (o&&o.shareDraw) {
            app.globalData.draw = true
        }
        //delete
          //app.globalData.draw = true
        getCurrentTimeMillis().then(res=>{
            if (res.success) {
                this.setData({
                    nowTime:new Date(res.data)
                })
            }
        })
        if (!app.globalData.isLogin && !app.globalData.userInfo) {
            // this.selectCategory()
        }
        if (o.shareMobile) {
            app.globalData.shareMobile = o.shareMobile
            this.setData({
                query: o.shareMobile
            })
        }
        var than = this
        await wx.getSystemInfo({
            success: function(res) {
                let startTime = new Date().getTime()
                let endTime = new Date('2023-02-01 00:00:00').getTime() // 停止弹出时间
                if (startTime < endTime) {
                    than.countBannerTime()
                }
                // console.log(res);
                var len = than.data.categoryList.length
                var boxHeight = (len <= 3 ? 230 : 230 * Math.ceil(len / 2)) / 750 * res.screenWidth
                var h = 450 / 750 * res.windowWidth
                var paddingAll = 150
                if (len < 3) {
                    paddingAll = (res.windowHeight - (800 / 750 * res.windowWidth)) / 2 * 750 / res.windowWidth
                }
                // console.log(len);
                var margingTop = (res.windowHeight - h - boxHeight) / 2
                than.setData({
                    myWindowHeight: res.windowHeight,
                    myScreenHeight: res.screenHeight,
                    statusBarHeight: res.statusBarHeight,
                    fontSizeSetting: res.fontSizeSetting,
                    margingTop: margingTop > 100 ? margingTop : 50,
                    paddingAll: paddingAll,
                    modalPadding: (res.windowHeight - (900 / 750 * res.windowWidth)) / 2
                })
            }
        })
        this.isShowNotice()
    },
    async onShow() {
      let _this = this;
        if (app.globalData.userInfo) {
            this.setData({
                info: app.globalData.userInfo
            })
        } else {
            try {
                var value = wx.getStorageSync('wxUserInfo')
                if (value) {
                    this.setData({
                        info: JSON.parse(value)
                    })
                  
                    app.globalData.userInfo = JSON.parse(value)
                }
            } catch (e) {
                // Do something when catch error
            }
        }
        if (app.globalData.phoneNumber) {
            this.setData({
                phoneNumber: app.globalData.phoneNumber
            })
        } else {
            try {
                var value = wx.getStorageSync('phoneNumber')
                if (value) {
                    this.setData({
                        phoneNumber: value
                    })
                    app.globalData.phoneNumber = value
                }
            } catch (e) {
                // Do something when catch error
            }
        }
        // console.log('show:',);
        if (this.__displayReporter.query.shareMobile) {
            app.globalData.shareMobile = this.__displayReporter.query.shareMobile
            this.setData({
                query: this.__displayReporter.query.shareMobile
            })
        }
        try {
            var token = wx.getStorageSync('token'); //检验token是否过期
            if (token) {
                var res = await checkToken({})
                if (res.success) {
                    app.globalData.isLogin = true
                }
            } else {
                if (app.globalData.authorization == 0 && (!app.globalData.isLogin || !this.data.phoneNumber || !this.data.info)) {
                    // this.selectCategory()
                }
            }
        } catch (error) {
            console.log('errorerror', error);
        }
        if (app.globalData.isLogin && !app.globalData.CurrenUserInfo.qqMobile) {
            try {
                var res = await getCurrentUserInfo(); //获取用户信息
                if (res.success) {
                    if (res.data.pybAdminMobile) {
                        app.globalData.admin = true
                      } else {
                        app.globalData.admin = false
                      }
                     
                    app.globalData.proxy = true
                    app.globalData.CurrenUserInfo = res.data
                    let path = app.globalData.shareObj.path
                    app.globalData.shareObj = { path: path + '?shareMobile=' + res.data.qqMobile, title: "专注服务包装印刷中间商" ,imageUrl: _this.data.imgBaseUrl+'/static/wxpyb/share.png' };
                    this.updateUserInfo()
                }
            } catch (error) {
                console.log('error', error);
            }
        }
        /**
         * 获取未支付订单数量
         */
        // if(app.globalData.isLogin){
        //   countOrder().then(res=>{
        //     console.log(res);
        //   })
        // }
        wx.showShareMenu()
        this.onShareAppMessage = () => ({...app.globalData.shareObj})
         //delete
        // this.onShareAppMessage = ()=>{
        //   return {
        //       title: '测试抽奖',
        //       path: '/pages/home/index?shareDraw=1',
        //   }
        // }
        if (app.globalData.isLogin) {
            try {
                var res = await getCurrentUserInfo(); //获取用户信息
                if (res.success) {
                    app.globalData.proxy = true
                    app.globalData.CurrenUserInfo = res.data
                    this.updateUserInfo()
                } 
                if (res.data.pybAdminMobile) {
                  app.globalData.admin = true
                } else {
                  app.globalData.admin = false
                } 
            } catch (error) {
                console.log('error', error);
            } 
            if (app.globalData.draw && !app.globalData.admin) {
                canRebate({}).then(res=>{
                    if (res.success) {
                        this.setData({
                            dialog:true
                        })
                    }
                })
            }
        }
        this.setData({
            isProxy:isProxy(app.globalData.CurrenUserInfo),
            admin: app.globalData.admin
        })
        if(app.globalData.admin&&this.data.cartList[0]){
            let cartList = this.data.cartList
            if(!cartList[0].list.find(e => e.title==='印刷加工')){
                cartList[0].list.push({
                    title:'印刷加工',
                    img:'/static/wxpyb/cart/i2.png',
                    url: '/pages/categoryPages/printUpload/index',
                })
                this.setData({
                    cartList:cartList
                })
            }
        }
    },
    isShowNotice: function(e) {
      let target = new Date('2023/05/03 00:00:00').getTime() // 停止弹出公告时间
      let current = new Date().getTime()
      if (target > current) {
        this.setData({
          noticePopup: true
        })
      }
    },
    closeNotice: function () {
      this.setData({
        noticePopup: false
      })
    },
    skipPage: function(e) {
        if (e.currentTarget.dataset.val) {
            wx.navigateTo({
                url: '../draw/index'
            })
        }
    },
    startmessage: function(e){
        console.log(e);
    },
    completemessage: function(e){
        console.log(e);
    },
    close: function () {
        this.setData({
            dialog: false
        })
        // //delete
      //this.restore()
        this.setData({
            isAlert: false,
            amount:null
        })
    },
    draw(){
        if (this.data.amount) {
            return
        }
        this.setData({
            amount:true
        })
        rebate({}).then(res=>{
            if (res.success) {
                let num = null
                switch (res.data.amount) {
                    case 25:
                        num = 1
                        break;
                    case 80:
                        num = 2
                        break;
                    case 35:
                        num = 3
                        break;
                    case 50:
                        num = 4
                        break;
                    case 15:
                        num = 5
                        break;
                    case 100:
                        num = 6
                        break;
                    default:
                        num = 0
                        break;
                }
                if (num) {
                    let animation = wx.createAnimation({    //创建动画实例
                        duration: 3000,
                        timingFunction: 'ease'
                    })
                    animation.rotate(360 * 5 - this.data.cat * num).step()
                    this.setData({
                        amount:res.data.amount,
                        animationData:animation.export(),
                        overdue:this.getOverdueTime()
                    })
                    let _this = this
                    setTimeout(()=>{
                        _this.setData({
                            isAlert:true
                        })
                       // _this.restore()
                    },4000)
                }
            }else{
                this.setData({
                    amount:false
                })
            }
        })
    },
    getOverdueTime(){
        let time = new Date(this.data.nowTime.getTime()+1000*60*60*24*7);
        return formatTime2(time)
    },
    /**
     * 转盘归位
     */
    restore: function () {
        let animation = wx.createAnimation({    //创建动画实例
        duration: 10,
        timingFunction: 'step-start'
        })
        animation.rotate(0).step()
        this.setData({
          amount:null,
          animationData: animation.export()//最后根据小程序文档说，这个参数需要export输出。
        })
    },
    //跳转优惠券页面
    goCoupon(){
      wx.navigateTo({
        url: '../personageCenter/coupon/index',
      })
    },
    //修改用户信息
    updateUserInfo(){
      let userInfo1 = JSON.parse(wx.getStorageSync('wxUserInfo'))
      let userInfo2 = app.globalData.CurrenUserInfo
      if(userInfo1.nickName!=userInfo2.wxNickname){
        if(userInfo2.wxNickname){
            if(userInfo1.nickName!='微信用户'){
                updateAccountInfo({
                    wxNickname: userInfo1.nickName, 
                    wxPortrait: userInfo1.avatarUrl,
                    sex:userInfo1.gender
                }).then(res => {})
            }
        }
      }
   
    },
    aboutPopupShow(){
        app.saveReport({
            actionId:1,
            channel: 100000
        })
      this.setData({
        aboutPopup:true
      })
    },
    aboutPopupHide(){
        this.setData({
          aboutPopup:false
        })
      },
})