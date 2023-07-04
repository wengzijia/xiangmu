// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  onShow:async function (e) {
    var _this = this
        if (wx.canIUse('getUpdateManager')) {
          const updateManager = wx.getUpdateManager()
          updateManager.onCheckForUpdate(function (res) {
            console.log('onCheckForUpdate====', res)
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
              // console.log('res.hasUpdate====')
              updateManager.onUpdateReady(function () {
                wx.showModal({
                  title: '更新提示',
                  content: '新版本已经上线，是否重启应用？',
                  showCancel:false,
                  success: function (res) {
                    wx.clearStorage()
                    _this.globalData.isLogin = false
                    if (res.confirm) {
                     // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                      updateManager.applyUpdate()
                    }
                  }
                })
              })
              updateManager.onUpdateFailed(function () {
                // 新的版本下载失败
                wx.showModal({
                  title: '已经有新版本了哟~',
                  content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                })
              })
            }
          })
        }
},
  onGotUserInfo: function(cb) {
    console.log(1233);
  },
  globalData: {
   
    // userInfo: {
    //   wx_portrait: null,
    //   wx_portrait: null
    // },//用户信息，头像，昵称
    // phoneNumber: null,//用户手机号
    // isIphoneX: false,
    isLogin: false,//是否登录
    // isProcessor: 1,//是否加工商
  }
})
