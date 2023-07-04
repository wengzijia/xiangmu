//index.js
import { getAllOrder, deleteOrder, cancelOrder, createWxPayUrl, createOrder, WxPayUrl, DiffOrderPayUrl } from "../../../api/orderApi.js";
import { paperSplitStr } from "../../../utils/util.js";
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
        regInfo: { pageNumber: 1, pageSize: 20, orderType: 0 },
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
        checkedListPayType:''
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
            wx.showLoading({
                title: '加载中',
                icon: 'loading',
                mask: true
            });
            this.setData({
                fastLoading: true
            })
            this.data.regInfo.pageNumber = this.data.orderData.length / 20 + 1;
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
                    e.miniEditionGoodsInfo[0].goodsAttr = paperSplitStr(e,e.miniEditionGoodsInfo[0].goodsAttr)
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
                    regInfo: { pageNumber: 1, pageSize: 20, orderType: this.data.orderType, status: 'nopaid' } //待付款
                })
                break;
            case "2":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, orderType: this.data.orderType, status: 'confirmed' }, //待配送
                    update: true
                })
                break;
            case "3":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, orderType: this.data.orderType, status: 'shipped' } //已完成
                })
                break;
            case "4":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, orderType: this.data.orderType, status: 'cancel' } //已取消
                })
                break;
            case "0":
                this.setData({
                    regInfo: { pageNumber: 1, pageSize: 20, orderType: this.data.orderType }, //全部 
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
                    regInfo: { pageNumber: 1, pageSize: 20 }, //全部 
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
                                item.goodsAttr = paperSplitStr(e,item.goodsAttr)
                                return item
                            })
                        }

                        // var goodsAttrText = e.miniEditionGoodsInfo[i].goodsAttr
                        // if (goodsAttrText.indexOf('纸行名称') == -1&&e.addtime>1629547810) {
                        //   goodsAttrText = '纸行名称:'+e.paper.paperShop+';纸张品牌:'+e.paper.brand+';吨价/平方单价:'+e.paper.paperTonprice+'元;'+goodsAttrText
                        // }else if(goodsAttrText.indexOf('吨价/平方单价')){
                        //   let str = '吨价/平方单价:'+e.paper.paperBaseprice+'元'
                        //   let str2 = '吨价/平方单价:'+e.paper.paperTonprice+'元'
                        //   goodsAttrText = goodsAttrText.replace(str,str2)
                        // }

                        // var arr = goodsAttrText.split(';')
                        // // arr.splice(1,0,'纸张信息:'+e.paper.brand+e.paper.kg+'g'+e.paper.colour)
                        // arr =(arr.map(item =>{
                        //   return item.split(':')
                        // })).filter(s=>{return s!=""})
                        // e.miniEditionGoodsInfo[i].goodsAttr = arr
                        return e
                    }),
                    list: []
                })
                // 处理完成后，终止下拉刷新
            wx.stopPullDownRefresh()
                // //结算倒计时
                // if (this.data.currentTab=='0'||this.data.currentTab=='2'||this.data.currentTab=='5') {
                //   this.runTime()
                // }
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
        getAllOrder({ orderNo: keywords, pageNumber: 1, pageSize: 40, orderType: this.data.orderType }).then(res => {
            this.setData({
                orderData: res.data
            })
        })
    },
    //多选
    checkboxChange: function(e) {
        if(e.detail.value.length==0){
            this.setData({
                list: [],
                totalPrice: 0,
            })
            return
        }
        var checkedListType = ''
        if (this.data.orderData[e.detail.value[0] * 1].paperSaleId) {
            checkedListType = 'paper'
            this.setData({
                checkedListPayType : app.globalData.payType2
            })
        }else{
            checkedListType = 'printing'
            this.setData({
                checkedListPayType : app.globalData.payType3
            })
        }
        if ((this.data.orderData[e.detail.value[e.detail.value.length-1] * 1].paperSaleId && checkedListType == 'paper')||(!this.data.orderData[e.detail.value[e.detail.value.length-1] * 1].paperSaleId && checkedListType == 'printing')) {
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
        }else{
            this.modalFun({ contentText: '九发纸业/金福纸业 需单独结算订单~' })
            var i = e.detail.value[e.detail.value.length-1] * 1
            this.setData({
                ["orderData[" + i +"].checked"]:false
            })
        }
    },
    //算总价
    allCheckStatu: function(e) {
        var priceArr = e.map(item => { return item.amount * 1 }).reduce((prev, curr) => { return prev * 1 + curr * 1 }, 0)
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
            let obj = this.data.orderData.find(item=>{return item.parentOrderNo==this.data.list[0]})
            if (obj.paperSaleId) {
                brick = brick.map(item => {
                    if (item.paperSaleId) {
                        item.checked = true
                    }else{
                        item.checked = false
                    }
                    return item 
                })
            }else{
                brick = brick.map(item => {
                    if (!item.paperSaleId) {
                        item.checked = true
                    }else{
                        item.checked = false
                    }
                    return item 
                })
            }
            var arr = brick.map(item=>{if (item.checked) {
                return item
            }}).filter(e=>e)
            if (arr.length!=brick.length) {
                this.modalFun({ contentText: '九发纸业/金福纸业 需单独结算订单~' })
            }
            this.allCheckStatu(arr)
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
        
            if (!res.success) {
                wx.hideLoading()
                wx.showModal({
                    title: "提示",
                    content: "合并订单失败，请稍后重试！",
                    showCancel: false,
                    success: function() {}
                })
                return
            }
            //调用微信支付
            createWxPayUrl({ orderNo: res.data.orderNo, payType: this.data.checkedListPayType }).then(resp => {
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
        var payType = e.currentTarget.dataset.paytype?app.globalData.payType2:app.globalData.payType3
        WxPayUrl({ orderNo: e.currentTarget.dataset.sn, payType: payType }).then(res => {
            if (!res.success) {
                wx.hideLoading()
                wx.showModal({
                    title: "提示",
                    content: "唤起微信支付失败，请联系客服！",
                    showCancel: false,
                    success: function() {}
                })
                return
            }
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
        if (e.currentTarget.dataset.status=="nopaid") {
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
            if (!res.success) {
                wx.hideLoading()
                wx.showModal({
                    title: "提示",
                    content: "差价订单支付失败，请联系客服！",
                    showCancel: false,
                    success: function() {}
                })
                return
            }
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
        console.log('eee',e)
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
    // 分享去支付
    sharePay() {
        wx.navigateTo({
            url: "/pages/personageCenter/allOrder/orderDetails/share/index"
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
                url: 'orderDetails/index?data=' + e.currentTarget.dataset.sn
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