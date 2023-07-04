/** 连接后台接口地址 */
var request_url = "https://kb.aocai.cn";
const BESA_URL = '/api';
/** 图片URL */
const imageBaseUrl = "https://alifile.xiaocaiyin.com/"
/**
 * 运行环境，develop：开发环境，trial：测试环境，release: 正式环境。
 */
var environment = {
  'develop': "http://192.168.1.212:30808",
  "trial": "http://192.168.1.212:30808",
  "release": "https://kb.aocai.cn"
}
const accountInfo = wx.getAccountInfoSync()
console.log('accountInfo', accountInfo.miniProgram.envVersion);
if (accountInfo) {
  request_url = environment[accountInfo.miniProgram.envVersion]
}

function errorFun(res) {
  wx.hideLoading()
  wx.showModal({
    title: '请求失败',
    showCancel: false, //隐藏取消按钮
    content: '网络请求失败，请检查您的网络',
    success: function (res) {
      if (res.confirm) {
        //   wx.hideLoading()
        console.log('点击确认回调')
      } else {
        console.log('点击取消回调')
      }
    }
  })
}
let isShowModal = false
const requesttools = ({
  url,
  method,
  data,
  myHeader
}) => {
  // wx.showLoading({
  //     title:'加载中...'
  //   });
  return new Promise((resolve, reject) => {
    // var token = ''
    var token = wx.getStorageSync('token');
    //配置header
    var header = {
      "Content-Type": "application/json;charset=UTF-8",
      "loginSource": "2" // 来源 1 生产管理平台 2机长看板
    }
    //看是否需要token
    if (token) {
      header.token = token;
    }
    // console.log('token',token);
    if (myHeader) {
      for (var key in myHeader) {
        header[key] = myHeader[key]
      }
    }
    wx.request({
      url: request_url + BESA_URL + url,
      data: data,
      header: header,
      method: method,
      success: function (res) {
        if (res.statusCode == 404) {
          errorFun(res)
          reject(res)
        } else {
          if (res.data.code == '401' || res.data.code == '910040') {
            // if(res.msg==="用户角色已发生改变，请重新登录"){
            //    全局错误提示
            try {
              // wx.clearStorageSync()
              wx.removeStorageSync('token')
              if (res.data.code == '401') {
                wx.setStorageSync('isLogin', 1) // 1 已登录  2 未登录
              }else if(res.data.code == '910040'){
                // 加工商禁用
                wx.setStorageSync('isLogin', 2) // 1 已登录  2 未登录
              }
              if (!isShowModal) {
                isShowModal = true
                wx.showModal({
                  title: '提示',
                  // content: res.data.message||res.data.msg,
                  content: res.data.code == '910040' ? res.data.message : '登录已过期,请重新登录。',
                  showCancel: true,
                  success(res) {
                    isShowModal = false
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '/pages/login/index'
                      })
                    }
                  }
                });
              }


            } catch (error) {
              console.log('error', error);
              wx.removeStorageSync('token')
              wx.reLaunch({
                url: '/pages/login/index'
              })
            }
            // }
            resolve(res.data)
          } else {
            resolve(res.data)
          }
        }

      },
      fail: function (res) {
        errorFun(res)
        reject(res)
      },
      complete: function (res) {
        // wx.hideLoading()
        // console.log(res)
      },
    })

  })
}



module.exports = {
  http: requesttools,
  requestUrl: request_url,
  /** 图片URL */
  imageBaseUrl
}