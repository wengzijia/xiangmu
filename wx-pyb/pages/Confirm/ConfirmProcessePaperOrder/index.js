// page/component/new-pages/cart/cart.js
import { checkEdition, addEditionOrder, createWxPayUrl, createWxPayUrl2,addSlittingFee,queryOrderCount } from "../../../api/cartApi.js";
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

  onLoad: function (o) {
    wx.showShareMenu()
    this.getOrderCount()
    // console.log('ooooooo', o);
    this.getcheckEdition(o.isFrom == 1 ? 1 :0);
    var type = o.isFrom == 0 ? 2 :1;
    this.setData({
      username: wx.getStorageSync('username'),
      phone: wx.getStorageSync('phone'),
      isFrom:o.isFrom,
      type:type,
    })

  },
  onShow(){
    this.onShareAppMessage =()=>({...app.globalData.shareObj})
  },
  /**获取订单提交次数 */
  getOrderCount:function(e){
    queryOrderCount().then(res=>{
      if (res.success) {
        this.setData({
          queryCount:res.data
        })
      }
    })
  },
  /**切纸费 */
  inputVal(e){
    var value = Number(e.detail.value)
    value = Math.floor(value)
    if(this.data.cutting===value) {
      return
    }
    if (value<=1) {
      value=0
    }
    // if (value>1000) {
    //   value = 1000
    // }
    this.setData({
      cutting:value,
      loading:true
    });
    // if(!this.data.cutting){
    //   this.modalFun({contentText:'请输入分切费用',time:1000})
    //   return
    // }
    wx.showLoading({
      mask:true
    })
    addSlittingFee({cartId:this.data.cartId,slittingFee:this.data.cutting,type:this.data.type}).then(res=>{
      // console.log('addSlittingFee',res);
      wx.hideLoading()
      this.setData({
        loading:false,

        totalPrice:res.data.price
      })
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
        totalOrder:res.data,
        cartId:res.data.cartEditions[0].id,
        carts: res.data.cartEditions.map(e =>{
          e.paper.paperShop = e.paper.paperShop.split('-')[0]
          e.discountDetail=JSON.parse(e.discountDetail)
          var arr = e.goodsAttr.split(';');
          arr.forEach((items,i)=>{
            if (items.indexOf('原价')!=-1) {
              this.setData({
                differ:items.split(':')[1]
              })
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
      this.setData({
        cuttingFeeprice:cuttingFeep,
        discountsPaperprice:discountsPaperp
      })
      // console.log('222222222',this.data.cuttingFeeprice,this.data.discountsPaperprice)
      this.getTotalPrice()
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
      addEditionOrder({ customer: this.data.username, mobile:null, memo: this.data.remarks, isFrom: this.data.isFrom==1?1:0,type: this.data.type,slittingFee:this.data.cutting }).then(res => {
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
          payRse:res
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
        let contentText = '平台将会与纸行核实吨价'
        if (this.data.queryCount>3) {
          contentText = '平台将会与纸行核实吨价\r\n本账号下单过于频繁，\r\n可能会存在取消优惠的风险'
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
            cancelText:'取消', 
            success (modalRes) {
              if (modalRes.confirm) {
                // console.log('用户点击确定')
                _this.payOrder()
              } else {
                wx.showToast({
                  title: '取消支付订单',
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(()=>{
                  if(res.data.length == 1){
                    wx.redirectTo({
                      url:'../../personageCenter/allPaperOrder/orderDetails/index?data=' + ordernum
                    })
                  }else if(res.data.length > 1){
                    wx.redirectTo({
                      url: '../../personageCenter/allPaperOrder/index?type=0'
                    })
                  }
                },1000)
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
      createWxPayUrl({ orderNo: res.data[0].data, payType: app.globalData.payType2 }).then(resp => {
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
              url:'../../personageCenter/allPaperOrder/orderDetails/index?data=' + ordernum
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
                  url:'../../personageCenter/allPaperOrder/orderDetails/index?data=' + ordernum
                })
              }
            })
          }
        })
      })
    } else if (res.data.length > 1) {
      // var allorder=[]
      // res.data.forEach(e=>{
      //   console.log(e.data)
      //   allorder.push(e.data)
      // })
      // createOrder({ list: allorder }).then(resp => {
          createWxPayUrl2({ orderNo: this.data.orderNo, payType: app.globalData.payType2 }).then(respo => {
          if (!respo.success) {
            wx.showModal({
              title: "提示",
              content: "订单状态异常",
              showCancel: false,
              success: function () {
                wx.redirectTo({
                  url: '../../personageCenter/allPaperOrder/index?type=0'
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
                url: '../../personageCenter/allPaperOrder/index?type=0'
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
                    url: '../../personageCenter/allPaperOrder/index?type=0'
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
        // total += carts[i].goodsTotal-carts[i].discountDetail.colorMoney-carts[i].discountDetail.spotMoney;   // 所有价格加起来
        total += carts[i].goodsTotal   // 所有价格加起来
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
    cprice = cprice.toFixed(2);
    console.log('cprice',cprice)
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      priceArr,
      cprice,
      pitCprice:Math.floor(this.data.differ*100-this.data.totalOrder.totalAmount*100)/100
    });
  }

})