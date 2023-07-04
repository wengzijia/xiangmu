//index.js
import { ordersDetails, WxPayUrl, editionFiles, cancelOrder, del, deleteOrder, DiffOrderPayUrl, getWxMinOrderOutTime, createOrderRefund } from "../../../../api/orderApi.js";
import { sgetByUid } from "../../../../api/userApi.js";
import util, { copyQQ, splitStr, editVersionType, numberFormat, isIndexOf } from '../../../../utils/util.js'
import { PDF_URL, uploadWebURL } from '../../../../utils/request';
import Toast from '@vant/weapp/toast/toast'
import { data, methods } from '../../../../utils/credit'
//获取应用实例 
const app = getApp()
Page({

  data: {
    ...data,
    creditType: 'supplier',
    creditCallBlack: 'getOrderDetails',//信用支付回调函数名称
    isSend: false,
    nowTime: new Date().getTime() / 1000,
    xh: false,
    xhToken: wx.getStorageSync('token'),
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHiddenMsg: false,
    announcementText: "",
    orderDetail: '',
    path: '',
    customerFile: '',
    isBind: false,
    ordersn: '',
    buttonStatu: '',
    mobile: '',
    orderstate: '',
    factoryName: '',
    createtime: '',
    source: '',
    cprice: 0,
    originalPrice: 0,
    goodFileId: '',
    uploadStatus: false,
    modal: {
      show: false, //modal是否显示，默认false
      contentText: '',
      icon: '',
      iconSize: '',
      image: '',
      imageSize: ''
    },
    admin: false,
    type: '',
    math: null,
    PDF_URL,
    uploadWebURL,
    lift: false, //自提
    imgBaseUrl: 'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/',
    fileConfirmText: '查看分层文件',
    suborderDiscountDetail: {}
  },
  TimeID: -1,
  ...methods,
  onLoad: function (option) {
    console.log('option', option);
    if (!app.globalData.isLogin) {
      wx.showLoading({
        title: '跳转中',
        mask: true
      })
      wx.navigateTo({
        url: '../../../login/index?data=' + option.data + '&type=shareOrder5',
        complete: () => {
          wx.hideLoading()
        }
      })
      return false
    }
    if (option.type == 'share') {
      this.setData({
        type: 'share'
      })
    }

    this.setData({
      creditActions: [this.data.creditActions[1]] // 删除信用支付
    })

    let obj = JSON.parse(option.data)
    if (obj.ordersn) {
      this.setData({
        type: obj.type,
        ordersn: obj.ordersn,
      })
    } else {
      this.setData({
        source: option.type,
        ordersn: option.data,//'11111111111111'
      })
    }
    try {
      this.setData({
        xhToken: wx.getStorageSync('token')
      })
    } catch (error) {

    }
    if (option.fileUrl) {
      // console.log('URL',option);
      this.setData({
        customerFile: JSON.parse(option.fileUrl).data,
        isBind: true
      })
    } else {
      this.setData({
        isBind: false
      })
    }
  },
  //页面显示时获取数据
  onShow: function () {
    // console.log('xhToken',this.data.xhToken);
    this.setData({
      admin: app.globalData.admin
    });
    if (!this.data.uploadStatus) {
      // console.log('ONSHOW',this.data.uploadStatus);
      this.getOrderDetails()
    }
    this.onShareAppMessage = () => {
      let obj = {
        ordersn: this.data.ordersn,
        type: this.data.type
      }
      // console.log('JSON.stringify(obj)', JSON.stringify(obj));
      return {
        title: '确认文件',
        path: 'pages/personageCenter/allPrintingOrder/share/orderDetails/index?data=' + this.data.ordersn,
      }
    }
  },
  //查看物流
  lookLogistics: function (e) {
    wx.navigateTo({
      url: '../logistics/index?orderSn=' + e.currentTarget.dataset.sn
    })
  },
  //预览图片
  previewImg: function (e) {
    // console.log('previewImg',e);
    wx.previewImage({
      current: this.data.imgBaseUrl + e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [this.data.imgBaseUrl + e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    // console.log('onPullDownRefresh');
    this.getOrderDetails()
  },
  copyQQ: function () {
    let _this = this;
    copyQQ(app, _this.modalFun)
  },

  //获取订单详情
  getOrderDetails: async function (e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    ordersDetails({ data: this.data.ordersn }).then(res => {
      // console.log("res.data.shippingName== 工厂自提", res);
      if (res.data?.shippingName == '自提') {
        let lift = true;
        this.setData({
          lift: lift
        })
      }
      else {
        let lift = false;
        this.setData({
          lift: lift
        })
      }
      wx.stopPullDownRefresh()
      wx.hideLoading()
      // var data = JSON.parse(res.data.suborderDiscountDetail)
      // var priceArr = [
      //   {title:'纸价',original:data.paperPriceOne ,discount:data.paperPriceOne-data.paperPrice,count: data.paperPrice},
      //   {title:'切纸价',original:data.cuttingFee,discount:data.cuttingFee,count:0},
      //   {title:'印刷费',original:data.colorMoney,discount:'',count:data.colorMoney},
      // ]
      var orderdatarr = res.data
      // this.onShareAppMessage = () => ({
      //     title: '确认订单产品制作文件',
      //     path: 'pages/personageCenter/allSingleOrder/orderDetails/index?data=' + orderdatarr.ordersn,

      // })
      let outTime = []
      console.log('res.dta', orderdatarr);
      // let aa='wxpay4'
      // if(aa.indexOf('wxpay'.toLowerCase())>-1){
      // console.log(124324);
      // }else if(aa.indexOf('creditPur'.toLowerCase())>-1){
      //   console.log(888);
      // }else{
      //   console.log(999) ;
      // }
      isIndexOf(orderdatarr)
      orderdatarr.children = orderdatarr.miniEditionGoodsInfo.map(item => {
        console.log(208, item);
        if (item.bluePaperConfirmTime > 0) {
          item.newconfirmTime = this.timestampToTime(item.bluePaperConfirmTime)
        }
        // item.orderDocumentsInfo.forEach(items => {
        //     if (items.isSend == 1) {
        //         this.setData({
        //             isSend: true
        //         })
        //     }
        // })
        item.versionType = editVersionType(item.versionType)
        // var arr = item.goodsAttr.split(';')
        let a = splitStr(item.goodsAttr, app.globalData.frontPaperMap);
        item.printTime = item.printTime && this.timestampToTime(item.printTime)
        console.log(item);
        if (item.priceinfoMap) {
          if (item.priceinfoMap.openSize) {
            item.priceinfoMap.openSize[0] = numberFormat(item.priceinfoMap.openSize[0])
            item.priceinfoMap.openSize[1] = numberFormat(item.priceinfoMap.openSize[1])
          }
        }

        // for(let key of a){
        //   // console.log(key[0]);
        //   if(key[0]=='纸张材质'){
        //     if(key[1].indexOf('银') != -1 || key[1].indexOf('金') != -1){
        //       console.log(123);
        //       item.isValue='exist'
        //     }else{
        //       item.isValue='aa'
        //     }
        //   }
        // }

        // console.log("arr",arr);
        // arr = arr.map(e => {
        //     return e.split(':')
        // }).filter(s => { return s != "" })
        item.goodsAttr = a;
        return item
      })
      console.log('setData',);

      this.setData({
        orderDetail: orderdatarr,
        suborderDiscountDetail: JSON.parse(res.data.suborderDiscountDetail),
        createtime: this.timestampToTime(res.data.addtime)
        // lift:lift
      })
      console.log(261, this.data.orderDetail);
      // console.log("列表orderDetail", orderdatarr);
      // console.log("退款中", orderdatarr.hasRefundStatus);
      // goods.confirmTime != "" && goods.confirmTime != 0
      let isConfirm = orderdatarr.children.find(e => e.confirmTime == 0 || e.confirmTime === null || e.confirmTime === '')
      this.setData({
        fileConfirmText: isConfirm ? '查看分层文件' : '文件已确认'
      })
      // console.log('isConfirm', isConfirm, (orderdatarr.status == 'paid' && isConfirm) ? 111 : 222);

      // switch (true) {
      // switch (res.data.status) {
      if (orderdatarr.status == 'nopaid') {
        this.setData({
          announcementText: '下单后，请及时上传设计文件。如有疑问，请咨询客服。',
          isHiddenMsg: true,
          orderstate: '待付款',
          buttonStatu: 'active',
        })
        wx.setNavigationBarTitle({
          title: "待付款"
        })
      }
      else if (orderdatarr.hasRefundStatus == 1 || orderdatarr.hasRefundStatus == 2 || orderdatarr.hasRefundStatus == 3) {
        this.setData({
          announcementText: '',
          isHiddenMsg: false,
          orderstate: '退款中',
          buttonStatu: 'disabled',

        })
        wx.setNavigationBarTitle({
          title: "退款中"
        })
      }
      else if (orderdatarr.hasRefundStatus == 4) {
        this.setData({
          announcementText: '',
          isHiddenMsg: false,
          orderstate: '退款完成',
          buttonStatu: 'disabled',

        })
        wx.setNavigationBarTitle({
          title: "退款完成"
        })
      }
      // else if (orderdatarr.status == 'paid' && !orderdatarr.confirmTime) {
      //     this.setData({
      //         announcementText: '下单后，请及时上传设计文件。如有疑问，请咨询客服。 ',
      //         isHiddenMsg: true,
      //         orderstate: '待确认',
      //         buttonStatu: 'active'
      //     })
      //     wx.setNavigationBarTitle({
      //         title: "待确认"
      //     })
      // }
      else if (orderdatarr.status === 'paid') {
        this.setData({
          announcementText: '',
          isHiddenMsg: false,
          orderstate: '审核成功',
          buttonStatu: 'disabled'
        })
        wx.setNavigationBarTitle({
          title: "待印刷"
        })
      }
      else if (orderdatarr.status === 'cancel') {
        this.setData({
          announcementText: '',
          isHiddenMsg: false,
          orderstate: '已取消',
          buttonStatu: 'disabled'
        })
        wx.setNavigationBarTitle({
          title: "已取消"
        })
      }
      else if (orderdatarr.status === 'shipped') {
        this.setData({
          announcementText: '',
          isHiddenMsg: false,
          orderstate: '已印刷',
          buttonStatu: 'disabled'
        })
        wx.setNavigationBarTitle({
          title: "已印刷"
        })
      }
      // else {
      //     this.setData({
      //         announcementText: '',
      //         isHiddenMsg: false,
      //         orderstate: '已发货',
      //         buttonStatu: 'disabled'
      //     })
      //     wx.setNavigationBarTitle({
      //         title: "已发货"
      //     })
      // };
      // }
      // if (this.data.isBind) {
      //     this.bindFile()
      // }
    })
      .catch(err => {
        wx.hideLoading()
      })
  },
  modalFun: function ({ contentText, icon, iconSize, image, imageSize, time }) {
    var _this = this;
    this.setData({
      modal: {
        show: true,
        contentText,
        icon,
        iconSize,
        image,
        imageSize
      }
    })
    setTimeout(() => {
      _this.setData({
        modal: {
          show: false, //modal是否显示，默认false
        }
      })
    }, time ? time : 2000);
  },
  alert: function () {
    this.modalFun({ contentText: '文件格式仅支持PDF/CDR/AI/PSD，大小不得超过100MB' })
  },
  //转换时间显示格式
  timestampToTime: function (time) {
    var date = new Date(time * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
  },
  delOrder: function (e) {
    var _this = this
    wx.showModal({
      title: '删除订单',
      confirmColor: '#02BB00',
      content: '确认删除此订单？',
      success: function (res) {
        if (res.confirm) {
          deleteOrder({ data: e.currentTarget.dataset.sn }).then(res => {
            wx.navigateBack({
              delta: 1
            })
            if (res.success) {
              wx.showToast({
                title: '删除成功',
                duration: 2000
              })
            }
          })
        }
      }
    })
    // deleteOrder({})
  },
  // 确认制作文件
  confirmedFile(options) {
    let _this = this;
    //检查是否有未支付的补差价订单
    // let miniDiffOrder = this.data.orderDetail.miniDiffOrder
    // if (miniDiffOrder && miniDiffOrder.find(e => e.status == 'nopaid')) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '您还有补差价订单未支付',
    //     showCancel: false,
    //     success(res) {
    //       if (res.confirm) {
    //         // console.log('用户点击确定')
    //       }
    //     }
    //   })
    //   return false
    // }

    let sid = options.currentTarget.dataset.sid;
    let type = options.currentTarget.dataset.type;
    let ordersn = this.data.ordersn;
    let token = wx.getStorageSync('token')
    // let url = this.data.PDF_URL+`?token=${token}&sn=${ordersn}&id=${sid}&type=${this.data.type}`
    console.log('6666');
    let obj = {
      token: token,
      sn: ordersn,
      id: sid,
      type: type
    }
    wx.navigateTo({
      url: "./checkFile/index?data=" + JSON.stringify(obj)
    })
    // wx.navigateTo({
    //     url:`./checkFile/index?token=${token}&sn=${ordersn}&id=${sid}&type=${type}`
    // })
    // wx.navigateTo({
    //     url:`./webView/index?url=${encodeURIComponent(url)}`
    // })
    // wx.navigateTo({
    //     url:`./webView/index?token=${token}&id=${sid}&orderNo=${ordersn}&type=${this.data.type}`
    // })
    // this.setData({
    //     ordersn: ordersn,
    //     xhToken: token,
    //     xh: false,
    //     goodFileId: sid
    // })
    // let token = wx.getStorageSync('token')
    // wx.redirectTo({
    //     // wx.navigateTo({
    //       url: 'http://192.168.2.14:8081/previewPdf?ordersn='+ ordersn +'&token='+ token + '&sid=' + sid,
    //     })
  },
  //上传文件
  UPloadFile: function (e) {
    console.log('UPloadFile', e.currentTarget);
    const _this = this
    wx.getSystemInfo({
      success: function (res) {
        // console.log('System', res)devtools
        if (res.platform !== 'android' && res.platform !== 'ios' && res.platform !== 'devtools' && _this.data.buttonStatu !== 'disabled') {
          _this.setData({
            xh: true
          })
          // let url = `http://127.0.0.1:8848/uploaded/pybuploadfile.html?token=${_this.data.xhToken}&id=${e.currentTarget.dataset.id}&orderNo=${_this.data.orderDetail.orderNo}`
          let url = `${_this.data.uploadWebURL}/static/pybupload/pybuploadfile.html?token=${_this.data.xhToken}&orderNo=${_this.data.orderDetail.orderNo}&id=0`
          wx.navigateTo({
            url: `./webView/index?url=${encodeURIComponent(url)}`
          })
          // wx.navigateTo({
          //     url:`./webView/index`
          // })
        }
      }
    })
    if (_this.data.xh) {
      return
    }
    clearTimeout(_this.TimeID);
    _this.TimeID = setTimeout(function () {
      if (_this.data.buttonStatu == 'active') {
        _this.setData({
          uploadStatus: true
        })
        // console.log('uploadStatus',_this.data.uploadStatus);
        wx.chooseMessageFile({
          count: 1,
          //能选择文件的数量
          type: 'file',
          //能选择文件的类型,这里只允许上传文件.还有视频,图片,或者都可以
          success(res) {
            var size = res.tempFiles[0].size;
            var filename = res.tempFiles[0].name;
            var newfilename = filename + "";
            //限制文件类型
            if (newfilename.indexOf(".pdf") == -1 && newfilename.indexOf(".cdr") == -1 && newfilename.indexOf(".ai") == -1 && newfilename.indexOf(".psd") == -1 && newfilename.indexOf(".PDF") == -1 && newfilename.indexOf(".CDR") == -1 && newfilename.indexOf(".AI") == -1 && newfilename.indexOf(".PSD") == -1) {
              _this.alert();
            } else {
              wx.showLoading({
                title: '上传文件中...',
                mask: true,
                success() {
                  wx.uploadFile({
                    url: app.globalData.requestUrl + '/api/consumer/order/miniEditionSuborder/updatePdfFile',
                    //上传的路径                  
                    filePath: res.tempFiles[0].path,
                    //刚刚在data保存的文件路径 
                    formData: {
                      folder: 'uploads/agent',
                      orderNo: _this.data.orderDetail.orderNo
                    },
                    header: {
                      "Content-Type": "application/json;charset=UTF-8",
                      'sysType': 'pinyiban_wx',
                      'token': wx.getStorageSync('token')
                    },
                    name: 'file',
                    success(res) {
                      console.log("上传文件", JSON.parse(res.data));
                      _this.setData({
                        customerFile: JSON.parse(res.data).data
                      })
                      // console.log('TTTTTTTTT',Toast);
                      // Toast.success('文件上传成功!');
                      // wx.showToast({
                      //     title: '文件上传成功!',
                      //     icon: 'success',
                      //     duration: 2000
                      // })
                      _this.bindFile();
                      _this.setData({
                        uploadStatus: false
                      })
                      _this.getOrderDetails();
                    },
                    fail(err) {
                      console.log('err', err);
                      _this.setData({
                        uploadStatus: false
                      })
                      wx.showModal({
                        title: '提示',
                        content: '文件上传失败!',
                        showCancel: false,
                        success(res) {
                          if (res.confirm) {
                            _this.getOrderDetails();
                          }
                        }
                      })
                    },
                  })
                }
              });
              _this.setData({
                path: res.tempFiles[0].path,
                //将文件的路径保存在页面的变量上,方便 wx.uploadFile调用
                // filename: filename    //渲染到wxml方便用户知道自己选择了什么文件
              })

            }
          }
        })
      }
    }, 500);
  },
  bindFile: function (e) {
    // console.log('bindFile',this.data.customerFile);
    console.log("上传文件3333", this.data.customerFile);
    editionFiles({
      fileUrl: this.data.customerFile,
      isPost: 1, //展示0，提交1
      moldNum: ['1'],
      note: [''],
      orderNo: this.data.orderDetail.orderNo,
      poSns: [this.data.orderDetail.miniEditionGoodsInfo[0].poSn]
    }).then(res => {
      console.log('editionFiles', res);
      this.setData({ isBind: false })
      this.getOrderDetails()
      wx.hideLoading()
      this.modalFun({ contentText: '上传成功', icon: 'ac-icon-check' })
    })
  },
  //关联资质
  relation: function (e) {
    if (this.data.isHiddenMsg) {
      wx.navigateTo({
        url: 'qualification/index?orderId=' + e.currentTarget.dataset.id
      })
    }

  },
  delQualification: function (e) {
    wx.showModal({
      title: '提示',
      showCancel: true, //取消按钮
      content: '是否取消资质',
      success: function (res) {
        if (res.confirm) {
          del({ list: [e.currentTarget.dataset.id] }).then(res => {
            // console.log('del',res);
            this.getOrderDetails()
          })
        }
      }
    })

  },
  //退款
  refund: function (e) {
    let _this = this
    wx.showModal({
      title: '申请退款',
      showCancel: true, //取消按钮
      content: '确认取消此订单,申请退款?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          createOrderRefund({
            moe: '微信小程序单款退款',
            orderNo: e.currentTarget.dataset.sn,
            orderType: 1
          }).then(res => {
            wx.hideLoading()
            if (res.success) {
              // wx.showModal({
              //   title: '提示',
              //   showCancel: false,//取消按钮
              //   content: '提交成功',
              // })
              _this.modalFun({ contentText: '提交成功', icon: 'ac-icon-check' })
            } else {
              _this.modalFun({ contentText: res.message })
            }
            // setTimeout(()=>{},2000)
            // console.log('refund');
            _this.getOrderDetails()
          })
        } else {
          // console.log('点击取消回调')
        }
      }
    })
  },
  //打开PDF
  lookPdf: function (e) {
    wx.showLoading({
      title: '加载文件中...',
      mask: true
    });
    // console.log("查看文件4444", e);
    // url: app.globalData.OSSFileUrl + e.currentTarget.dataset.url,
    wx.downloadFile({
      url: app.globalData.OSSFileUrl + e.currentTarget.dataset.url,
      success: function (res) {
        // console.log('查看文件4444', res);
        wx.hideLoading()
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType: 'pdf',
          success: function (res) {
            // console.log('打开文档成功')
          }
        })
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },
  //查看资质图片
  lookimg: function (e) {
    //encodeURIComponent
    var imgUrl = e.currentTarget.dataset.url.filter(item => { return item !== '' }).map(item => { return item = app.globalData.OSSFileUrl + item })
    wx.previewImage({
      current: e.currentTarget.dataset.url[0],
      urls: imgUrl, // 需要预览的图片http链接列表
    })
  },
  //调用微信支付
  WXpay: function (e) {
    let _this = this
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask: true
    });
    WxPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType3 }).then(res => {
      console.log('WxPayUrl', res.data);
      var payBean = JSON.parse(res.data)
      wx.hideLoading();
      // console.log('qqqqqqqqqqqqqqqqqqq',payBean);
      // console.log('WXpay', res);
      wx.requestPayment({
        // 'appId':payBean.appid,
        'timeStamp': payBean.timeStamp, //时间戳
        'nonceStr': payBean.nonceStr, //随机字符串
        'package': payBean.package, //统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
        'signType': payBean.signType, //非必要——签名算法
        'paySign': payBean.paySign, //签名
        'success': function (res) {
          // console.log(res); 
          // console.log('WXpay');
          this.getOrderDetails()
          // wx.navigateTo({
          //   url: '../../../turntable/index?data='+e.currentTarget.dataset.no
          // })
        },
        'fail': function (res) {
          console.log('err');
          console.log(JSON.stringify(res))
          console.log(res.detail)
          console.log(res.message)
          wx.hideLoading()
          wx.showModal({
            title: "提示",
            content: "支付失败",
            showCancel: false,
            success: function () {

            }
          })
        }
      })
    })
  },
  DiffOrderPay: function (e) {
    if (this.data.orderDetail.status == 'nopaid') {
      wx.showModal({
        title: "提示",
        content: "请先支付主订单!",
        showCancel: false,
        success: function () { }
      })
      return
    }
    DiffOrderPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType3 }).then(res => {
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
          // console.log(res);
          // wx.navigateTo({
          //   url: '../../turntable/index?data='+e.currentTarget.dataset.no
          // })
          // console.log('DiffOrderPay');
          this.getOrderDetails()
        },
        'fail': function (res) {
          wx.hideLoading()
          wx.showModal({
            title: "提示",
            content: "支付失败",
            showCancel: false,
            success: function () { }
          })
        }
      })
    })
  },
  // document: function (e) {
  //     wx.navigateTo({
  //         url: 'standard/index'
  //     })
  // },
  //更改页面标题
  changetitle: function (options) {
    wx.setNavigationBarTitle({
      title: "标题"
    })
  },
  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.dataset.sn,
      success: function (res) {
        wx.hideLoading()
        that.modalFun({ contentText: '复制成功', icon: 'ac-icon-check' })
      }
    })
  },
  cgContacts: function (e) {
    wx.navigateTo({
      url: 'changeContacts/index?sn=' + e.currentTarget.dataset.sn
    })
  },
  addrelation: function (e) {
    if (this.data.isHiddenMsg) {
      wx.navigateTo({
        url: '../../qualifications/qualificationsDetails/index?id=' + e.currentTarget.dataset.id
      })
    }

  },
  /** 信用支付 */
  selectCredit(e) {
    e.sn = e.currentTarget.dataset.sn
    e.wxPayCallBlack = 'WXpay'
    if (this.data.orderDetail.bonusMoney > 0) {
      this.WXpay(e)
    } else {
      this.getUserCreditPurchase(e)
    }
  },
  // onUnload() {

  //   wx.redirectTo({
  //     url: "/pages/personageCenter/allPrintingOrder/index",
  //     success: function (res) {
       
  //     }
  //   });
  // },
})