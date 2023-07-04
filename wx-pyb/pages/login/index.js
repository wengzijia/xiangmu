//index.js
//获取应用实例
import {authorizeLogin,checkToken,decryptPhone,mobileExist,updateAccountInfo,simpleRegistration,getCurrentUserInfo,bindPhone} from '../../api/userApi'
const app = getApp()
Page({

  data: {
    userInfo:null,
    active:1,
    hasUserInfo: false,
    state:'',
    loginLoading:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phone:'',
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
    },
    query:undefined,
    orderSn:'',
    jump:false,
    registerState:'',
    register:false,
    loginData:null,
    res:null,
    btnBan:true,
    status:true,
    hide:false,
    loginType:'',
    shareStr:'',
    type:'',
    refereeMobile:'',//业务员手机号
    cid:'',//渠道id
    nid:'',//业务员id
    refereeInfo:{}
  },
  modalFun({contentText,icon,iconSize,image,imageSize,time}){
    var _this = this;
    _this.setData({
      modal: {
        show: true,
        contentText,icon,iconSize,image,imageSize
      }
    })
    setTimeout(() => {
      _this.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
    }) }, time?time:2000);
  },
  onLoad: function (e) {
    // let scene = e.scene
    let scene = decodeURIComponent(e.scene)
    if (scene) {
      scene.split('&').forEach(e =>{
        let arr = e.split('=')
        if(arr[1]&&arr[1]!='null'){
          this.setData({
            [arr[0]]:arr[1]
          })
        }
      })
      console.log(this.data)
   
    }
    if (e.type=='shareOrder'||e.type=='shareOrder2'||e.type=='shareOrder3'||e.type=='shareOrder4'||e.type=='shareOrder6') {
      console.log(64,e);
      this.setData({
        loginType:e.type,
        shareStr:e.data
      })
    }else if(e.type=='settlement') {
      let obj = JSON.parse(e.data)
      this.setData({
        loginType:e.type,
        orderSn:obj.ordersn,
        type:obj.type
      })
    } else if (e.type == 'subscribe') {
      this.setData({
        loginType: e.type,
        orderSn: e.data,
        type: e.type
      })
    }
    let _this = this
    if (e.userCenter) {
      this.setData({
        hide:true
      })
    }
    //读取本地存储用户信息
    try {
      var value = wx.getStorageSync('wxUserInfo')
      if (value) {
        // Do something with return value
        _this.setData({
          userInfo:JSON.parse(value)
        })
        app.globalData.userInfo = JSON.parse(value)
      }
    } catch (e) {
      // Do something when catch error
    }
    //读取本地存储用户手机号
    try {
      var value = wx.getStorageSync('phoneNumber')
      if (value) {
        this.setData({
          phoneNumber:value
        })
        app.globalData.phoneNumber = value
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  onShow(e){
    let _this = this
    // if (app.globalData.userInfo&&/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(app.globalData.phoneNumber)) {
    //   wx.login({
    //     success(res){
    //       _this.setData({
    //         hide:true,
    //         btnBan:false,
    //         loginData:res.code
    //       })
    //       _this.verification()
    //     },
    //   })
    // }else
    //如果有用户信息，尝试登录 
    if (this.data.userInfo||this.data.active!=1) {
      _this.setData({
        hide:true
      })
      wx.login({
        success(res){
          _this.setData({
            loginData:res.code
          })
          wx.showLoading({
            title: '加载中...',
            mask: true
          });
          _this.toLogin()
          _this.setData({
            active:2
          })
        },
      })
    }
    
  },
  //获取用户信息
   getUserInfo:async function(e){
    let _this = this
    if (!app.globalData.userInfo||!this.data.userInfo) {
      wx.getUserProfile({
        desc: '将作为个人特色信息展示', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          // console.log('userInfo',res);
          app.globalData.userInfo = res.userInfo
          wx.setStorageSync("wxUserInfo",JSON.stringify(res.userInfo))
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            hide:true
          })
          
        },
        fail:()=>{
          wx.setStorageSync("wxUserInfo", JSON.stringify({}))
       },
        complete:(userInfo)=>{
          wx.login({
            success(res){
              _this.setData({
                loginData:res.code
              })
              // if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(app.globalData.phoneNumber)) {
              //   _this.verification()
              // }
              wx.showLoading({
                title: '加载中...',
                mask: true
              });
              _this.toLogin()
              
          // updateAccountInfo({
          //   wxNickname:res.userInfo.nickName,
          //   wxPortrait:res.userInfo.avatarUrl,
          //   sex:res.userInfo.gender
          // }).then(res=>{})
              _this.setData({
                active:2
              })
            },
          })
        }
      })
    }
  },
  //登录
  verification:function(){
    if (app.globalData.isLogin) {
      return
    }
    wx.showLoading({
      title: '登录中...',
      mask: true
    });
    this.setData({
      loginLoading:true
    })
    this.toLogin()
  },
    //授权手机号
  getPhoneNumber (e) {
    let _this = this
    if (!e.detail.iv) {
      wx.switchTab({
        url: '../home/index'
      })
    }
    if (!e.detail.encryptedData) {
      _this.toHome()
      return false
    }
    _this.setData({
      loginLoading:true
    })
    // console.log(e);
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
    //解析手机号
    decryptPhone({
      encryptedData:e.detail.encryptedData,
      iv:e.detail.iv,
      key:_this.data.registerState
    }).then(res=>{
      _this.setData({
        loginLoading:false
      })
      // _this.verification(res.data.phoneNumber)
      if (res.success) {
        wx.setStorageSync('phoneNumber',res.data.phoneNumber)
        app.globalData.phoneNumber = res.data.phoneNumber
        if (_this.data.register) {
          //注册
          mobileExist( {
            "language": "zh-cn",
            "mobile": res.data.phoneNumber
          }).then(Mres=>{
            if (Mres.success) {
              _this.setData({
                registerState:_this.data.res.data.state,
                register:true
              })
              
              let regInfo = {
                "imgVerifyCode": "1",
                "imgVerifyUuid": "1",
                "language": "zh-cn",
                "mobile":res.data.phoneNumber,
                "pwd": "a123456",
                "refereeMobile":  this.data.refereeMobile||"",
                "nid":  this.data.nid||"",
                "channelId":  this.data.cid||"",
                "smsVerifyCode": "111111",
                "smsVerifyUuid": "123456",
                "state": this.data.registerState
              }
              //注册新用户
              simpleRegistration( regInfo ).then(resb =>{
                if (resb.success) {
                  if(resb.data.token){
                    try {
                    wx.setStorageSync('token', resb.data.token)
                    app.globalData.isLogin = true
                    _this.router(1)
                    // if (_this.data.loginType=='shareOrder') {
                    //   wx.redirectTo({
                    //     url:'../personageCenter/allSingleOrder/share/index?data='+_this.data.shareStr+'&from=login'
                    //   })
                    // }else if(_this.data.loginType=='settlement'){
                    //   wx.redirectTo({
                    //     url:'../personageCenter/allSingleOrder/orderDetails/index?data='+_this.data.orderSn+'&type='+_this.data.type
                    //   })
                    // }else{
                    //   wx.showToast({
                    //     title: '注册成功',
                    //     icon: 'success',
                    //     duration: 1000
                    //   })
                    //   setTimeout(()=>{
                    //     wx.switchTab({
                    //       url: '../home/index'
                    //     })
                    //   },1000)
                      
                    // }
                    } catch (e) { }
                  }
                }else{
                  _this.modalFun({contentText:resb.message})
                  _this.setData({
                    loginLoading:false
                  })
                }
              })
            }else{
              // //qq小程序用户操作
              // wx.showToast({
              //   title: '该账号已注册',
              //   icon: 'error',
              //   duration: 2000
              // })
               //绑定手机号
              bindPhone({
                "bindType": "wechat",
                "language": "zh-cn",
                "mobile":res.data.phoneNumber,
                "smsVerifyCode": 111111,
                "smsVerifyUuid": 123456,
                "state":this.data.registerState
              }).then(re=>{
                if (re.success) {
                  if (re.data) {
                    try {
                      wx.setStorageSync('token', re.data)
                      app.globalData.isLogin = true
                      _this.router(0)
                    } catch (e) { }
                  }
                }
              })
            }
          })
        }else{
          //绑定手机号
          bindPhone({
            "bindType": "wechatOnMobile",
            "language": "zh-cn",
            "mobile":res.data.phoneNumber,
            "smsVerifyCode": 111111,
            "smsVerifyUuid": 123456,
            "state":this.data.registerState
          }).then(re=>{
            if (re.success) {
              if (re.data) {
                try {
                  wx.setStorageSync('token', re.data)
                  app.globalData.isLogin = true
                  _this.router(0)
                  // if (_this.data.loginType=='shareOrder') {
                  //   wx.redirectTo({
                  //     url:'../personageCenter/allSingleOrder/share/index?data='+_this.data.shareStr+'&from=login'
                  //   })
                  // }else if(_this.data.loginType=='settlement'){
                  //   wx.redirectTo({
                  //     url:'../personageCenter/allSingleOrder/orderDetails/index?data='+_this.data.orderSn+'&type='+_this.data.type
                  //   })
                  // }else{
                  //   wx.showToast({
                  //     title: '登录成功',
                  //     icon: 'success',
                  //     duration: 1000
                  //   })
                  //   setTimeout(()=>{
                  //     wx.switchTab({
                  //       url: '../home/index'
                  //     })
                  //   },1000)
                    
                  // }
                } catch (e) { }
              }
            }
          })
        }
      }else{
        wx.showModal({
          title: '请求失败',
          showCancel:false,//隐藏取消按钮
          content: '网络请求失败，请检查您的网络',
          success: function (res) {
            if (res.confirm) {  
              //   wx.hideLoading()
              // console.log('点击确认回调')
            } else {   
              // console.log('点击取消回调')
            }
          }
        })
      }
    })
  },
  //登录
  toLogin:function(){
    let _this = this
    authorizeLogin({code: _this.data.loginData}).then(resp=>{
      if (!resp.success) {
        wx.showModal({
          title: '登录失败',
          showCancel:false,//隐藏取消按钮
          content: resp.message,
          success: function (res) {
            if (res.confirm) {  
              //   wx.hideLoading()
              // console.log('点击确认回调')
            } else {   
              // console.log('点击取消回调')
            }
          }
        })
      }
      wx.hideLoading();
      if (resp.data.token) {
        wx.setStorageSync('token', resp.data.token)
        //有token获取用户信息
        getCurrentUserInfo().then(item=>{
          _this.setData({
            loginLoading:false
          })
          if (item.data?.qqMobile) {
            wx.setStorageSync('phoneNumber',item.data.qqMobile)
            wx.setStorageSync('transferUid',item.data.id)
            app.globalData.phoneNumber = item.data.qqMobile
            //有手机号登录
            try {
              app.globalData.isLogin = true
              _this.router(0)
              // if (_this.data.loginType=='shareOrder') {
              //   wx.redirectTo({
              //     url:'../personageCenter/allSingleOrder/share/index?data='+_this.data.shareStr+'&from=login'
              //   })
              // }else if(_this.data.loginType=='settlement'){
              //   wx.redirectTo({
              //     url:'../personageCenter/allSingleOrder/orderDetails/index?data='+_this.data.orderSn+'&type='+_this.data.type
              //   })
              // }else{
              //   wx.showToast({
              //     title: '登录成功',
              //     icon: 'success',
              //     duration: 1000
              //   })
              //   setTimeout(()=>{
              //     wx.switchTab({
              //       url: '../home/index'
              //     })
              //   },1000)
                
              // }
              } catch (e) { }
          }else{
            _this.setData({
              hide:false
            })
            wx.removeStorageSync('token')
            //无手机号 获取手机号 绑定手机号流程
            _this.setData({
              registerState:resp.data.state,
              register:false,
              res:resp,
              active:2
            })
          }
        })
      }else if(resp.data&&resp.data.state){
        //无token 获取手机号 注册
        _this.setData({
          hide:false,
          registerState:resp.data.state,
          register:true,
          res:resp
        })
      }
    }).catch(err=>{
      _this.setData({
        loginLoading:false
      })
      wx.showModal({
        title: '登录失败',
        showCancel:false,//隐藏取消按钮
        content: '网络异常，请稍后重试',
        success: function (res) {
          if (res.confirm) {  
            //   wx.hideLoading()
            // console.log('点击确认回调')
          } else {   
            // console.log('点击取消回调')
          }
        }
      })
      wx.hideLoading();
    })
  },
  /**路由跳转 */
  router(flag){
    let _this = this
    if (_this.data.loginType=='shareOrder') {
      wx.redirectTo({
        url:'../personageCenter/allSingleOrder/share/index?data='+_this.data.shareStr+'&from=login'
      })
    }else if (_this.data.loginType=='shareOrder2') {
      wx.redirectTo({
        url:'../personageCenter/allProcessOrder/share/index?data='+_this.data.shareStr+'&from=login'
      })
    }else if (_this.data.loginType=='shareOrder3') {
      wx.redirectTo({
        url:'../personageCenter/allPrintingOrder/share/index?data='+_this.data.shareStr+'&from=login'
      })
    }else if (_this.data.loginType=='shareOrder4') {
      wx.redirectTo({
        url:'../personageCenter/allPrintingOrder/share/orderDetails/index?data='+_this.data.shareStr+'&from=login'
      })
    }else if (_this.data.loginType=='shareOrder5') {
      wx.redirectTo({
        url:'../personageCenter/allPrintingOrder/orderDetails/index?data='+_this.data.shareStr+'&from=login'
      })
    }else if (_this.data.loginType=='shareOrder6') {
      wx.redirectTo({
        url:'/pages/personageCenter/allPrintingOrder/share/checkFile/index?data='+_this.data.shareStr+'&from=login'
      })
    }else if(_this.data.loginType=='settlement'){
      wx.redirectTo({
        url:'../personageCenter/allSingleOrder/share/orderDetails/index?data='+JSON.stringify({ordersn:_this.data.orderSn})+'&type='+_this.data.type+'&from=login'
      })
    }else if(_this.data.loginType=='subscribe'){
      wx.redirectTo({
        url:'../personageCenter/allSingleOrder/orderDetails/index?data='+_this.data.orderSn+'&type='+_this.data.type+'&from=login'
      })
    }else{
      wx.showToast({
        title: flag==1?'注册成功':'登录成功',
        icon: 'success',
        mask:true,
        duration: 1000
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../home/index'
        })
      },1000)
      
    }
  },
  toHome:function(){
    wx.switchTab({
      url: '../home/index'
    })
  },
  checkProtocol: function () {
    var bool = this.data.btnBan
    if (!this.data.status) {
      return false
    }
    this.setData({
      btnBan: !bool
    })
  },
  protocolText:function(){
    wx.navigateTo({url:'./registerProtocol/index'})
  },

})
