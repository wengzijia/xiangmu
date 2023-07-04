// pages/login/index.js
import {
  getCode,
  smsLogin,
  loginOkUserRoleAuthList,
  validDeviceStatus
} from "../../api/login"
import {
  punchClock
} from "../../api/device"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: "", // 手机号
    codeTime: "", // 用来清除验证码定时器
    showCode: true, // 是否显示获取验证码
    code: "", // 验证码
    isFabricators: false, // 是否加工商
    ids: "", // 相关id
    isOnDuty: 1 // 是否上班   1 上班 2 下班 
  },
  // 先去看看
  look() {
    wx.switchTab({
      url: '/pages/current/index',
    })
  },
  // 获取输入框值
  getInputVal(e) {
    console.log(e);
    let _this = this;
    let {
      value
    } = e.detail
    let {
      type
    } = e.currentTarget.dataset
    // 0 手机号  1 密码
    if (type == 0) {
      _this.setData({
        phoneNumber: value
      })
    } else if (type == 1) {
      _this.setData({
        code: value
      })
    }
  },
  // 校验手机号
  checkPhone() {
    let _this = this;
    // 手机号
    let phoneNumber = _this.data.phoneNumber;
    if (!phoneNumber) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }
    // 手机号正则
    let phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false
    }
    return true
  },
  // 获取验证码
  sendCode() {
    let _this = this;
    if (!_this.checkPhone()) return;
    let num = 60;
    // 参数
    let param = {
      language: "zh-cn",
      mobile: _this.data.phoneNumber
    }
    wx.showLoading({
      title: '获取中...',
      mask: true
    })
    getCode(param).then((res) => {
      wx.hideLoading()
      let {
        code,
        data,
        message
      } = res
      console.log('ss', code, message);
      if (code == '000000') {
        wx.setStorageSync('uuid', data)
        wx.showToast({
          title: message,
          icon: "none"
        })
        _this.setData({
          isFabricators: true
        })
        let codeTime = _this.data.codeTime;
        codeTime = setInterval(function () {
          num--
          if (num > 0) {
            _this.setData({
              countDown: num + 's',
              showCode: false
            })
          } else {
            clearInterval(codeTime)
            _this.setData({
              countDown: "",
              showCode: true,
            })
          }
        }, 1000)
      } else {
        wx.showToast({
          title: message,
          icon: "none"
        })
      }
    }).catch(err => {
      console.log('err', err)
      wx.hideLoading()
    })
  },

  // 登录
  async login() {
    let _this = this;
    let ids = _this.data.ids
    if (!_this.checkPhone()) return;
    // 验证码
    if (!_this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '登录中...',
      mask:true
    })
    let param = {
      language: "zh-cn",
      mobile: _this.data.phoneNumber,
      uuid: wx.getStorageSync('uuid'),
      verificationCode: _this.data.code
    }
    let {
      code,
      data,
      message
    } = await smsLogin(param);
    if (code == '000000') {
      // wx.showToast({
      //   title: message,
      //   icon: "none"
      // })
      wx.setStorageSync('token', data)
      await loginOkUserRoleAuthList().then(res => {
        console.log('res', res);
        if (res.code == '000000') {
          let userOrgList = res.data?.userOrgList.filter(item=>item.orgCode == 'manufacturer' && item.hasBoss);
          console.log('userOrgList',userOrgList);
          wx.setStorageSync('supplierId', userOrgList[0].orgId)
          // wx.hideLoading()
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
            duration:3000
          })
          // wx.hideLoading()
          return
        }
      })
      // isLogin  1 已登录   2 未登录
      wx.setStorageSync('isLogin', 1)
      // 判断是否正常下班
      if (wx.getStorageSync('isOnDuty') == 1) {
        let result = await validDeviceStatus(ids.deviceId);
        // 表示token过期且有机器未下班
        if (result.code == '000000') {
          wx.switchTab({
            url: '/pages/current/index',
          })
          return
        }
        // token过期 设备停用且未进行下班,需要自动下班(下次设备启用才能选择)
        if (result.code == '990003') {
          let param = {
            deviceId: ids.deviceId,
            deviceOperatorId: ids.pilotId,
            punchType: 1 // 打卡类型：0 上班 1 下班
          }
          let data = await punchClock(param);
          if (data.code == '000000') {
            wx.setStorageSync('isOnDuty', 1)
            // 加工商禁用需要移除
            wx.removeStorageSync('ids')
          } else {
            wx.showToast({
              title: data.message,
              icon: "none",
              duration:3000
            })
            return
          }
        }
      }
      wx.navigateTo({
        url: `/pages/device/index`
      })
    } else {
      wx.showToast({
        title: message,
        icon: "none",
        duration:3000
      })
      // wx.hideLoading()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // wx.removeStorageSync('token')
    wx.setStorageSync('isLogin', 2)
    _this.setData({
      ids: wx.getStorageSync('ids')
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