//index.js
import { getShareOrderDetails, editionFiles, singleWxPayUrl, confirmReceiver, cancelOrder, del, deleteOrder, DiffOrderPayUrl, repaidByOrderNo, createOrderRefund } from "../../../../../api/orderApi.js";
import { sgetByUid } from "../../../../../api/userApi.js";
import { copyQQ ,splitStr} from '../../../../../utils/util.js'

// import {PDF_URL} from '../../../../../utils/request'
import { PDF_URL, uploadWebURL } from '../../../../../utils/request';
//获取应用实例
const app = getApp()

Page({

    data: {
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
        math:null,
        PDF_URL,
        uploadWebURL,
        imgBaseUrl:'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/',
        fileConfirmText:'查看分层文件',
        lift:false,//是否自提
    },
    TimeID: -1,

    onLoad: function (option) {
        console.log('ordersnordersnordersnordersn',option);
        if (!app.globalData.isLogin) {
            wx.showLoading({
                title: '跳转中',
                mask: true
            })
            wx.navigateTo({
                url: '../../../../login/index?data=' + option.data + '&type=settlement',
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
        let obj = JSON.parse(option.data)
        this.setData({
            ordersn: obj.ordersn||option.data,
        })
        
        try {
            this.setData({
                xhToken: wx.getStorageSync('token')
            })
        } catch (error) {

        }
        if (option.fileUrl) {
            // console.log('URL',option);
            this.setData({
                fileUrl: JSON.parse(option.fileUrl).data,
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
        this.getOrderDetails()
        this.onShareAppMessage=()=>{
            let obj = {
                ordersn:this.data.ordersn,
                type:this.data.type
            }
            console.log('JSON.stringify(obj)',JSON.stringify(obj));
            return {
              title: '确认文件',
              path: 'pages/personageCenter/allSingleOrder/share/orderDetails/index?data='+JSON.stringify(obj),
            }
        }
    },
    //查看物流
    lookLogistics:function(e){
        wx.navigateTo({
            url:'../../logistics/index?orderSn='+e.currentTarget.dataset.sn
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
        console.log("传入的数据", this.data.ordersn);
        if (this.data.type == 'share') {
           this.data.math = {
                orderNo: this.data.ordersn,
                // salesId: 1
            }
        }else{
            this.data.math = {
                orderNo: this.data.ordersn,
            }
        }
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        // console.log('GGGGGGGGGGGGGGGGGGGG',this.data.math);
        getShareOrderDetails( this.data.math).then(res => {
            if ( res.data?.shippingName == '工厂自提') {
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
            console.log('orderdatarr',res);
            // this.onShareAppMessage = () => ({
            //     title: '确认订单产品制作文件',
            //     path: 'pages/personageCenter/allSingleOrder/orderDetails/index?data=' + orderdatarr.ordersn,

            // })
            orderdatarr.children = orderdatarr.children.map(item => {
                var arr = splitStr(item.goodsAttr,app.globalData.frontPaperMap)
                if(item.priceinfoMap){
                  if(item.priceinfoMap.greyVersion){
                    item.priceinfoMap.IsOpen=true
                   arr = splitStr(item.priceinfoMap.competGoodsAttr,app.globalData.frontPaperMap);
                   item.priceinfoMap.pinbanObj = {
                    facialTissue: JSON.parse(item.priceinfoMap.facialTissue), // 面纸内贴

                  facialTissueResp: item.priceinfoMap.facialTissueResp?JSON.parse(item.priceinfoMap.facialTissueResp):'',
                    greyVersion: JSON.parse(item.priceinfoMap.greyVersion) // 灰板
                  }
                  }else{
                   arr = splitStr(item.goodsAttr,app.globalData.frontPaperMap);
                   item.priceinfoMap.IsOpen=false
                  }
                 }
                item.goodsAttr = arr
                return item
            })
            this.setData({
                orderDetail: orderdatarr,
            })
            let isConfirm = orderdatarr.children.find(e => e.confirmTime == 0 || e.confirmTime === null || e.confirmTime === '')
            this.setData({
                fileConfirmText:isConfirm?'查看分层文件':'文件已确认'
            })
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
            else if (orderdatarr.status == 'paid' && isConfirm) {
                this.setData({
                    announcementText: '下单后，请及时上传设计文件。如有疑问，请咨询客服。 ',
                    isHiddenMsg: true,
                    orderstate: '待确认',
                    buttonStatu: 'active'
                })
                wx.setNavigationBarTitle({
                    title: "待确认"
                })
            }
            else if (orderdatarr.status === 'paid' && orderdatarr.confirmTime != '') {
                this.setData({
                    announcementText: '',
                    isHiddenMsg: false,
                    orderstate: '审核成功',
                    buttonStatu: 'disabled'
                })
                wx.setNavigationBarTitle({
                    title: "待发货"
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
                    orderstate: '已发货',
                    buttonStatu: 'disabled'
                })
                wx.setNavigationBarTitle({
                    title: "已发货"
                })
            }
            else {
                this.setData({
                    announcementText: '',
                    isHiddenMsg: false,
                    orderstate: '已发货',
                    buttonStatu: 'disabled'
                })
                wx.setNavigationBarTitle({
                    title: "已发货"
                })
            };
            // switch (true) {
            //     // switch (res.data.status) {
            //     case (orderdatarr.status == 'nopaid'):
            //         this.setData({
            //             announcementText: '下单后，请及时上传设计文件。如有疑问，请咨询客服。',
            //             isHiddenMsg: true,
            //             orderstate: '待付款',
            //             buttonStatu: 'active',
            //         })
            //         wx.setNavigationBarTitle({
            //             title: "待付款"
            //         })
            //         break;
            //     case (orderdatarr.status == 'paid' && (orderdatarr.confirmTime === '' || orderdatarr.confirmTime === null || orderdatarr.confirmTime === 0)):
            //         this.setData({
            //             announcementText: '下单后，请及时上传设计文件。如有疑问，请咨询客服。 ',
            //             isHiddenMsg: true,
            //             orderstate: '待确认',
            //             buttonStatu: 'active'
            //         })
            //         wx.setNavigationBarTitle({
            //             title: "待确认"
            //         })
            //         break;
            //     case (orderdatarr.status === 'paid' && orderdatarr.confirmTime != ''):
            //         this.setData({
            //             announcementText: '',
            //             isHiddenMsg: false,
            //             orderstate: '审核成功',
            //             buttonStatu: 'disabled'
            //         })
            //         wx.setNavigationBarTitle({
            //             title: "待发货"
            //         })
            //         break;
            //     case (orderdatarr.status === 'cancel'):
            //         this.setData({
            //             announcementText: '',
            //             isHiddenMsg: false,
            //             orderstate: '已取消',
            //             buttonStatu: 'disabled'
            //         })
            //         wx.setNavigationBarTitle({
            //             title: "已取消"
            //         })
            //         break;
            //     // case 'refunding':
            //     //     this.setData({
            //     //         announcementText: '',
            //     //         isHiddenMsg: false,
            //     //         orderstate: '退款中',
            //     //         buttonStatu: 'disabled',

            //     //     })
            //     //     wx.setNavigationBarTitle({
            //     //         title: "退款中"
            //     //     })
            //     //     break;
            //     case (orderdatarr.status === 'shipped'):
            //         this.setData({
            //             announcementText: '',
            //             isHiddenMsg: false,
            //             orderstate: '已发货',
            //             buttonStatu: 'disabled'
            //         })
            //         wx.setNavigationBarTitle({
            //             title: "已发货"
            //         })
            //         break;

            //     default:
            //         this.setData({
            //             announcementText: '',
            //             isHiddenMsg: false,
            //             orderstate: '已发货',
            //             buttonStatu: 'disabled'
            //         })
            //         wx.setNavigationBarTitle({
            //             title: "已发货"
            //         })
            //         break;
            // }
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
        this.modalFun({ contentText: '文件格式仅支持PDF/CDR/AI/PSD，大小不得超过100MB' })
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
        // let sid = options.currentTarget.dataset.sid;
        // let ordersn = this.data.ordersn;
        // let token = wx.getStorageSync('token')
        // this.setData({
        //     ordersn: ordersn,
        //     xhToken: token,
        //     xh: false,
        //     goodFileId: sid
        // })
        //检查有没有未支付的补差价订单
        if (this.data.orderDetail.miniDiffOrder) {
            let flag = false;
            this.data.orderDetail.miniDiffOrder.forEach(item=>{
                if (item.status=='nopaid') {
                    flag = true
                }
            })
            if (flag) {
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
        }
        let sid = options.currentTarget.dataset.sid;
        let ordersn = this.data.ordersn;
        let token = wx.getStorageSync('token')
        let url = this.data.PDF_URL+`?token=${token}&sn=${ordersn}&id=${sid}&type=${this.data.type}`
        
        // wx.navigateTo({
        //     url:`../../orderDetails/webView/index?url=${encodeURIComponent(url)}`,
        // })
        wx.navigateTo({
            url:`../../orderDetails/checkFile/index?token=${token}&sn=${ordersn}&id=${sid}&type=${this.data.type}`
        })
        // let token = wx.getStorageSync('token')
        // wx.redirectTo({
        //     // wx.navigateTo({
        //       url: 'http://192.168.2.14:8081/previewPdf?ordersn='+ ordersn +'&token='+ token + '&sid=' + sid,
        //     })
    },

    //上传文件
    UPloadFile: function (e) {
        console.log('UPloadFile', e);
        const _this = this
        wx.getSystemInfo({
            success: function (res) {
                console.log('System', res)
                if (res.platform !== 'android' && res.platform !== 'ios' && res.platform !== 'devtools' && _this.data.buttonStatu !== 'disabled') {
                    _this.setData({
                        xh: true
                    })
                    let url = `${_this.data.uploadWebURL}/static/pybupload/pybuploadfile.html?token=${_this.data.xhToken}&id=${e.currentTarget.dataset.id}&orderNo=${_this.data.orderDetail.orderNo}`
                    wx.navigateTo({
                        url:`./webView/index?url=${encodeURIComponent(url)}`
                    })
                }
            }
        })
        if (_this.data.xh) {
            return
        }
        clearTimeout(_this.TimeID);
        _this.TimeID = setTimeout(function () {
            if (_this.data.buttonStatu == 'active') {
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
                                mask: true
                            });
                            console.log("filePath", res.tempFiles[0].path);
                            wx.uploadFile({
                                url: app.globalData.requestUrl + '/api/consumer/order/miniSupplierOrders/updatePdfFile',
                                //上传的路径                  
                                filePath: res.tempFiles[0].path,
                                //刚刚在data保存的文件路径 
                                formData: {
                                    folder: 'uploads/file',
                                    orderNo: _this.data.ordersn,
                                    isPdf: 1,
                                    orderDocId: e.currentTarget.dataset.id,
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
                                        fileUrl: JSON.parse(res.data).data
                                    })
                                    _this.getOrderDetails();
                                    // _this.bindFile();

                                }
                            })
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
    // bindFile: function(e) {
    //     // console.log('bindFile',this.data.fileUrl);
    //     console.log("上传文件3333",this.data.fileUrl);
    //     editionFiles({
    //         fileUrl: this.data.fileUrl,
    //         isPost: 1, //展示0，提交1
    //         moldNum: ['1'],
    //         note: [''],
    //         orderNo: this.data.orderDetail.orderNo,
    //         poSns: [this.data.orderDetail.miniEditionGoodsInfo[0].poSn]
    //     }).then(res => {
    //         console.log('editionFiles',res);
    //         this.setData({ isBind: false })
    //         this.getOrderDetails()
    //         wx.hideLoading()
    //         this.modalFun({ contentText: '上传成功', icon: 'ac-icon-check' })
    //     })
    // },
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
                        moe: '微信小程序退款',
                        orderNo: e.currentTarget.dataset.sn,
                        orderType: 5
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
        singleWxPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType }).then(res => {
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
    // cgContacts: function (e) {
    //     wx.navigateTo({
    //         url: 'changeContacts/index?sn=' + e.currentTarget.dataset.sn
    //     })
    // },
    addrelation: function (e) {
        if (this.data.isHiddenMsg) {
            wx.navigateTo({
                url: '../../../qualifications/qualificationsDetails/index?id=' + e.currentTarget.dataset.id
            })
        }

    },
})