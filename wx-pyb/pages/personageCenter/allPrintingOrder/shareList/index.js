//index.js
import { getAllOrder, deleteOrder, cancelOrder, createProxyMergePayQrCode, createOrder, WxPayUrl, DiffOrderPayUrl,canclePrintAllot } from "../../../../api/orderApi.js";
import { formatTime,numberFormat } from "../../../../utils/util.js";
import {splitStr,editVersionType} from "../../../../utils/util";
//获取应用实例
const app = getApp()

Page({

    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        currentTab: 0,
        keywords: '',
        orderData: [],
        height: 550,
        regInfo: { pageNumber: 1, pageSize: 20, salesId: 1 },
        // regInfo: { pageNumber: 1, pageSize: 20, orderType:0,salesId:1},
        totalPrice: 0,
        list: [],
        Allchecked: false,
        suborderDiscountDetail: {},
        mxamount: [],
        more: false,
        fastLoading: true,
        modal: {
            show: false, //modal是否显示，默认false
            contentText: '',
            icon: '',
            iconSize: '',
            image: '',
            imageSize: ''
        },
        updateTime: '',
        update: false,
        orderType: 0,
        imgBaseUrl:'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'
    },
    TimeID: -1,
    onLoad: function(options) {
        // console.log(options);
        //接收参数，显示对应状态订单
        this.setData({
            currentTab: options.type,
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
    /**
   * 查看制作文件
   * @param {*} options 
   */
     confirmedFile(options) {
        let sid = options.currentTarget.dataset.sid;
        let ordersn =  options.currentTarget.dataset.sn;
        let type =  options.currentTarget.dataset.type;
        let token = wx.getStorageSync('token')
        let obj = {
          token:token,
          sn:ordersn,
          id:sid,
          type:type
        }
        wx.navigateTo({
            url:"../orderDetails/checkFile/index?data=" + JSON.stringify(obj)
        })
      },
    /**
     * 取消分享
     */
    cancelShareOrder(e) {
        wx.showLoading({
            title: '加载中',
            icon: 'loading',
            mask: true
          });
          canclePrintAllot({orderNo:e.currentTarget.dataset.sn}).then(res=>{
            if (res.success) {
                this.modalFun({ contentText: '取消成功', icon: 'icon-check' })
            }
            this.getAllOrder()
            wx.hideLoading()
        })
    },
    /**
     * 弹窗
     * @param {} param0 
     */
    modalFun: function({ contentText, icon, iconSize, image, imageSize, time }) {
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
    onPullDownRefresh() {
        // this.getOrder()
        this.getAllOrder();

    },
    onShow: function() {
        this.onShareAppMessage =()=>({...app.globalData.shareObj})
        this.getAllOrder();
        this.setData({
            height: wx.getSystemInfoSync().windowHeight - 98
        })
    },
    //跳转到物流页
    lookLogistics(e){
    wx.navigateTo({
        url:'../logistics/index?orderSn='+e.currentTarget.dataset.orderno
    })
    },
    loading: function () {
        var that = this
        if (that.data.fastLoading) {
          return false
        }
        if (this.data.orderData.length % 20!==0&&this.data.orderData.length % 20 < 20 ) {
          console.log(this.data.orderData.length);
          that.setData({
            more: true
          })
          setTimeout(() => { that.setData({ more: false }) }, 2000)
        } else {
          this.setData({
            fastLoading:true,
          })
          wx.showLoading({
            title: '加载中',
            icon: 'loading',
            mask: true
          });
          this.data.regInfo.pageNumber = this.data.orderData.length / 20 + 1;
          getAllOrder(this.data.regInfo).then(res => {
            var orderdatarr = res.data.map(item => {
              if (item.miniEditionGoodsInfo) {
                item.miniEditionGoodsInfo.map(e => {
                
                  e.versionType=editVersionType(e.versionType)
                  let a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
                  e.bluePaperConfirmTime = e.bluePaperConfirmTime && this.timestampToTime(e.bluePaperConfirmTime)
                  e.printTime = e.printTime && this.timestampToTime(e.printTime)
                  if(e.priceinfoMap){
                    if(e.priceinfoMap.openSize){
                      e.priceinfoMap.openSize[0]=numberFormat(e.priceinfoMap.openSize[0])
                      e.priceinfoMap.openSize[1]=numberFormat(e.priceinfoMap.openSize[1])
                    }
                }
                  for(let key of a){
                    // console.log(key[0]);
                    if(key[0]=='纸张材质'){
                      if(key[1].indexOf('银') != -1 || key[1].indexOf('金') != -1){
                        console.log(123);
                        e.isValue='exist'
                      }else{
                        e.isValue='aa'
                      }
                    }
                  }
                  e.goodsAttr = a;
                  return e
                });
                item.confirmtime =  this.timestampToTime(item.confirmTime);
                item.newMoney = item.amount - (item.bonusMoney||0)
                item.suborderDiscountDetail = JSON.parse(item.suborderDiscountDetail)
                item.addtime = this.timestampToTime(item.addtime)
                return item
              }
            })
    
            this.setData({
              fastLoading:false,
              orderData: this.data.orderData.concat(orderdatarr)
            });
            wx.hideLoading();
          })
        }
      },
    //获取订单列表
    getAllOrder: function() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        this.setData({
            update: false
        })
        clearInterval(this.data.updateTime)
            //判断请求对应状态的订单
            if (this.data.currentTab && this.data.currentTab != '0') {
                this.setData({
                regInfo: { pageNumber: 1, pageSize: 20, orderType: 4, status: this.data.currentTab, sourceUid: 1}
                })
            } else {
                this.setData({
                regInfo: { pageNumber: 1, pageSize: 20, orderType: 4, sourceUid: 1 }// 全部
                })
            }
        /**
         * 获取订单列表
         */
         getAllOrder(this.data.regInfo).then(res => {
            wx.hideLoading()
            this.setData({
                    orderData: res.data.map(item => {
                        if (item.miniEditionGoodsInfo) {
                            item.miniEditionGoodsInfo.map(e => {
                                // let arr = e.goodsAttr.split(';')
                                // arr = (arr.map(s => {
                                //     return s.split(':')
                                // })).filter(a => { return a != "" })
                                e.bluePaperConfirmTime = e.bluePaperConfirmTime && this.timestampToTime(e.bluePaperConfirmTime)
                                e.printTime = e.printTime && this.timestampToTime(e.printTime)
                                e.versionType=editVersionType(e.versionType)
                                let arr = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
                                if(e.priceinfoMap){
                                  if(e.priceinfoMap.openSize){
                                    e.priceinfoMap.openSize[0]=numberFormat(e.priceinfoMap.openSize[0])
                                    e.priceinfoMap.openSize[1]=numberFormat(e.priceinfoMap.openSize[1])
                                  }
                              }
                                for(let key of arr){
                                  // console.log(key[0]);
                                  if(key[0]=='纸张材质'){
                                    if(key[1].indexOf('银') != -1 || key[1].indexOf('金') != -1){
                                      console.log(123);
                                      e.isValue='exist'
                                    }else{
                                      e.isValue='aa'
                                    }
                                  }
                                }
                                e.goodsAttr = arr
                                return e
                            })
                            item.newMoney = item.amount - (item.bonusMoney||0)
                            item.confirmtime = this.timestampToTime(item.confirmTime);
                            item.addtime = this.timestampToTime(item.addtime)
                            item.suborderDiscountDetail = JSON.parse(item.suborderDiscountDetail)
                            return item
                        }
                    })
                })
            // 处理完成后，终止下拉刷新
            wx.stopPullDownRefresh()
        })
    },
    //转换时间显示格式
    timestampToTime: function(time) {
        var date = new Date(time * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    },

    //搜索
    getkeywords: function(e) {
        var val = e.detail.value;
        let reg = /^[1-9]\d*$|^0$/;
        if (!reg.test(val)) {
          val = "";
          this.modalFun({ contentText: "请输入正确的订单编号", time: 2000 });
          
        }
        this.setData({
            keywords: val
        });
    },
    clearText: function() {
        this.setData({
            keywords: ''
        })
        this.getAllOrder()
    },
    search: function() {
        var keywords = this.data.keywords
        getAllOrder({ orderNo: keywords, pageNumber: 1, pageSize: 40, orderType: 4, salesId: 1 }).then(res => {
            wx.hideLoading()
            this.setData({
                orderData: res.data.map(item => {
                    if (item.miniEditionGoodsInfo) {
                        item.miniEditionGoodsInfo.map(e => {
                            e.versionType=editVersionType(e.versionType)
                            let arr = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
                            e.bluePaperConfirmTime = e.bluePaperConfirmTime && this.timestampToTime(e.bluePaperConfirmTime)
                            e.printTime = e.printTime && this.timestampToTime(e.printTime)
                            if(e.priceinfoMap){
                              if(e.priceinfoMap.openSize){
                                e.priceinfoMap.openSize[0]=numberFormat(e.priceinfoMap.openSize[0])
                                e.priceinfoMap.openSize[1]=numberFormat(e.priceinfoMap.openSize[1])
                              }
                          }
                            for(let key of arr){
                              // console.log(key[0]);
                              if(key[0]=='纸张材质'){
                                if(key[1].indexOf('银') != -1 || key[1].indexOf('金') != -1){
                                  console.log(123);
                                  e.isValue='exist'
                                }else{
                                  e.isValue='aa'
                                }
                              }
                            }
                            e.goodsAttr = arr
                            return e
                        })
                        item.newMoney = item.amount - (item.bonusMoney||0)
                        item.confirmtime = this.timestampToTime(item.confirmTime);
                        item.addtime = this.timestampToTime(item.addtime)
                        item.suborderDiscountDetail = JSON.parse(item.suborderDiscountDetail)
                        return item
                    }
                })
            })
        })
    },
    //多选
    checkboxChange: function(e) {
        var arr = e.detail.value.map(item => {
            return this.data.orderData[item * 1]
        })
        if (e.length === this.data.orderData.length) {
            var allStatu = true
        } else {
            var allStatu = false
        }
        this.setData({
            Allchecked: allStatu
        })
        this.allCheckStatu(arr)
    },
    //算总价
    allCheckStatu: function (e) {
        var priceArr = e.map(item => { return item.amount}).reduce((prev, curr) => { return prev  + curr  }, 0)
        console.log(e);
        this.setData({
        list: e.map(item => { return item.parentOrderNo }),
        totalPrice: priceArr,
        })
    },
    //全选
    allCheckboxChange: function() {
        var brick = this.data.orderData;
        if (!this.data.Allchecked) {
            this.allCheckStatu(this.data.orderData)
            brick = brick.map(item => { item.checked = true; return item })
        } else {
            this.allCheckStatu([])
            brick = brick.map(item => { item.checked = false; return item })
        }
        this.setData({
            Allchecked: !this.data.Allchecked,
            orderData: brick
        })
    },
    /**
     * 合并支付
     */
    totalPay: function() {
        wx.showLoading({
            title: '',
            icon: 'loading',
            mask: true
        });
        //合并订单
        createOrder({ list: this.data.list }).then(res => {
            //调用微信支付
            createProxyMergePayQrCode({ orderNo: res.data.orderNo, payType: app.globalData.payType3 }).then(resp => {
                var payBean = JSON.parse(resp.data)
                wx.hideLoading();
                wx.requestPayment({
                    'timeStamp': payBean.timeStamp, //时间戳
                    'nonceStr': payBean.nonceStr, //随机字符串
                    'package': payBean.package, //统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
                    'signType': payBean.signType, //非必要——签名算法
                    'paySign': payBean.paySign, //签名
                    'success': function(e) {
                        console.log(e);
                        this.getAllOrder()
                            // wx.navigateTo({
                            //   url: '../../turntable/index?orderNo='+res.data.orderNo
                            // })
                    },
                    'fail': function(e) {
                        wx.hideLoading()
                        wx.showModal({
                            title: "提示",
                            content: "支付失败",
                            showCancel: false,
                            success: function() {}
                        })
                    }
                })
            })
        })
    },
    //调用微信支付
    WXpay: function(e) {
        wx.showLoading({
            title: '',
            icon: 'loading',
            mask: true
        });

        WxPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType3 }).then(res => {
          console.log(431,res);
            var payBean = JSON.parse(res.data)
            console.log(432,payBean);
            wx.requestPayment({
                // 'appId':payBean.appid,
                'timeStamp': payBean.timeStamp, //时间戳
                'nonceStr': payBean.nonceStr, //随机字符串
                'package': payBean.package, //统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
                'signType': payBean.signType, //非必要——签名算法
                'paySign': payBean.paySign, //签名
                'success': function(res) {
                    this.getAllOrder();
                },
                fail: function(res) {
                  console.log(443,res);
                    wx.hideLoading()
                    wx.showModal({
                        title: "提示",
                        content: "支付失败",
                        showCancel: false,
                        success: function() {}
                    })
                }
            })
            wx.hideLoading();
        })
    },
    //支付补差价订单
    DiffOrderPay: function(e) {
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
                'success': function(res) {
                    this.getAllOrder()
                },
                'fail': function(res) {
                    wx.hideLoading()
                    wx.showModal({
                        title: "提示",
                        content: "支付失败",
                        showCancel: false,
                        success: function() {}
                    })
                }
            })
        })
    },
    //tabs切换
    tabsCrount: function(e) {
        var that = this;
        if (this.data.currentTab === e.currentTarget.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.currentTarget.dataset.current
            })
            that.getAllOrder();

            // that.getOrder()
        }
    },
    cancel: function(e) {
        var that = this
        wx.showModal({
            title: '取消订单',
            confirmColor: '#02BB00',
            content: '确认取消此订单？',
            success: function(res) {
                if (res.confirm) {
                  cancelOrder({ data: e.currentTarget.dataset.sn }).then(res => {
                        if (res.success) {
                            that.modalFun({ contentText: '取消成功', icon: 'icon-check' })
                        } else {
                            that.modalFun({ contentText: '订单取消失败，请稍后重试' })
                        }
                        // that.getOrder()
                        that.getAllOrder();

                    })
                } else {
                    // console.log('点击取消回调')
                }
            }
        })

    },
    delOrder: function(e) {
        var _this = this
        wx.showModal({
            title: '删除订单',
            confirmColor: '#02BB00',
            content: '确认删除此订单？',
            success: function(res) {
                if (res.confirm) {
                    deleteOrder({ data: e.currentTarget.dataset.sn }).then(res => {
                        // _this.getOrder()
                        if (res.success) {
                            _this.modalFun({ contentText: '删除成功', icon: 'icon-check' })
                            _this.getAllOrder();
                        } else {
                            _this.modalFun({ contentText: '删除失败，' + res.message })
                        }
                    })
                }
            }
        })
    },
    // 查看上传文件
    //打开PDF
    lookPdf: function(e) {
        wx.showLoading({
            title: '加载文件中...',
            mask: true
        });
        // console.log("查看文件4444", e);
        // url: app.globalData.OSSFileUrl + e.currentTarget.dataset.url,
        wx.downloadFile({
            url: app.globalData.OSSFileUrl + e.currentTarget.dataset.url,
            success: function(res) {
                console.log('查看文件4444', res);
                wx.hideLoading()
                const filePath = res.tempFilePath
                wx.openDocument({
                    filePath: filePath,
                    fileType: 'pdf',
                    success: function(res) {
                        // console.log('打开文档成功')
                    }
                })
            },
            fail: function(res) {
                wx.hideLoading()
            }
        })
    },

    runTime() {
        let _this = this
        let ti = 7 * 60 * 60 * 24
        this.setData({
            updateTime: setInterval(() => {
                // console.log(_this.data.orderData);
                _this.data.orderData.forEach((item, i) => {
                    _this.setData({
                        ['orderData[' + i + '].downTime']: ((item.confirmedTime + ti) - (new Date().getTime() / 1000)) > 0 ? ('结算倒计时:' + _this.timestampToTime((item.confirmedTime + ti) - new Date().getTime() / 1000)) : ''
                    })
                });
            }, 1000)
        })
    },
    // //转换时间显示格式
    // timestampToTime: function (time) {
    //   var D = (parseInt(time/86400)>0?parseInt(time/86400):0 )+ '天';
    //   var h = (parseInt((time%86400)/3600)>0?parseInt((time%86400)/3600):0 )+ '时';
    //   var m = (parseInt(((time%86400)%3600)/60)>0?parseInt(((time%86400)%3600)/60):0) + '分';
    //   var s = (parseInt(((time%86400)%3600)%60)>0?parseInt(((time%86400)%3600)%60):0) + '秒';
    //   return  D + h + m + s;
    // },
    //跳转到订单详情
    getOrderDetails(e) {
        console.log("单号", e.currentTarget.dataset.sn);
        const _this = this
        let isTemplate = e.currentTarget.dataset.template;
        if(isTemplate==1){

        }else{
          clearTimeout(this.TimeID)
          this.TimeID = setTimeout(function() {
              console.log(e);
              wx.navigateTo({
                  url: '../orderDetails/index?data=' + e.currentTarget.dataset.sn + '&type=share'
              })
          }, 500)
        }
      
        
    },
    bindPrint(e){
      console.log(e);
      let id = e.currentTarget.dataset.sid
      let sn = e.currentTarget.dataset.sn
      wx.removeStorage({ key: 'orderNo' })
      wx.setStorageSync('orderNo',sn)
      wx.setStorageSync('orderId',id)
      wx.navigateTo({
        url: '../../../categoryPages/print/index',
      })
      
    },
    onHide() {
        clearInterval(this.data.updateTime)
    },
    onUnload() {
        clearInterval(this.data.updateTime)
    }
})