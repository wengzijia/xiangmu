//index.js
import { getAllOrder, deleteOrder, cancelOrder, createWxPayUrl, createOrder, WxPayUrl, DiffOrderPayUrl,cancleProcessAllot } from "../../../../api/orderApi.js";
import { paperSplitStr,processSplitStr } from "../../../../utils/util.js";

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
        regInfo: { pageNumber: 1, pageSize: 20, orderType: 0, sourceUid: 1 },
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
        orderType: 2,
    },
    TimeID: -1,
    onLoad: function(options) {
        // console.log(options);
        //接收参数，显示对应状态订单
        this.setData({
            currentTab: options.type,
        })
    },
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
        this.getOrder()
    },
    onShow: function() {
        this.onShareAppMessage =()=>({...app.globalData.shareObj})
        this.getOrder()
        this.setData({
            admin: app.globalData.admin,
            height: wx.getSystemInfoSync().windowHeight - 50
        })
    },
    loading: function() {
        var that = this
        if (that.data.fastLoading) {
            return false
        }
        if (this.data.orderData.length % 20!==0&&this.data.orderData.length % 20 < 20) {
            that.setData({
                more: true
            })
            setTimeout(() => { that.setData({ more: false }) }, 2000)
        } else {
            // wx.showLoading({
            //     title: '加载中',
            //     icon: 'loading',
            //     mask: true
            // });
            this.setData({
                fastLoading: true
            })
            this.data.regInfo.pageNumber = this.data.orderData.length / 20 + 1;
            // this.getOrder()
            getAllOrder(this.data.regInfo).then(res => {
                let ti = 7 * 60 * 60 * 24
                var orderdatarr = res.data.map(item => {
                    item.suborderDiscountDetail = JSON.parse(item.suborderDiscountDetail)
                    if (item.confirmedTime > 0 && ((item.confirmedTime + ti) - new Date().getTime() / 1000)) {
                        item.downTime = this.timestampToTime((item.confirmedTime + ti) - new Date().getTime() / 1000)
                    } else {
                        item.downTime = ''
                    }
                    return item
                })
                orderdatarr = orderdatarr.map(e => {
                   
                                e.goodsAttr =   processSplitStr(e.goodsAttr) 
                    // e.miniEditionGoodsInfo[0].goodsAttr = paperSplitStr(e,e.miniEditionGoodsInfo[0].goodsAttr)
                    return e
                })
                this.setData({
                    fastLoading: false,
                    orderData: this.data.orderData.concat(orderdatarr)
                })
                wx.hideLoading();
            })
        }
    },
    //获取订单列表
    getOrder: function() {
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
                    regInfo: { pageNumber: 1, pageSize: 20, orderType: this.data.orderType, status: 'nopaid', sourceUid: 1  } //待付款
                })
                break;
            case "2":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, orderType: this.data.orderType, status: 'confirmed', sourceUid: 1  }, //进行中
                    update: true
                })
                break;
            case "3":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, orderType: this.data.orderType, status: 'shipped', sourceUid: 1  } //已完成
                })
                break;
            case "4":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, orderType: this.data.orderType, status: 'cancel', sourceUid: 1  } //已取消
                })
                break;
            case "0":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, orderType: this.data.orderType, sourceUid:1 }, //全部 
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
                    regInfo: { pageNumber: 1, pageSize: 20, sourceUid: 1  }, //全部 
                })
                break;
        }
        getAllOrder(this.data.regInfo).then(res => {
            wx.hideLoading()
            var orderdatarr = res.data.map(item => {
                item.suborderDiscountDetail = JSON.parse(item.suborderDiscountDetail)
                return item
            })
            this.setData({
                    fastLoading: false,
                    orderData: orderdatarr.map(e => {
                        if (e.miniEditionGoodsInfo && e.miniEditionGoodsInfo.length > 0) {
                            e.miniEditionGoodsInfo.map(item => {
                                item.goodsAttr = processSplitStr(item.goodsAttr)
                                return item
                            })
                        }
                        return e
                    }),
                    list: []
                })
                console.log('orderData',this.data.orderData);
                // 处理完成后，终止下拉刷新
            wx.stopPullDownRefresh()
                // //结算倒计时
                // if (this.data.currentTab=='0'||this.data.currentTab=='2'||this.data.currentTab=='5') {
                //   this.runTime()
                // }
        })
    },
    /**
     * 分享订单
     */
    shareOrder(e) {
        wx.navigateTo({
        url: './share/index?data=' + e.currentTarget.dataset.sn + '&from=list'
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
        cancleProcessAllot({orderNo:e.currentTarget.dataset.sn}).then(res=>{
            wx.hideLoading()
            if (res.success) {
                this.modalFun({ contentText: '取消分享成功', icon: 'icon-check' })
            }
            this.getAllOrder()
        })
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
    },
    search: function() {
        var keywords = this.data.keywords
        getAllOrder({ orderNo: keywords, pageNumber: 1, pageSize: 40, orderType: this.data.orderType, sourceUid: 1  }).then(res => {
            this.setData({
                orderData: res.data
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
            createWxPayUrl({ orderNo: res.data.orderNo, payType: app.globalData.payType }).then(resp => {
                var payBean = JSON.parse(resp.data)
                wx.hideLoading();
                wx.requestPayment({
                    'timeStamp': payBean.timeStamp, //时间戳
                    'nonceStr': payBean.nonceStr, //随机字符串
                    'package': payBean.package, //统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
                    'signType': payBean.signType, //非必要——签名算法
                    'paySign': payBean.paySign, //签名
                    'success': function(e) {
                        // console.log(e);
                        wx.hideLoading()
                        this.getOrder()
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

        WxPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: app.globalData.payType }).then(res => {
            var payBean = JSON.parse(res.data)
            wx.requestPayment({
                // 'appId':payBean.appid,
                'timeStamp': payBean.timeStamp, //时间戳
                'nonceStr': payBean.nonceStr, //随机字符串
                'package': payBean.package, //统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
                'signType': payBean.signType, //非必要——签名算法
                'paySign': payBean.paySign, //签名
                'success': function(res) {
                    wx.hideLoading()
                    this.getOrder()
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
                    wx.hideLoading()
                    this.getOrder()
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
            that.getOrder()
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
                            that.modalFun({ contentText: '取消成功', icon: 'ac-icon-check' })
                        } else {
                            that.modalFun({ contentText: '订单取消失败，请稍后重试' })
                        }
                        that.getOrder()
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
                        _this.getOrder()
                        if (res.success) {
                            _this.modalFun({ contentText: '删除成功', icon: 'ac-icon-check' })
                        } else {
                            _this.modalFun({ contentText: '删除失败，' + res.message })
                        }
                    })
                }
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
    //转换时间显示格式
    timestampToTime: function(time) {
        var D = (parseInt(time / 86400) > 0 ? parseInt(time / 86400) : 0) + '天';
        var h = (parseInt((time % 86400) / 3600) > 0 ? parseInt((time % 86400) / 3600) : 0) + '时';
        var m = (parseInt(((time % 86400) % 3600) / 60) > 0 ? parseInt(((time % 86400) % 3600) / 60) : 0) + '分';
        var s = (parseInt(((time % 86400) % 3600) % 60) > 0 ? parseInt(((time % 86400) % 3600) % 60) : 0) + '秒';
        return D + h + m + s;
    },
    //跳转到订单详情
    getOrderDetails(e) {
        const _this = this
        clearTimeout(this.TimeID)
        this.TimeID = setTimeout(function() {
            console.log(e);
            wx.navigateTo({
                url: '../orderDetails/index?data=' + e.currentTarget.dataset.sn
            })
        }, 500)
    },
    onHide() {
        clearInterval(this.data.updateTime)
    },
    onUnload() {
        clearInterval(this.data.updateTime)
    }
})