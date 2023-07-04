/** 连接后台接口地址 */
var request_url = "https://www.aocai.cn";
const BESA_URL = '/api';
/** 图片URL */
const imageBaseUrl = "https://alifile.xiaocaiyin.com/"
/**
 * 运行环境，develop：开发环境，trial：测试环境，release: 正式环境。
 */
var environment = {
    // 'develop': "http://zmd.xiaocaiyin.com:10002",
    "develop": "http://zmd.xiaocaiyin.com:10002",
    // "develop": "http://192.168.7.17",
    // 'develop': "http://zsl.xiaocaiyin.com:10002",
    // "trial": "http://zsl.xiaocaiyin.com:10002",
    "trial": "http://zmd.xiaocaiyin.com:10002",
    "release": "https://bms.xiaocaiyin.com"
}
const accountInfo = wx.getAccountInfoSync()
console.log('获取当前小程序信息----：',accountInfo.miniProgram)
if (accountInfo) {
    request_url = environment[accountInfo.miniProgram.envVersion]
}
function  errorFun(res) {
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

const requesttools = ({ url, method, data, myHeader }) => {
    // wx.showLoading({
    //     title:'加载中...'
    //   });
    return new Promise((resolve, reject) => {
        // var token = ''
        var token = wx.getStorageSync('token');
        //配置header
        var header = {
            "Content-Type": "application/json;charset=UTF-8",
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
            //url:url.indexOf('/processing/') > -1 || url.indexOf('/getWxUserInfo') >-1 ? request_url + BESA_URL + url : 'http://zmd.xiaocaiyin.com:10002'+ BESA_URL + url,
            url:request_url + BESA_URL + url,
            data: data,
            header: header,
            method: method,
            success: function (res) {
                if(res.statusCode==404){
                  errorFun(res)
                  reject(res)
                }else{
                    if(res.data.code==99999){
                        // if(res.msg==="用户角色已发生改变，请重新登录"){
                        //    全局错误提示
                        try {
                     
                            wx.clearStorageSync()
                            wx.showModal({
                                title: '提示',
                                content: res.data.msg,
                                showCancel: true,
                                success(res) {
                                    if(res.confirm){
                                    wx.reLaunch({
                                        url: '/pages/login/index'
                                    })
                                }
                                }
                            });
                                   
                        } catch (error) {
                            wx.reLaunch({
                                url: '/pages/home/index'
                              })
                        }
                        // }
                        resolve(res.data)
                    }else{
                        resolve(res.data)
                    }
                }
                
            },
            fail: function (res) {
              errorFun(res)
              reject(res)
            },
            complete: function (res) {
                wx.hideLoading()
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