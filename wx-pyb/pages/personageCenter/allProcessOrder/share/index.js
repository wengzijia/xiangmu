// const { json } = require("stream/consumers");
//index.js
import { getSupplierOrderDetails,allotProcesse, getCurrentUserInfo,editionFiles, WxPayUrl, confirmReceiver, SingcancelOrder, del, deleteOrder, DiffOrderPayUrl, repaidByOrderNo, createOrderRefund,ordersDetails } from "../../../../api/orderApi.js";
import {getCurrentTimeMillis} from "../../../../api/userApi.js";
import { intercept,splitStr,processSplitStr } from '../../../../utils/util';
import {data,methods} from '../../../../utils/credit';
//获取应用实例
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    ...methods,
    data: {
        ...data,
        creditType:'edition',
        creditCallBlack:'toOrderDetails',
        userInfo: null,
        ordersn:'',
        isShare:false,
        isFromList:false,
        isAdmin:false,
        orderDetail:'',
        mobile:'',
        time:30 * 60 * 60 * 1000,
        parentOrderNo:''
    },
    //获取用户id
    getUser(e){
        wx.showLoading({
            title: '',
            icon: 'loading',
            mask: true
        });
        getCurrentUserInfo({}).then(re=>{
            if (re.success) {
                let uId = re.data.id
                this.transfer(uId,e)
            }else{
                wx.showModal({
                    title: '网络异常',
                    showCancel: false, //隐藏取消按钮
                    content: '获取用户信息失败，请联系业务员',
                    success: function(res) {
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
    }, 
    //转移订单
    transfer(uId,e){
        console.log('UID',uId,'UUID',this.data.orderDetail.uid);
        if (uId==this.data.orderDetail.uid) {
            this.selectCredit(e)
        }else{
            allotProcesse({
                "orderNo": this.data.ordersn,
                "transferUid": uId
            }).then(res=>{
                console.log('转移',res);
                if (res.success) {
                    this.selectCredit(e)
                }else{
                    // console.log('allotProcesseError',res);
                    wx.hideLoading();
                    wx.showModal({
                        title: '订单转移失败',
                        showCancel: false, //隐藏取消按钮
                        content: '订单转移失败，请联系业务员',
                        success: function(res) {
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
    selectCredit(e){
        e.sn =  this.data.parentOrderNo
        e.wxPayCallBlack = 'wxPay'
        console.log('e',e)
        this.getUserCreditPurchase(e)
    },
    // 微信支付
    wxPay(no){
        let _this = this
        WxPayUrl({ orderNo: _this.data.parentOrderNo, payType: app.globalData.payType }).then(res => {
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
                    // console.log(res); 
                    // this.getOrderDetails()
                    wx.showToast({
                        title: '订单支付成功',
                        icon: 'success',
                        duration: 1500,
                        complete(){
                            _this.toOrderDetails()
                            // wx.redirectTo({
                            //     url: '../orderDetails/index?data='+_this.data.ordersn
                            // })
                        }
                    })
                    
                },
                'fail': function(res) {
                    console.log('err');
                    console.log(JSON.stringify(res))
                    console.log(res.detail)
                    console.log(res.message)
                    wx.hideLoading()
                    wx.showModal({
                        title: "提示",
                        content: "支付失败",
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {
                                _this.toOrderDetails()
                                // wx.redirectTo({
                                //     url: '../orderDetails/index?data='+_this.data.ordersn
                                // })
                            }
                        }
                    })
                }
            })
        })
    },
    toOrderDetails(){
        let _this = this
        wx.redirectTo({
            url: '../orderDetails/index?data='+_this.data.ordersn
        })
    },
    // 获取订单详情
    getOrderDetails() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        
        // console.log('res.data',this.data.ordersn);
        ordersDetails({ data: this.data.ordersn }).then(async res => {
            let date
            try {
                date =  (await getCurrentTimeMillis()).data
            } catch (error) {
                date = new Date().getTime()
            }
            wx.hideLoading()
            // console.log('res.data',res);
            var data = JSON.parse(res.data.suborderDiscountDetail)
            var orderdatarr = res.data
            let time = res.data.addtime*1000+24*60*60*1000 - date
            if (time<3*1000&&res.data.status == "nopaid") {
                this.canel()
            }else{
                this.setData({
                    time:time,
                })
            }
            orderdatarr.miniEditionGoodsInfo[0].goodsAttr = processSplitStr(orderdatarr.miniEditionGoodsInfo[0].goodsAttr)
            this.setData({
                orderDetail: orderdatarr,
                mobile: res.data.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2"),
                'orderDetail.suborderDiscountDetail':JSON.parse(res.data.suborderDiscountDetail),
                parentOrderNo:orderdatarr.parentOrderNo,
            })
        })
    },
    //取消订单
    canel(){
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        SingcancelOrder({ orderNo: this.data.ordersn }).then(res=>{
            // console.log('取消订单',res);
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(option) {        
        if (!app.globalData.isLogin) {
            wx.showLoading({
                title: '跳转中',
                mask: true
            })
            let str = option.data
            wx.navigateTo({
                url: '../../../login/index?data=' + str + '&type=shareOrder2',
                complete: () => {
                    wx.hideLoading()
                }
            })
            return false
        }
        if(option.from=='list'){
            // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXX',option);
            this.setData({
                isFromList:true,
                ordersn: option.data
            })
        }else{
            let obj = JSON.parse(option.data)
            // console.log('MMMMMMMMMMMMMMMMMMMMMM',obj);
            if (obj.name) {
                obj.nickName = obj.name
                // let obj = {
                //     avatarUrl:option.avatarUrl,
                //     nickName:option.name
                // }
                this.setData({
                        userInfo:obj,
                        ordersn: obj.sn
                }) 
            }
        }
        try {
            this.setData({
                xhToken: wx.getStorageSync('token')
            })
        } catch (error) {

        }
        // this.setData({
        //     source: option.type,
        //     ordersn: option.data
        // })

    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (app.globalData.isLogin){
            this.getOrderDetails()
            getCurrentUserInfo().then(res=>{
                if (res.data&&res.data.pybAdminMobile) {
                    this.setData({
                        isAdmin:true,
                    })
                } else {
                    this.setData({
                        isAdmin:false,
                    })
                }
                if (res.data&&res.data.pybAdminMobile&&this.data.isFromList) {
                    this.setData({
                        isShare:true,
                        userInfo:JSON.parse(wx.getStorageSync('wxUserInfo'))
                    })
                    let userInfo = JSON.parse(wx.getStorageSync('wxUserInfo'))
                    this.onShareAppMessage = ()=>{
                        let obj = {
                            sn:this.data.ordersn,
                            name:userInfo.nickName,
                            avatarUrl:userInfo.avatarUrl
                        }
                        // console.log('obj',obj);
                        return {
                            title: '分享订单',
                            path: '/pages/personageCenter/allProcessOrder/share/index?data='+JSON.stringify(obj),
                        }
                    }
                } else {
                    this.setData({
                        isShare:false,
                    })
                }
            })
        }
    },
    heid(){
        this.setData({
            isShare:false
        })
        setTimeout(()=>{
            wx.redirectTo({
                url: '../index?type=0'
              })
         },1000)
    },
})