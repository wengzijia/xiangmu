//index.js
import { ordersDetails, editionFiles, WxPayUrl, confirmReceiver, cancelOrder, del, deleteOrder,DiffOrderPayUrl,repaidByOrderNo,createOrderRefund } from "../../../../api/orderApi.js";
import { sgetByUid } from "../../../../api/userApi.js";
import {copyQQ,paperSplitStr} from '../../../../utils/util.js'
//获取应用实例
const app = getApp()

Page({
  
  data: {
    nowTime:new Date().getTime()/1000, 
    xh:false,
    xhToken:wx.getStorageSync('token'),
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHiddenMsg: false,
    announcementText: "",
    orderDetail: '',
    path: '',
    fileUrl: '',
    isBind:false,
    ordersn: '',
    buttonStatu: '',
    mobile: '',
    orderstate: '',
    factoryName:'',
    createtime: '',
    source:'',
    cprice:0,
    originalPrice:0,
    uploadStatus:false,
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
  }
  },
  TimeID: -1,

  onLoad: function (option) {
    if(!app.globalData.isLogin){
      wx.showLoading({
        title: '跳转中',mask:true
      })
      wx.navigateTo({
        url: '../../../login/index?ordersn='+option.data+'&type=settlement',
        complete: ()=>{
          wx.hideLoading()
        }
      })
      return false
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    try {
      this.setData({
        xhToken:wx.getStorageSync('token')
      })
    } catch (error) {
      
    }
    this.setData({ 
      source: option.type,
      ordersn: option.data
     })
    if (option.fileUrl) {
      // console.log('URL',option);
      this.setData({
        fileUrl: JSON.parse(option.fileUrl).data,
        isBind:true
      })
    }else{
      this.setData({
        isBind:false
      })
    }
  },
  //页面显示时获取数据
  onShow: function () {
    if (!this.data.uploadStatus) {
      this.getOrderDetails()
    }
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getOrderDetails()
  },
  copyQQ:function(){
    let than = this;
    copyQQ(app,than.modalFun)
  },
  //获取订单详情
  getOrderDetails: function (e) {
    ordersDetails({ data: this.data.ordersn }).then(res => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
      var data = JSON.parse(res.data.suborderDiscountDetail)
      var priceArr = [
        {title:'纸价',original:data.paperPriceOne ,discount:data.paperPriceOne-data.paperPrice,count: data.paperPrice},
        {title:'切纸价',original:data.cuttingFee,discount:data.cuttingFee,count:0},
        {title:'印刷费',original:data.colorMoney,discount:'',count:data.colorMoney},
      ]
      var orderdatarr = res.data
      orderdatarr.payTypeText =  res.data.payType?(res.data.payType.indexOf('wxpay')!=-1?'微信支付':res.data.payType.indexOf('alipay')!=-1?'支付宝支付':''):'未支付'
      orderdatarr.miniEditionGoodsInfo[0].goodsAttr = paperSplitStr(orderdatarr,orderdatarr.miniEditionGoodsInfo[0].goodsAttr)
      var fName = orderdatarr.factoryName?orderdatarr.factoryName.split('_')[0]:''
      var cprice = (data.paperPriceOne*1 - data.paperPrice*1).toFixed(2);
      var suborderDiscountDetails = JSON.parse(orderdatarr.suborderDiscountDetail);
      if (orderdatarr.addtime<1630249200) {
        var originalPrice = suborderDiscountDetails.priceOne*1+suborderDiscountDetails.cuttingFee*1;
      } else {
        // console.log('12323213213213',suborderDiscountDetails);
        // var papers = JSON.parse(orderdatarr.paper);
        var originalPrice = suborderDiscountDetails.priceOne*1-(suborderDiscountDetails.colorMoney*1+suborderDiscountDetails.spotMoney*1) + ((orderdatarr.paper?.cuttingfee)?orderdatarr.paper.cuttingfee:0);
        console.log('originalPrice',suborderDiscountDetails.priceOne*1,suborderDiscountDetails.colorMoney*1,suborderDiscountDetails.spotMoney*1,orderdatarr.paper?.cuttingfee);
      }
      originalPrice = originalPrice.toFixed(2)
      this.setData({
        orderDetail: orderdatarr,
        factoryName:fName,
        createtime: this.timestampToTime(res.data.addtime),
        mobile: res.data.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2"),
        'orderDetail.suborderDiscountDetail':JSON.parse(res.data.suborderDiscountDetail),
        priceArr:data.paperPriceOne?priceArr:[],
        cprice:cprice,
        originalPrice:originalPrice,
      })
      this.setData({
        'orderDetail.saving':Math.floor(this.data.orderDetail.suborderDiscountDetail.paperPriceOne*100-this.data.orderDetail.suborderDiscountDetail.paperPrice*100)/100
      })
      switch (res.data.status) {
        case 'nopaid':
          this.setData({
            announcementText: '下单后，请及时上传设计文件。如有疑问，请咨询客服。',
            isHiddenMsg: true,
            orderstate: '待付款',
            buttonStatu: 'active'
          })
          wx.setNavigationBarTitle({
            title: "待付款"
          })
          break;
          case 'paid':
          this.setData({
            announcementText: '下单后，请及时上传设计文件。如有疑问，请咨询客服。 ',
            isHiddenMsg: true,
            orderstate: '待审核',
            buttonStatu: 'active'
          })
          wx.setNavigationBarTitle({
            title: "待配送"
          })
          break;
          case 'confirmed':
            this.setData({
              announcementText: '',
              isHiddenMsg: false,
              orderstate: '审核成功',
              buttonStatu: 'disabled'
            })
            wx.setNavigationBarTitle({
              title: "待配送"
            })
          break;
          case 'cancel':
            this.setData({
              announcementText: '',
              isHiddenMsg: false,
              orderstate: '已取消',
              buttonStatu: 'disabled'
            })
            wx.setNavigationBarTitle({
              title: "已取消"
            })
          break;
          case 'refunding':
            this.setData({
              announcementText: '',
              isHiddenMsg: false,
              orderstate: '退款中',
              buttonStatu: 'disabled'
            })
            wx.setNavigationBarTitle({
              title: "退款中"
            })
          break;
          case 'shipped':
            this.setData({
              announcementText: '',
              isHiddenMsg: false,
              orderstate: '已完成',
              buttonStatu: 'disabled'
            })
            wx.setNavigationBarTitle({
              title: "已完成"
            })
          break;
      
        default:
          this.setData({
            announcementText: '',
            isHiddenMsg: false,
            orderstate: '已完成',
            buttonStatu: 'disabled'
          })
          wx.setNavigationBarTitle({
            title: "已完成"
          })
          break;
      }
     if (this.data.isBind) {
       this.bindFile()
     }
    })
  },
  //转换时间显示格式
  timestampToTime: function (time) {
    var date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
  },
  modalFun: function({contentText,icon,iconSize,image,imageSize,time}){
    var than = this;
    this.setData({
      modal: {
        show: true,
        contentText,icon,iconSize,image,imageSize
      }
    })
    setTimeout(() => {
      than.setData({
        modal: {
          show: false,//modal是否显示，默认false
        }
    }) }, time?time:2000);
  },
  alert:function(){
    this.modalFun({contentText:'文件格式仅支持PDF/CDR/AI/PSD，大小不得超过100MB'})
  },
  delOrder: function (e) {
    var than = this
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
  //上传文件
  UPloadFile: function (e) {
    const than = this
    wx.getSystemInfo({
      success: function(res) {
        // console.log('System',res)
        if(res.platform!=='android'&&res.platform!=='ios'&&res.platform!=='devtools'&&than.data.buttonStatu!=='disabled'){
          than.setData({
            xh:true
          })
        }
      }
    })
    if (than.data.xh) {
      return 
    }
    clearTimeout(than.TimeID);
    than.TimeID = setTimeout(function () {
      if (than.data.buttonStatu == 'active') {
        _this.setData({
          uploadStatus: true
        })
        wx.chooseMessageFile({
          count: 1,//能选择文件的数量
          type: 'file',//能选择文件的类型,这里只允许上传文件.还有视频,图片,或者都可以
          success(res) {
            var size = res.tempFiles[0].size;
            var filename = res.tempFiles[0].name;
            var newfilename = filename + "";
            let arr = [".pdf",".cdr",".ai",".psd",".PDF",".CDR",".AI",".PSD",]
            let  tp = arr.find(s => newfilename.indexOf(s) == -1 )
            if (tp) {//限制文件类型
              // if (newfilename.indexOf(".pdf") == -1 && newfilename.indexOf(".cdr") == -1 && newfilename.indexOf(".ai") == -1 && newfilename.indexOf(".psd") == -1&&newfilename.indexOf(".PDF") == -1 && newfilename.indexOf(".CDR") == -1 && newfilename.indexOf(".AI") == -1 && newfilename.indexOf(".PSD") == -1) { //限制文件类型
              than.alert()
            } else {
              wx.showLoading({
                title: '上传文件中...',
                mask:true
              });
              wx.uploadFile({  
                url: app.globalData.requestUrl+'/api/consumer/order/miniEditionSuborder/updatePdfFile',//上传的路径                  
                filePath: res.tempFiles[0].path,//刚刚在data保存的文件路径 
                formData: {
                  folder: 'uploads/agent',
                  orderNo: e.currentTarget.dataset.sn
                },
                header: {
                  "Content-Type": "application/json;charset=UTF-8",
                  'sysType': 'pinyiban_wx',
                  'token': wx.getStorageSync('token')
                },
                name: 'file',
                success(res) {
                  than.setData({
                    fileUrl: JSON.parse(res.data).data
                  })
                  _this.setData({
                    uploadStatus: false
                  })
                  than.bindFile()
                }
              })
              than.setData({
                path: res.tempFiles[0].path,//将文件的路径保存在页面的变量上,方便 wx.uploadFile调用
                // filename: filename    //渲染到wxml方便用户知道自己选择了什么文件
              })
            }
          }
        })
      }
    }, 500);
  },
  bindFile:function(e){
    // console.log('bindFile',this.data.fileUrl);
    editionFiles({
      fileUrl: this.data.fileUrl,
      isPost: 1,//展示0，提交1
      moldNum: ['1'],
      note: [''],
      orderNo: this.data.orderDetail.orderNo,
      poSns: [this.data.orderDetail.miniEditionGoodsInfo[0].poSn]
    }).then(res => {
      // console.log('editionFiles',res);
      this.setData({isBind:false})
      this.getOrderDetails()
      wx.hideLoading()
      this.modalFun({contentText:'上传成功',icon:'ac-icon-check'})
    })
  },
  //关联资质
  relation: function (e) {
    if(this.data.isHiddenMsg){
      wx.navigateTo({
        url: 'qualification/index?orderId=' + e.currentTarget.dataset.id
      })
    }
    
  },
  delQualification:function(e){
    wx.showModal({
      title: '提示',
      showCancel: true,//取消按钮
      content: '是否取消资质',
      success: function (res) {
        if (res.confirm) {
          del({list:[e.currentTarget.dataset.id]}).then(res =>{
            // console.log('del',res);
            this.getOrderDetails()
          })
        }
      }
    })
    
  },
  // settlement:function(e){
  //   let _this = this
  //   let accountNumber = false
  //   let UserName = ''
  //   let UserMobile = ''
  //   wx.showLoading({
  //     title: '加载中...',
  //     icon:'loading',            
  //     mask:true 
  //   })
  //   sgetByUid().then(res=>{
  //     wx.hideLoading()
  //     // console.log(res)
  //     if (res.data&&res.data.length>0) {
  //       accountNumber = true
  //       UserName = res.data[0].username,
  //       UserMobile = res.data[0].account.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
  //       wx.showModal({
  //         title: '确认结算',
  //         showCancel: true,//取消按钮
  //         content: '印刷费：￥'+(this.data.orderDetail.suborderDiscountDetail.colorMoney*1+this.data.orderDetail.suborderDiscountDetail.spotMoney*1)+'将转入\r\n支付宝：'+UserMobile+'\r\n姓名(实名)：'+UserName,
  //         success: function (res) {
  //           if (res.confirm) {
  //             wx.showLoading({
  //               title: '加载中...',                           
  //               mask:true 
  //             })
  //             repaidByOrderNo({orderNo:e.currentTarget.dataset.no}).then(res=>{
  //               wx.hideLoading()
  //               if (res.success) {
  //                 _this.modalFun({contentText:'提交成功',icon:'ac-icon-check'})
  //                 _this.source = ''
  //               setTimeout(()=>{_this.getOrderDetails()},2000)
  //               }else{
  //                 _this.modalFun({contentText:res.message})
  //               }
                
  //             })
  //           } else {
  //             // console.log('点击取消回调')
  //           }
  //         }
  //       })
  //     } else {
  //       accountNumber = false
  //       wx.showModal({
  //         title: '提示',
  //         confirmText:'去设置',
  //         content: '您还未设置收款账户',
  //         success: function (res) {
  //           if (res.confirm) {  
  //             wx.navigateTo({
  //               url: '../../settings/collection/index'
  //             })
  //           } else {   
  //             // console.log('点击取消回调')
  //           }
  //         }
  //       })
  //     }
  //   })
  // },
  refund:function(e){
    let _this = this
    wx.showModal({
      title: '申请退款',
      showCancel: true,//取消按钮
      content: '确认取消此订单,申请退款?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中...',                           
            mask:true 
          })
          createOrderRefund({ 
            moe:'微信小程序退款',
            orderNo: e.currentTarget.dataset.sn,
            orderType:5
          }).then(res => {
            wx.hideLoading()
            if (res.success) {
              // wx.showModal({
              //   title: '提示',
              //   showCancel: false,//取消按钮
              //   content: '提交成功',
              // })
                _this.modalFun({contentText:'提交成功',icon:'ac-icon-check'})
            }else{
              _this.modalFun({contentText:res.message})
            }
            // setTimeout(()=>{},2000)
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
      mask:true 
    });
    wx.downloadFile({
      url: app.globalData.OSSFileUrl+e.currentTarget.dataset.url,
      success: function (res) {
        wx.hideLoading()
        const  filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType:'pdf',
          success: function (res) {
            // console.log('打开文档成功')
          }
        })
      },
      fail:function(res){
        wx.hideLoading()
      }
    })
  },
  //查看资质图片
  lookimg: function (e) {
    //encodeURIComponent
    var imgUrl = e.currentTarget.dataset.url.filter(item=>{return item !== ''}).map(item =>{return item = app.globalData.OSSFileUrl+item})
    wx.previewImage({
      current:e.currentTarget.dataset.url[0],
      urls: imgUrl, // 需要预览的图片http链接列表
    })
  },
  //调用微信支付
  WXpay: function (e) {
    let _this = this
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask:true
    });
    var payType = e.currentTarget.dataset.paytype?app.globalData.payType2:app.globalData.payType3
    WxPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: payType }).then(res => {
      var payBean = JSON.parse(res.data)
      wx.hideLoading();
        // console.log('qqqqqqqqqqqqqqqqqqq',payBean);
      // console.log('WXpay', res);
      wx.requestPayment({
          // 'appId':payBean.appid,
          'timeStamp': payBean.timeStamp,//时间戳
          'nonceStr': payBean.nonceStr,//随机字符串
          'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
          'signType': payBean.signType,//非必要——签名算法
          'paySign': payBean.paySign,//签名
          'success': function (res) {
            // console.log(res); 
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
  DiffOrderPay:function (e) {
    if (this.data.orderDetail.status == 'nopaid') {
      wx.showModal({
          title: "提示",
          content: "请先支付主订单!",
          showCancel: false,
          success: function () { }
      })
      return
  }
    var payType = e.currentTarget.dataset.paytype?app.globalData.payType2:app.globalData.payType3
    DiffOrderPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: payType }).then(res => {
      var payBean = JSON.parse(res.data)
      wx.hideLoading();
      wx.requestPayment({
          // 'appId':payBean.appid,
          'timeStamp': payBean.timeStamp,//时间戳
          'nonceStr': payBean.nonceStr,//随机字符串
          'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
          'signType': payBean.signType,//非必要——签名算法
          'paySign': payBean.paySign,//签名
          'success': function (res) {
            // console.log(res);
            // wx.navigateTo({
            //   url: '../../turntable/index?data='+e.currentTarget.dataset.no
            // })
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
  //   wx.navigateTo({
  //     url: 'standard/index'
  //   })
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
        that.modalFun({contentText:'复制成功',icon:'ac-icon-check'})
      }
    })
  },
  cgContacts: function (e) {
    wx.navigateTo({
      url: 'changeContacts/index?sn=' + e.currentTarget.dataset.sn
    })
  },
  addrelation: function (e) {
    if(this.data.isHiddenMsg){
      wx.navigateTo({
        url: '../../qualifications/qualificationsDetails/index?id=' + e.currentTarget.dataset.id
      })
    }
   
  }
})
