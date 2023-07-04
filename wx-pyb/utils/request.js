
var request_url = "https://www.aocai.cn"; 
var OSSFileUrl = 'https://www.aocai.cn/api/consumer/certifyFree/alibaba/oss/viewFile?fileName=' //OSS地址
const BESA_URL = '/api/consumer'


//运行环境，develop：开发环境，trial：体验环境，release: 正式环境。
var environment = {
    // 'develop': "https://www.liaotu.com",
    //'develop': "http://testpyb.vaiwan.com",
    // "develop":"https://www.liaotu.com",
    // "develop":"http://192.168.6.45:9030",
     'develop': "http://192.168.1.222:9001", 
    //  'develop': "http://192.168.8.8:9005", 
  //  'develop': "http://192.168.7.41:9001",
    // 'develop': "https://www.aocai.cn",
    "trial": "https://www.liaotu.com",
    //'trial': "http://testpyb.vaiwan.com",
    "release": "https://www.aocai.cn"
}
const accountInfo = wx.getAccountInfoSync()
// accountInfo.miniProgram.envVersion= 'release'
if (accountInfo) {
    //根据运行环境使用对应后台接口地址
    request_url = environment[accountInfo.miniProgram.envVersion]
}
/** 预览PDF文件的URL */
var previewPdfURLOBJ = {
    'develop': "http://192.168.2.14:8081/dev/h5pyb/previewpdf",
    "trial": "http://lt.xiaocaiyin.com:10002/test/h5pyb/previewPdf",
    "release": "https://qdpyb.aocai.cn/h5pyb/previewPdf"
}
/** PC端打开上传文件URL */
var uploadWebURL = {
    'develop': "http://test.aocai.cn:10002",
    "trial": "http://test.aocai.cn:10002",
    "release": "https://www.aocai.cn"
}
// 拼版-刀模下载地址
var PIN_BAN_URL = { 
    "develop":"http://192.168.1.220/knife/",
    "trial": "http://192.168.1.220/knife/",
    "release": "https://admin.aocai.cn/knife/"
}
/** 首页图片、刀模图片存放的服务地址 */
var imgBaseUrl = { 
    // "develop":"http://192.168.9.2:8049",
    "develop":"https://www.aocai.cn",
    "trial": "https://www.aocai.cn",
    "release": "https://www.aocai.cn"
}
/** 提效工具-下载刀模、3D软打样的web-view服务地址 */
var toolWebView = { 
    "develop":"http://192.168.9.2:8049",
    // "develop":"http://www.aocai.cn",
    "trial": "https://192.168.1.222:8001",
    "release": "https://www.aocai.cn"
}
/** 优惠券 */
var couponUrl = { 
    'develop': "https://www.liaotu.com",
    // 'develop': "http://192.168.8.41:9420",
    // 'develop': "https://www.aocai.cn",
    "trial": "https://www.liaotu.com",
    // 'trial': "http://192.168.8.14:7901",
    //'trial': "http://testpyb.vaiwan.com",
    "release": "https://www.aocai.cn"
}
/** 拼版 算法接口 */
var pinban_single_web = { 
    'develop': "http://zheng.xiaocaiyin.com:10002",
    // 'develop': "http://192.168.8.14:7901",
    // 'develop': "https://www.aocai.cn",
    "trial": "https://www.liaotu.com/pinban",
    // 'trial': "http://192.168.8.14:7901",
    //'trial': "http://testpyb.vaiwan.com",
    "release": "https://www.aocai.cn/pinban"
}
// 订阅消息 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
var subscribeType = { 
    'develop': "developer",
    "trial": "trial",
    "release": "formal"
}


var app
const requesttools = ({ url, method, data, myHeader }) => {
    return new Promise((resolve, reject) => {
        var token = wx.getStorageSync('token');
        //配置header
        var header = {
            "Content-Type": "application/json;charset=UTF-8",
            'sysType': 'pinyiban_wx',
        }
        //看是否需要token
        if (token) {
            header.token = token;
        }
        if (myHeader) {
            for (var key in myHeader) {
                header[key] = myHeader[key]
            }
        }
        if (!app) {
            app = getApp()
        }
        let url2
        // 如果不是拼版或者优惠券接口，则按照默认IP地址，否则根据传入进来的IP地址
        if (url.indexOf("pinban_single_web")==-1 && url.indexOf("ac-inner")==-1) {
            url2 = request_url + BESA_URL + url
        }else{
            url2 = url
        }
        wx.request({
            url: url2,
            data: data,
            header: header,
            method: method,
            success: function (res) {
                if (res.data.message=='token无效'&&url!='/users/user/getDbUserInfo') {
                    wx.showModal({
                        title: '提示',
                        content: '您的登录已失效，请重新登录',
                        success: function (res) {
                            if (res.confirm) {
                                app.globalData.isLogin = false
                                wx.reLaunch({
                                    url: "/pages/login/index"
                                })
                            } else {
                                console.log('点击取消回调')
                            }
                        }
                    })
                }
                resolve(res.data)
            },
            fail: function (res) {
                wx.hideLoading()
                if (!app) {
                    app = getApp()
                }
                if (app.globalData.showModal) {
                    return
                }
                app.globalData.showModal = true
                console.log(res)
                wx.showModal({
                    title: '请求失败',
                    showCancel: false, //隐藏取消按钮
                    content: '网络请求失败，请检查您的网络',
                    success: function (res) {
                        app.globalData.showModal = false
                        if (res.confirm) {
                            console.log('点击确认回调')
                        } else {
                            console.log('点击取消回调')
                        }
                    }
                })
                reject(res)
            },
            complete: function (res) {
                // wx.hideLoading()
                // console.log(res)
            },
        })

    })
}

/** 下载文件 */
export const downloadFile = ({url,fileName,fileType})=>{
    const newPath = `${wx.env.USER_DATA_PATH}/${fileName}`;
    wx.downloadFile({
        url: request_url+url, //仅为示例，并非真实的资源
        filePath: newPath,
        header:{
            token:wx.getStorageSync('token')
          },
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            wx.getSystemInfo({
              success: function (res) {
                if (
                  res.platform !== "android" &&
                  res.platform !== "ios" &&
                  res.platform !== "devtools"
                ) {
                  wx.saveFileToDisk({
                    filePath: newPath,
                    success(res) {
                      console.log(res);
                    },
                    fail(res) {
                      console.error(res);
                    },
                  });
                } else {
                    console.log('openDocument');
                  wx.openDocument({
                    // 打开下载文件
                    filePath: newPath,
                    showMenu: true,
                    fileType: fileType,
                    success: function (res) {},
                  });
                }
              }
            })
    
          }
        },
        complete(res) {
          console.log("dcccxxx", res);
        },
      });
}


module.exports = {
    http: requesttools,
    downloadFile,
    requestUrl: request_url,
    OSSFileUrl,
    PDF_URL: previewPdfURLOBJ[accountInfo.miniProgram.envVersion],
    uploadWebURL: uploadWebURL[accountInfo.miniProgram.envVersion],
    PIN_BAN_URL: PIN_BAN_URL[accountInfo.miniProgram.envVersion],
    IMG_BASE_URL: imgBaseUrl[accountInfo.miniProgram.envVersion],
    TOOL_WEB_VIEW:toolWebView[accountInfo.miniProgram.envVersion],
    COUPON_URL:couponUrl[accountInfo.miniProgram.envVersion],
    PINBAN_SINGLE_WEB:pinban_single_web[accountInfo.miniProgram.envVersion],
    SUBSCRIBE_TYPE: subscribeType[accountInfo.miniProgram.envVersion]
}