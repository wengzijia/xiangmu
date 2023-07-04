//index.js
import { getAllSupplierOrder, deleteOrder, SingcancelOrder, singnCreatePayQrCode, createOrder1, singleWxPayUrl, DiffOrderPayUrl,cancleAllot } from "../../../../api/orderApi.js";
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
        imgBaseUrl:'https://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/',
        value:false
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
        let ordersn =  options.currentTarget.dataset.ordersn;
        let token = wx.getStorageSync('token')
      
        wx.navigateTo({
            url:`../orderDetails/checkFile/index?token=${token}&sn=${ordersn}&id=${sid}`
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
        cancleAllot({orderNo:e.currentTarget.dataset.sn}).then(res=>{
            wx.hideLoading()
            if (res.success) {
                this.modalFun({ contentText: '取消成功', icon: 'icon-check' })
            }
            this.getAllOrder()
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
          getAllSupplierOrder(this.data.regInfo).then(res => {
            var orderdatarr = res.data.map(item => {
              if (item.children) {
                item.children.map(e => {
                
                  e.versionType=editVersionType(e.versionType)
                  let a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
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
                  if(e.priceinfoMap){
                    if(e.priceinfoMap.greyVersion){
                     e.priceinfoMap.IsOpen=true
                     a = splitStr(e.priceinfoMap.competGoodsAttr,app.globalData.frontPaperMap);
                     e.priceinfoMap.pinbanObj = {
                      facialTissue: JSON.parse(e.priceinfoMap.facialTissue), // 面纸内贴
                      facialTissueResp: e.priceinfoMap.facialTissueResp?JSON.parse(e.priceinfoMap.facialTissueResp):'',
                      greyVersion: JSON.parse(e.priceinfoMap.greyVersion) // 灰板
                    }
                    for (let i = 0; i < e.priceinfoMap.pinbanObj.greyVersion.length; i++) {
                        const el = e.priceinfoMap.pinbanObj.greyVersion[i];
                        let ar = el.part.split('_')
                        el.title = this.findName(ar)
                    }
            
                    for (let i = 0; i < e.priceinfoMap.pinbanObj.facialTissue.length; i++) {
                        const el = e.priceinfoMap.pinbanObj.facialTissue[i];
                        let ar = el.part.split('_')
                        el.title = this.findName(ar)
                    }
                    }else{
                      a = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
                     e.priceinfoMap.IsOpen=false
                    }
                   }
                  e.goodsAttr = a;
                  return e
                });
                item.confirmtime =  this.timestampToTime(item.confirmTime);
                // item.newMoney = item.amount - (item.bonusMoney||0)
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
    findName(ar) {
        let arr = [ { key: "floor", val: "地盒" }, { key: "canopy", val: "天盖" }, { key: "innerFrame", val: "内围框" }, { key: "leather", val: "皮壳", },
        { key: "innerBox", val: "内盒", }, { key: "cabinet", val: "柜桶", }, { key: "drawer", val: "抽屉", }]
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
            str+= '/'
        }
        str += obj.val
        }

        return str
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
        switch (this.data.currentTab) {
            case "1":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, status: '1', salesId: 1 } //待付款
                })
                break;
            case "2":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, status: '2', salesId: 1 }, //待确认
                    update: true
                })
                break;
            case "3":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, status: '3', salesId: 1 } //已发货
                })
                break;
            case "5":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, status: '5', salesId: 1 } //待发货
                })
                break;
            case "''":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, salesId: 1 }, //全部 
                })
                break;
                // case "5":
                //   this.setData({
                //     regInfo: { pageNumber: 1, pageSize: 20, status: "confirmed" },//待结算
                //     update:true
                //   })
                //   break;
            default:
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, salesId: 1 }, //全部 
                })
                break;
        }
        /**
         * 获取订单列表
         */
        getAllSupplierOrder(this.data.regInfo).then(res => {
            wx.hideLoading()
            this.setData({
                    orderData: res.data.map(item => {
                      item.value=false
                        if (item.children) {
                            item.children.map(e => {
                                // let arr = e.goodsAttr.split(';')
                                // arr = (arr.map(s => {
                                //     return s.split(':')
                                // })).filter(a => { return a != "" })
                                e.versionType=editVersionType(e.versionType)
                                let arr = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
                                if(e.priceinfoMap){
                                  if(e.priceinfoMap.openSize){
                                    e.priceinfoMap.openSize[0]=numberFormat(e.priceinfoMap.openSize[0])
                                    e.priceinfoMap.openSize[1]=numberFormat(e.priceinfoMap.openSize[1])
                                  }
                                  // 去除市场价 减少中台修改 
                                  if (e.priceinfoMap.paperTonsMaterPriceStr) {
                                    let strArr =  e.priceinfoMap.paperTonsMaterPriceStr.split('/')
                                    if(strArr.length>0){
                                      e.priceinfoMap.paperTonsMaterPriceStr2 = String(e.priceinfoMap.paperTonsDiscountPrice)+'元/'+strArr[1]
                                    }
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
                                if(e.priceinfoMap){
                                  if(e.priceinfoMap.greyVersion){
                                   e.priceinfoMap.IsOpen=true
                                   arr = splitStr(e.priceinfoMap.competGoodsAttr,app.globalData.frontPaperMap);
                                   e.priceinfoMap.pinbanObj = {
                                    facialTissue: JSON.parse(e.priceinfoMap.facialTissue), // 面纸内贴
                                    facialTissueResp: e.priceinfoMap.facialTissueResp?JSON.parse(e.priceinfoMap.facialTissueResp):'',
                                    greyVersion: JSON.parse(e.priceinfoMap.greyVersion) // 灰板
                                  }
                                  for (let i = 0; i < e.priceinfoMap.pinbanObj.greyVersion.length; i++) {
                                      const el = e.priceinfoMap.pinbanObj.greyVersion[i];
                                      let ar = el.part.split('_')
                                      el.title = this.findName(ar)
                                  }
                          
                                  for (let i = 0; i < e.priceinfoMap.pinbanObj.facialTissue.length; i++) {
                                      const el = e.priceinfoMap.pinbanObj.facialTissue[i];
                                      let ar = el.part.split('_')
                                      el.title = this.findName(ar)
                                  }
                                  }else{
                                    arr = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
                                   e.priceinfoMap.IsOpen=false
                                  }
                                 }
                                e.goodsAttr = arr
                                return e
                            })
                            // item.newMoney = item.amount - (item.bonusMoney||0)
                            item.confirmtime = this.timestampToTime(item.confirmTime);
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
        var D = date.getDate() + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    },

    //搜索
    getkeywords: function(e) {
        var val = e.detail.value;
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
        getAllSupplierOrder({ orderNo: keywords, pageNumber: 1, pageSize: 40, orderType: this.data.orderType, salesId: 1 }).then(res => {
            wx.hideLoading()
            this.setData({
                orderData: res.data.map(item => {
                  item.value=false
                    if (item.children) {
                        item.children.map(e => {
                            // let arr = e.goodsAttr.split(';')
                            // arr = (arr.map(s => {
                            //     return s.split(':')
                            // })).filter(a => { return a != "" })
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
                            if(e.priceinfoMap){
                              if(e.priceinfoMap.greyVersion){
                               e.priceinfoMap.IsOpen=true
                               arr = splitStr(e.priceinfoMap.competGoodsAttr,app.globalData.frontPaperMap);
                               e.priceinfoMap.pinbanObj = {
                                facialTissue: JSON.parse(e.priceinfoMap.facialTissue), // 面纸内贴
                                facialTissueResp: e.priceinfoMap.facialTissueResp?JSON.parse(e.priceinfoMap.facialTissueResp):'',
                                greyVersion: JSON.parse(e.priceinfoMap.greyVersion) // 灰板
                              }
                              for (let i = 0; i < e.priceinfoMap.pinbanObj.greyVersion.length; i++) {
                                  const el = e.priceinfoMap.pinbanObj.greyVersion[i];
                                  let ar = el.part.split('_')
                                  el.title = this.findName(ar)
                              }
                      
                              for (let i = 0; i < e.priceinfoMap.pinbanObj.facialTissue.length; i++) {
                                  const el = e.priceinfoMap.pinbanObj.facialTissue[i];
                                  let ar = el.part.split('_')
                                  el.title = this.findName(ar)
                              }
                              }else{
                                arr = splitStr(e.goodsAttr,app.globalData.frontPaperMap);
                               e.priceinfoMap.IsOpen=false
                              }
                             }
                            e.goodsAttr = arr
                            return e
                        })
                        // item.newMoney = item.amount - (item.bonusMoney||0)
                        item.confirmtime = this.timestampToTime(item.confirmTime);
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
    allCheckStatu: function(e) {
        var priceArr = e.map(item => { return item.amount * 1 }).reduce((prev, curr) => { return prev * 1 + curr * 1 }, 0)
        this.setData({
            list: e.map(item => { return item.orderNo }),
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
        createOrder1({ list: this.data.list }).then(res => {
            //调用微信支付
            singnCreatePayQrCode({ orderNo: res.data.orderNo, payType: app.globalData.payType }).then(resp => {
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

        singleWxPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType }).then(res => {
            var payBean = JSON.parse(res.data)
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
        if (e.currentTarget.dataset.status=="nopaid") {
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
                    SingcancelOrder({ data: e.currentTarget.dataset.sn }).then(res => {
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
        clearTimeout(this.TimeID)
        this.TimeID = setTimeout(function() {
            console.log(e);
            wx.navigateTo({
                url: '../orderDetails/index?data=' + e.currentTarget.dataset.sn + '&type=share'
            })
        }, 500)
    },
    textChange(e) {
     
      let index=e.currentTarget.dataset.index
      let orderData=this.data.orderData
   
      var ischeck2 = orderData[index].value;
      orderData[index].value = !ischeck2;
      this.setData({
        orderData: orderData
      });
      console.log(ischeck2);
    },
    onHide() {
        clearInterval(this.data.updateTime)
    },
    onUnload() {
        clearInterval(this.data.updateTime)
    }
})