// const { json } = require("stream/consumers");
//index.js
import {
  allot,
  getCurrentUserInfo,
  singleWxPayUrl,
  SingcancelOrder,
  getShareOrderDetails
} from "../../../../api/orderApi.js";
import {
  getCurrentTimeMillis,
  generateUrlLink
} from "../../../../api/userApi.js";
import {
  splitStr,
  editVersionType,
  numberFormat
} from '../../../../utils/util'
import {
  data,
  methods
} from '../../../../utils/credit'
//获取应用实例
const app = getApp()
const envVersion = wx.getAccountInfoSync().miniProgram.envVersion

Page({

  /**
   * 页面的初始数据
   */
  ...methods,
  data: {
    ...data,
    creditType: 'supplier',
    creditCallBlack: 'toOrderDetails',
    userInfo: null,
    ordersn: '',
    isShare: false,
    isFromList: false,
    isAdmin: false,
    orderDetail: '',
    show: false,
    time: 30 * 60 * 60 * 1000,
    open: [{
        value: false
      },
      {
        value: false
      },
    ],
    more: false,
    shareURL: '', // 分享链接
    query: null, // 页面请求参数保存
  },
  //转移订单
  Pay(e) {
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask: true
    });
    let uId = wx.getStorageSync('transferUid')
    if (!uId) {
      getCurrentUserInfo().then(re => {
        uId = re.data.id
        allot({
          "orderNo": this.data.ordersn,
          "transferUid": uId
        }).then(res => {
          if (res.success) {
            this.selectCredit(e)
          } else {
            wx.hideLoading();
            wx.showModal({
              title: '订单转移失败',
              showCancel: false, //隐藏取消按钮
              content: '订单转移失败，请联系业务员',
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

        })
      })
    } else {
      allot({
        "orderNo": this.data.ordersn,
        "transferUid": uId
      }).then(res => {
        if (res.success) {
          this.selectCredit(e)
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '订单转移失败',
            showCancel: false, //隐藏取消按钮
            content: '订单转移失败，请联系业务员',
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

      })
    }
  },
  /** 信用支付 */
  selectCredit(e) {
    e.sn = e.currentTarget.dataset.sn
    e.wxPayCallBlack = 'wxPay'
    this.getUserCreditPurchase(e)
  },
  // 微信支付
  wxPay(e) {
    let _this = this
    singleWxPayUrl({
      orderNo: e.currentTarget.dataset.sn,
      payType: app.globalData.payType
    }).then(res => {
      var payBean = JSON.parse(res.data)
      wx.hideLoading();
      wx.requestPayment({
        // 'appId':payBean.appid,
        'timeStamp': payBean.timeStamp, //时间戳
        'nonceStr': payBean.nonceStr, //随机字符串
        'package': payBean.package, //统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
        'signType': payBean.signType, //非必要——签名算法
        'paySign': payBean.paySign, //签名
        'success': function (res) {
          wx.showToast({
            title: '订单支付成功',
            icon: 'success',
            duration: 1500,
            complete() {
              _this.toOrderDetails()
            }
          })

        },
        'fail': function (res) {
          wx.hideLoading()
          wx.showModal({
            title: "提示",
            content: "支付失败",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                _this.toOrderDetails()
              }
            }
          })
        }
      })
    })
  },
  toOrderDetails() {
    wx.redirectTo({
      url: '../orderDetails/index?data=' + this.data.ordersn
    })
  },
  // 获取订单详情
  getOrderDetails() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    getShareOrderDetails({
      orderNo: this.data.ordersn
    }).then(async res => {
      let date
      try {
        date = (await getCurrentTimeMillis()).data
      } catch (error) {
        date = new Date().getTime()
      }
      wx.hideLoading()
      var orderdatarr = res.data
      orderdatarr.children = orderdatarr.children.map(item => {
        // item.paperInfo = intercept(item.goodsAttr)
        item.versionType = editVersionType(item.versionType)
        let a = splitStr(item.goodsAttr, app.globalData.frontPaperMap);
        if (item.priceinfoMap) {
          if (item.priceinfoMap.openSize) {
            item.priceinfoMap.openSize[0] = numberFormat(item.priceinfoMap.openSize[0])
            item.priceinfoMap.openSize[1] = numberFormat(item.priceinfoMap.openSize[1])
          }
          // 去除市场价 减少中台修改 
          if (item.priceinfoMap.paperTonsMaterPriceStr) {
            let strArr = item.priceinfoMap.paperTonsMaterPriceStr.split('/')
            if (strArr.length > 0) {
              item.priceinfoMap.paperTonsMaterPriceStr2 = String(item.priceinfoMap.paperTonsDiscountPrice) + '元/' + strArr[1]
            }
          }
        }
        for (let key of a) {
          if (key[0] == '纸张材质') {
            if (key[1].indexOf('银') != -1 || key[1].indexOf('金') != -1) {
              item.isValue = 'exist'
            } else {
              item.isValue = 'aa'
            }
          }
        }
        if (item.priceinfoMap) {
          if (item.priceinfoMap.greyVersion) {
            item.priceinfoMap.IsOpen = true
            a = splitStr(item.priceinfoMap.competGoodsAttr, app.globalData.frontPaperMap);
            item.priceinfoMap.pinbanObj = {
              facialTissue: JSON.parse(item.priceinfoMap.facialTissue), // 面纸内贴
              facialTissueResp: item.priceinfoMap.facialTissueResp ? JSON.parse(item.priceinfoMap.facialTissueResp) : '',
              greyVersion: JSON.parse(item.priceinfoMap.greyVersion) // 灰板
            }

            for (let i = 0; i < item.priceinfoMap.pinbanObj.greyVersion.length; i++) {
              const el = item.priceinfoMap.pinbanObj.greyVersion[i];
              let ar = el.part.split('_')
              el.title = this.findName(ar)
            }

            for (let i = 0; i < item.priceinfoMap.pinbanObj.facialTissue.length; i++) {
              const el = item.priceinfoMap.pinbanObj.facialTissue[i];
              let ar = el.part.split('_')
              el.title = this.findName(ar)
            }
          } else {
            a = splitStr(item.goodsAttr, app.globalData.frontPaperMap);
            item.priceinfoMap.IsOpen = false
          }
        }
        item.goodsAttr = a
        return item
      })
      let time = res.data.createtime * 1000 + 24 * 60 * 60 * 1000 * 15 - date
      this.setData({
        time: time,
      })
      // }

      this.setData({
        orderDetail: orderdatarr,
        show: true
      })
      wx.hideLoading()

    })
  },
  findName(ar) {
    let arr = [{
        key: "floor",
        val: "地盒"
      }, {
        key: "canopy",
        val: "天盖"
      }, {
        key: "innerFrame",
        val: "内围框"
      }, {
        key: "leather",
        val: "皮壳",
      },
      {
        key: "innerBox",
        val: "内盒",
      }, {
        key: "cabinet",
        val: "柜桶",
      }, {
        key: "drawer",
        val: "抽屉",
      }
    ]
    let str = ''

    for (let i = 0; i < ar.length; i++) {
      const el = ar[i];

      let obj = arr.find(ell => el.indexOf(ell.key) != -1 && el.indexOf('Face') == -1) // Face 内贴
      if (!obj) {
        continue
      }
      if (str.indexOf(obj.val) != -1) {
        str += '1'
        obj.val += '2'
      }
      if (i) {
        str += '/'
      }
      str += obj.val
    }

    return str
  },
  //取消订单
  canel() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    SingcancelOrder({
      orderNo: this.data.ordersn
    }).then(res => {
      if (!res.success) {
        wx.showModal({
          title: '提示',
          content: '订单状态异常'
        })
        return false
      }
      this.getOrderDetails()
      wx.hideLoading()
    })
  },
  // 获取分享页链接
  getShareURL() {
    let str = ''
    if (this.data.query) {
      for (const key in this.data.query) {
        str += key + '=' + this.data.query[key] + '&'
      }
      str = str.slice(0, str.length - 1)
    }
    generateUrlLink({
      env_version: envVersion || 'release', // 正式版为 "release"，体验版为"trial"，开发版为"develop"
      path: 'pages/personageCenter/allSingleOrder/share/index',
      query: str,
    }).then(res => {
      this.setData({
        shareURL: res.data
      })
    })
  },
  copyBtn: function () {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: this.data.shareURL,
      success: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '',
          showCancel: false, //隐藏取消按钮
          content: '复制成功',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    if (!app.globalData.isLogin) {
      wx.showLoading({
        title: '跳转中',
        mask: true
      })
      let str = option.data
      wx.navigateTo({
        url: '../../../login/index?data=' + str + '&type=shareOrder',
        complete: () => {
          wx.hideLoading()
        }
      })
      return false
    }
    this.setData({
      query: option
    })
    if (option.from == 'list') {
      this.setData({
        isFromList: true,
        ordersn: option.data
      })
    } else {
      let obj = JSON.parse(option.data)
      obj.nickName = obj.name || ''
      this.setData({
        userInfo: obj,
        ordersn: obj.sn
      })
    }
    try {
      this.setData({
        xhToken: wx.getStorageSync('token')
      })
    } catch (error) {

    }

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderDetails()
    if (app.globalData.isLogin) {
      getCurrentUserInfo().then(res => {
        if (res.data && res.data.pybAdminMobile) {
          this.setData({
            isAdmin: true,
          })
        } else {
          this.setData({
            isAdmin: false,
          })
        }
        if (res.data && res.data.pybAdminMobile && this.data.isFromList) {
          this.setData({
            isShare: true,
            userInfo: JSON.parse(wx.getStorageSync('wxUserInfo'))
          })
          let userInfo = JSON.parse(wx.getStorageSync('wxUserInfo'))
          this.onShareAppMessage = () => {
            let obj = {
              sn: this.data.ordersn,
              name: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl
            }
            return {
              title: '分享订单',
              path: '/pages/personageCenter/allSingleOrder/share/index?data=' + JSON.stringify(obj),
            }
          }
        } else {
          this.setData({
            isShare: false,
          })
        }
      })
    }
  },
  heid() {
    this.setData({
      isShare: false
    })
    setTimeout(() => {
      wx.redirectTo({
        url: '../index'
      })
    }, 1000)
  },
  textChange(e) {
    let index = Number(e.currentTarget.dataset.index)
    this.setData({
      ['open' + `[${index}].value`]: !this.data.open[index].value
    })
  },
  clickMore() {
    this.setData({
      more: !this.data.more
    })
  }
})