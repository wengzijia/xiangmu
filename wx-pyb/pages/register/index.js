//index.js
import {simpleRegistration,mobileExist,sendRegSmsVerifyCode,authorizeLogin,bindPhone} from '../../api/userApi'
//获取应用实例
const app = getApp()
Page({
  data: {
    inputValue: '',
    focus: false,
    state: '',
    btnStr: '获取手机验证码',
    btnBan: true,
    btnBan2: true,
    isNew:false,
    pwdTipRed: '',
    pwdShow: 'ac-icon-eye2',//ac-icon-eye2
    regInfo: {
      "imgVerifyCode": "1",
      "imgVerifyUuid": "1",
      "language": "zh-cn",
      "mobile": "",
      "pwd": "a123456",
      "refereeMobile": "",
      "smsVerifyCode": "",
      "smsVerifyUuid": "",
      "state": ""
    },
    serviceArea:['广州市','佛山市','肇庆市','深圳市','东莞市','惠州市','珠海市','中山市','江门市'],
    modal: {
      show: false,//modal是否显示，默认false
  },
    loginLoading:false,
    city:'',
    status:true
  },
  onLoad:async function (options) {
    // wx.showShareMenu()
    // console.log(options);
    var _this =this;
    if (options.state) {
      this.setData({
        'regInfo.state': options.state
      })
    }
    var uuid = '';
    try {
      uuid = await wx.getStorageSync('uuId')
    } catch (e) {
      // Do something when catch error
    }
    this.setData({
      'regInfo.smsVerifyUuid':uuid
    })
    if(app.globalData.scene){
      this.setData({
        'regInfo.refereeMobile': app.globalData.scene
      })
    }
    try {
      var str = wx.getStorageSync('registerInfo')?wx.getStorageSync('registerInfo'):''
      if(str){
        var obj = JSON.parse(str) 
        this.setData({
          'regInfo.mobile': obj.mobile,
          btnBan:false
        })
        var res = await mobileExist( {
          "language": "zh-cn",
          "mobile": obj.mobile
        })
        if (res.success) {
          var msg = res.data
          _this.setData({
            isNew:true
          })
        }else{
          _this.setData({
            isNew:false
          })
        }
      }
    } catch (error) {

    }
    // this.getLocation()
  },
  // 微信获得经纬度
  // getLocation: function () {
  //   let vm = this;
  //    // 这里写你自己的秘钥
  //   qqmapsdk = new QQMapWX({
  //     key: '3THBZ-2GKL6-A5WSK-MCWC5-SMCEO-AYFYI' //自己的key秘钥 http://lbs.qq.com/console/mykey.html 在这个网址申请
  //   });
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success: function (res) {
  //       console.log("getLocation");
  //       console.log(res)
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       var speed = res.speed
  //       var accuracy = res.accuracy;
  //       vm.getLocal(latitude, longitude)
  //     },
  //     fail: function (res) {
  //       console.log('fail' + JSON.stringify(res))
  //     }
  //   })
  // },
  // // 获取当前地理位置
  // getLocal: function (latitude, longitude) {
  //   let vm = this;
  //   qqmapsdk.reverseGeocoder({
  //     location: {
  //       latitude: latitude,
  //       longitude: longitude
  //     },
  //     success: function (res) {
  //       console.log("getLocal");
  //       console.log(res);
  //       let province = res.result.ad_info.province
  //       let city = res.result.ad_info.city
  //       if (vm.data.serviceArea.indexOf(city)!=-1) {
  //         vm.setData({
  //           btnBan2:false,
  //           city: vm.data.serviceArea.indexOf(city),
  //           status:true
  //         })
  //       }else{
  //         vm.setData({
  //           btnBan2:true,
  //           status:false
  //         })
  //       }
  //       // vm.setData({
  //       //   province: province,
  //       //   city: city,
  //       //   latitude: latitude,
  //       //   longitude: longitude
  //       // })

  //     },
  //     fail: function (res) {
  //       console.log("fail");
  //       console.log(res);
  //     },
  //     complete: function (res) {
  //       // console.log(res);
  //     }
  //   });
  // },
  onShow(){
    if(app.globalData.scene){
      this.setData({
        'regInfo.refereeMobile': app.globalData.scene
      })
    }
  },
  modalFun({contentText,icon,iconSize,image,imageSize,time}){
    var _this = this;
    this.setData({
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
  /**
   * 获取短信验证码
   * @returns 
   */
  getNoteCode: async function () {
    if (!this.data.status) {
      return false
    }
    var _this = this;
    const mobileReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    var mobile = _this.data.regInfo.mobile
    console.log('mobile', mobile);
    //验证手机号
    if (!mobileReg.test(mobile)) {
      this.modalFun({contentText:'手机号格式不正确'})
      return
    }
    var msg;
    try {
    //手机号是否存在
    var res =  await mobileExist( {
        "language": "zh-cn",
        "mobile": mobile,
      })
      if (res.success) {
        _this.setData({
          isNew:true
        })
      }else{
        if(res.code=='920002'){
          msg = res.message
        }
        _this.setData({
          isNew:false
        })
      }
    } catch (error) {
      
    }
    // console.log('msg',msg)
    if(msg){
      _this.modalFun({contentText:msg})
      return
    }
    

    var num = 60
    _this.setData({
      btnBan: true,
      btnStr: num + 's 后重新获取'
    })
    sendRegSmsVerifyCode({
        "imgVerifyCode": '11',
        "imgVerifyUuid": '22',
        "language": "zh-cn",
        "mobile": mobile,
        "sign": null
    }).then(res=>{
      // console.log(res);
      if (res.success) {
        this.modalFun({contentText:'验证码已发送'})
        wx.setStorageSync('uuId', res.data)
        wx.setStorageSync('registerInfo',JSON.stringify({
          mobile,
          isNew:_this.data.isNew
        }))
        _this.setData({
          'regInfo.smsVerifyUuid': res.data
        })
      }
    })

    var time = setInterval(() => {
      num = num - 1
      _this.setData({
        btnStr: num + 's 后重新获取'
      })
      if (num == 0) {
        _this.setData({
          btnBan: false,
          btnStr: '重新获取验证码'
        })
        clearInterval(time)
      }
    }, 1000)
  },
  /**
   * 是否显示密码
   */
  pwdShowFun: function () {
    var _this = this;
    this.setData({
      pwdShow: _this.data.pwdShow == 'ac-icon-eye2' ? 'ac-icon-eye' : 'ac-icon-eye2'
    })
  },
  /**
   * 把输入框的数据放入data里面
   * @param {*} e 
   */
  inputFun: function (e) {
    var value = e.detail.value
    var _this = this;
    if (e.currentTarget.dataset.key == 'regInfo.mobile') {
      const reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
      const reg2 = /后重新获取$/g
      if (reg.test(value)&&!reg2.test(this.data.btnStr)) {
        this.setData({
          btnBan: false
        })
        var str = wx.getStorageSync('registerInfo')
        if(str){
          var obj = JSON.parse(str) 
          if(obj.mobile==value&&obj.isNew){
            _this.setData({
              'isNew':true
            })
          }
        }
      }
    }
    this.setData({ [e.currentTarget.dataset.key]: value })
  },
  /**
   * 校验数据
   */
  parityData() {
    const mobileReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    var regInfo = this.data.regInfo;
    var mobile = regInfo.mobile
    // console.log('mobile', mobile);
    //验证手机号
    if (!mobileReg.test(mobile)) {
      
      this.modalFun({contentText:'手机号格式不正确'})
      return
    }
    var smsVerifyUuid = regInfo.smsVerifyUuid
    if (!smsVerifyUuid || smsVerifyUuid === '') {
     
      this.modalFun({contentText:'请先获取验证码'})
      return
    }
    var smsVerifyCode = regInfo.smsVerifyCode
    if (!smsVerifyCode || smsVerifyCode === '') {
    
      this.modalFun({contentText:'请输入验证码'})
      return
    }

    // var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    // var pwd = regInfo.pwd
    // //如果新用户，校验密码
    // if (this.data.isNew) {
    //   if (!reg.test(pwd)) {
    //     this.setData({
    //       pwdTipRed: 'red'
    //     })
    //     return false
    //   } else {
    //     this.setData({
    //       pwdTipRed: ''
    //     })
    //   }
    // }
    
    // var mobile2 = regInfo.refereeMobile;
    // if (mobile2 !== '' && !mobileReg.test(mobile2)) {
    //
    //   this.modalFun({contentText:'推荐人手机号格式不正确'})
    //   return false
    // }

    return true
  },
  /**
   * 提交
   * @param {*} e 
   */
  submit: async function (e) {
    var _this = this;
    if (_this.data.isNew) {
      var bool = await this.parityData();
      if (bool) {
        if(_this.data.loginLoading) return
        _this.setData({
          loginLoading:true
        })
        // console.log('this.data.regInfo', this.data.regInfo)
        simpleRegistration( this.data.regInfo).then(res =>{
          if (res.success) {
            try {
              wx.setStorageSync('userId', res.data.id)
              wx.removeStorageSync('registerInfo')
            } catch (e) { }
            _this.toLogin()
          }else{
            _this.modalFun({contentText:res.message})
            _this.setData({
              loginLoading:false
            })
          }
        })
      }
    }else{
      _this.toBindPhone()
    }
  },
  toLogin:function(){
    let _this = this
    wx.login({
      success(res) {
        console.log(res);
        if (res.code) {
          authorizeLogin({
              code: res.code,
              "language": "zh-cn"
          }).then(res =>{
            if(res.success){
              if(res.data.token){
                 try {
                  wx.setStorageSync('token', res.data.token)
                  app.globalData.isLogin = true;
                  wx.switchTab({
                    url: '../home/index'
                  })
                  } catch (e) { }
              }else if(res.data.state){
                wx.navigateTo({
                  url: '../register/index?state='+res.data.state
                })
              }else{
                _this.modalFun({contentText:res.message})
              }
             
            }else{
              if(res.message=='账号状态异常'){
                wx.switchTab({
                  url: '../home/index'
                })
              }else{
                _this.modalFun({contentText:res.message})
              }
             
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      complete(){
        _this.setData({
          loginLoading:false
        })
      }
    })
    wx.switchTab({
      url: '../home/index'
    })
  },
  //绑定手机
  toBindPhone:function(){
    var _this = this;
    var regInfo =_this.data.regInfo
    if (!regInfo.mobile) {
      this.modalFun({contentText:'请填写手机号'})
      return false
    }
    if (!(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/.test(regInfo.mobile))) {
      this.modalFun({contentText:'手机号格式不正确'})
      return false
    }
    if (!regInfo.smsVerifyCode) {
      this.modalFun({contentText:'请填写验证码'})
      return false
    }
    wx.showLoading({
      title:'加载中...',
      mask:true
    });
    bindPhone({
      "bindType": "wechat",
      "language": "zh-cn",
      "mobile":regInfo.mobile,
      "smsVerifyCode": regInfo.smsVerifyCode,
      "smsVerifyUuid": regInfo.smsVerifyUuid,
      "state":regInfo.state
    }).then(res =>{
      wx.hideLoading()
      if (res.success) {
        wx.removeStorageSync('registerInfo')
        _this.toLogin()
      }else{
        _this.modalFun({contentText:'绑定失败,请稍后重试'})
      }
    })
  },
  checkProtocol: function () {
    var bool = this.data.btnBan2
    if (!this.data.status) {
      return false
    }
    this.setData({
      btnBan2: !bool
    })
  },
  protocolText:function(){
    wx.navigateTo({url:'./registerProtocol/index'})
  }
})
