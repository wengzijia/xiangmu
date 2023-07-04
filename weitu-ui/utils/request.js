/** 连接后台接口地址 */
var request_url = "https://www.aocai.cn";
const BESA_URL = '/api';
/** 图片URL */
const imageBaseUrl = "https://alifile.xiaocaiyin.com/"

/** 项目静态资源文件的baseUrl */
const staticFileBaseUrl = {
    "develop": "http://192.168.9.2:8001",
    "trial": "http://192.168.9.2:8001",
    "release": "https://www.aocai.cn"
}


/**
 * 运行环境，develop：开发环境，trial：测试环境，release: 正式环境。
 */
var environment = {
    // "develop": "http://192.168.7.41:9001",
    // "develop": "https://www.liaotu.com",
     "develop": "http://192.168.1.222:9001",
    "trial": "https://www.liaotu.com",
    "release": "https://www.aocai.cn",
    // "release": "https://www.liaotu.com"
}
const accountInfo = wx.getAccountInfoSync()
console.log('获取当前小程序信息----：', accountInfo.miniProgram)
if (accountInfo) {
    request_url = environment[accountInfo.miniProgram.envVersion]
}
/** web-view服务地址 */
var WEB_VIEW_BASE_URL = {
    "develop": "http://192.168.9.2:8049",
    // "develop":"http://www.aocai.cn",
    "trial": "https://192.168.1.222:8001",
    "release": "https://dingtalk.aocai.cn"
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
            "sysType": "weitu_wx"
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
            url: request_url + BESA_URL + url,
            data: data,
            header: header,
            method: method,
            success: function (res) {
                if (res.statusCode == 404) {
                    errorFun(res)
                    reject(res)
                } else {
                    if (res.data.code == '970005' || res.data.code == "970006" || res.data.code == "970007") {
                        // if(res.msg==="用户角色已发生改变，请重新登录"){
                        //    全局错误提示
                        try {
                            // wx.clearStorageSync()
                            wx.removeStorageSync('token')
                            wx.setStorageSync('isLogin', 1) // 1 已登录  2 未登录
                            wx.showModal({
                                title: '提示',
                                // content: res.data.message||res.data.msg,
                                content: '登录已过期,请重新登录。',
                                // showCancel: false,
                                success(res) {
                                    if (res.confirm) {
                                        wx.reLaunch({
                                            url: '/pages/login/index'
                                        })
                                    }
                                }
                            });

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
    imageBaseUrl,
    staticFileBaseUrl: staticFileBaseUrl[accountInfo.miniProgram.envVersion],
    accountInfo,
    WEB_VIEW_BASE_URL: WEB_VIEW_BASE_URL[accountInfo.miniProgram.envVersion],
}