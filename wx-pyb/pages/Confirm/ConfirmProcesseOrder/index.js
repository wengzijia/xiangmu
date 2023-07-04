// page/component/new-pages/cart/cart.js
import { checkEdition, addEditionOrder, createWxPayUrl, createWxPayUrl2,addSlittingFee,queryOrderCount } from "../../../api/cartApi.js";
import { createOrder,getCurrentUserInfo, WxPayUrl } from "../../../api/orderApi.js";
import {data,methods} from '../../../utils/credit'
const app = getApp()
Page({
  ...methods,
  data: {
    ...data,
    creditType:'edition',
    creditCallBlack:'toPage',
    carts: [],
    totalPrice: 0,
    username: '',
    phone: '',
    remarks: '',
    cuttingFeeprice:0,
    discountsPaperprice:0,
    isFrom:0,
    priceArr:[],
    cprice:0,
    differ:0,
    totalOrder:'',
    pitCprice:0,
    cutting:'',
    cartId:'',
    loading:false,
    Interval:'',
    type:1,
    modal: {
      show: false,//modal是否显示，默认false
      contentText:'',
      icon:'',
      iconSize:'',
      image:'',
      imageSize:''
    },
    queryCount:0,
    showModal:false,
    payRse:null,
    orderNo:''
  },
  /** 信用支付 */
  selectCredit(e){
    e.sn =  e.currentTarget.dataset.sn
    e.wxPayCallBlack = 'payOrder'
    console.log('e',e)
    this.getUserCreditPurchase(e)
  },
  onLoad: function (o) {
    wx.showShareMenu()
    // console.log('ooooooo', o);
    // this.getcheckEdition(o.isFrom == 1 ? 1 :0);
    this.getcheckEdition(1);
    // var type = o.isFrom == 0 ? 2 :1;
    var type = 1;
    this.setData({
      username: wx.getStorageSync('username'),
      phone: wx.getStorageSync('phone'),
      isFrom:o.isFrom,
      type:type,
    })

  },
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
    getCurrentUserInfo().then(res => {
      if (res.data.pybAdminMobile) {
        app.globalData.admin = true
      } else {
        app.globalData.admin = false
      }
    })
  },
  /**
   * 消息提示
   * @param {Object} 
   */
   modalFun({contentText,icon,iconSize,image,imageSize,time}){
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
  getcheckEdition(isFrom) {
    checkEdition({ isFrom,orderType:2 }).then(res => {
      if (!res.success) {
        wx.showModal({
          title: '提示',
          content: '没有找到订单数据,请稍后重试！',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
        return false;
      }
      this.setData({
        payRse:null,
        totalOrder:res.data,
        cartId:res.data.cartEditions[0].id,
        carts: res.data.cartEditions.map(e =>{
          e.goodsAttr=JSON.parse(e.goodsAttr)
          e.goodsAttr.map(str=>{
            var arr = str.goodsAttr.split(';');
            arr = arr.map(e =>{
              return e.split(':')
            })
            str.newgoods = arr.filter(s=>s)
            return str
          })
          return e
        })
      })
    })
  },
  formname(e) {
    this.setData({
      username: e.detail.value
    })
  },
  formphone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  formremarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  },

  ordernow() {
    let _this=this
    if (this.data.loading) {
      clearInterval(this.data.Interval)
      if (!this.Interval) {
        this.setData({
          Interval:setInterval(()=>{
            this.ordernow()
          },1000)
        })
      }
      return
    }
    clearInterval(this.data.Interval)
      // if(!this.data.cutting){
      //   this.modalFun({contentText:'请输入分切费用',time:1000})
      //   return
      // }
    // console.log(this.data.username, this.data.phone)
    // this.data.username
    // if(this.data.username.length>=1&&this.data.phone.length==11&&this.data.username.length<15){
    // else 
    // var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    
    if (!/^(?:[\u4e00-\u9fa5·]{2,16})$/.test(this.data.username)) {
      console.log(this.data.username);
      wx.showToast({
        title: '请输入正确姓名', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    }else if(!/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(this.data.phone)){
      console.log(this.data.phone);
      wx.showToast({
        title: '请输入正确手机号', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    }else if(this.data.remarks.length>120){
      wx.showToast({
        title: '备注字数不能超过120个', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    } else {
      // if (this.data.payRse&&this.data.payRse.success) {
      //   // 传入selectCredit的参数
      //   let ev = {
      //     currentTarget:{
      //       dataset:{
      //         amount:_this.data.totalPrice,
      //         sn: this.data.payRse.data.length == 1?this.data.payRse.data[0].data:_this.data.orderNo,
      //       }
      //     },
      //     wxPayCallBlack:'payOrder'
      //   }
      //   // console.log('evev',ev)
      //   this.selectCredit(ev)
      //   return
      // }
      wx.removeStorage({ key: 'username' })
      wx.removeStorage({ key: 'phone' })
      wx.setStorage({
        key: 'username',
        data: this.data.username
      })
      wx.setStorage({
        key: 'phone',
        data: this.data.phone
      })
      wx.showLoading({
        title:'正在提交',
        mask:true
      })
      addEditionOrder({ customer: this.data.username, mobile:this.data.phone, memo: this.data.remarks, isFrom: this.data.isFrom==1?1:0,orderType: 2 }).then(res => {
        wx.hideLoading();
        if(!res.success){
          let text = ',请联系客服'
          if (res.message=='纸张吨价信息不正确,请重新填写') {
            text = ',或联系客服'
          }
          wx.showToast({
            title:res.message+text,
            icon: 'none',
            duration: 2000
          })
          
          return
        }
        this.setData({
          payRse:res,
          isMergePay:res.data.length > 1
        })
        var allorder=[]
      res.data.forEach(e=>{
        console.log(e.data)
        allorder.push(e.data)
      })
      if (res.data.length > 1){
        createOrder({ list: allorder }).then(resp=>{
          this.setData({
            orderNo: resp.data.orderNo
          })
        })
      }
      
        // console.log(123111,res.data[0].data)
        var ordernum = res.data[0].children[0]
        // console.log('res.data.length',res.data.length)
        // console.log('res',res)
        let contentText = '拼一版会核实加工费,核实后联系您'
        if (this.data.queryCount>3) {
          contentText = '拼一版会核实加工费,核实后联系您\r\n本账号下单过于频繁，\r\n可能会存在取消优惠的风险'
          // this.setData({
          //   showModal:true
          // })
        }
        // else{
          let _this = this
          wx.showModal({
            title: '订单提交成功！',
            content: contentText,
            confirmText:'去支付',  
            success (modalRes) {
              if (modalRes.confirm) {
                console.log('用户点击确定')
                // _this.payOrder()
                if (res.data.length == 1) {
                  let ev = {
                    currentTarget:{
                      dataset:{
                        amount:_this.data.totalPrice,
                        sn: res.data[0].data,
                      }
                    },
                    wxPayCallBlack:'payOrder'
                  }
                  // console.log('evev',ev)
                  _this.selectCredit(ev)
                }else{
                  _this.payOrder()
                }
              } else if (modalRes.cancel) { 
                // wx.showToast({
                //   title: '取消支付订单',
                //   icon: 'none',
                //   duration: 2000
                // })
                if(res.data.length == 1){
                  let url = `../../personageCenter/allProcessOrder/orderDetails/index?data=${ordernum}`
                  wx.redirectTo({
                    url:url
                  })
                  // wx.redirectTo({
                  //   url:'../../personageCenter/allProcessOrder/orderDetails/index?data=' + ordernum
                  // })
                }else if(res.data.length > 1){
                console.log(1234);
                  wx.redirectTo({
                    url: '../../personageCenter/allProcessOrder/index'
                  })
                }
              }
            }
          })
        // }
      }).catch(()=>{
        wx.hideLoading();
      })
    }
  },
  payOrder:function(){
    let _this = this
    let res = _this.data.payRse
    var ordernum = res.data[0].children[0]
    if (res.data.length == 1) {
      createWxPayUrl({ orderNo: res.data[0].data, payType: app.globalData.payType }).then(resp => {
        var payBean = JSON.parse(resp.data)
        // console.log(res)
        wx.requestPayment({
          'timeStamp': payBean.timeStamp,//时间戳
          'nonceStr': payBean.nonceStr,//随机字符串
          'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
          'signType': payBean.signType,//非必要——签名算法
          'paySign': payBean.paySign,//签名
          'success': function (res) {
            wx.hideLoading()
            _this.setData({
              toastShow: true
            })
            wx.redirectTo({
              // url: '../turntable/index?data=' + ordernum
              url:'../../personageCenter/allProcessOrder/orderDetails/index?data=' + ordernum
            })
          },
          'fail': function (res) {
            console.log(JSON.stringify(res))
            console.log(res)
            wx.hideLoading()
            wx.showModal({
              title: "提示",
              content: "支付失败",
              showCancel: false,
              success: function () { 
                wx.redirectTo({
                  // url: '../personageCenter/allOrder/index?type=0'
                  url:'../../personageCenter/allProcessOrder/orderDetails/index?data=' + ordernum
                })
              }
            })
          }
        })
      })
    } else if (res.data.length > 1) {
          createWxPayUrl2({ orderNo: this.data.orderNo, payType: app.globalData.payType }).then(respo => {
          if (!respo.success) {
            wx.showModal({
              title: "提示",
              content: "订单状态异常",
              showCancel: false,
              success: function () {
                wx.redirectTo({
                  url: '../../personageCenter/allProcessOrder/index?type=0'
                })
              }
            })
          }
          var payBean = JSON.parse(respo.data)
          // console.log(res)
          wx.requestPayment({
            'timeStamp': payBean.timeStamp,//时间戳
            'nonceStr': payBean.nonceStr,//随机字符串
            'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
            'signType': payBean.signType,//非必要——签名算法
            'paySign': payBean.paySign,//签名
            'success': function (res) {
              wx.hideLoading()
              _this.setData({
                toastShow: true
              })
              wx.redirectTo({
                url: '../../personageCenter/allProcessOrder/index?type=0'
                // url: '../turntable/index?orderNo='+resp.data.orderNo
              })
            },
            'fail': function (respo) {
              console.log(JSON.stringify(respo))
              console.log(respo.detail)
              console.log(respo.message)
              wx.hideLoading()
              wx.showModal({
                title: "提示",
                content: "支付失败",
                showCancel: false,
                success: function () {
                  wx.redirectTo({
                    url: '../../personageCenter/allProcessOrder/index?type=0'
                    // url: '../turntable/index?orderNo='+resp.data.orderNo
                  })
                }
              })
            }
          })
        })
      // })
    }
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
   preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    let res = this.data.payRse
    var ordernum = res.data[0].children[0]
    this.hideModal();
    wx.showToast({
      title: '取消支付订单',
      icon: 'none',
      duration: 2000,
      success: function () {
        if(res.data.length == 1){
          wx.redirectTo({
            url:'../../personageCenter/allPaperOrder/orderDetails/index?data=' + ordernum
          })
        }else if(res.data.length > 1){
          wx.redirectTo({
            url: '../../personageCenter/allPaperOrder/index?type=0'
          })
        }
      
      }
    })
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    this.payOrder()
  },
  toPage(){
    wx.redirectTo({
      url: '../../personageCenter/allProcessOrder/index?type=0'
    })
  },
})