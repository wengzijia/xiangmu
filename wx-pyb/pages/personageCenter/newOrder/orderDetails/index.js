//index.js
import { getSupplierOrderDetails,ordersDetails,WxPayUrl, editionFiles, singleWxPayUrl, confirmReceiver, cancelOrder, del, deleteOrder, DiffOrderPayUrl, getWxMinOrderOutTime, createOrderRefund } from "../../../../api/orderApi.js";
import { sgetByUid } from "../../../../api/userApi.js";
import { copyQQ } from '../../../../utils/util.js'
import { PDF_URL, uploadWebURL } from '../../../../utils/request';
import { splitStr,format } from "../../../../utils/util"


//获取应用实例
const app = getApp()

Page({

    data: {
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
        fileUrl: '',
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
        orderAmount:0,
        PDF_URL,
        uploadWebURL,
        lift: false, //自提
        imgBaseUrl:'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/',
        fileConfirmText:'查看分层文件',
        goodsList:[
          {
            poSn:'PO2022030813775531-1',
            size:'111_222',
            num:1200,
            moduleNum:2
          },
          {
            poSn:'PO2022030813775531-2',
            size:'111_222',
            num:1200,
            moduleNum:2
          }
        ],
        order:{
            
        },
        goodsAttr:[]
    },
    TimeID: -1,
    QRpay: function(e){
      wx.navigateTo({
        url: `../qrPay/index?sn=${e.currentTarget.dataset.no}`
      })
    },
    onLoad: function (option) {
        console.log('option',option)
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
           // console.log('URL',option);
        if (option.fileUrl) {
        
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
    // console.log('xhToken',this.data.xhToken);
    this.getOrderDetails()
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
    //查看物流
    lookLogistics:function(e){
        wx.navigateTo({
            url:'../logistics/index?orderSn='+e.currentTarget.dataset.sn
        })
    },
    //预览图片
  previewImg:function(e){
    // console.log('previewImg',e);
    wx.previewImage({
      current: this.data.imgBaseUrl+e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [this.data.imgBaseUrl+e.currentTarget.dataset.url] // 需要预览的图片http链接列表
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
    //   //分享订单给客户
    //   onShareAppMessage() {
    //        return {
    //         title: '确认信息',
    //         path: 'pages/personageCenter/allSingleOrder/orderDetails/index?data='+this.data.ordersn,
    //         } 

    // },
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
        var goodsAttrText = orderdatarr.miniEditionGoodsInfo[0].goodsAttr
        // if (!orderdatarr.boxtype) {
        //   if (goodsAttrText.indexOf('纸行名称') == -1&&orderdatarr.addtime>1629547810) {
        //     goodsAttrText = '纸行名称:'+orderdatarr.paper.paperShop+';纸张品牌:'+orderdatarr.paper.brand+';吨价/平方单价:'+orderdatarr.paper.paperTonprice+'元;'+goodsAttrText
        //   }else if(goodsAttrText.indexOf('吨价/平方单价')){
        //     let str = '吨价/平方单价:'+orderdatarr.paper.paperBaseprice+'元'
        //     let str2 = '吨价/平方单价:'+orderdatarr.paper.paperTonprice+'元'
        //     goodsAttrText = goodsAttrText.replace(str,str2)
        //   }
        // }
          var arr = goodsAttrText.split(';')
          arr.forEach((items,i)=>{
            if (items.indexOf('吨价')!=-1) {
              this.setData({
                originalPrice:items.split(':')[1]
              })
              arr.splice(i,1)
            }
          })
          // arr.splice(1,0,'纸张信息:'+orderdatarr.paper.brand+orderdatarr.paper.kg+'g'+orderdatarr.paper.colour)
          arr =arr.map(item =>{
            return item.split(':')
          }).filter(s=>{return s!=""})
          // arr.splice(1,0,'纸张吨价:'+orderdatarr.paperName)
          orderdatarr.miniEditionGoodsInfo[0].goodsAttr = arr
          var fName = orderdatarr.factoryName?orderdatarr.factoryName.split('_')[0]:''
          let pickUpTime = ''
          if (res.data.miniEditionGoodsInfo[0].sendtime>0) {
            pickUpTime = this.timestampToTime(res.data.miniEditionGoodsInfo[0].sendtime)
          }else{
            pickUpTime = this.timestampToTime(res.data.addtime)
          }
        //   this.getDelivery(pickUpTime,Math.ceil(Number(res.data.totalTime)/24))
          orderdatarr.miniOrdersGoodsList = orderdatarr.miniOrdersGoodsList.map(e =>{
            let size = e.goodsAttr.split(';').map(e => e.split(':')).find(e=> e[0]==='展开尺寸')
            e.size = size?size[1]:''
            return e
        })
        console.log('orderdatarr',orderdatarr)
      this.setData({
        orderDetail: orderdatarr,
        factoryName:fName,
        createtime: this.timestampToTime(res.data.addtime),
        mobile: res.data.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2"),
        'orderDetail.suborderDiscountDetail':JSON.parse(res.data.suborderDiscountDetail),
        priceArr:data.paperPriceOne?priceArr:[],
        totalTime:Math.ceil(Number(res.data.totalTime)/24*10)/10,
        goodsAttr:orderdatarr.miniEditionGoodsInfo[0].goodsAttr,
        createTime:format(orderdatarr.addtime*1000),
        orderAmount:Number(orderdatarr.amount||0)+Number(orderdatarr.amountNopaid||0)
        // pickUpDate:pickUpTime
      })
      this.setData({
        'orderDetail.saving':(this.data.orderDetail.suborderDiscountDetail.paperPriceOne*100-this.data.orderDetail.suborderDiscountDetail.paperPrice*100+this.data.orderDetail.suborderDiscountDetail.cuttingFee*100)/100
      })
      switch (res.data.status) {
        case 'nopaid':
          this.setData({
            announcementText: '下单后，请及时上传设计文件。如有疑问，请咨询客服。',
            isHiddenMsg: true,
            orderstate: '待付预付款',
            buttonStatu: 'active'
          })
          wx.setNavigationBarTitle({
            title: "待付预付款"
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
            title: "已预付"
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
              title: "已预付"
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
        // this.modalFun({ contentText: '文件格式仅支持PDF/CDR/AI/PSD，大小不得超过100MB' })
        this.modalFun({ contentText: '文件格式仅支持PDF，大小不得超过100MB' })
    },
    //转换时间显示格式
    timestampToTime: function(time) {
        var date = new Date(time * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
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
        //检查是否有未支付的补差价订单
        let miniDiffOrder = this.data.orderDetail.miniDiffOrder
            if (miniDiffOrder&&miniDiffOrder.find( e=> e.status=='nopaid')) {
                wx.showModal({
                    title: '提示',
                    content: '您还有补差价订单未支付',
                    showCancel:false,
                    success (res) {
                      if (res.confirm) {
                        // console.log('用户点击确定')
                      } 
                    }
                  })
                return false
            }
        
        let sid = options.currentTarget.dataset.sid;
        let ordersn = this.data.ordersn;
        let token = wx.getStorageSync('token')
        let url = this.data.PDF_URL+`?token=${token}&sn=${ordersn}&id=${sid}&type=${this.data.type}`
        console.log('6666');
        wx.navigateTo({
            url:`./checkFile/index?token=${token}&sn=${ordersn}&id=${sid}&type=${this.data.type}`
        })
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
    const than = this
    const _this = this;
    wx.getSystemInfo({
      success: function(res) {
        // console.log('System',res)
        if(res.platform!=='android'&&res.platform!=='ios'&&than.data.buttonStatu!=='disabled'){
          than.setData({
            xh:true
          })
          
          let url = `${_this.data.uploadWebURL}/static/pybupload/pybuploadfile.html?token=${_this.data.xhToken}&id=${0}&orderNo=${_this.data.orderDetail.orderNo}&poSns=${_this.data.orderDetail.miniEditionGoodsInfo[0].poSn}`
          wx.navigateTo({
              url:`../../allSingleOrder/orderDetails/webView/index?url=${encodeURIComponent(url)}`
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
        wx.chooseMessageFile({
          count: 1,  //能选择文件的数量
          type: 'file', //能选择文件的类型,这里只允许上传文件.还有视频,图片,或者都可以
          success(res) {
            var size = res.tempFiles[0].size;
            var filename = res.tempFiles[0].name;
            var newfilename = filename + "";
            // if (newfilename.indexOf(".pdf") == -1 && newfilename.indexOf(".cdr") == -1 && newfilename.indexOf(".ai") == -1 && newfilename.indexOf(".psd") == -1&&newfilename.indexOf(".PDF") == -1 && newfilename.indexOf(".CDR") == -1 && newfilename.indexOf(".AI") == -1 && newfilename.indexOf(".PSD") == -1) { //限制文件类型
            if(newfilename.indexOf(".pdf") == -1 && newfilename.indexOf(".PDF") == -1 ){
              than.alert()
            } else {
              wx.showLoading({
                title: '上传文件中...',
                mask:true
              });
              wx.uploadFile({  
                url: app.globalData.requestUrl+'/api/consumer/order/miniEditionSuborder/updatePdfFile',   //上传的路径                  
                filePath: res.tempFiles[0].path, //刚刚在data保存的文件路径 
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
                  than.bindFile()
                }
              })
              than.setData({
                path: res.tempFiles[0].path, //将文件的路径保存在页面的变量上,方便 wx.uploadFile调用
                // filename: filename    //渲染到wxml方便用户知道自己选择了什么文件
              })
            }
          }
        })
      }
    }, 500);
  },
  
    bindFile:function(e){
        console.log('bindFile',this.data.fileUrl);
        editionFiles({
          fileUrl: this.data.fileUrl,
          isPost: 1,//展示0，提交1
          moldNum: ['1'],
          note: [''],
          orderNo: this.data.orderDetail.orderNo,
          poSns: [this.data.orderDetail.miniEditionGoodsInfo[0].poSn]
        }).then(res => {
          console.log('editionFiles',res);
          this.setData({isBind:false})
          this.getOrderDetails()
          wx.hideLoading()
          this.modalFun({contentText:'上传成功',icon:'ac-icon-check'})
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
      mask:true
    });
    WxPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType }).then(res => {
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
            _this.getOrderDetails()
            // wx.navigateTo({
            //   url: '../../../turntable/index?data='+e.currentTarget.dataset.no
            // })
          },
          'fail': function (res) {
            console.log('err');
            console.log(JSON.stringify(res))
            console.log(res.detail)
            console.log(res.message)
            _this.getOrderDetails()
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
      let _this = this;
        DiffOrderPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType }).then(res => {
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
                    _this.getOrderDetails()
                },
                'fail': function (res) {
                  _this.getOrderDetails()
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
})