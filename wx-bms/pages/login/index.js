// pages/login/index.js
import { setWxPhoneLogin, setWxNickname } from "../../api/login";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginCode: '', //登录凭证（code）
    shareType: '', //分享页传入类型
    shareTypeName:'',//判断是否是印刷加工商分享过来的
    isNewUser: false,//判断是否是新用户 false不是新用户
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options", options);
    if (options.isNewUser == "1") {
      this.setData({
        isNewUser: true,
      })
    }
    // 分享页进入标识
    // if (options.type == 'shareOrder') {
    this.setData({
      shareType: options.shareId,
      shareTypeName:options.shareTypeName
    })
    // }
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
    this.wxlogin();
  },
  // 调用接口获取登录凭证（code）
  wxlogin() {
    let _this = this;
    wx.login({
      success(res) {
        if (res.code) {
          _this.setData({
            loginCode: res.code
          });
          console.log("6666loginCode", _this.data.loginCode);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    // let flag = true;
     this.wxlogin()
    // if(flag){
    //   setTimeout(this.wxlogin(), 1000)
    // }
    console.log("555", e);
    console.log("333", e.detail.iv);
    console.log("7777", e.detail.encryptedData);
    // 拒绝后 以未注册的状态进入首页
    if (!e.detail.iv || !e.detail.encryptedData) {
      this.tolook()
    }
    else {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      console.log("登录后的跳转66", this.data.shareType);
      const params = { code: this.data.loginCode, encryptedData: e.detail.encryptedData, iv: e.detail.iv, type: 'bms' };
      setWxPhoneLogin(params).then((result) => {
        console.log('result', result);
        const wx_nickname = result.data.wx_nickname;
        const wx_portrait = result.data.wx_portrait;
        if (result.code == 200) {
          app.globalData.isLogin = true;
          //
          wx.setStorageSync('token', result.data.token)
          // 如果不存在微信昵称和头像，判断为新用户
          if (!wx_nickname || !wx_portrait) {
            this.setData({
              isNewUser: true
            })
            wx.showToast({
              title: '注册成功,请授权微信头像和昵称',
              icon: 'success',
              duration: 1000
            })

          } else {
            this.router(0);//用户登录
            console.log(77777);
          }
          wx.hideLoading();
        }
        else if (result.code == 3001) {
          wx.showToast({
            title: result.msg,
            icon: 'error',
            duration: 1000
          })
        }
      })
    }

  },
  // 跳转到首页
  tolook() {
    wx.showLoading({
      title: '跳转中',
      mask: true
    });
    wx.reLaunch({
      url: '../home/index',
      complete: () => {
        wx.hideLoading()
      }
    })

  },
  //获取用户信息
  getUserInfo: async function (e) {
    let _this = this
    if (!app.globalData.userInfo || !this.data.userInfo) {
      wx.getUserProfile({
        desc: '将作为个人特色信息展示', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          // console.log('userInfo',res);
          // app.globalData.userInfo = res.userInfo;
          // wx.setStorageSync("wxUserInfo", JSON.stringify(res.userInfo))
          const parms = { wx_portrait: res.userInfo.avatarUrl, wx_nickname: res.userInfo.nickName }
          setWxNickname(parms).then((resluts) => {
            console.log("resluts", resluts);
            // app.globalData.userInfo.wx_portrait = res.userInfo.avatarUrl;
            // app.globalData.userInfo.wx_nickname = res.userInfo.nickName;
          })
          // wx.setStorageSync("wxUserInfo", JSON.stringify(app.globalData.userInfo))
        },
        complete: () => {
          // _this.wxlogin();
          this.router(1); //新用户
          // wx.login({
          //   success(res) {
          //     _this.setData({
          //       loginData: res.code
          //     })
          // wx.showLoading({
          //   title: '加载中...',
          //   mask: true
          // });

        }
      })
    }
  },
  /**路由跳转 */
  router(flag) {
    let _this = this
    console.log("登录后的跳转", this.data.shareType);
    // 如果是分享页进入，登录后的跳转
    if (_this.data.shareType) {
      console.log(999999);
      const url  = _this.data.shareTypeName === 'printingModule' ? '/pages/printingModule/bill/shareBill/index?shareId=' : '/pages/bill/shareBill/index?shareId='
      wx.redirectTo({
        url: url +_this.data.shareType
      })
    } else {
      if (flag != 1) {
        wx.showToast({
          title: flag == 1 ? '注册成功' : '登录成功',
          icon: 'success',
          duration: 1000
        })
      }
      this.tolook();
    }
  },
  // 协议跳转
  serviceAgree() {
    wx.navigateTo({
      url: './service/index',
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