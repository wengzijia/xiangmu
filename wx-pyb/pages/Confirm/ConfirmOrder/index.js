// page/component/new-pages/cart/cart.js
import { checkEdition, addEditionOrder, createWxPayUrl, createWxPayUrl2 } from "../../../api/cartApi.js";
import { createOrder } from "../../../api/orderApi.js";

const app = getApp()

Page({

  data: {
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
    orderTime:'',
    pickUpDate:''
  },

  onLoad: function (o) {
    wx.showShareMenu()
    // console.log('ooooooo', o);
    this.getcheckEdition(o.isFrom == 1 ? 1 :0);
    this.setData({
      username: wx.getStorageSync('username'),
      phone: wx.getStorageSync('phone'),
      isFrom:o.isFrom,
      pickUpDate:o.pickUpDate
    })

  },
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },

  getcheckEdition(isFrom) {
    var cuttingFeep=0
    var discountsPaperp=0
    checkEdition({ isFrom }).then(res => {
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
        totalOrder:res.data.totalAmount,
        carts: res.data.cartEditions.map(e =>{
          e.discountDetail=JSON.parse(e.discountDetail)
          var arr = e.goodsAttr.split(';');
          arr.forEach((items,i)=>{
            if (items.indexOf('吨价')!=-1) {
              // this.setData({
              //   differ:Number(items.split(':')[1])
              // })
              arr.splice(i,1)
            }
          })
          arr = arr.map(e =>{
            return e.split(':')
          // }).concat([[e.paperName]])
          })
          // arr.splice(1,0,[['纸张品牌'],[e.paper.brand+'_'+e.paper.colour]])
          e.newgoods = arr.filter(s=>{return s!=""})
          return e
        })
      })
      for(var i=0;i<this.data.carts.length;i++){
        cuttingFeep+=this.data.carts[i].discountDetail.cuttingFee
        discountsPaperp+=this.data.carts[i].discountDetail.discountsPaper
      }
      let newDate = this.coniventTime(res.data.cartEditions[0].createtime+res.data.cartEditions[0].totalTime*3600)
      this.setData({
        cuttingFeeprice:cuttingFeep,
        discountsPaperprice:discountsPaperp,
        orderTime:Math.ceil(Number(res.data.cartEditions[0].totalTime)/24*10)/10
        // pickUpDate:newDate
      })
      this.getTotalPrice()
    })
  },
  coniventTime(time){
    var date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ?'0'+date.getDate():date.getDate()
    return Y + M + D;
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
    // console.log(this.data.username, this.data.phone)
    // this.data.username
    // if(this.data.username.length>=1&&this.data.phone.length==11&&this.data.username.length<15){
    // else 
    // var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    
    var nameReg = /^[\u4E00-\u9FA5]{2,15}$/;
    if (!nameReg.test(this.data.username)) {
      wx.showToast({
        title: '请输入正确姓名', // 标题
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
      addEditionOrder({ customer: this.data.username, mobile:null, memo: this.data.remarks, isFrom: this.data.isFrom==1?1:0 }).then(res => {
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
        // console.log(123111,res.data[0].data)
        var ordernum = res.data[0].children[0]
        // console.log('res.data.length',res.data.length)
        // console.log('res',res)
        wx.showModal({
          title: '订单提交成功！',
          content: '平台将会核实所有费用',
          confirmText:'去支付', 
          cancelText:'取消', 
          success (modalRes) {
            if (modalRes.confirm) {
              console.log('用户点击确定')
              if (res.data.length == 1) {
                createWxPayUrl({ orderNo: res.data[0].data, payType: app.globalData.payType }).then(res => {
                  var payBean = JSON.parse(res.data)
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': payBean.timeStamp,//时间戳
                    'nonceStr': payBean.nonceStr,//随机字符串
                    'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
                    'signType': payBean.signType,//非必要——签名算法
                    'paySign': payBean.paySign,//签名
                    'success': function (res) {
                      wx.hideLoading()
                      that.setData({
                        toastShow: true
                      })
                      wx.redirectTo({
                        // url: '../turntable/index?data=' + ordernum
                        url:'../../personageCenter/allOrder/orderDetails/index?data=' + ordernum
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
                            url:'../../personageCenter/allOrder/orderDetails/index?data=' + ordernum
                          })
                        }
                      })
                    }
                  })
                })
              } else if (res.data.length > 1) {
                var allorder=[]
                res.data.forEach(e=>{
                  // console.log(e.data)
                  allorder.push(e.data)
                })

                createOrder({ list: allorder }).then(resp => {
                  createWxPayUrl2({ orderNo: resp.data.orderNo, payType: app.globalData.payType }).then(res => {
                    var payBean = JSON.parse(res.data)
                    console.log(res)
                    wx.requestPayment({
                      'timeStamp': payBean.timeStamp,//时间戳
                      'nonceStr': payBean.nonceStr,//随机字符串
                      'package': payBean.package,//统一下单接口返回的 prepay_id 参数，提交格式如：prepay_id=***
                      'signType': payBean.signType,//非必要——签名算法
                      'paySign': payBean.paySign,//签名
                      'success': function (res) {
                        wx.hideLoading()
                        that.setData({
                          toastShow: true
                        })
                        wx.redirectTo({
                          url: '../../personageCenter/allOrder/index?type=0'
                          // url: '../turntable/index?orderNo='+resp.data.orderNo
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
                              url: '../../personageCenter/allOrder/index?type=0'
                              // url: '../turntable/index?orderNo='+resp.data.orderNo
                            })
                          }
                        })

                      }
                    })
                  })


                })
              }
            } else if (modalRes.cancel) {
              wx.showToast({
                title: '取消支付订单',
                icon: 'none',
                duration: 2000,
                success: function () {
                  if(res.data.length == 1){
                    wx.redirectTo({
                      url:'../../personageCenter/allOrder/orderDetails/index?data=' + ordernum
                    })
                  }else if(res.data.length > 1){
                    wx.redirectTo({
                      url: '../../personageCenter/allOrder/index?type=0'
                    })
                  }
                 
                }
              })
            
            }
          }
        })
      }).catch(()=>{
        wx.hideLoading();
      })
    }

  },
  getTotalPrice() {
    var carts = this.data.carts;                  // 获取购物车列表
    var total = 0;
    var cprice=0;
    console.log('cartscartscarts',carts)
    var priceArr = [
      {title:'纸价',original:0 ,discount:0,count: 0},
      {title:'切纸价',original:0,discount:0,count:0},
      {title:'印刷费',original:0,discount:'',count:0},
    ]
    for (var i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].ischeck) {                     // 判断选中才会计算价格
        // total += carts[i].num * carts[i].goodsTotal;   // 所有价格加起来
        // total += carts[i].goodsTotal;   // 所有价格加起来
        total += carts[i].goodsTotal-carts[i].discountDetail.colorMoney-carts[i].discountDetail.spotMoney;   // 所有价格加起来
        cprice+=carts[i].discountDetail.priceOne+carts[i].discountDetail.cuttingFee-carts[i].discountDetail.price
        priceArr[0].original = priceArr[0].original+carts[i].discountDetail.paperPriceOne
        priceArr[0].discount = priceArr[0].discount+carts[i].discountDetail.paperPriceOne-carts[i].discountDetail.paperPrice
        priceArr[0].count = priceArr[0].count+carts[i].discountDetail.paperPrice

        priceArr[1].original = priceArr[1].original+carts[i].discountDetail.cuttingFee
        priceArr[1].discount = priceArr[1].discount+carts[i].discountDetail.cuttingFee
        
        priceArr[2].original = priceArr[2].original+carts[i].discountDetail.colorMoney
        priceArr[2].count = priceArr[2].count+carts[i].discountDetail.colorMoney
      }
    }
    // console.log('differ',this.data.differ)
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      priceArr,
      cprice,
      // pitCprice:Math.floor(this.data.differ*100-this.data.totalOrder*100)/100
    });
    // console.log('differ',this.data.differ,'pitCprice',this.data.differ*100,this.data.totalOrder)
  }

})